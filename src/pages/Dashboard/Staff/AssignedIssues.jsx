import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const AssignedIssues = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: issues = [], refetch } = useQuery({
        queryKey: ['assigned-issues', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/issues?assignedTo=${user.email}`);
            return res.data.issues;
        }
    });

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axiosSecure.patch(`/issues/${id}/status`, { status: newStatus });
            refetch();
            Swal.fire('Success', `Status updated to ${newStatus}`, 'success');
        } catch (error) {
            Swal.fire('Error', 'Failed to update status', 'error');
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="p-6 bg-gray-100 rounded-2xl shadow-sm"
        >
            <h2 className="text-3xl font-bold mb-6 text-slate-800">
                Assigned Issues
            </h2>

            <div className=" no-scrollbar rounded-xl border border-slate-200">

                <table className="table w-full">
                    <thead className="bg-slate-50 text-slate-600">
                        <tr>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Update</th>
                            <th>Details</th>
                        </tr>
                    </thead>

                    <tbody>
                        {issues.map(issue => (
                            <motion.tr
                                key={issue._id}
                                whileHover={{ scale: 1.01 }}
                                transition={{ duration: 0.2 }}
                                className="hover:bg-slate-50 transition-all"
                            >
                                <td className="font-medium text-slate-700">
                                    {issue.title}
                                </td>

                                <td>
                                    <div className="badge badge-outline border-primary text-primary px-3 py-2">
                                        {issue.status}
                                    </div>
                                </td>

                                <td className="capitalize text-slate-600">
                                    {issue.priority}
                                </td>

                                <td>
                                    <select
                                        className="select select-bordered select-sm focus:border-primary focus:outline-none transition-all"
                                        defaultValue={issue.status}
                                        onChange={(e) =>
                                            handleStatusChange(issue._id, e.target.value)
                                        }
                                    >
                                        <option value="pending" disabled>Pending</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="resolved">Resolved</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </td>

                                <td>
                                    <Link
                                        to={`/issues/${issue._id}`}
                                        className="btn btn-xs btn-primary btn-outline hover:scale-105 transition-transform"
                                    >
                                        View
                                    </Link>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default AssignedIssues;
