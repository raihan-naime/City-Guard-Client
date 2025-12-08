import { motion } from "framer-motion";

const Banner = () => {
    return (
        <div className="hero min-h-[600px]" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop)'}}>
            <div className="hero-overlay bg-opacity-60"></div>
            <div className="hero-content text-center text-neutral-content">
                <div className="max-w-md">
                    <motion.h1 
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-5 text-5xl font-bold"
                    >
                        Report Issues, Improve Your City
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="mb-5"
                    >
                        Join the community in making our city better. Report infrastructure issues like potholes, broken streetlights, and more.
                    </motion.p>
                    <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="btn btn-primary"
                    >
                        Report Now
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default Banner;
