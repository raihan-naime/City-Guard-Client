import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaUser, FaStar, FaShieldAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const Profile = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: dbUser, refetch } = useQuery({
        queryKey: ['user', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get('/users/me');
            return res.data;
        }
    });

    const handleSubscribe = async () => {
        Swal.fire({
            title: 'Subscribe to Premium',
            text: "Pay 1000tk to report unlimited issues!",
            showCancelButton: true,
            confirmButtonText: 'Pay 1000tk'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.post('/payments', {
                        amount: 1000,
                        purpose: 'subscription',
                        paymentMethodId: 'mock_pm_sub'
                    });
                    Swal.fire('Subscribed!', 'You are now a Premium user.', 'success');
                    refetch();
                } catch (error) {
                    Swal.fire('Error', error.response?.data?.message || 'Payment failed', 'error');
                }
            }
        });
    };

    return (
        <div className="max-w-full mx-auto p-6">
            <motion.h2
                className="text-3xl font-bold mb-8 flex items-center gap-2 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <FaUser /> My Profile
            </motion.h2>

            <motion.div
                className="card bg-white shadow-2xl rounded-3xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.02, boxShadow: "0px 15px 40px rgba(0,0,0,0.15)" }}
            >
                <div className="card-body items-center text-center">
                    <motion.div
                        className="avatar mb-4"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="w-28 h-28 rounded-full ring ring-purple-400 ring-offset-base-100 ring-offset-4 overflow-hidden">
                            <img src={user?.photoURL || "https://i.ibb.co/5GzXkwq/user.png"} alt="Profile" />
                        </div>
                    </motion.div>

                    <motion.h2
                        className="card-title mt-2 text-2xl font-semibold text-gray-800"
                        whileHover={{ scale: 1.03, color: "#805ad5" }}
                    >
                        {user?.displayName}
                    </motion.h2>

                    <motion.p
                        className="text-gray-500 mb-4"
                        whileHover={{ scale: 1.02, color: "#6b46c1" }}
                    >
                        {user?.email}
                    </motion.p>

                    <div className="stats shadow-md rounded-xl p-4 w-full flex justify-around gap-6 bg-gradient-to-r from-purple-50 to-pink-50">
                        <motion.div
                            className="stat"
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="stat-title flex items-center gap-2 text-gray-600"><FaShieldAlt /> Role</div>
                            <div className="stat-value text-purple-700 text-2xl uppercase">{dbUser?.role}</div>
                        </motion.div>

                        <motion.div
                            className="stat"
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="stat-title flex items-center gap-2 text-gray-600"><FaStar /> Status</div>
                            <div className={`stat-value text-2xl uppercase ${dbUser?.subscriptionStatus === 'free' ? 'text-yellow-500' : 'text-green-500'}`}>
                                {dbUser?.subscriptionStatus}
                            </div>
                        </motion.div>
                    </div>

                    {dbUser?.subscriptionStatus === 'free' && (
                        <motion.div
                            className="card-actions mt-6 w-full"
                            whileHover={{ scale: 1.02 }}
                        >
                            <button
                                onClick={handleSubscribe}
                                className="btn w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:from-pink-500 hover:to-purple-500 transition-all duration-300"
                            >
                                Subscribe for Premium (1000tk)
                            </button>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;
