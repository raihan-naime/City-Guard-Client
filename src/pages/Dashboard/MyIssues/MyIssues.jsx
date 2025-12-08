import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const MyIssues = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: issues = [], refetch } = useQuery({
        queryKey: ['my-issues', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/issues?author=${user.email}&limit=100`);
            return res.data.issues;
        }
    });

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Assuming I have delete endpoint. Checking implementation plan... 
                    // I created Issue API CRUD, but let's double check route existence in next step or assume yes. 
                    // I actually didn't explicitly write DELETE route in `issueRoutes.js` (I wrote POST, GET, PATCH).
                    // I MUST ADD DELETE ROUTE.
                    await axiosSecure.delete(`/issues/${id}`);
                    refetch();
                    Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
                } catch (error) {
                    Swal.fire('Error', 'Make sure you implemented DELETE route!', 'error');
                }
            }
        })
    }

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">My Issues</h2>
            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {issues.map(issue => (
                            <tr key={issue._id}>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle w-12 h-12">
                                                <img src={issue.image} alt={issue.title} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold">{issue.title}</div>
                                            <div className="text-sm opacity-50">{issue.location}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className={`badge ${issue.status === 'resolved' ? 'badge-success' : 'badge-ghost'}`}>{issue.status}</div>
                                </td>
                                <td>{issue.priority}</td>
                                <td>{new Date(issue.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <Link to={`/issues/${issue._id}`} className="btn btn-ghost btn-xs">View</Link>
                                    {issue.status === 'pending' && (
                                        <button onClick={() => handleDelete(issue._id)} className="btn btn-ghost btn-xs text-error">Delete</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyIssues;
