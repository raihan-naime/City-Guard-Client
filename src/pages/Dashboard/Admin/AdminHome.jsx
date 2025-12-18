import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { FaUsers, FaClipboardList, FaCheckCircle, FaMoneyCheckAlt, FaTimesCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import logo from "../../../assets/react.svg"; // your logo path

const AdminHome = () => {
    const axiosSecure = useAxiosSecure();

    const { data: stats = { users: 0, issues: 0, resolved: 0, payments: 0 } } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const [usersRes, issuesRes, paymentsRes] = await Promise.all([
                axiosSecure.get('/users'),
                axiosSecure.get('/issues?limit=1000'),
                axiosSecure.get('/payments')
            ]);
            
            const issues = issuesRes.data.issues || [];

            return {
                users: usersRes.data.length,
                totalIssues: issues.length,
                resolved: issues.filter(i => i.status === 'resolved').length,
                pending: issues.filter(i => i.status === 'pending').length,
                rejected: issues.filter(i => i.status === 'rejected').length,
                payments: paymentsRes.data.length,
                latestUsers: usersRes.data.slice(-5).reverse(),
                latestPayments: paymentsRes.data.slice(0, 5) // payments already sorted desc in backend
            };
        }
    });

    const statItems = [
        { title: 'Total Users', value: stats.users, icon: <FaUsers className="text-blue-500 w-6 h-6" /> },
        { title: 'Total Issues', value: stats.totalIssues, icon: <FaClipboardList className="text-indigo-500 w-6 h-6" /> },
        { title: 'Resolved Issues', value: stats.resolved, icon: <FaCheckCircle className="text-green-500 w-6 h-6" /> },
        { title: 'Pending Issues', value: stats.pending, icon: <FaClipboardList className="text-yellow-500 w-6 h-6" /> },
        { title: 'Rejected Issues', value: stats.rejected, icon: <FaTimesCircle className="text-red-500 w-6 h-6" /> },
        { title: 'Total Payments', value: stats.payments, icon: <FaMoneyCheckAlt className="text-purple-500 w-6 h-6" /> },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
        hover: { scale: 1.05, transition: { type: "spring", stiffness: 200 } }
    };

    return (
        <motion.div
            className="p-6 space-y-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Logo and title */}
            <motion.div className="flex items-center gap-4 mb-6"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ type: "spring", stiffness: 120 }}
            >
                <motion.img
                    src={logo}
                    alt="Logo"
                    className="w-12 h-12 rounded-full shadow-lg"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                />
                <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-violet-600 text-transparent bg-clip-text">
                    Admin Dashboard Overview
                </h2>
            </motion.div>

            {/* Stats grid */}
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
            >
                {statItems.map((stat, index) => (
                    <motion.div
                        key={index}
                        className="stat p-6 rounded-2xl shadow-lg bg-[var(--card-bg)] backdrop-blur-lg cursor-pointer border border-[var(--glass-border)]"
                        variants={itemVariants}
                        whileHover="hover"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            {stat.icon}
                            <div className="stat-title text-[var(--text-secondary)] font-semibold">{stat.title}</div>
                        </div>
                        <div className="stat-value text-2xl font-bold text-[var(--text-primary)]">{stat.value}</div>
                    </motion.div>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                {/* Latest Users */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-[var(--card-bg)] p-6 rounded-2xl shadow-xl border border-[var(--glass-border)]"
                >
                    <h3 className="text-xl font-bold mb-4 text-[var(--text-primary)]">Latest Registered Users</h3>
                    <table className="table w-full text-sm">
                        <thead>
                            <tr className="bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
                                <th className="py-3 px-4 rounded-l-lg">Name</th>
                                <th className="py-3 px-4 rounded-r-lg">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.latestUsers?.map((u, i) => (
                                <tr key={i} className="border-b border-[var(--glass-border)] hover:bg-[var(--bg-secondary)]">
                                    <td className="py-3 px-4 font-medium text-[var(--text-primary)]">{u.name}</td>
                                    <td className="py-3 px-4 text-[var(--text-secondary)] capitalize">{u.role}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>

                {/* Latest Payments */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-[var(--card-bg)] p-6 rounded-2xl shadow-xl border border-[var(--glass-border)]"
                >
                    <h3 className="text-xl font-bold mb-4 text-[var(--text-primary)]">Latest Payments Received</h3>
                    <table className="table w-full text-sm">
                        <thead>
                            <tr className="bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
                                <th className="py-3 px-4 rounded-l-lg">User</th>
                                <th className="py-3 px-4">Amount</th>
                                <th className="py-3 px-4 rounded-r-lg">Purpose</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.latestPayments?.map((p, i) => (
                                <tr key={i} className="border-b border-[var(--glass-border)] hover:bg-[var(--bg-secondary)]">
                                    <td className="py-3 px-4 font-medium text-[var(--text-primary)]">{p.user?.name || 'Unknown'}</td>
                                    <td className="py-3 px-4 font-bold text-green-500">${p.amount}</td>
                                    <td className="py-3 px-4 text-[var(--text-secondary)] capitalize">{p.purpose}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default AdminHome;
