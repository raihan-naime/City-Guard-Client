import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import { motion } from "framer-motion";
import { FaUserCircle, FaCheckCircle, FaClock } from "react-icons/fa";

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
        Swal.fire({
            title: 'Boost Issue Priority',
            text: "This will cost 100tk. Do you want to proceed?",
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Pay & Boost'
        }).then(async (result) => {
            if (result.isConfirmed) {
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
        <div className="container  mx-auto px-4 py-8 ">
            <div className="flex mt-15 flex-col lg:flex-row gap-8">
                {/* Left: Issue Info */}
                <motion.div 
                    className="lg:w-2/3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.img 
                        src={issue.image} 
                        alt={issue.title} 
                        className="w-full h-96 object-cover rounded-xl mb-6 shadow-2xl hover:scale-105 transition-transform duration-500"
                        whileHover={{ scale: 1.03 }}
                    />

                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-4xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500">{issue.title}</h1>
                        <div className="flex gap-2">
                            <span className={`badge ${issue.priority === 'high' ? 'badge-error text-white' : 'badge-ghost'}`}>
                                {issue.priority}
                            </span>
                            <span className={`badge ${issue.status === 'resolved' ? 'badge-success' : 'badge-warning text-white'}`}>
                                {issue.status}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="avatar">
                            <div className="w-12 rounded-full overflow-hidden border border-gray-200 shadow-sm">
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

                    <p className="text-lg leading-relaxed mb-8 text-gray-800">{issue.description}</p>
                    <p className="text-gray-600 mb-4"><strong>Location:</strong> {issue.location}</p>

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-4">
                        {user?.email === issue.author?.email && issue.status === 'pending' && (
                            <>
                                <button className="btn btn-warning shadow-md hover:shadow-lg transition-all">Edit</button>
                                <button className="btn btn-error shadow-md hover:shadow-lg transition-all">Delete</button>
                            </>
                        )}
                        {issue.priority !== 'high' && (
                            <button onClick={handleBoost} className="btn btn-secondary shadow-md hover:shadow-lg transition-all">Boost Issue (100tk)</button>
                        )}
                    </div>
                </motion.div>

                {/* Right: Timeline & Staff */}
                <motion.div 
                    className="lg:w-1/3 space-y-8"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {issue.assignedTo && (
                        <motion.div 
                            className="card bg-white shadow-2xl border border-gray-200 rounded-xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="card-body">
                                <h3 className="card-title text-purple-600">Assigned Staff</h3>
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="avatar">
                                        <div className="w-12 rounded-full overflow-hidden border border-gray-200 shadow-sm">
                                            <img src={issue.assignedTo?.photoURL || "https://i.ibb.co/5GzXkwq/user.png"} />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-bold">{issue.assignedTo?.name}</p>
                                        <p className="text-xs text-gray-500">{issue.assignedTo?.email}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <motion.div 
                        className="bg-white p-6 rounded-xl shadow-2xl border border-gray-200"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <h3 className="text-xl font-bold mb-4 text-purple-600">Timeline</h3>
                        <ul className="space-y-4">
                            {issue.timeline?.slice().reverse().map((event, index) => (
                                <motion.li 
                                    key={index} 
                                    className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString()}</span>
                                        <FaCheckCircle className="text-green-500" />
                                    </div>
                                    <span className="font-semibold text-gray-800">{event.status}</span>
                                    <p className="text-sm text-gray-600">{event.message}</p>
                                    <div className="text-xs mt-1 text-gray-400">by {event.updatedBy}</div>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default IssueDetails;
