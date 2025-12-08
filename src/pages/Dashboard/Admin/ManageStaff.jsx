import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";

const ManageStaff = () => {
    const axiosSecure = useAxiosSecure();
    const { createUser, updateUserProfile } = useAuth(); // Creating staff involves creating firebase auth...
    // Admin creating staff account with password?
    // Start with Firebase `createUser`. But wait, `createUser` logs the admin out and logs the new user in?
    // YES. Firebase Client SDK `createUserWithEmailAndPassword` will automatically sign in the new user.
    // This is problematic for Admin panel.
    // Ideally Admin uses Firebase Admin SDK on server to create user.
    // But requirement says: "Admin clicks Add Staff... provides basic info... staff account is created...".
    // "Allowing an admin to create passwords for staff is done only for assignment simplicity."
    // If I use client SDK, I must re-login admin or use a secondary generic app instance.
    // Easier way: `axios.post('/users/staff')` and server uses Admin SDK to create user.
    // I already set up `firebase-admin` on server! I should use that.
    
    // I need a server route `POST /users/staff` that uses `admin.auth().createUser()`.
    
    const { register, handleSubmit, reset } = useForm();

    const { data: staff = [], refetch } = useQuery({
        queryKey: ['staff'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data.filter(u => u.role === 'staff');
        }
    });

    const onSubmit = async (data) => {
        try {
            // Call Server API to create staff
            await axiosSecure.post('/users/staff', data);
            reset();
            refetch();
            Swal.fire('Success', 'Staff created successfully', 'success');
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Failed to create staff', 'error');
        }
    }
    
    const handleDelete = async (id) => {
         // Delete staff from DB and Firebase (ideally).
         // I'll just delete from DB for now or call server endpoint.
         try {
             await axiosSecure.delete(`/users/${id}`);
             refetch();
             Swal.fire('Deleted', 'Staff removed', 'success');
         } catch (e) {
             Swal.fire('Error', 'Failed to delete', 'error');
         }
    }

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Manage Staff</h2>
            
            {/* Add Staff Form */}
            <div className="bg-base-100 p-6 rounded-xl shadow mb-8">
                <h3 className="font-bold mb-4">Add New Staff</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-4">
                    <input {...register("name")} placeholder="Name" required className="input input-bordered w-full" />
                    <input {...register("email")} placeholder="Email" required className="input input-bordered w-full" />
                    <input {...register("password")} placeholder="Password" required className="input input-bordered w-full" />
                     {/* Photo optional or default */}
                    <button className="btn btn-primary">Add Staff</button>
                </form>
            </div>

            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staff.map(s => (
                            <tr key={s._id}>
                                <td>{s.name}</td>
                                <td>{s.email}</td>
                                <td>
                                    <button onClick={() => handleDelete(s._id)} className="btn btn-xs btn-error">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageStaff;
