import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const AllIssues = () => {
    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);
    const limit = 6;

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['issues', search, category, status, page],
        queryFn: async () => {
            const res = await axiosPublic.get(`/issues?search=${search}&category=${category}&status=${status}&page=${page}&limit=${limit}`);
            return res.data;
        }
    });

    const handleUpvote = async (issueId, authorId) => {
        if (!user) {
            Swal.fire({
                title: 'Please Login',
                text: "You need to login to upvote",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Login'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login', { state: { from: { pathname: '/all-issues' } } });
                }
            })
            return;
        }

        if (user.email === authorId) { // This check is insufficient on frontend if we don't have author email. Better check ID. 
            // API handles own issue check. Let's just try to call API.
        }

        try {
            await axiosSecure.patch(`/issues/${issueId}/upvote`);
            refetch(); // Refetch to show new count
        } catch (error) {
           Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response?.data?.message || 'Something went wrong',
            });
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-16">
            <h2 className="text-3xl font-bold text-center mb-8">All Reported Issues</h2>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center bg-base-200 p-4 rounded-lg">
                <input 
                    type="text" 
                    placeholder="Search by title or location..." 
                    className="input input-bordered w-full md:w-1/3"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select className="select select-bordered w-full md:w-1/4" onChange={(e) => setCategory(e.target.value)} value={category}>
                    <option value="">All Categories</option>
                    <option value="Roads">Roads</option>
                    <option value="Water">Water</option>
                    <option value="Electricity">Electricity</option>
                    <option value="Garbage">Garbage</option>
                </select>
                <select className="select select-bordered w-full md:w-1/4" onChange={(e) => setStatus(e.target.value)} value={status}>
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                </select>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="text-center py-20"><span className="loading loading-spinner loading-lg"></span></div>
            ) : (
                <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data?.issues?.map(issue => (
                        <div key={issue._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all">
                            <figure className="h-48 relative">
                                <img src={issue.image} alt={issue.title} className="w-full h-full object-cover" />
                                {issue.priority === 'high' && <div className="absolute top-2 right-2 badge badge-error text-white">Top Priority</div>}
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title justify-between">
                                    {issue.title}
                                    <div className={`badge ${issue.status === 'resolved' ? 'badge-success' : 'badge-ghost'}`}>{issue.status}</div>
                                </h2>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    {issue.location}
                                </p>
                                <p className="line-clamp-2">{issue.description}</p>
                                <div className="card-actions justify-between items-center mt-4">
                                    <button 
                                        onClick={() => handleUpvote(issue._id, issue.author?._id)} // author id not fully passed here but validation happens on backend
                                        className="btn btn-sm btn-ghost gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>
                                        {issue.upvoteCount}
                                    </button>
                                    <Link to={`/issues/${issue._id}`} className="btn btn-primary btn-sm">View Details</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Pagination */}
                <div className="join flex justify-center mt-10">
                    <button className="join-item btn" onClick={() => setPage(old => Math.max(old - 1, 1))} disabled={page === 1}>«</button>
                    <button className="join-item btn">Page {page} of {data?.totalPages || 1}</button>
                    <button className="join-item btn" onClick={() => setPage(old => (!data || old === data.totalPages ? old : old + 1))} disabled={!data || page === data.totalPages}>»</button>
                </div>
                </>
            )}
        </div>
    );
};

export default AllIssues;
