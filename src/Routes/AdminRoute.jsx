import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const AdminRoute = ({ children }) => {
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

    if (user && dbUser?.role === 'admin') {
        return children;
    }

    // If logged in but not admin, maybe redirect to home or show denied? 
    // Navigate to login creates loop if user is logged in. 
    // Usually redirect to home / or explicit denied page.
    // For now, redirect to / with replace.
    return <Navigate to="/" state={{ from: location }} replace></Navigate>
};

export default AdminRoute;
