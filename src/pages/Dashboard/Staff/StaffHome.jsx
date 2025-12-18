import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FaClipboardList, FaCheckCircle, FaTasks, FaChartPie } from "react-icons/fa";

const StaffHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: stats = { totalAssigned: 0, resolvedCount: 0, todayTasks: 0, statusDistribution: {} } } = useQuery({
    queryKey: ["staff-stats", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get('/stats/staff');
      return res.data;
    },
  });

  // Calculate max for chart
  const maxValue = Math.max(
    stats.statusDistribution?.pending || 0,
    stats.statusDistribution?.inProgress || 0,
    stats.statusDistribution?.resolved || 0,
    stats.statusDistribution?.closed || 0,
    1
  );
  
  const getBarHeight = (val) => `${(val / maxValue) * 100}%`;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="p-6 bg-[var(--bg-primary)] min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-[var(--text-primary)]">Dashboard Overview</h2>
        <p className="text-[var(--text-secondary)]">Welcome back, {user?.displayName}</p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Assigned Issues Count */}
        <motion.div variants={itemVariants} className="stat bg-[var(--card-bg)] shadow-lg rounded-2xl border-l-4 border-blue-500 border-r border-t border-b border-r-[var(--glass-border)] border-t-[var(--glass-border)] border-b-[var(--glass-border)]">
          <div className="stat-figure text-blue-500">
            <FaClipboardList className="text-3xl" />
          </div>
          <div className="stat-title font-semibold text-[var(--text-secondary)]">Assigned Issues</div>
          <div className="stat-value text-blue-600">{stats.totalAssigned}</div>
          <div className="stat-desc">Total assignments</div>
        </motion.div>

        {/* Resolved Issues Count */}
        <motion.div variants={itemVariants} className="stat bg-[var(--card-bg)] shadow-lg rounded-2xl border-l-4 border-emerald-500 border-r border-t border-b border-r-[var(--glass-border)] border-t-[var(--glass-border)] border-b-[var(--glass-border)]">
          <div className="stat-figure text-emerald-500">
            <FaCheckCircle className="text-3xl" />
          </div>
          <div className="stat-title font-semibold text-[var(--text-secondary)]">Issues Resolved</div>
          <div className="stat-value text-emerald-600">{stats.resolvedCount}</div>
          <div className="stat-desc">Success rate</div>
        </motion.div>

        {/* Today's Tasks */}
        <motion.div variants={itemVariants} className="stat bg-[var(--card-bg)] shadow-lg rounded-2xl border-l-4 border-amber-500 border-r border-t border-b border-r-[var(--glass-border)] border-t-[var(--glass-border)] border-b-[var(--glass-border)]">
          <div className="stat-figure text-amber-500">
            <FaTasks className="text-3xl" />
          </div>
          <div className="stat-title font-semibold text-[var(--text-secondary)]">Today's Tasks</div>
          <div className="stat-value text-amber-600">{stats.todayTasks}</div>
          <div className="stat-desc">Pending & In-Progress</div>
        </motion.div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <motion.div 
            className="bg-[var(--card-bg)] p-8 rounded-2xl shadow-xl border border-[var(--glass-border)]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
        >
            <h3 className="text-xl font-bold mb-8 text-[var(--text-primary)] flex items-center gap-2">
                <FaChartPie className="text-indigo-500"/> Issue Status Distribution
            </h3>
            
            <div className="flex items-end justify-around h-64 w-full">
                {/* Pending */}
                <div className="flex flex-col items-center gap-2 group w-12">
                    <div className="text-sm font-bold text-gray-500">{stats.statusDistribution?.pending || 0}</div>
                    <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: getBarHeight(stats.statusDistribution?.pending || 0) }}
                        className="w-full bg-amber-200 hover:bg-amber-400 rounded-t-lg transition-colors"
                    ></motion.div>
                    <div className="text-xs font-semibold text-gray-400 rotate-0">Pending</div>
                </div>

                {/* In Progress */}
                <div className="flex flex-col items-center gap-2 group w-12">
                    <div className="text-sm font-bold text-gray-500">{stats.statusDistribution?.inProgress || 0}</div>
                    <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: getBarHeight(stats.statusDistribution?.inProgress || 0) }}
                        className="w-full bg-blue-200 hover:bg-blue-400 rounded-t-lg transition-colors"
                    ></motion.div>
                    <div className="text-xs font-semibold text-gray-400">Progress</div>
                </div>

                {/* Resolved */}
                <div className="flex flex-col items-center gap-2 group w-12">
                    <div className="text-sm font-bold text-gray-500">{stats.statusDistribution?.resolved || 0}</div>
                    <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: getBarHeight(stats.statusDistribution?.resolved || 0) }}
                        className="w-full bg-emerald-200 hover:bg-emerald-400 rounded-t-lg transition-colors"
                    ></motion.div>
                    <div className="text-xs font-semibold text-gray-400">Resolved</div>
                </div>

                {/* Closed */}
                <div className="flex flex-col items-center gap-2 group w-12">
                    <div className="text-sm font-bold text-gray-500">{stats.statusDistribution?.closed || 0}</div>
                    <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: getBarHeight(stats.statusDistribution?.closed || 0) }}
                        className="w-full bg-gray-200 hover:bg-gray-400 rounded-t-lg transition-colors"
                    ></motion.div>
                    <div className="text-xs font-semibold text-gray-400">Closed</div>
                </div>
            </div>
        </motion.div>

        {/* Recent Activity / Extra Stats */}
        <motion.div 
             className="bg-[var(--card-bg)] p-8 rounded-2xl shadow-inner border border-[var(--glass-border)] flex flex-col justify-center items-center text-center"
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.3 }}
        >
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4">You are doing great!</h3>
            <p className="text-[var(--text-secondary)] mb-6">You have resolved <span className="font-bold text-emerald-600">{stats.resolvedCount}</span> issues so far. Keep up the good work ensuring our city remains safe and clean.</p>
            <div className="radial-progress text-indigo-500 font-bold text-xl" style={{"--value": Math.min((stats.resolvedCount / Math.max(stats.totalAssigned, 1)) * 100, 100), "--size": "8rem", "--thickness": "0.8rem"}}>
                {Math.round((stats.resolvedCount / Math.max(stats.totalAssigned, 1)) * 100)}%
            </div>
            <p className="mt-4 text-sm text-[var(--text-secondary)]">Completion Rate</p>
        </motion.div>
      </div>
    </div>
  );
};

export default StaffHome;
