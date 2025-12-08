import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const AdminAllIssues = () => {
    const axiosSecure = useAxiosSecure();

    const { data: issues = [], refetch } = useQuery({
        queryKey: ['admin-issues'],
        queryFn: async () => {
             const res = await axiosSecure.get('/issues?limit=100'); // get all
             return res.data.issues;
        }
    });

    const { data: staffList = [] } = useQuery({
        queryKey: ['staff'],
        queryFn: async () => {
             const res = await axiosSecure.get('/users');
             return res.data.filter(u => u.role === 'staff');
        }
    });

    const handleAssign = async (issueId, staffId) => {
        if(!staffId) return;
        try {
            await axiosSecure.patch(`/issues/${issueId}/assign`, { staffId });
            refetch();
            Swal.fire('Success', 'Staff assigned', 'success');
        } catch (error) {
            Swal.fire('Error', 'Failed to assign', 'error');
        }
    }

    const handleReject = async (issueId) => {
        try {
             await axiosSecure.patch(`/issues/${issueId}/status`, { status: 'rejected' });
             refetch();
        } catch(e) { /* ... */ }
    }

    return (
        <div>
             <h2 className="text-3xl font-bold mb-6">All Issues (Admin)</h2>
             <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Status/Priority</th>
                            <th>Assigned To</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {issues.map(issue => (
                            <tr key={issue._id}>
                                <td>{issue.title}</td>
                                <td>
                                    {issue.status} / {issue.priority}
                                </td>
                                <td>
                                    {issue.assignedTo ? issue.assignedTo.name : (
                                        <div className="dropdown dropdown-right">
                                            <div tabIndex={0} role="button" className="btn btn-xs btn-outline">Assign Staff</div>
                                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                                {staffList.map(staff => (
                                                    <li key={staff._id}><a onClick={() => handleAssign(issue._id, staff._id)}>{staff.name}</a></li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </td>
                                <td>
                                    {issue.status === 'pending' && <button onClick={() => handleReject(issue._id)} className="btn btn-xs btn-error">Reject</button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminAllIssues;
