import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserCircle, FaCheckCircle, FaClock, FaTimes, FaMapMarkerAlt, FaEdit, FaTrash, FaRocket, FaMoneyBillWave } from "react-icons/fa";
import Payment from "../Shared/Payment/Payment";
import { useState } from "react";

const IssueDetails = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const navigate = useNavigate();

    const { data: issue, isLoading, refetch } = useQuery({
        queryKey: ['issue', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/issues/${id}`);
            return res.data;
        }
    });

    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({ title: '', description: '', location: '', image: '' });
    const [note, setNote] = useState('');

    const handleBoostClick = () => {
        setIsPaymentModalOpen(true);
    };

    const handlePaymentSuccess = async (transactionId) => {
        try {
            await axiosSecure.post('/payments', {
                amount: 100, // Boost price 100tk
                purpose: 'boost_issue',
                issueId: issue._id,
                paymentMethodId: transactionId
            });
            Swal.fire('Boosted!', 'Issue priority is now High.', 'success');
            setIsPaymentModalOpen(false);
            refetch();
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Payment save failed', 'error');
        }
    };

    const handleDelete = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ff6b6b',
            cancelButtonColor: '#b0bec5',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.delete(`/issues/${id}`);
                    Swal.fire('Deleted!', 'Your issue has been deleted.', 'success');
                    navigate('/all-issues');
                } catch (error) {
                    Swal.fire('Error', 'Failed to delete issue.', 'error');
                }
            }
        });
    };

    const handleEditClick = () => {
        setEditForm({
            title: issue.title,
            description: issue.description,
            location: issue.location,
            image: issue.image
        });
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosSecure.put(`/issues/${id}`, editForm);
            Swal.fire('Updated!', 'Issue details updated.', 'success');
            setIsEditModalOpen(false);
            refetch();
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Update failed', 'error');
        }
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        if(!note.trim()) return;
        try {
            await axiosSecure.post(`/issues/${id}/progress`, { message: note });
            Swal.fire('Success', 'Progress note added.', 'success');
            setNote('');
            refetch();
        } catch (error) {
            Swal.fire('Error', 'Failed to add note', 'error');
        }
    };

    if (isLoading) return <div className="text-center py-20"><span className="loading loading-spinner loading-lg"></span></div>;

    return (
        <div className="container my-10 mx-auto px-4 py-8 max-w-7xl">
            <div className="flex mt-8 flex-col lg:flex-row gap-10">
                {/* Left: Issue Info */}
                <motion.div 
                    className="lg:w-2/3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="relative group overflow-hidden rounded-2xl shadow-2xl mb-8">
                        <motion.img 
                            src={issue.image} 
                            alt={issue.title} 
                            className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
                             <div>
                                <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-md">{issue.title}</h1>
                                <div className="flex flex-wrap gap-3">
                                    <span className={`badge border-none text-white font-semibold py-3 px-4 ${issue.priority === 'high' ? 'bg-red-500' : 'bg-blue-500'}`}>
                                        {issue.priority === 'high' ? 'High Priority' : 'Normal Priority'}
                                    </span>
                                    <span className={`badge border-none text-white font-semibold py-3 px-4 ${issue.status === 'resolved' ? 'bg-green-500' : issue.status === 'closed' ? 'bg-gray-500' : 'bg-yellow-500'}`}>
                                        {issue.status}
                                    </span>
                                </div>
                             </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                            <div className="avatar">
                                <div className="w-14 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <img src={issue.author?.photoURL || "https://i.ibb.co/5GzXkwq/user.png"} alt="User" />
                                </div>
                            </div>
                            <div>
                                <p className="font-bold text-lg text-gray-800">{issue.author?.name}</p>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <FaClock /> Reported on {new Date(issue.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="ml-auto flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg font-bold text-gray-700">
                                ⭐ {issue.upvoteCount} Upvotes
                            </div>
                        </div>

                        <h3 className="text-xl font-semibold mb-3 text-gray-700">Description</h3>
                        <p className="text-lg leading-relaxed mb-6 text-gray-600 font-light">{issue.description}</p>
                        
                        <div className="flex items-center gap-2 text-gray-600 mb-8 bg-gray-50 p-3 rounded-lg w-fit">
                            <FaMapMarkerAlt className="text-red-500" />
                            <strong>Location:</strong> {issue.location}
                        </div>

                        <div className="flex flex-wrap gap-4 mt-6">
                            {/* Edit: Author & Pending */}
                            {user?.email === issue.author?.email && issue.status === 'pending' && (
                                <button onClick={handleEditClick} className="btn btn-warning gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                                    <FaEdit /> Edit Issue
                                </button>
                            )}
                            
                            {/* Delete: Author (Any status) */}
                            {user?.email === issue.author?.email && (
                                <button onClick={handleDelete} className="btn btn-error text-white gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                                    <FaTrash /> Delete
                                </button>
                            )}
                            
                            {/* Boost: Not High Priority */}
                            {issue.priority !== 'high' && (
                                <button onClick={handleBoostClick} className="btn btn-secondary gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all bg-gradient-to-r from-violet-600 to-fuchsia-600 border-none animate-pulse hover:animate-none">
                                    <FaRocket /> Boost Priority (100 Tk)
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Right: Timeline & Staff */}
                <motion.div 
                    className="lg:w-1/3 space-y-8"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Assigned Staff Card */}
                    {issue.assignedTo && (
                        <div className="card-3d bg-white p-6 rounded-2xl border border-indigo-100">
                            <h3 className="text-lg font-bold text-indigo-600 mb-4 border-b pb-2">Assigned Officer</h3>
                            <div className="flex items-center gap-4">
                                <div className="avatar">
                                    <div className="w-12 rounded-full ring ring-indigo-200">
                                        <img src={issue.assignedTo?.photoURL || "https://i.ibb.co/5GzXkwq/user.png"} alt="Staff" />
                                    </div>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800">{issue.assignedTo?.name}</p>
                                    <p className="text-xs text-gray-500">{issue.assignedTo?.email}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Staff Add Progress Note (Only Only for Assigned Staff) */}
                    {user?.email === issue.assignedTo?.email && (
                        <div className="card-3d bg-purple-50 p-6 rounded-2xl border border-purple-100">
                            <h3 className="text-lg font-bold text-purple-700 mb-2">Add Progress Note</h3>
                            <form onSubmit={handleAddNote}>
                                <textarea 
                                    className="textarea textarea-bordered w-full mb-3" 
                                    placeholder="Enter progress details..."
                                    value={note}
                                    onChange={e => setNote(e.target.value)}
                                    required
                                ></textarea>
                                <button type="submit" className="btn btn-sm btn-primary w-full">Add Note</button>
                            </form>
                        </div>
                    )}

                    {/* Vertical Timeline */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                        <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                             <FaClock className="text-primary" /> Issue Timeline
                        </h3>
                        <div className="relative border-l-2 border-gray-200 ml-3 space-y-8">
                            {issue.timeline?.slice().reverse().map((event, index) => (
                                <div key={index} className="relative pl-8 pb-3 last:pb-0">
                                    {/* Timeline Dot */}
                                    <span className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-md z-10
                                        ${event.status === 'resolved' ? 'bg-green-500' : 
                                          event.status === 'in-progress' ? 'bg-blue-500' :
                                          event.status === 'closed' ? 'bg-gray-500' : 
                                          event.status === 'pending' ? 'bg-yellow-500' : 'bg-purple-500'
                                        }`}
                                    ></span>
                                    
                                    <div className="flex flex-col bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-bold text-gray-800 capitalize flex items-center gap-2">
                                                {event.status === 'resolved' && <FaCheckCircle className="text-green-500"/>}
                                                {event.status || 'Update'}
                                            </span>
                                            <span className="text-xs text-gray-500 font-mono bg-white px-2 py-1 rounded-full shadow-sm">
                                                {new Date(event.date).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700 font-medium">{event.message}</p>
                                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                            <FaUserCircle /> {event.updatedBy}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl"
                        >
                            <h3 className="text-2xl font-bold mb-4">Edit Issue</h3>
                            <form onSubmit={handleEditSubmit} className="space-y-4">
                                <input 
                                    type="text" 
                                    placeholder="Title"
                                    className="input input-bordered w-full"
                                    value={editForm.title}
                                    onChange={e => setEditForm({...editForm, title: e.target.value})}
                                    required
                                />
                                <textarea 
                                    className="textarea textarea-bordered w-full" 
                                    placeholder="Description"
                                    value={editForm.description}
                                    onChange={e => setEditForm({...editForm, description: e.target.value})}
                                    required
                                ></textarea>
                                <input 
                                    type="text" 
                                    placeholder="Location"
                                    className="input input-bordered w-full"
                                    value={editForm.location}
                                    onChange={e => setEditForm({...editForm, location: e.target.value})}
                                    required
                                />
                                <input 
                                    type="url" 
                                    placeholder="Image URL"
                                    className="input input-bordered w-full"
                                    value={editForm.image}
                                    onChange={e => setEditForm({...editForm, image: e.target.value})}
                                    required
                                />
                                <div className="flex justify-end gap-2 mt-4">
                                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn btn-ghost">Cancel</button>
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
                    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg relative"
                        >
                            <button 
                                onClick={() => setIsPaymentModalOpen(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
                            >
                                <FaTimes size={24} />
                            </button>
                            <h3 className="text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Boost Issue Priority</h3>
                            <p className="mb-6 text-center text-gray-600 bg-purple-50 p-4 rounded-xl border border-purple-100">
                                Upgrade this issue to <strong>High Priority</strong> for faster resolution.<br/>
                                <span className="text-sm">Cost: <strong className="text-purple-700 text-lg">100 Tk</strong> ($1)</span>
                            </p>
                            
                            <Payment price={100} onSuccess={handlePaymentSuccess} />
                            
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default IssueDetails;
