import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserPlus, FaBan, FaClipboardList, FaTimes } from "react-icons/fa";
import { useState } from "react";

const AdminAllIssues = () => {
    const axiosSecure = useAxiosSecure();
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [selectedStaffId, setSelectedStaffId] = useState("");

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

    const openAssignModal = (issue) => {
        setSelectedIssue(issue);
        setSelectedStaffId("");
        setAssignModalOpen(true);
    };

    const handleAssign = async () => {
        if(!selectedStaffId || !selectedIssue) {
            Swal.fire('Error', 'Please select a staff member', 'error');
            return;
        }

        try {
            await axiosSecure.patch(`/issues/${selectedIssue._id}/assign`, { staffId: selectedStaffId });
            refetch();
            Swal.fire('Success', 'Staff assigned successfully', 'success');
            setAssignModalOpen(false);
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Failed to assign', 'error');
        }
    }

    const handleReject = async (issueId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You want to reject this issue?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, reject it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.patch(`/issues/${issueId}/status`, { status: 'rejected' });
                    refetch();
                    Swal.fire('Rejected!', 'The issue has been rejected.', 'success');
                } catch(e) { 
                    Swal.fire('Error', 'Failed to reject', 'error');
                }
            }
        });
    }

    return (
        <motion.div 
            className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-lg relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
        >
            <motion.h2 
                className="text-3xl font-bold mb-6 flex items-center gap-3 text-purple-700"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <FaClipboardList /> All Issues (Admin)
            </motion.h2>

            <div className="overflow-x-auto min-h-[400px]">
                <table className="table w-full text-left rounded-lg overflow-hidden shadow-md">
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
                            <tr key={issue._id} className="even:bg-gray-100 hover:bg-purple-50">
                                <td className="p-3 font-medium">{issue.title}</td>
                                <td className="p-3">
                                    <span className={`font-semibold ${issue.status === 'pending' ? 'text-yellow-600' : issue.status === 'resolved' ? 'text-green-600' : 'text-red-600'}`}>
                                        {issue.status}
                                    </span> / <span className="text-blue-600">{issue.priority}</span>
                                </td>
                                <td className="p-3">
                                    {issue.assignedTo ? (
                                        <div className="flex items-center gap-2 text-green-700 font-semibold">
                                            <FaUserPlus /> {issue.assignedTo.name}
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => openAssignModal(issue)}
                                            className="btn btn-xs btn-outline btn-info flex items-center gap-2"
                                        >
                                            Assign Staff <FaUserPlus />
                                        </button>
                                    )}
                                </td>
                                <td className="p-3">
                                    {issue.status === 'pending' && (
                                        <button 
                                            onClick={() => handleReject(issue._id)} 
                                            className="btn btn-xs btn-error flex items-center gap-1 text-white"
                                        >
                                            <FaBan /> Reject
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Assign Staff Modal */}
            <AnimatePresence>
                {assignModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm relative"
                        >
                            <button 
                                onClick={() => setAssignModalOpen(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
                            >
                                <FaTimes size={24} />
                            </button>
                            <h3 className="text-xl font-bold mb-4 text-center text-purple-700">Assign Staff</h3>
                            
                            <div className="form-control w-full mb-6">
                                <label className="label">
                                    <span className="label-text">Select a Staff Member</span>
                                </label>
                                <select 
                                    className="select select-bordered w-full"
                                    value={selectedStaffId}
                                    onChange={(e) => setSelectedStaffId(e.target.value)}
                                >
                                    <option value="" disabled>Pick one</option>
                                    {staffList.map(staff => (
                                        <option key={staff._id} value={staff._id}>{staff.name} ({staff.email})</option>
                                    ))}
                                </select>
                            </div>

                            <button 
                                onClick={handleAssign}
                                className="btn btn-primary w-full"
                            >
                                Confirm Assignment
                            </button>
                            
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </motion.div>
    );
};

export default AdminAllIssues;
