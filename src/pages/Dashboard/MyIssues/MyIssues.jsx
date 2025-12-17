import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiEye, FiTrash2 } from "react-icons/fi";
import { FaCheckCircle, FaClock } from "react-icons/fa";

const MyIssues = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: issues = [], refetch } = useQuery({
        queryKey: ['my-issues', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/issues?author=${user.email}&limit=100`);
            return res.data.issues;
        }
    });

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
                        {issues.map(issue => (
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
                                        <button
                                            onClick={() => handleDelete(issue._id)}
                                            className="flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors shadow-sm"
                                        >
                                            <FiTrash2 /> Delete
                                        </button>
                                    )}
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>
        </div>
    );
};

export default MyIssues;
