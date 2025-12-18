import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import ThemeToggle from "../../../components/ThemeToggle/ThemeToggle";

const Navbar = () => {
    const { user, logOut } = useAuth();
    const navigate = useNavigate();

    const handleLogOut = () => {
        logOut()
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Logged Out',
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate('/');
            })
            .catch(error => console.error(error));
    }

    const navOptions = <>
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/all-issues">All Issues</NavLink></li>
        <li><NavLink to="/how-it-works">How it Works</NavLink></li> 
        <li><NavLink to="/contact">Contact</NavLink></li>
        {/* Extra page */}
        {!user && <li><NavLink to="/login">Login</NavLink></li>}
    </>


    return (
        <div className="navbar glass-effect fixed top-4 left-0 right-0 z-50 px-6 max-w-6xl mx-auto rounded-full shadow-lg transition-all duration-300 backdrop-blur-md bg-[var(--glass-bg)] border border-[var(--glass-border)]">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden hover:bg-white/20 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--text-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-2xl bg-[var(--card-bg)] backdrop-blur-xl rounded-2xl w-52 border border-[var(--glass-border)] text-[var(--text-primary)]">
                        {navOptions}
                    </ul>
                </div>
                <Link to="/" className="btn btn-ghost text-3xl font-extrabold text-gradient tracking-tight hover:scale-105 transition-transform" style={{ fontFamily: 'var(--font-primary)' }}>CityGuard</Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-1 font-medium text-[var(--text-primary)]">
                    {navOptions}
                </ul>
            </div>
            <div className="navbar-end gap-3">
                <ThemeToggle />
                {user ? (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border-2 border-indigo-400 hover:border-indigo-600 transition-colors shadow-md">
                            <div className="w-10 rounded-full">
                                <img alt="User" src={user?.photoURL || "https://i.ibb.co/5GzXkwq/user.png"} />
                            </div>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-2xl bg-[var(--card-bg)] backdrop-blur-xl rounded-2xl w-56 border border-[var(--glass-border)] space-y-1 text-[var(--text-primary)]">
                            <li className="menu-title text-center text-indigo-500 font-bold text-lg mb-2">{user?.displayName}</li>
                            <li><Link to="/dashboard" className="hover:bg-indigo-500/10 hover:text-indigo-500 rounded-lg py-2">Dashboard</Link></li>
                            <li><button onClick={handleLogOut} className="hover:bg-red-500/10 hover:text-red-500 rounded-lg py-2">Logout</button></li>
                        </ul>
                    </div>
                ) : (
                    <Link to="/login" className="btn-primary-lendex text-white shadow-xl hover:shadow-2xl">Join Us</Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;
