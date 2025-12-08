import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const StaffHome = () => {
     const { user } = useAuth();
     const axiosSecure = useAxiosSecure();
 
     const { data: currentIssues = [] } = useQuery({
         queryKey: ['staff-issues', user?.email],
         queryFn: async () => {
             const res = await axiosSecure.get(`/issues?assignedTo=${user.email}`);
             return res.data.issues;
         }
     });

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">My Work</h2>
            <div className="stats shadow w-full">
                <div className="stat">
                    <div className="stat-title">Assigned Issues</div>
                    <div className="stat-value">{currentIssues.length}</div>
                </div>
                 <div className="stat">
                    <div className="stat-title">Resolved by Me</div>
                    <div className="stat-value">{currentIssues.filter(i => i.status === 'resolved').length}</div>
                </div>
            </div>
        </div>
    );
};

export default StaffHome;
