import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { FaUserPlus, FaBan, FaClipboardList } from "react-icons/fa";

const AdminAllIssues = () => {
    const axiosSecure = useAxiosSecure();

    const { data: issues = [], refetch } = useQuery({
        queryKey: ['admin-issues'],
        queryFn: async () => {
            const res = await axiosSecure.get('/issues?limit=100'); // get all
            return res.data.issues;
        }
    });

    const { data: staffList = [] } = useQuery({
        queryKey: ['staff'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data.filter(u => u.role === 'staff');
        }
    });

    const handleAssign = async (issueId, staffId) => {
        if(!staffId) return;
        try {
            await axiosSecure.patch(`/issues/${issueId}/assign`, { staffId });
            refetch();
            Swal.fire('Success', 'Staff assigned', 'success');
        } catch (error) {
            Swal.fire('Error', 'Failed to assign', 'error');
        }
    }

    const handleReject = async (issueId) => {
        try {
            await axiosSecure.patch(`/issues/${issueId}/status`, { status: 'rejected' });
            refetch();
        } catch(e) { /* ... */ }
    }

    return (
        <motion.div 
            className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
        >
            <motion.h2 
                className="text-3xl font-bold mb-6 flex items-center gap-3 text-purple-700"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.03 }}
            >
                <FaClipboardList /> All Issues (Admin)
            </motion.h2>

            <div className="overflow-x-auto">
                <motion.table
                    className="table w-full text-left rounded-lg overflow-hidden shadow-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <thead className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                        <tr>
                            <th className="p-3">Title</th>
                            <th className="p-3">Status / Priority</th>
                            <th className="p-3">Assigned To</th>
                            <th className="p-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {issues.map(issue => (
                            <motion.tr
                                key={issue._id}
                                className="even:bg-gray-100 hover:bg-purple-50 cursor-pointer"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                whileHover={{ scale: 1.02, boxShadow: "0px 8px 20px rgba(0,0,0,0.1)" }}
                            >
                                <td className="p-3 font-medium">{issue.title}</td>
                                <td className="p-3">
                                    <span className={`font-semibold ${issue.status === 'pending' ? 'text-yellow-600' : issue.status === 'resolved' ? 'text-green-600' : 'text-red-600'}`}>
                                        {issue.status}
                                    </span> / <span className="text-blue-600">{issue.priority}</span>
                                </td>
                                <td className="p-3">
                                    {issue.assignedTo ? (
                                        <motion.div 
                                            className="flex items-center gap-2 text-green-700 font-semibold"
                                            whileHover={{ scale: 1.05, color: "#6b46c1" }}
                                        >
                                            <FaUserPlus /> {issue.assignedTo.name}
                                        </motion.div>
                                    ) : (
                                        <div className="dropdown dropdown-right">
                                            <motion.div 
                                                tabIndex={0} 
                                                role="button" 
                                                className="btn btn-xs btn-outline btn-info flex items-center gap-2"
                                                whileHover={{ scale: 1.05, backgroundColor: "#6b46c1", color: "#fff" }}
                                            >
                                                Assign Staff <FaUserPlus />
                                            </motion.div>
                                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-lg bg-white rounded-box w-52">
                                                {staffList.map(staff => (
                                                    <motion.li 
                                                        key={staff._id} 
                                                        whileHover={{ scale: 1.05, backgroundColor: "#e9d8fd", borderRadius: 6 }}
                                                    >
                                                        <a 
                                                            onClick={() => handleAssign(issue._id, staff._id)} 
                                                            className="flex items-center gap-2 p-1 rounded"
                                                        >
                                                            <FaUserPlus className="text-purple-500"/> {staff.name}
                                                        </a>
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </td>
                                <td className="p-3">
                                    {issue.status === 'pending' && (
                                        <motion.button 
                                            onClick={() => handleReject(issue._id)} 
                                            className="btn btn-xs btn-error flex items-center gap-1"
                                            whileHover={{ scale: 1.1, backgroundColor: "#c53030" }}
                                        >
                                            <FaBan /> Reject
                                        </motion.button>
                                    )}
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </motion.table>
            </div>
        </motion.div>
    );
};

export default AdminAllIssues;
