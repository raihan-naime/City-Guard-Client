import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";

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
        })
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">My Profile</h2>
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body items-center text-center">
                    <div className="avatar">
                        <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                            <img src={user?.photoURL || "https://i.ibb.co/5GzXkwq/user.png"} />
                        </div>
                    </div>
                    <h2 className="card-title mt-4">{user?.displayName}</h2>
                    <p>{user?.email}</p>
                    
                    <div className="stats shadow mt-6">
                         <div className="stat">
                            <div className="stat-title">Role</div>
                            <div className="stat-value text-primary text-2xl uppercase">{dbUser?.role}</div>
                        </div>
                        <div className="stat">
                            <div className="stat-title">Status</div>
                            <div className="stat-value text-secondary text-2xl uppercase">{dbUser?.subscriptionStatus}</div>
                        </div>
                    </div>

                    {dbUser?.subscriptionStatus === 'free' && (
                        <div className="card-actions mt-6">
                            <button onClick={handleSubscribe} className="btn btn-warning w-full">Subscribe for Premium (1000tk)</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
