import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

const StaffHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: currentIssues = [] } = useQuery({
    queryKey: ["staff-issues", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/issues?assignedTo=${user.email}`);
      return res.data.issues;
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="p-6 bg-gray-100 rounded-2xl overflow-auto scrollbar-hide"
    >
      <h2 className="text-3xl font-bold mb-6 text-slate-800">My Work</h2>

      <div className="stats w-full shadow-sm border border-slate-200 rounded-2xl bg-white">
        {/* Assigned Issues */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.25 }}
          className="stat cursor-default"
        >
          <div className="stat-title text-slate-500 tracking-wide">
            Assigned Issues
          </div>
          <div className="stat-value text-primary">{currentIssues.length}</div>
        </motion.div>

        {/* Resolved Issues */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.25 }}
          className="stat cursor-default"
        >
          <div className="stat-title text-slate-500 tracking-wide">
            Resolved by Me
          </div>
          <div className="stat-value text-emerald-600">
            {currentIssues.filter((i) => i.status === "resolved").length}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StaffHome;
