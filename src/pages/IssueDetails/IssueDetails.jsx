import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";

const IssueDetails = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    const { data: issue, isLoading, refetch } = useQuery({
        queryKey: ['issue', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/issues/${id}`);
            return res.data;
        }
    });

    const handleBoost = async () => {
        // Implement payment modal here later
        Swal.fire({
            title: 'Boost Issue Priority',
            text: "This will cost 100tk. Do you want to proceed?",
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Pay & Boost'
        }).then(async (result) => {
            if (result.isConfirmed) {
                // Call payment API
                 try {
                    await axiosSecure.post('/payments', {
                         amount: 100,
                         purpose: 'boost_issue',
                         issueId: issue._id,
                         paymentMethodId: 'mock_pm'
                    });
                     Swal.fire('Boosted!', 'Issue priority is now High.', 'success');
                     refetch();
                } catch (error) {
                     Swal.fire('Error', error.response?.data?.message || 'Payment failed', 'error');
                }
            }
        })
    }

    if (isLoading) return <div className="text-center py-20"><span className="loading loading-spinner loading-lg"></span></div>;

    return (
        <div className="container mx-auto px-4 py-8 mt-16">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left: Issue Info */}
                <div className="lg:w-2/3">
                    <img src={issue.image} alt={issue.title} className="w-full h-96 object-cover rounded-xl mb-6 shadow-lg" />
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-4xl font-bold">{issue.title}</h1>
                        <div className="flex gap-2">
                             <div className={`badge ${issue.priority === 'high' ? 'badge-error text-white' : 'badge-ghost'}`}>{issue.priority}</div>
                             <div className={`badge ${issue.status === 'resolved' ? 'badge-success' : 'badge-ghost'}`}>{issue.status}</div>
                        </div>
                    </div>
                    hi
                    <div className="flex items-center gap-4 mb-6">
                        <div className="avatar">
                            <div className="w-12 rounded-full">
                                <img src={issue.author?.photoURL || "https://i.ibb.co/5GzXkwq/user.png"} />
                            </div>
                        </div>
                        <div>
                            <p className="font-bold">{issue.author?.name}</p>
                            <p className="text-xs text-gray-500">Reported on {new Date(issue.createdAt).toLocaleDateString()}</p>
                        </div>
                         <div className="ml-auto text-lg font-bold text-gray-600">
                            Upvotes: {issue.upvoteCount}
                        </div>
                    </div>

                    <p className="text-lg leading-relaxed mb-8">{issue.description}</p>
                    <p className="text-gray-600 mb-2"><strong>Location:</strong> {issue.location}</p>
                     
                     {/* Buttons */}
                     <div className="flex gap-4">
                        {user?.email === issue.author?.email && issue.status === 'pending' && (
                             <>
                                <button className="btn btn-warning">Edit</button> {/* TODO: Implement Edit Modal */}
                                <button className="btn btn-error">Delete</button>
                             </>
                        )}
                        {issue.priority !== 'high' && (
                            <button onClick={handleBoost} className="btn btn-secondary">Boost Issue (100tk)</button>
                        )}
                     </div>
                </div>

                {/* Right: Timeline & Staff */}
                <div className="lg:w-1/3 space-y-8">
                    {issue.assignedTo && (
                        <div className="card bg-base-100 shadow-xl border border-gray-200">
                             <div className="card-body">
                                <h3 className="card-title text-primary">Assigned Staff</h3>
                                <div className="flex items-center gap-4 mt-2">
                                     <div className="avatar">
                                        <div className="w-12 rounded-full">
                                            <img src={issue.assignedTo?.photoURL || "https://i.ibb.co/5GzXkwq/user.png"} />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-bold">{issue.assignedTo?.name}</p>
                                        <p className="text-xs text-gray-500">{issue.assignedTo?.email}</p>
                                    </div>
                                </div>
                             </div>
                        </div>
                    )}

                    <div className="bg-base-100 p-6 rounded-xl shadow-xl border border-gray-200">
                        <h3 className="text-xl font-bold mb-4">Timeline</h3>
                        <ul className="timeline timeline-vertical">
                            {issue.timeline?.slice().reverse().map((event, index) => (
                                <li key={index}>
                                     {index !== issue.timeline.length - 1 && <hr />}
                                    <div className="timeline-start text-xs text-gray-500">{new Date(event.date).toLocaleDateString()}</div>
                                    <div className="timeline-middle">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-primary"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                                    </div>
                                    <div className="timeline-end timeline-box bg-base-200 text-sm">
                                        <span className="font-bold block">{event.status}</span>
                                        {event.message}
                                        <div className="text-xs mt-1 text-gray-500">by {event.updatedBy}</div>
                                    </div>
                                    {index !== 0 && <hr />}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IssueDetails;
