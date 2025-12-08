import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../pages/Shared/Navbar/Navbar"; // Assuming path
import Footer from "../pages/Shared/Footer/Footer"; // Assuming path

const MainLayout = () => {
    const location = useLocation();
    
    // Check if header/footer should be hidden (e.g. login page)
    const noHeaderFooter = location.pathname.includes('login') || location.pathname.includes('register') || location.pathname.includes('404');

    return (
        <div>
            {!noHeaderFooter && <Navbar />}
            <div className="min-h-screen">
                <Outlet />
            </div>
            {!noHeaderFooter && <Footer />}
        </div>
    );
};

export default MainLayout;
