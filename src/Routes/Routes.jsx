import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Home from "../pages/Home/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import AllIssues from "../pages/AllIssues/AllIssues";
import IssueDetails from "../pages/IssueDetails/IssueDetails";

import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../Layout/DashboardLayout";
import CitizenHome from "../pages/Dashboard/CitizenHome/CitizenHome";
import MyIssues from "../pages/Dashboard/MyIssues/MyIssues";
import AddIssue from "../pages/Dashboard/AddIssue/AddIssue";
import Profile from "../pages/Dashboard/Profile/Profile";
import AssignedIssues from "../pages/Dashboard/Staff/AssignedIssues";
import StaffHome from "../pages/Dashboard/Staff/StaffHome";
import AdminHome from "../pages/Dashboard/Admin/AdminHome";
import ManageUsers from "../pages/Dashboard/Admin/ManageUsers";
import ManageStaff from "../pages/Dashboard/Admin/ManageStaff";
import AdminAllIssues from "../pages/Dashboard/Admin/AdminAllIssues";
import AdminPayments from "../pages/Dashboard/Admin/AdminPayments";
import ErrorPage from "../pages/Shared/ErrorPage/ErrorPage";
import AnimatedLoginCard from "../pages/Login/AnimatedLoginCard";
import AnimatedRegistrationCard from "../pages/Register/AnimatedRegistrationCard";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "login",
        Component: AnimatedLoginCard
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "all-issues",
        element: <AllIssues />,
      },
      {
        path: "issues/:id",
        element: (
          <PrivateRoute>
            <IssueDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "test",
        Component: AnimatedRegistrationCard

      },
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      // Citizen
      {
        path: "citizen-home",
        element: <CitizenHome />,
      },
      {
        path: "my-issues",
        element: <MyIssues />,
      },
      {
        path: "add-issue",
        element: <AddIssue />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      // Staff
      {
        path: "staff-home",
        element: <StaffHome />,
      },
      {
        path: "assigned-issues",
        element: <AssignedIssues />,
      },
      // Admin
      {
        path: "admin-home",
        element: <AdminHome />,
      },
      {
        path: "manage-users",
        element: <ManageUsers />,
      },
      {
        path: "manage-staff",
        element: <ManageStaff />,
      },
      {
        path: "all-issues-admin",
        element: <AdminAllIssues />,
      },
      {
        path: "payments-admin",
        element: <AdminPayments />,
      },
    ],
  },
]);
