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

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const limit = 6;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["issues", search, category, status, page],
    queryFn: async () => {
      const res = await axiosPublic.get(
        `/issues?search=${search}&category=${category}&status=${status}&page=${page}&limit=${limit}`
      );
      return res.data;
    },
  });

  const handleUpvote = async (issueId, authorId) => {
    if (!user) {
      Swal.fire({
        title: "Please Login",
        text: "You need to login to upvote",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#2563eb",
        cancelButtonColor: "#dc2626",
        confirmButtonText: "Login",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login", { state: { from: { pathname: "/all-issues" } } });
        }
      });
      return;
    }

    try {
      await axiosSecure.patch(`/issues/${issueId}/upvote`);
      refetch();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 mt-16">
      <h2 className="text-4xl font-bold text-center mb-10 tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        All Reported Issues
      </h2>

      {/* Filters */}
      <div
        className="flex flex-col md:flex-row gap-4 mb-10 justify-between items-center bg-base-200/60 backdrop-blur-lg p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
      >
        {/* Search */}
        <div className="relative w-full md:w-1/3 group">
          <input
            type="text"
            placeholder="Search by title or location..."
            className=" input w-full bg-base-100 border border-base-300 rounded-xl pl-11 transition-all duration-300 ease-out focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 group-hover:border-primary/60 "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <svg
            className="
        absolute left-3 top-1/2 -translate-y-1/2
        h-5 w-5 text-gray-400
        transition-colors duration-300
        group-focus-within:text-primary
      "
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35M16 10.5a5.5 5.5 0 11-11 0 5.5 5.5 0 0111 0z"
            />
          </svg>
        </div>

        {/* Category */}
        <div className="relative w-full md:w-1/4 group">
          <select
            className=" select w-full bg-base-100 border border-base-30  rounded-xl transition-all duration-300 ease-out focus:border-primary focus:ring-2 focus:ring-primary/20 group-hover:border-primary/60"
            onChange={(e) => setCategory(e.target.value)}
            value={category}
          >
            <option value="">All Categories</option>
            <option value="Roads">Roads</option>
            <option value="Water">Water</option>
            <option value="Electricity">Electricity</option>
            <option value="Garbage">Garbage</option>
          </select>
        </div>

        {/* Status */}
        <div className="relative w-full md:w-1/4 group">
          <select
            className="
        select w-full
        bg-base-100
        border border-base-300
        rounded-xl
        transition-all duration-300 ease-out
        focus:border-primary
        focus:ring-2 focus:ring-primary/20
        group-hover:border-primary/60
      "
            onChange={(e) => setStatus(e.target.value)}
            value={status}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="text-center py-20">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data?.issues?.map((issue) => (
              <div
                key={issue._id}
                className="group card bg-base-100 rounded-2xl shadow-md 
                                           hover:shadow-2xl transition-all duration-300 
                                           hover:-translate-y-1"
              >
                <figure className="h-48 relative overflow-hidden rounded-t-2xl">
                  <img
                    src={issue.image}
                    alt={issue.title}
                    className="w-full h-full object-cover 
                                                   transition-transform duration-500 
                                                   group-hover:scale-105"
                  />
                  {issue.priority === "high" && (
                    <div className="absolute top-3 right-3 badge badge-error text-white shadow">
                      Top Priority
                    </div>
                  )}
                </figure>

                <div className="card-body space-y-2">
                  <h2 className="card-title justify-between text-lg font-semibold">
                    {issue.title}
                    <span
                      className={`badge px-3 py-2 ${
                        issue.status === "resolved"
                          ? "badge-success"
                          : "badge-outline"
                      }`}
                    >
                      {issue.status}
                    </span>
                  </h2>

                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {issue.location}
                  </p>

                  <p className="text-sm line-clamp-2 text-gray-600">
                    {issue.description}
                  </p>

                  <div className="card-actions justify-between items-center mt-4">
                    <button
                      onClick={() => handleUpvote(issue._id, issue.author?._id)}
                      className="btn btn-sm btn-ghost gap-2 
                                                       hover:bg-primary/10 transition-all"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                      {issue.upvoteCount}
                    </button>

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

          {/* Pagination */}
          <div className="join flex justify-center mt-12">
            <button
              className="join-item btn hover:bg-primary hover:text-white transition"
              onClick={() => setPage((old) => Math.max(old - 1, 1))}
              disabled={page === 1}
            >
              «
            </button>
            <button className="join-item btn btn-ghost">
              Page {page} of {data?.totalPages || 1}
            </button>
            <button
              className="join-item  btn hover:bg-gray-300 hover:text-white transition"
              onClick={() =>
                setPage((old) =>
                  !data || old === data.totalPages ? old : old + 1
                )
              }
              disabled={!data || page === data.totalPages}
            >
              »
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AllIssues;
