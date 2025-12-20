Public Infrastructure Issue Reporting System
A comprehensive digital platform designed to bridge the gap between citizens and municipal authorities. Citizens can report infrastructure issues like broken streetlights or potholes, while admins and staff manage the resolution lifecycle through a transparent, real-time tracking system.

🚀 Live Links & Credentials
Live Site: [Insert Live URL Here]

Client Repo: [Insert Client Repo Link]

Server Repo: [Insert Server Repo Link]

Admin Access:

Email: admin@example.com

Password: Admin123! (Update as needed)

✨ Key Features
Role-Based Access Control: Distinct dashboards and permissions for Citizens, Staff, and Admins.

Real-Time Issue Tracking: A vertical timeline/stepper UI showing the lifecycle from "Pending" to "Closed."

Interactive Issue Map/List: "All Issues" page with advanced server-side search, filtering (category, status, priority), and pagination.

Upvote System: Logged-in users can upvote issues to highlight public importance (limited to once per user).

Premium Subscription: Citizens can pay 1000tk via integrated payment to become Premium users for unlimited reporting.

Issue Boosting: Users can pay 100tk to boost an issue's priority to "High," pinning it to the top of lists.

Staff Assignment: Admins can assign specific staff members to issues to streamline the workflow.

Dynamic Dashboards: Data visualization using charts to show issue statistics, resolution rates, and payments.

PDF Invoices: Downloadable payment receipts for subscriptions and boosts.

Fully Responsive Design: Optimized for mobile, tablet, and desktop views with persistent login sessions.

🛠️ Technology Stack
Frontend: React.js, Tailwind CSS, DaisyUI, TanStack Query (React Query).

Backend: Node.js, Express.js, MongoDB.

Security: Firebase Auth, JWT (JSON Web Tokens), Environment Variables.

Payments: Stripe (or preferred provider).

Notifications: SweetAlert2 / React Hot Toast.

📥 Installation & Setup
1. Prerequisites
Node.js (v16 or higher)

MongoDB Atlas account

Firebase Project

2. Backend Setup (Server)
Clone the repository:

Bash

git clone <server-repo-url>
cd server-folder
Install dependencies:

Bash

npm install
Create a .env file in the root and add:

Code snippet

PORT=5000
DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password
JWT_ACCESS_TOKEN=your_secret_key
STRIPE_SECRET_KEY=your_stripe_key
Start the server:

Bash

node index.js (or npm start)
3. Frontend Setup (Client)
Clone the repository:

Bash

git clone <client-repo-url>
cd client-folder
Install dependencies:

Bash

npm install
Create a .env.local file in the root and add your Firebase and API config:

Code snippet

VITE_apiKey=your_firebase_key
VITE_authDomain=your_project.firebaseapp.com
VITE_projectId=your_project_id
VITE_API_URL=http://localhost:5000
Start the development server:

Bash

npm run dev
📋 Role-Specific Instructions
Citizens: Can report up to 3 issues for free. Go to the Profile page to upgrade to Premium for unlimited reports.

Staff: Access your Assigned Issues page to update statuses. Note that boosted issues will always appear at the top.

Admin: Use the Manage Staff section to create official staff accounts. Access the Payments page to download transaction records.