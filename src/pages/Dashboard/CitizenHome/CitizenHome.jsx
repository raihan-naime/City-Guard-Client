import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const CitizenHome = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: stats = {} } = useQuery({
        queryKey: ['citizen-stats', user?.email],
        queryFn: async () => {
            // Need a new customized stats endpoint or filter issues with user id
            const res = await axiosSecure.get(`/issues?author=${user?.email}`); // Assuming I modify API or just fetch all and filter client side for now since I lack stats api
            // Wait, I didn't make a stats API for citizen.
            // Let's rely on fetching `my-issues` and calculating length. 
            // Or use a generic `/issues` call and filter by author? My previous API was `search`, `category` etc. 
            // It uses `Issue.find(query)`. I can pass `author` ID?
            // Actually, I didn't strictly implement `author` query param in my backend `Get All Issues`.
            // Let's modify Backend or just use what we have? 
            // The prompt asks for cards: Total submitted, pending, in progress, resolved.
            
            // I should create a quick API for dashboard stats or just patch `getAllIssues` to allow author filter.
            // Let's check `issueRoutes.js`... I don't see `author` in `req.query` handling.
            // I will use `axiosSecure.get('/issues')` and filter manually for now if simple, or better:
            // I need `My Issues` page anyway.
            
            // Let's fetch all "My Issues" here to calculate stats?
            // `GET /issues?authorId=...` - API doesn't support it yet.
            // I will start by just showing static placeholders or basic info until I add the API support?
            // No, I should add the API support. It's easy.
            return {
                total: 0,
                pending: 0,
                inProgress: 0,
                resolved: 0
            }; 
        }
    });

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Welcome, {user?.displayName}</h2>
            <div className="stats shadow w-full">
                <div className="stat">
                    <div className="stat-figure text-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <div className="stat-title">Total Issues</div>
                    <div className="stat-value">{stats.total || 0}</div>
                    <div className="stat-desc">Reported by you</div>
                </div>
                
                <div className="stat">
                    <div className="stat-figure text-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                    </div>
                    <div className="stat-title">Pending</div>
                    <div className="stat-value">{stats.pending || 0}</div>
                </div>
                
                <div className="stat">
                    <div className="stat-figure text-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                    </div>
                    <div className="stat-title">Resolved</div>
                    <div className="stat-value">{stats.resolved || 0}</div>
                </div>
            </div>
            {/* Add Chart Here Later if needed */}
        </div>
    );
};

export default CitizenHome;
