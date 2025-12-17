import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { FaUserLock, FaUserCheck } from "react-icons/fa";

const ManageUsers = () => {
    const axiosSecure = useAxiosSecure();

    const { data: users = [], refetch } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data.filter(u => u.role === 'citizen');
        }
    });

    const handleBlock = async (user) => {
        Swal.fire({
            title: `Are you sure you want to ${user.isBlocked ? 'unblock' : 'block'} this user?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axiosSecure.patch(`/users/${user._id}/block`, { isBlocked: !user.isBlocked });
                refetch();
                Swal.fire('Success', 'User status updated', 'success');
            }
        });
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const rowVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h2 className="text-4xl font-extrabold mb-8 text-gray-800">Manage Citizens</h2>

            <motion.div
                className="overflow-x-auto shadow-lg rounded-xl bg-white"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <table className="min-w-full table-auto border-collapse">
                    <thead className="bg-gray-100 text-gray-700 uppercase text-sm font-medium tracking-wider">
                        <tr>
                            <th className="py-4 px-6 text-left">Name</th>
                            <th className="py-4 px-6 text-left">Email</th>
                            <th className="py-4 px-6 text-left">Role</th>
                            <th className="py-4 px-6 text-left">Status</th>
                            <th className="py-4 px-6 text-left">Action</th>
                        </tr>
                    </thead>
                    <motion.tbody>
                        {users.map((user) => (
                            <motion.tr
                                key={user._id}
                                variants={rowVariants}
                                className="border-b border-gray-200 last:border-none hover:bg-gray-50 transition-colors duration-200"
                            >
                                <td className="py-4 px-6 font-medium text-gray-800">{user.name}</td>
                                <td className="py-4 px-6 text-gray-600">{user.email}</td>
                                <td className="py-4 px-6 capitalize text-gray-600">{user.role}</td>
                                <td className={`py-4 px-6 font-semibold ${user.isBlocked ? 'text-red-600' : 'text-green-600'}`}>
                                    {user.isBlocked ? 'Blocked' : 'Active'}
                                </td>
                                <td className="py-4 px-6">
                                    <motion.button
                                        onClick={() => handleBlock(user)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-300 shadow-md
                                            ${user.isBlocked ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}
                                    >
                                        {user.isBlocked ? <FaUserCheck /> : <FaUserLock />}
                                        {user.isBlocked ? 'Unblock' : 'Block'}
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

export default ManageUsers;
