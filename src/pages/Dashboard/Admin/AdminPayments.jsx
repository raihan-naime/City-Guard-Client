import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AdminPayments = () => {
    const axiosSecure = useAxiosSecure();

    const { data: payments = [] } = useQuery({
        queryKey: ['admin-payments'],
        queryFn: async () => {
             const res = await axiosSecure.get('/payments');
             return res.data;
        }
    });

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">All Payments</h2>
            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Amount</th>
                            <th>Purpose</th>
                            <th>Transaction ID</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                         {payments.map(pay => (
                             <tr key={pay._id}>
                                 <td>
                                     <div>
                                         <div className="font-bold">{pay.user?.name || 'Unknown'}</div>
                                         <div className="text-xs opacity-50">{pay.user?.email}</div>
                                     </div>
                                 </td>
                                 <td>{pay.amount}</td>
                                 <td>{pay.purpose}</td>
                                 <td>{pay.transactionId}</td>
                                 <td>{new Date(pay.date).toLocaleDateString()}</td>
                             </tr>
                         ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPayments;
