import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import {
    FaHome,
    FaUser,
    FaUsers,
    FaTasks,
    FaClipboardList,
    FaMoneyCheckAlt,
    FaSignOutAlt,
    FaExclamationTriangle
} from "react-icons/fa";

const DashboardLayout = () => {
    const { user, logOut } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const { data: dbUser } = useQuery({
        queryKey: ['user', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get('/users/me');
            return res.data;
        }
    });

    const handleLogOut = () => {
        logOut().then(() => navigate('/'));
    };

    const isAdmin = dbUser?.role === 'admin';
    const isStaff = dbUser?.role === 'staff';
    const isCitizen = dbUser?.role === 'citizen';

    const linkClass = ({ isActive }) =>
        `sidebar-link ${isActive ? "active-link" : ""}`;

    return (
        <div className="drawer lg:drawer-open min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

            {/* Main Content */}
            <div className="drawer-content p-6 lg:p-10">
                <label
                    htmlFor="my-drawer-2"
                    className="btn btn-primary drawer-button lg:hidden mb-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                    Open Menu
                </label>

                <div className="page-animate text-slate-800">
                    <Outlet />
                </div>
            </div>

            {/* Sidebar */}
            <div className="drawer-side">
                <label htmlFor="my-drawer-2" className="drawer-overlay"></label>

                <ul className="menu p-6 w-80 min-h-full
                    bg-white/60 backdrop-blur-2xl
                    border-r border-slate-200
                    shadow-[0_20px_50px_rgba(0,0,0,0.08)]
                    text-slate-700">

                    {/* Brand */}
                    <div className="mb-10 text-center animate-slideIn">
                        <h2 className="text-3xl font-extrabold tracking-tight
                            bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                            CityGuard
                        </h2>
                        <p className="text-xs uppercase tracking-widest text-slate-400 mt-1">
                            Smart City Dashboard
                        </p>
                    </div>

                    {/* Citizen */}
                    {isCitizen && (
                        <>
                            <li><NavLink to="/dashboard/citizen-home" className={linkClass}><FaHome /> Dashboard Home</NavLink></li>
                            <li><NavLink to="/dashboard/my-issues" className={linkClass}><FaClipboardList /> My Issues</NavLink></li>
                            <li><NavLink to="/dashboard/add-issue" className={linkClass}><FaExclamationTriangle /> Report Issue</NavLink></li>
                            <li><NavLink to="/dashboard/profile" className={linkClass}><FaUser /> My Profile</NavLink></li>
                        </>
                    )}

                    {/* Staff */}
                    {isStaff && (
                        <>
                            <li><NavLink to="/dashboard/staff-home" className={linkClass}><FaHome /> Dashboard Home</NavLink></li>
                            <li><NavLink to="/dashboard/assigned-issues" className={linkClass}><FaTasks /> Assigned Issues</NavLink></li>
                            <li><NavLink to="/dashboard/profile" className={linkClass}><FaUser /> My Profile</NavLink></li>
                        </>
                    )}

                    {/* Admin */}
                    {isAdmin && (
                        <>
                            <li><NavLink to="/dashboard/admin-home" className={linkClass}><FaHome /> Dashboard Home</NavLink></li>
                            <li><NavLink to="/dashboard/manage-users" className={linkClass}><FaUsers /> Manage Users</NavLink></li>
                            <li><NavLink to="/dashboard/manage-staff" className={linkClass}><FaUsers /> Manage Staff</NavLink></li>
                            <li><NavLink to="/dashboard/all-issues-admin" className={linkClass}><FaClipboardList /> All Issues</NavLink></li>
                            <li><NavLink to="/dashboard/payments-admin" className={linkClass}><FaMoneyCheckAlt /> Payments</NavLink></li>
                            <li><NavLink to="/dashboard/profile" className={linkClass}><FaUser /> My Profile</NavLink></li>
                        </>
                    )}

                    <div className="divider my-6 opacity-40"></div>

                    {/* Common */}
                    <li><Link to="/" className="sidebar-link"><FaHome /> Home</Link></li>
                    <li><Link to="/all-issues" className="sidebar-link"><FaClipboardList /> All Issues</Link></li>
                    <li>
                        <button
                            onClick={handleLogOut}
                            className="sidebar-link text-red-500 hover:bg-red-50"
                        >
                            <FaSignOutAlt /> Logout
                        </button>
                    </li>
                </ul>
            </div>

            {/* Styles */}
            <style>
                {`
                .sidebar-link {
                    @apply flex items-center gap-3 px-4 py-3 rounded-xl
                           font-medium transition-all duration-300 ease-out;
                }

                .sidebar-link:hover {
                    background: linear-gradient(to right, rgba(59,130,246,0.08), rgba(139,92,246,0.08));
                    transform: translateX(4px);
                }

                .sidebar-link svg {
                    transition: transform 0.3s ease;
                }

                .sidebar-link:hover svg {
                    transform: scale(1.1);
                }

                .active-link {
                    background: linear-gradient(to right, rgba(59,130,246,0.15), rgba(139,92,246,0.15));
                    color: #2563eb;
                    font-weight: 600;
                    position: relative;
                }

                .active-link::before {
                    content: "";
                    position: absolute;
                    left: 0;
                    top: 12%;
                    height: 76%;
                    width: 4px;
                    border-radius: 999px;
                    background: linear-gradient(to bottom, #2563eb, #7c3aed);
                    animation: indicator 0.35s ease-out;
                }

                @keyframes indicator {
                    from { height: 0; }
                    to { height: 76%; }
                }

                .page-animate {
                    animation: fadeUp 0.4s ease-out;
                }

                @keyframes fadeUp {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-slideIn {
                    animation: slideIn 0.5s ease-out;
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-12px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                `}
            </style>
        </div>
    );
};

export default DashboardLayout;
