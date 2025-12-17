import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { FaUsers, FaClipboardList, FaCheckCircle, FaMoneyCheckAlt } from "react-icons/fa";
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

            return {
                users: usersRes.data.length,
                issues: issuesRes.data.issues ? issuesRes.data.issues.length : 0,
                resolved: issuesRes.data.issues ? issuesRes.data.issues.filter(i => i.status === 'resolved').length : 0,
                payments: paymentsRes.data.length
            };
        }
    });

    const statItems = [
        { title: 'Total Users', value: stats.users, icon: <FaUsers className="text-blue-500 w-6 h-6" /> },
        { title: 'Total Issues', value: stats.issues, icon: <FaClipboardList className="text-yellow-500 w-6 h-6" /> },
        { title: 'Resolved Issues', value: stats.resolved, icon: <FaCheckCircle className="text-green-500 w-6 h-6" /> },
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
                        className="stat p-6 rounded-2xl shadow-lg bg-gradient-to-tr from-white/80 to-white/50 backdrop-blur-lg cursor-pointer"
                        variants={itemVariants}
                        whileHover="hover"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            {stat.icon}
                            <div className="stat-title text-slate-500 font-semibold">{stat.title}</div>
                        </div>
                        <div className="stat-value text-2xl font-bold text-slate-800">{stat.value}</div>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
};

export default AdminHome;
