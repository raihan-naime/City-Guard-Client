import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { Link } from "react-router-dom";

const FeaturedIssues = () => {
    const axiosPublic = useAxiosPublic();
    
    const { data: issues = [], isLoading } = useQuery({
        queryKey: ['featuredIssues'],
        queryFn: async () => {
            const res = await axiosPublic.get('/issues?status=resolved&limit=6');
            return res.data.issues; // API returns object with issues array
        }
    });

    if (isLoading) return <div className="text-center my-10"><span className="loading loading-spinner loading-lg"></span></div>;

    return (
        <div className="my-16 container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10">Recently Resolved Issues</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {issues.map(issue => (
                    <div key={issue._id} className="card bg-base-100 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                        <figure className="h-48 overflow-hidden"><img src={issue.image} alt={issue.title} className="w-full h-full object-cover" /></figure>
                        <div className="card-body">
                            <h2 className="card-title">
                                {issue.title}
                                <div className="badge badge-success text-white">Resolved</div>
                            </h2>
                            <p className="text-gray-500 line-clamp-2">{issue.description}</p>
                            <div className="card-actions justify-end mt-4">
                                <Link to={`/issues/${issue._id}`} className="btn btn-outline btn-sm btn-primary">View Details</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {issues.length === 0 && <p className="text-center text-gray-500">No resolved issues yet. Be the first!</p>}
        </div>
    );
};

export default FeaturedIssues;
