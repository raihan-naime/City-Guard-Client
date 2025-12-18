import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiEye, FiTrash2, FiEdit, FiX } from "react-icons/fi";
import { FaCheckCircle, FaClock } from "react-icons/fa";
import { useState } from "react";

const MyIssues = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [filterStatus, setFilterStatus] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({ id: '', title: '', description: '', location: '', image: '' });

    const { data: issues = [], refetch } = useQuery({
        queryKey: ['my-issues', user?.email, filterStatus, filterCategory],
        queryFn: async () => {
            const params = {
                author: user.email,
                limit: 100,
                status: filterStatus || undefined,
                category: filterCategory || undefined
            };
            const res = await axiosSecure.get('/issues', { params });
            return res.data.issues;
        }
    });

    const openEditModal = (issue) => {
        setEditForm({
            id: issue._id,
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
            await axiosSecure.put(`/issues/${editForm.id}`, {
                title: editForm.title,
                description: editForm.description,
                location: editForm.location,
                image: editForm.image
            });
            Swal.fire('Updated!', 'Issue update successfully', 'success');
            setIsEditModalOpen(false);
            refetch();
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Update failed', 'error');
        }
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.delete(`/issues/${id}`);
                    refetch();
                    Swal.fire('Deleted!', 'Your issue has been deleted.', 'success');
                } catch (error) {
                    Swal.fire('Error', 'Make sure you implemented DELETE route!', 'error');
                }
            }
        })
    }

    return (
        <div className="p-6">
            {/* Header */}
            <motion.h2
                className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                My Issues
            </motion.h2>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
                <select 
                    className="select select-bordered w-full max-w-xs shadow-sm hover:shadow-md transition-all focus:ring-2 focus:ring-purple-500"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="rejected">Rejected</option>
                </select>

                <select 
                    className="select select-bordered w-full max-w-xs shadow-sm hover:shadow-md transition-all focus:ring-2 focus:ring-purple-500"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                >
                    <option value="">All Categories</option>
                    <option value="Roads">Roads</option>
                    <option value="Water">Water</option>
                    <option value="Electricity">Electricity</option>
                    <option value="Garbage">Garbage</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            {/* Table */}
            <motion.div
                className="overflow-hidden rounded-xl shadow-xl border border-gray-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <table className="min-w-full w-full text-left table-auto">
                    <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        <tr>
                            <th className="p-4">Title</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Priority</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {issues.length > 0 ? issues.map(issue => (
                            <motion.tr
                                key={issue._id}
                                className="even:bg-gray-50 hover:bg-purple-50 transition-all duration-300 cursor-pointer"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.02, boxShadow: "0px 8px 20px rgba(0,0,0,0.08)" }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Title */}
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle w-12 h-12 overflow-hidden border border-gray-200 shadow-sm">
                                                <img src={issue.image || "https://i.ibb.co/5GzXkwq/user.png"} alt={issue.title} />
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-800">{issue.title}</span>
                                            <span className="text-sm text-gray-400">{issue.location}</span>
                                        </div>
                                    </div>
                                </td>

                                {/* Status */}
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        {issue.status === 'resolved' ? (
                                            <FaCheckCircle className="text-green-500" />
                                        ) : (
                                            <FaClock className="text-yellow-500" />
                                        )}
                                        <span className={`font-semibold ${issue.status === 'resolved' ? 'text-green-600' : 'text-yellow-600'}`}>
                                            {issue.status}
                                        </span>
                                    </div>
                                </td>

                                {/* Priority */}
                                <td className="p-4 text-purple-600 font-semibold">{issue.priority}</td>

                                {/* Date */}
                                <td className="p-4">{new Date(issue.createdAt).toLocaleDateString()}</td>

                                {/* Actions */}
                                <td className="p-4 flex flex-wrap gap-2">
                                    <Link
                                        to={`/issues/${issue._id}`}
                                        className="flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors shadow-sm"
                                    >
                                        <FiEye /> View
                                    </Link>

                                    {issue.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => openEditModal(issue)}
                                                className="flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors shadow-sm"
                                            >
                                                <FiEdit /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(issue._id)}
                                                className="flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors shadow-sm"
                                            >
                                                <FiTrash2 /> Delete
                                            </button>
                                        </>
                                    )}
                                </td>
                            </motion.tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-gray-500">No issues found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </motion.div>

            {/* Edit Modal */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl relative"
                        >
                            <button onClick={() => setIsEditModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                                <FiX size={24} />
                            </button>
                            <h3 className="text-2xl font-bold mb-4">Edit Issue</h3>
                            <form onSubmit={handleEditSubmit} className="space-y-4">
                                <div className="form-control">
                                    <label className="label font-semibold">Title</label>
                                    <input 
                                        type="text" 
                                        className="input input-bordered w-full"
                                        value={editForm.title}
                                        onChange={e => setEditForm({...editForm, title: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label font-semibold">Description</label>
                                    <textarea 
                                        className="textarea textarea-bordered w-full h-24" 
                                        value={editForm.description}
                                        onChange={e => setEditForm({...editForm, description: e.target.value})}
                                        required
                                    ></textarea>
                                </div>
                                <div className="form-control">
                                    <label className="label font-semibold">Location</label>
                                    <input 
                                        type="text" 
                                        className="input input-bordered w-full"
                                        value={editForm.location}
                                        onChange={e => setEditForm({...editForm, location: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label font-semibold">Image URL</label>
                                    <input 
                                        type="url" 
                                        className="input input-bordered w-full"
                                        value={editForm.image}
                                        onChange={e => setEditForm({...editForm, image: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn btn-ghost">Cancel</button>
                                    <button type="submit" className="btn btn-primary">Save Changes</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MyIssues;
