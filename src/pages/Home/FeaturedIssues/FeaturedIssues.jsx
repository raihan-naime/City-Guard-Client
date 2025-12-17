import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { Link } from "react-router-dom";

const FeaturedIssues = () => {
  const axiosPublic = useAxiosPublic();

  const { data: issues = [], isLoading } = useQuery({
    queryKey: ["featuredIssues"],
    queryFn: async () => {
      const res = await axiosPublic.get("/issues?status=resolved&limit=6");
      return res.data.issues;
    },
  });

  if (isLoading)
    return (
      <div className="text-center my-10">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  return (
    <div className="my-16 container mx-auto px-4">
      <h2
        className="text-3xl font-bold text-center mb-10
                           bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                           bg-clip-text text-transparent"
      >
        Recently Resolved Issues
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {issues.map((issue) => (
          <div
            key={issue._id}
            className="
                            group card bg-base-100 shadow-lg border border-gray-100 
                            rounded-2xl overflow-hidden
                            transition-all duration-500 ease-in-out
                            hover:shadow-2xl hover:-translate-y-2 hover:scale-105
                            hover:border-transparent
                        "
          >
            <figure className="h-48 overflow-hidden relative">
              <img
                src={issue.image}
                alt={issue.title}
                className="
                                    w-full h-full object-cover
                                    transition-transform duration-500 ease-in-out
                                    group-hover:scale-110
                                "
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title justify-between items-center">
                {issue.title}
                <div className="badge badge-success text-white shadow-md transition-all duration-300 group-hover:bg-green-500">
                  Resolved
                </div>
              </h2>
              <p className="text-gray-500 line-clamp-2">{issue.description}</p>
              <div className="card-actions justify-end mt-4">
                
                <Link
                  to={`/issues/${issue._id}`}
                  className="btn btn-sm relative overflow-hidden text-white border-none bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 shadow-md transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-[2px] active:translate-y-0 active:shadow-md before:absolute before:inset-0 before:bg-white/20 before:translate-x-[-120%] before:skew-x-[-20deg] before:transition-transform before:duration-500 hover:before:translate-x-[120%] "
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {issues.length === 0 && (
        <p className="text-center text-gray-500 mt-6">
          No resolved issues yet. Be the first!
        </p>
      )}
    </div>
  );
};

export default FeaturedIssues;
