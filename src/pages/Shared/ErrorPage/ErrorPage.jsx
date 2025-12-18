import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiAlertTriangle } from "react-icons/fi"; // Using a modern alert icon

const ErrorPage = () => {
    // Framer Motion variant for the main container animation
    const containerVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    };

    // Framer Motion variant for the "404" number animation
    const numberVariants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 100, delay: 0.3 } },
    };

    // Framer Motion variant for the button animation
    const buttonVariants = {
        hover: { scale: 1.05, boxShadow: "0px 0px 8px rgb(255, 255, 255)" },
        tap: { scale: 0.95 },
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-500">
            <motion.div
                className="card w-full max-w-lg glass-effect shadow-2xl p-10 text-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Icon Section */}
                <motion.div
                    className="flex justify-center mb-6"
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                >
                    <FiAlertTriangle className="text-error w-16 h-16 drop-shadow-lg" />
                </motion.div>

                {/* 404 Header */}
                <motion.h1 
                    className="text-9xl font-extrabold mb-4 tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500"
                    variants={numberVariants}
                >
                    404
                </motion.h1>

                {/* Sub-Headline */}
                <h2 className="text-3xl font-bold mb-3">
                    <span className="text-secondary">Ouch!</span> Page not found.
                </h2>

                {/* Description */}
                <p className="mb-8 opacity-70">
                    The requested page may have been moved, deleted, or is temporarily unavailable. We're sorry for the inconvenience.
                </p>

                {/* Action Button */}
                <div className="flex flex-col md:flex-row justify-center gap-4">
                     <Link to="/">
                        <motion.button
                            className="btn btn-primary btn-lg w-full md:w-auto shadow-lg"
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <span className="mr-2">🏡</span> Take Me Home
                        </motion.button>
                    </Link>
                </div>
               
                {/* Additional professional links */}
                <div className="mt-8 space-x-4 text-sm opacity-60">
                    <Link to="/contact" className="hover:text-primary transition-colors">
                        Contact Support
                    </Link>
                    <span>|</span>
                    <Link to="#" className="hover:text-primary transition-colors">
                        View Sitemap
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default ErrorPage;
