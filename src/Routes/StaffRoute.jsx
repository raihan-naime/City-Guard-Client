import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const StaffRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const location = useLocation();

    const { data: dbUser, isLoading: isRoleLoading } = useQuery({
        queryKey: [user?.email, 'role'],
        enabled: !loading && !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/me`);
            return res.data;
        }
    });

    if (loading || isRoleLoading) {
        return <div className="text-center py-20"><span className="loading loading-spinner loading-lg"></span></div>
    }

    if (user && dbUser?.role === 'staff') {
        return children;
    }

    return <Navigate to="/" state={{ from: location }} replace></Navigate>
};

export default StaffRoute;
