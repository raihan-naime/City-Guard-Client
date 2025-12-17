import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiEye, FiTrash2 } from "react-icons/fi";

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
        <div>
            <motion.h2
                className="text-3xl font-bold mb-6 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                My Issues
            </motion.h2>

            <div className="overflow-x-auto">
                <motion.table
                    className="table w-full text-left rounded-xl overflow-hidden shadow-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        <tr>
                            <th className="p-3">Title</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Priority</th>
                            <th className="p-3">Date</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {issues.map(issue => (
                            <motion.tr
                                key={issue._id}
                                className="even:bg-gray-50 hover:bg-purple-50 cursor-pointer transition-all duration-300"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.02, boxShadow: "0px 8px 20px rgba(0,0,0,0.1)" }}
                                transition={{ duration: 0.3 }}
                            >
                                <td className="p-3">
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle w-12 h-12 overflow-hidden">
                                                <img src={issue.image || "https://i.ibb.co/5GzXkwq/user.png"} alt={issue.title} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-800">{issue.title}</div>
                                            <div className="text-sm opacity-50">{issue.location}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className={`badge ${issue.status === 'resolved' ? 'badge-success' : 'badge-warning'}`}>
                                        {issue.status}
                                    </div>
                                </td>
                                <td className="text-purple-600 font-semibold">{issue.priority}</td>
                                <td>{new Date(issue.createdAt).toLocaleDateString()}</td>
                                <td className="flex gap-2">
                                    <Link
                                        to={`/issues/${issue._id}`}
                                        className="btn btn-sm btn-ghost flex items-center gap-1 hover:bg-purple-100 transition-colors"
                                    >
                                        <FiEye /> View
                                    </Link>
                                    {issue.status === 'pending' && (
                                        <button
                                            onClick={() => handleDelete(issue._id)}
                                            className="btn btn-sm btn-ghost text-red-500 flex items-center gap-1 hover:bg-red-100 transition-colors"
                                        >
                                            <FiTrash2 /> Delete
                                        </button>
                                    )}
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </motion.table>
            </div>
        </div>
    );
};

export default MyIssues;
