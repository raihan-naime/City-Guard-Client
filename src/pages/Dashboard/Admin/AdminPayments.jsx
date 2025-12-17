import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { motion } from "framer-motion";
import { FaDollarSign, FaUser, FaClipboardList } from "react-icons/fa";

const AdminPayments = () => {
    const axiosSecure = useAxiosSecure();

    const { data: payments = [] } = useQuery({
        queryKey: ['admin-payments'],
        queryFn: async () => {
            const res = await axiosSecure.get('/payments');
            return res.data;
        }
    });

    return (
        <motion.div 
            className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
        >
            <motion.h2
                className="text-3xl font-bold mb-6 flex items-center gap-3 text-green-700"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.5 }}
            >
                <FaClipboardList /> All Payments
            </motion.h2>

            <div className="overflow-x-auto">
                <motion.table
                    className="table w-full text-left rounded-lg overflow-hidden shadow-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <thead className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                        <tr>
                            <th className="p-3 flex items-center gap-2"><FaUser /> User</th>

                            <th className="p-3 flex items-center gap-2"><FaDollarSign /> Amount</th>
                            
                            <th className="p-3">Purpose</th>
                            <th className="p-3">Transaction ID</th>
                            <th className="p-3">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map(pay => (
                            <motion.tr
                                key={pay._id}
                                className="even:bg-gray-100 hover:bg-green-50 cursor-pointer"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                whileHover={{ scale: 1.02, boxShadow: "0px 8px 20px rgba(0,0,0,0.1)" }}
                            >
                                <td className="p-3">
                                    <div>
                                        <div className="font-bold">{pay.user?.name || 'Unknown'}</div>
                                        <div className="text-xs opacity-50">{pay.user?.email}</div>
                                    </div>
                                </td>
                                <td className="p-3 text-green-600 font-semibold">{pay.amount}</td>
                                <td className="p-3">{pay.purpose}</td>
                                <td className="p-3 font-mono text-gray-700">{pay.transactionId}</td>
                                <td className="p-3">{new Date(pay.date).toLocaleDateString()}</td>
                            </motion.tr>
                        ))}
                    </tbody>
                </motion.table>
            </div>
        </motion.div>
    );
};

export default AdminPayments;
