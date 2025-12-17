import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { FaUser, FaStar, FaShieldAlt } from "react-icons/fa";

const Profile = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: dbUser, refetch } = useQuery({
        queryKey: ['user', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get('/users/me');
            return res.data;
        }
    });

    const handleSubscribe = async () => {
         Swal.fire({
            title: 'Subscribe to Premium',
            text: "Pay 1000tk to report unlimited issues!",
            showCancelButton: true,
            confirmButtonText: 'Pay 1000tk'
        }).then(async (result) => {
            if (result.isConfirmed) {
                  try {
                    await axiosSecure.post('/payments', {
                         amount: 1000,
                         purpose: 'subscription',
                         paymentMethodId: 'mock_pm_sub'
                    });
                     Swal.fire('Subscribed!', 'You are now a Premium user.', 'success');
                     refetch();
                } catch (error) {
                     Swal.fire('Error', error.response?.data?.message || 'Payment failed', 'error');
                }
            }
        })
    }

    return (
        <div className="max-w-2xl mx-auto">
            <motion.h2
                className="text-3xl font-bold mb-8 flex items-center gap-2 text-purple-700"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03, color: "#805ad5" }}
                transition={{ duration: 0.5 }}
            >
                <FaUser /> My Profile
            </motion.h2>

            <motion.div
                className="card bg-white shadow-2xl rounded-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.02, boxShadow: "0px 15px 30px rgba(0,0,0,0.15)" }}
            >
                <div className="card-body items-center text-center">
                    <motion.div
                        className="avatar"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                        whileHover={{ scale: 1.1 }}
                    >
                        <div className="w-24 rounded-full ring ring-purple-400 ring-offset-base-100 ring-offset-2 overflow-hidden">
                            <img src={user?.photoURL || "https://i.ibb.co/5GzXkwq/user.png"} />
                        </div>
                    </motion.div>

                    <motion.h2 
                        className="card-title mt-4 text-xl font-semibold"
                        whileHover={{ scale: 1.05, color: "#805ad5" }}
                        transition={{ duration: 0.3 }}
                    >
                        {user?.displayName}
                    </motion.h2>

                    <motion.p 
                        className="text-gray-600"
                        whileHover={{ scale: 1.02, color: "#6b46c1" }}
                    >
                        {user?.email}
                    </motion.p>
                    
                    <div className="stats shadow-md mt-6 flex justify-center gap-6">
                         <motion.div 
                             className="stat"
                             whileHover={{ scale: 1.05, color: "#805ad5" }}
                         >
                            <div className="stat-title flex items-center gap-2"><FaShieldAlt /> Role</div>
                            <div className="stat-value text-purple-700 text-2xl uppercase">{dbUser?.role}</div>
                        </motion.div>

                        <motion.div 
                             className="stat"
                             whileHover={{ scale: 1.05, color: "#f6ad55" }}
                        >
                            <div className="stat-title flex items-center gap-2"><FaStar /> Status</div>
                            <div className="stat-value text-yellow-400 text-2xl uppercase">{dbUser?.subscriptionStatus}</div>
                        </motion.div>
                    </div>

                    {dbUser?.subscriptionStatus === 'free' && (
                        <motion.div 
                            className="card-actions mt-6 w-full"
                            whileHover={{ scale: 1.02 }}
                        >
                            <button 
                                onClick={handleSubscribe} 
                                className="btn bg-gradient-to-r from-purple-500 to-pink-500 text-white w-full hover:from-pink-500 hover:to-purple-500 shadow-lg transform transition-all duration-300"
                            >
                                Subscribe for Premium (1000tk)
                            </button>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;
