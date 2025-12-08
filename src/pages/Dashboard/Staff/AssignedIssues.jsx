import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const AssignedIssues = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: issues = [], refetch } = useQuery({
        queryKey: ['assigned-issues', user?.email],
        queryFn: async () => {
            // Need API to get assigned issues. 
            // getAllIssues supports author filter, but not assignedTo?
            // Actually assignedTo is in DB. I can filter by it?
            // "Assigned Staff" ID is in DB. 
            // My API `getAllIssues` (GET /issues) supports generic query.
            // But I didn't add `assignedTo` to the query builder in `issueRoutes.js` explicitly.
            // I should add it or handle it.
            // Let's add it in next step.
            const res = await axiosSecure.get(`/issues?assignedTo=${user.email}`); // passing email, but backend needs ID usually.
            // I'll handle email->id lookup in backend for assignedTo as well.
            return res.data.issues;
        }
    });

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axiosSecure.patch(`/issues/${id}/status`, { status: newStatus });
            refetch();
            Swal.fire('Success', `Status updated to ${newStatus}`, 'success');
        } catch (error) {
            Swal.fire('Error', 'Failed to update status', 'error');
        }
    }

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Assigned Issues</h2>
             <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Current Status</th>
                            <th>Priority</th>
                            <th>Change Status</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {issues.map(issue => (
                            <tr key={issue._id}>
                                <td>{issue.title}</td>
                                <td><div className="badge badge-outline">{issue.status}</div></td>
                                <td>{issue.priority}</td>
                                <td>
                                    <select 
                                        className="select select-bordered select-xs" 
                                        defaultValue={issue.status}
                                        onChange={(e) => handleStatusChange(issue._id, e.target.value)}
                                    >
                                        <option value="pending" disabled>Pending</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="resolved">Resolved</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </td>
                                <td><Link to={`/issues/${issue._id}`} className="btn btn-xs">View</Link></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AssignedIssues;
