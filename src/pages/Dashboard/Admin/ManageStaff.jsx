import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import { motion } from "framer-motion";
import { FaTrash, FaUserPlus, FaEdit, FaTimes } from "react-icons/fa";
import { useState } from "react";

const ManageStaff = () => {
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, reset } = useForm();
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const { data: staff = [], refetch } = useQuery({
        queryKey: ['staff'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data.filter(u => u.role === 'staff');
        }
    });

    const onSubmit = async (data) => {
        try {
            await axiosSecure.post('/users/staff', data);
            reset();
            refetch();
            Swal.fire('Success', 'Staff created successfully', 'success');
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Failed to create staff', 'error');
        }
    }

    const handleDelete = async (id) => {
        try {
            await axiosSecure.delete(`/users/${id}`);
            refetch();
            Swal.fire('Deleted', 'Staff removed', 'success');
        } catch {
            Swal.fire('Error', 'Failed to delete', 'error');
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axiosSecure.put(`/users/${editingStaff._id}`, {
                name: editingStaff.name,
                email: editingStaff.email, // Usually email isn't updated easily but allow it if needed, or just name/photo/phone
                photoURL: editingStaff.photoURL
            });
            refetch();
            setEditModalOpen(false);
            Swal.fire('Success', 'Staff updated', 'success');
        } catch (error) {
            Swal.fire('Error', 'Update failed', 'error');
        }
    }

    const openEditModal = (s) => {
        setEditingStaff(s);
        setEditModalOpen(true);
    };

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const rowVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

    return (
        <div className="p-8 bg-[var(--bg-primary)] min-h-screen">
            {/* Header */}
            <motion.h2 className="text-4xl font-extrabold mb-8 text-[var(--text-primary)]"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}>
                Manage Staff
            </motion.h2>

            {/* Add Staff Form */}
            <motion.div className="bg-[var(--card-bg)] p-6 rounded-xl shadow-lg border border-[var(--glass-border)] mb-8 transition-colors duration-300"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}>
                <h3 className="flex items-center gap-2 font-semibold text-[var(--text-secondary)] mb-4">
                    <FaUserPlus className="text-indigo-500"/> Add New Staff
                </h3>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-4">
                    <input {...register("name")} placeholder="Name" required className="input bg-white text-black input-bordered w-full border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition" />



                    <input {...register("email")} placeholder="Email" required className="input bg-white text-black input-bordered w-full border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition" />
                    
                    <input {...register("phone")} placeholder="Phone" className="input bg-white text-black input-bordered w-full border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition" />
                    
                    <input {...register("photoURL")} placeholder="Photo URL" className="input bg-white text-black input-bordered w-full border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition" />



                    <input {...register("password")} 
                    placeholder="Password" required className="input input-bordered bg-white text-black w-full border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition" />
                    <button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-600 transition transform hover:scale-105">
                        Add Staff <FaUserPlus />
                    </button>
                </form>
            </motion.div>

            {/* Staff Table */}
            <motion.div className="overflow-x-auto bg-[var(--card-bg)] shadow-lg rounded-xl border border-[var(--glass-border)] transition-colors duration-300"
                variants={containerVariants}
                initial="hidden"
                animate="visible">
                <table className="min-w-full table-auto border-collapse">
                    <thead className="bg-[var(--bg-secondary)] text-[var(--text-secondary)] uppercase text-sm font-semibold tracking-wide">
                        <tr>
                            <th className="py-4 px-6 text-left">Name</th>
                            <th className="py-4 px-6 text-left">Email</th>
                            <th className="py-4 px-6 text-left">Action</th>
                        </tr>
                    </thead>
                    <motion.tbody>
                        {staff.map(s => (
                            <motion.tr key={s._id} variants={rowVariants}
                                className="border-b border-[var(--glass-border)] last:border-none hover:bg-[var(--bg-secondary)] transition-colors duration-200 cursor-pointer">
                                <td className="py-4 px-6 font-medium text-[var(--text-primary)]">{s.name}</td>
                                <td className="py-4 px-6 text-[var(--text-secondary)]">{s.email}</td>
                                <td className="py-4 px-6">
                                    <div className="flex gap-2">
                                        <motion.button onClick={() => openEditModal(s)}
                                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                            className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-white bg-blue-500 hover:bg-blue-600 shadow-md transition">
                                            <FaEdit /> Edit
                                        </motion.button>
                                        <motion.button onClick={() => handleDelete(s._id)}
                                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                            className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-white bg-red-500 hover:bg-red-600 shadow-md transition">
                                            <FaTrash /> Delete
                                        </motion.button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </motion.tbody>
                </table>
            </motion.div>

            {/* Edit Modal */}
             {editModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative animate-in fade-in zoom-in duration-200">
                        <button onClick={() => setEditModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                            <FaTimes />
                        </button>
                        <h3 className="text-xl font-bold mb-4 text-gray-800">Edit Staff Info</h3>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="label">Name</label>
                                <input 
                                    value={editingStaff.name} 
                                    onChange={e => setEditingStaff({...editingStaff, name: e.target.value})}
                                    className="input input-bordered w-full" 
                                />
                            </div>
                            <div>
                                <label className="label">Photo URL</label>
                                <input 
                                    value={editingStaff.photoURL} 
                                    onChange={e => setEditingStaff({...editingStaff, photoURL: e.target.value})}
                                    className="input input-bordered w-full" 
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-full">Update Staff</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageStaff;
