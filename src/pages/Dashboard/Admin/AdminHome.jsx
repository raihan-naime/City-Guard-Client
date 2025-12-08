import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const AdminHome = () => {
    const axiosSecure = useAxiosSecure();

    const { data: stats = {
        users: 0,
        issues: 0,
        resolved: 0,
        payments: 0
    } } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            // Fetch all separately or specialized endpoint.
            // Using separate calls for now.
            const [usersRes, issuesRes, paymentsRes] = await Promise.all([
                axiosSecure.get('/users'),
                axiosSecure.get('/issues?limit=1000'),
                axiosSecure.get('/payments') // Need to make this route
            ]);
            
            return {
                users: usersRes.data.length,
                issues: issuesRes.data.issues ? issuesRes.data.issues.length : 0, // getAllIssues returns {issues: [], ...}
                resolved: issuesRes.data.issues ? issuesRes.data.issues.filter(i => i.status === 'resolved').length : 0,
                payments: paymentsRes.data.length
            };
        }
    });

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Admin Dashboard Overview</h2>
            <div className="stats shadow w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                <div className="stat">
                    <div className="stat-title">Total Users</div>
                    <div className="stat-value">{stats.users}</div>
                </div>
                <div className="stat">
                    <div className="stat-title">Total Issues</div>
                    <div className="stat-value">{stats.issues}</div>
                </div>
                <div className="stat">
                    <div className="stat-title">Resolved Issues</div>
                    <div className="stat-value">{stats.resolved}</div>
                </div>
                <div className="stat">
                    <div className="stat-title">Total Payments</div>
                    <div className="stat-value">{stats.payments}</div>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;
