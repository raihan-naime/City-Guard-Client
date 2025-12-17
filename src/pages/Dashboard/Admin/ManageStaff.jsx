import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import { motion } from "framer-motion";
import { FaTrash, FaUserPlus } from "react-icons/fa";

const ManageStaff = () => {
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, reset } = useForm();
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

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const rowVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <motion.h2 className="text-4xl font-extrabold mb-8 text-gray-800"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}>
                Manage Staff
            </motion.h2>

            {/* Add Staff Form */}
            <motion.div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}>
                <h3 className="flex items-center gap-2 font-semibold text-gray-700 mb-4">
                    <FaUserPlus className="text-indigo-500"/> Add New Staff
                </h3>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-4">
                    <input {...register("name")} placeholder="Name" required className="input bg-white text-black input-bordered w-full border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition" />



                    <input {...register("email")} placeholder="Email" required className="input bg-white text-black input-bordered w-full border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition" />



                    <input {...register("password")} 
                    placeholder="Password" required className="input input-bordered bg-white text-black w-full border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition" />
                    <button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-600 transition transform hover:scale-105">
                        Add Staff <FaUserPlus />
                    </button>
                </form>
            </motion.div>

            {/* Staff Table */}
            <motion.div className="overflow-x-auto bg-white shadow-lg rounded-xl border border-gray-200"
                variants={containerVariants}
                initial="hidden"
                animate="visible">
                <table className="min-w-full table-auto border-collapse">
                    <thead className="bg-indigo-50 text-gray-700 uppercase text-sm font-semibold tracking-wide">
                        <tr>
                            <th className="py-4 px-6 text-left">Name</th>
                            <th className="py-4 px-6 text-left">Email</th>
                            <th className="py-4 px-6 text-left">Action</th>
                        </tr>
                    </thead>
                    <motion.tbody>
                        {staff.map(s => (
                            <motion.tr key={s._id} variants={rowVariants}
                                className="border-b border-gray-200 last:border-none hover:bg-indigo-50 transition-colors duration-200 cursor-pointer">
                                <td className="py-4 px-6 font-medium text-gray-800">{s.name}</td>
                                <td className="py-4 px-6 text-gray-600">{s.email}</td>
                                <td className="py-4 px-6">
                                    <motion.button onClick={() => handleDelete(s._id)}
                                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-red-500 hover:bg-red-600 shadow-md transition">
                                        <FaTrash /> Delete
                                    </motion.button>
                                </td>
                            </motion.tr>
                        ))}
                    </motion.tbody>
                </table>
            </motion.div>
        </div>
    );
};

export default ManageStaff;
