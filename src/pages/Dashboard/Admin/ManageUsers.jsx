import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const ManageUsers = () => {
    const axiosSecure = useAxiosSecure();

    const { data: users = [], refetch } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            // Filter only citizens? Prompt says "Manage citizens".
            return res.data.filter(u => u.role === 'citizen');
        }
    });

    const handleBlock = async (user) => { // Toggle block
         Swal.fire({
            title: `Are you sure you want to ${user.isBlocked ? 'unblock' : 'block'} this user?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes'
        }).then(async (result) => {
            if (result.isConfirmed) {
                // I didn't implement block endpoint explicitly, but I have role/update endpoint?
                // `PATCH /users/:id/role` only updates role.
                // I need generic update or block endpoint.
                // I'll assume I can use a generic update or add it. 
                // Let's check `userRoutes.js`. It has `PATCH /:id/role`. 
                // I should add `PATCH /:id/block`.
                // For now, I will use `PATCH /users/:id/role` and pretend it handles block or just add block route now.
                // I will Add Block Route in next step.
                 await axiosSecure.patch(`/users/${user._id}/block`, { isBlocked: !user.isBlocked });
                 refetch();
                 Swal.fire('Success', 'User status updated', 'success');
            }
        })
    }

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Manage Citizens</h2>
            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status.</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>{user.isBlocked ? 'Blocked' : 'Active'}</td>
                                <td>
                                    <button onClick={() => handleBlock(user)} className={`btn btn-xs ${user.isBlocked ? 'btn-success' : 'btn-error'}`}>
                                        {user.isBlocked ? 'Unblock' : 'Block'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;
