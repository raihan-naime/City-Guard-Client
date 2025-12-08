import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const DashboardLayout = () => {
    const { user, logOut } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    // Check user role from DB for sidebar links
    const { data: dbUser } = useQuery({
        queryKey: ['user', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get('/users/me');
            return res.data;
        }
    });

    const handleLogOut = () => {
        logOut()
            .then(() => {
                navigate('/');
            })
    }

    const isAdmin = dbUser?.role === 'admin';
    const isStaff = dbUser?.role === 'staff';
    const isCitizen = dbUser?.role === 'citizen';

    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col p-8">
                {/* Page content here */}
                <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden mb-4">Open Menu</label>
                <Outlet />
            </div> 
            <div className="drawer-side">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label> 
                <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                    {/* Sidebar content here */}
                    <div className="mb-6 text-center">
                         <h2 className="text-2xl font-bold text-primary">CityGuard</h2>
                         <p className="text-sm">Dashboard</p>
                    </div>

                    {isCitizen && (
                        <>
                            <li><NavLink to="/dashboard/citizen-home">Dashboard Home</NavLink></li>
                            <li><NavLink to="/dashboard/my-issues">My Issues</NavLink></li>
                            <li><NavLink to="/dashboard/add-issue">Report Issue</NavLink></li>
                            <li><NavLink to="/dashboard/profile">My Profile</NavLink></li>
                        </>
                    )}

                    {isStaff && (
                        <>
                            <li><NavLink to="/dashboard/staff-home">Dashboard Home</NavLink></li>
                            <li><NavLink to="/dashboard/assigned-issues">Assigned Issues</NavLink></li>
                            <li><NavLink to="/dashboard/profile">My Profile</NavLink></li>
                        </>
                    )}

                    {isAdmin && (
                        <>
                            <li><NavLink to="/dashboard/admin-home">Dashboard Home</NavLink></li>
                            <li><NavLink to="/dashboard/manage-users">Manage Users</NavLink></li>
                            <li><NavLink to="/dashboard/manage-staff">Manage Staff</NavLink></li>
                            <li><NavLink to="/dashboard/all-issues-admin">All Issues</NavLink></li>
                            <li><NavLink to="/dashboard/payments-admin">Payments</NavLink></li>
                            <li><NavLink to="/dashboard/profile">My Profile</NavLink></li>
                        </>
                    )}

                    <div className="divider"></div>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/all-issues">All Issues</Link></li>
                    <li><button onClick={handleLogOut}>Logout</button></li>
                </ul>
            </div>
        </div>
    );
};

export default DashboardLayout;
