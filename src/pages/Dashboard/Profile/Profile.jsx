import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaUser, FaStar, FaShieldAlt, FaFilePdf, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Payment from "../../Shared/Payment/Payment";
import { useState } from "react";

const Profile = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', photoURL: '' });

    const { data: dbUser, refetch } = useQuery({
        queryKey: ['user', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get('/users/me');
            return res.data;
        }
    });

    const { data: myPayments = [] } = useQuery({
        queryKey: ['my-payments', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get('/payments/me');
            return res.data;
        }
    });

    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const handlePaymentSuccess = async (transactionId) => {
        try {
             await axiosSecure.post('/payments', {
                 amount: 1000, 
                 purpose: 'subscription',
                 paymentMethodId: transactionId
             });
             Swal.fire('Subscribed!', 'You are now a Premium user.', 'success');
             setIsPaymentModalOpen(false);
             refetch();
        } catch (error) {
             Swal.fire('Error', error.response?.data?.message || 'Payment save failed', 'error');
        }
    };

    const handleSubscribeClick = () => {
        setIsPaymentModalOpen(true);
    };

    const handleDownloadInvoice = () => {
        if (!user) return; // Guard clause

        const doc = new jsPDF();
        doc.text("My Payment Invoices", 20, 10);
        doc.text(`User: ${user?.displayName || 'Unknown'}`, 20, 20);
        doc.text(`Email: ${user?.email || 'N/A'}`, 20, 30);
        
        const tableColumn = ["Amount", "Purpose", "Transaction ID", "Date"];
        const tableRows = [];
    
        myPayments.forEach(pay => {
            const paymentData = [
                `${pay.amount} tk`,
                pay.purpose,
                pay.transactionId,
                new Date(pay.date).toLocaleDateString()
            ];
            tableRows.push(paymentData);
        });
    
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 40
        });
    
        doc.save("my_invoice.pdf");
    };

    if (!user) return <div className="text-center mt-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

    return (
        <div className="max-w-full mx-auto p-4 md:p-8">
            <motion.h2
                className="text-3xl md:text-4xl font-bold mb-8 flex items-center justify-center gap-3 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <FaUser className="text-purple-500" /> My Profile
            </motion.h2>

            <motion.div
                className="card-3d w-full max-w-lg md:max-w-2xl mx-auto glass-effect p-8 md:p-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="flex flex-col items-center text-center">
                    <motion.div
                        className="avatar mb-6"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="w-32 h-32 rounded-full ring-4 ring-purple-500 ring-offset-base-100 ring-offset-4 overflow-hidden shadow-2xl">
                            <img src={user?.photoURL || "https://i.ibb.co/5GzXkwq/user.png"} alt="Profile" className="object-cover w-full h-full" />
                        </div>
                    </motion.div>

                    <motion.h2
                        className="text-3xl font-bold text-[var(--text-primary)]"
                    >
                        {user?.displayName}
                    </motion.h2>
                    <p className="text-sm opacity-70 mb-8 font-mono">{user?.email}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-8">
                        <motion.div
                            className="stat glass-dark rounded-2xl p-4 shadow-inner border border-white/10"
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="stat-title flex items-center justify-center gap-2 text-gray-400 font-semibold uppercase tracking-wider text-xs"><FaShieldAlt /> Role</div>
                            <div className="stat-value text-purple-400 text-2xl uppercase mt-1">{dbUser?.role || 'User'}</div>
                        </motion.div>

                        <motion.div
                            className="stat glass-dark rounded-2xl p-4 shadow-inner border border-white/10"
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="stat-title flex items-center justify-center gap-2 text-gray-400 font-semibold uppercase tracking-wider text-xs"><FaStar /> Status</div>
                            <div className={`stat-value text-2xl uppercase mt-1 ${dbUser?.subscriptionStatus === 'free' ? 'text-yellow-400' : 'text-green-400'}`}>
                                {dbUser?.subscriptionStatus || 'Free'}
                            </div>
                        </motion.div>
                    </div>

                    {/* Premium Badge for Premium Users */}
                    {dbUser?.subscriptionStatus === 'premium' && (
                         <div className="flex items-center justify-center gap-2 mb-6 text-yellow-500 font-bold text-xl animate-pulse">
                            <FaStar /> Premium Member
                         </div>
                    )}

                    {/* Blocked Warning */}
                    {dbUser?.isBlocked && (
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-md w-full"
                            role="alert"
                        >
                            <p className="font-bold">Account Blocked</p>
                            <p>Your account has been blocked by the administration. Please contact support.</p>
                        </motion.div>
                    )}

                    {dbUser?.subscriptionStatus === 'free' && (
                        <motion.button
                            onClick={handleSubscribeClick}
                            className="btn btn-3d w-full mb-4 text-lg rounded-xl h-14"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Subscribe for Premium (1000 Tk)
                        </motion.button>
                    )}

                    {myPayments.length > 0 && (
                        <button
                            onClick={handleDownloadInvoice}
                            className="btn btn-outline btn-info w-full flex items-center gap-2 rounded-xl"
                        >
                            <FaFilePdf /> Download Payment History
                        </button>
                    )}
                </div>
            </motion.div>

            {/* Edit Profile Button */}
             <div className="flex justify-center mt-6">
                <button onClick={() => {
                        setEditForm({ name: dbUser?.name, photoURL: dbUser?.photoURL });
                        setEditModalOpen(true);
                    }} 
                    className="btn btn-outline btn-secondary gap-2 uppercase tracking-widest text-xs"
                >
                    <FaUser /> Edit Profile
                </button>
             </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {editModalOpen && (
                    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl relative"
                        >
                            <h3 className="text-2xl font-bold mb-4">Edit Profile</h3>
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                try {
                                    await axiosSecure.put('/users/me', editForm);
                                    refetch();
                                    Swal.fire('Success', 'Profile updated!', 'success');
                                    setEditModalOpen(false);
                                } catch(err) {
                                    Swal.fire('Error', 'Update failed', 'error');
                                }
                            }} className="space-y-4">
                                <div className="form-control">
                                    <label className="label">Name</label>
                                    <input 
                                        type="text" 
                                        className="input input-bordered w-full"
                                        value={editForm.name}
                                        onChange={e => setEditForm({...editForm, name: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">Photo URL</label>
                                    <input 
                                        type="text" 
                                        className="input input-bordered w-full"
                                        value={editForm.photoURL}
                                        onChange={e => setEditForm({...editForm, photoURL: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                    <button type="button" onClick={() => setEditModalOpen(false)} className="btn btn-ghost">Cancel</button>
                                    <button type="submit" className="btn btn-primary">Save Changes</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

             {/* Payment Modal */}
             <AnimatePresence>
                {isPaymentModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0, rotateX: 20 }}
                            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                            exit={{ scale: 0.8, opacity: 0, rotateX: 20 }}
                            className="bg-[var(--card-bg)] rounded-3xl shadow-2xl p-8 w-full max-w-lg relative border border-white/10"
                        >
                            <button 
                                onClick={() => setIsPaymentModalOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors bg-white/10 rounded-full p-2"
                            >
                                <FaTimes size={18} />
                            </button>
                            <h3 className="text-2xl font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Confirm Subscription</h3>
                            <p className="mb-6 text-center opacity-70 text-sm">Unlock exclusive features by upgrading to Premium.</p>
                            
                            <Payment price={1000} onSuccess={handlePaymentSuccess} />
                            
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;
