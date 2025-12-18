import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FaClipboardList, FaHourglassHalf, FaTools, FaCheckCircle, FaMoneyBillWave } from "react-icons/fa";

const CitizenHome = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: stats = {} } = useQuery({
        queryKey: ['citizen-stats', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/stats/citizen`);
            return res.data;
        }
    });

    // Calculate max value for chart scaling
    const maxValue = Math.max(stats.total || 0, stats.pending || 0, stats.inProgress || 0, stats.resolved || 0, 10);

    const getBarHeight = (value) => {
        return `${(value / maxValue) * 100}%`;
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="p-6">
            <motion.h2 
                className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                Welcome back, {user?.displayName}
            </motion.h2>

            <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Total Issues */}
                <motion.div variants={itemVariants} className="stat glass-effect bg-white p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500">
                    <div className="stat-figure text-indigo-500">
                        <FaClipboardList className="text-3xl" />
                    </div>
                    <div className="stat-title font-semibold text-gray-500">Total Reported</div>
                    <div className="stat-value text-indigo-600 text-4xl mt-2">{stats.total || 0}</div>
                    <div className="stat-desc text-indigo-400 font-medium">Lifetime issues</div>
                </motion.div>

                {/* Pending */}
                <motion.div variants={itemVariants} className="stat glass-effect bg-white p-6 rounded-2xl shadow-lg border-l-4 border-yellow-500">
                    <div className="stat-figure text-yellow-500">
                        <FaHourglassHalf className="text-3xl" />
                    </div>
                    <div className="stat-title font-semibold text-gray-500">Pending</div>
                    <div className="stat-value text-yellow-600 text-4xl mt-2">{stats.pending || 0}</div>
                    <div className="stat-desc text-yellow-400 font-medium">Awaiting action</div>
                </motion.div>

                {/* In Progress */}
                <motion.div variants={itemVariants} className="stat glass-effect bg-white p-6 rounded-2xl shadow-lg border-l-4 border-blue-500">
                    <div className="stat-figure text-blue-500">
                        <FaTools className="text-3xl" />
                    </div>
                    <div className="stat-title font-semibold text-gray-500">In Progress</div>
                    <div className="stat-value text-blue-600 text-4xl mt-2">{stats.inProgress || 0}</div>
                    <div className="stat-desc text-blue-400 font-medium">Currently being fixed</div>
                </motion.div>

                {/* Resolved */}
                <motion.div variants={itemVariants} className="stat glass-effect bg-white p-6 rounded-2xl shadow-lg border-l-4 border-green-500">
                    <div className="stat-figure text-green-500">
                        <FaCheckCircle className="text-3xl" />
                    </div>
                    <div className="stat-title font-semibold text-gray-500">Resolved</div>
                    <div className="stat-value text-green-600 text-4xl mt-2">{stats.resolved || 0}</div>
                    <div className="stat-desc text-green-400 font-medium">Successfully completed</div>
                </motion.div>

                 {/* Payments */}
                 <motion.div variants={itemVariants} className="stat glass-effect bg-white p-6 rounded-2xl shadow-lg border-l-4 border-pink-500 col-span-1 md:col-span-2 lg:col-span-4 lg:w-1/4">
                    <div className="stat-figure text-pink-500">
                        <FaMoneyBillWave className="text-3xl" />
                    </div>
                    <div className="stat-title font-semibold text-gray-500">Total Payments</div>
                    <div className="stat-value text-pink-600 text-4xl mt-2">{stats.paymentCount || 0}</div>
                    <div className="stat-desc text-pink-400 font-medium">Transactions completed</div>
                </motion.div>

            </motion.div>

            {/* Simple CSS Chart */}
            <motion.div 
                className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <h3 className="text-xl font-bold mb-8 text-gray-700">Issue Activity Overview</h3>
                <div className="flex items-end justify-center gap-8 h-64 w-full max-w-3xl mx-auto">
                    {/* Total Bar */}
                    <div className="flex flex-col items-center gap-2 group w-16">
                        <div className="text-sm font-bold text-gray-500 group-hover:text-indigo-600 transition-colors">{stats.total || 0}</div>
                        <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: getBarHeight(stats.total || 0) }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="w-full bg-indigo-100 hover:bg-indigo-500 rounded-t-lg transition-colors relative"
                        >
                             <div className="absolute bottom-0 w-full bg-indigo-500 h-2 rounded-t-lg opacity-20"></div>
                        </motion.div>
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total</div>
                    </div>

                    {/* Pending Bar */}
                    <div className="flex flex-col items-center gap-2 group w-16">
                        <div className="text-sm font-bold text-gray-500 group-hover:text-yellow-600 transition-colors">{stats.pending || 0}</div>
                     <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: getBarHeight(stats.pending || 0) }}
                            transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
                            className="w-full bg-yellow-100 hover:bg-yellow-500 rounded-t-lg transition-colors relative"
                        >
                            <div className="absolute bottom-0 w-full bg-yellow-500 h-2 rounded-t-lg opacity-20"></div>
                        </motion.div>
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pending</div>
                    </div>

                    {/* In Progress Bar */}
                    <div className="flex flex-col items-center gap-2 group w-16">
                         <div className="text-sm font-bold text-gray-500 group-hover:text-blue-600 transition-colors">{stats.inProgress || 0}</div>
                        <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: getBarHeight(stats.inProgress || 0) }}
                            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                            className="w-full bg-blue-100 hover:bg-blue-500 rounded-t-lg transition-colors relative"
                        >
                            <div className="absolute bottom-0 w-full bg-blue-500 h-2 rounded-t-lg opacity-20"></div>
                        </motion.div>
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Progress</div>
                    </div>

                    {/* Resolved Bar */}
                    <div className="flex flex-col items-center gap-2 group w-16">
                        <div className="text-sm font-bold text-gray-500 group-hover:text-green-600 transition-colors">{stats.resolved || 0}</div>
                        <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: getBarHeight(stats.resolved || 0) }}
                            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                            className="w-full bg-green-100 hover:bg-green-500 rounded-t-lg transition-colors relative"
                        >
                            <div className="absolute bottom-0 w-full bg-green-500 h-2 rounded-t-lg opacity-20"></div>
                        </motion.div>
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Resolved</div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CitizenHome;
