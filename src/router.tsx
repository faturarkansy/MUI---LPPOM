import { Navigate, createBrowserRouter } from "react-router-dom";

import NotFound from "./pages/OtherPage/NotFound";
import AppLay from "./layout/AppLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import AuthLayouts from "./pages/AuthPages/AuthPageLayout";
import SignIn from "./pages/AuthPages/SignIn";
// import SignUp from "./pages/AuthPages/SignUp";

// import AdminDashboard from "./pages/AdminPages/Dashboard/AdminDashboard";
// import AdminUser from "./pages/AdminPages/UserManagement/AdminUser";
// import AdminMedia from "./pages/AdminPages/Marketing/AdminMedia";
// import AdminFAQ from "./pages/AdminPages/Marketing/AdminFAQ";
// import AdminPostTest from "./pages/AdminPages/LMS/AdminPostTest";
// import AdminLearningModule from "./pages/AdminPages/LMS/AdminLearningModule";

// import ManagerDashboard from "./pages/ManagerPages/Dashboard/ManagerDashboard";

// import TLDashboard from "./pages/TLPages/Dashboard/TLDashboard";
// import TLCompany from "./pages/TLPages/Company/TLCompany";
// import TLSubmission from "./pages/TLPages/Company/TLSubmission";

import MHODashboard from "./pages/MHOPages/Dashboard/MHODashboard";
import MHOAgent from "./pages/MHOPages/Agent/MHOAgent";
import MHOSubmission from "./pages/MHOPages/Submission/MHOSubmission";
import MHOCompany from "./pages/MHOPages/Company/MHOCompany";
import MHOActivities from "./pages/MHOPages/Activities/MHOActivities";
import MHOLearningModule from "./pages/MHOPages/LMS/MHOLearningModule";

// import AgentDashboard from "./pages/AgentPages/Dashboard/AgentDashboard";
// import AgentCompany from "./pages/AgentPages/Company/AgentCompany";
// import AgentSubmission from "./pages/AgentPages/Company/AgentSubmission";
// import AgentMedia from "./pages/AgentPages/Marketing/AgentMedia";
// import AgentFAQ from "./pages/AgentPages/Marketing/AgentFAQ";
// import AgentPostTest from "./pages/AgentPages/LMS/AgentPostTest";
// import AgentLearningModule from "./pages/AgentPages/LMS/AgentLearningModule";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayouts />,
    children: [
      {
        path: "",
        element: <Navigate to="signin" />,
      },
      {
        path: "signin",
        element: <SignIn />,
      },
      // {
      //   path: "signup",
      //   element: <SignUp />,
      // },
    ],
  },

  // {
  //   path: "/admin",
  //   element: (
  //     <ProtectedRoute allowedRoles={["admin"]}>
  //       <AppLay />
  //     </ProtectedRoute>
  //   ),
  //   children: [
  //     {
  //       path: "",
  //       element: <Navigate to="dashboard" />,
  //     },
  //     {
  //       path: "dashboard",
  //       element: <AdminDashboard />,
  //     },
  //     {
  //       path: "user",
  //       element: <AdminUser />,
  //     },
  //     {
  //       path: "media",
  //       element: <AdminMedia />,
  //     },
  //     {
  //       path: "faq",
  //       element: <AdminFAQ />,
  //     },
  //     {
  //       path: "post-test",
  //       element: <AdminPostTest />,
  //     },
  //     {
  //       path: "learning-module",
  //       element: <AdminLearningModule />,
  //     },
  //   ],
  // },

  // {
  //   path: "/manager",
  //   element: (
  //     <ProtectedRoute allowedRoles={["manager"]}>
  //       <AppLay />
  //     </ProtectedRoute>
  //   ),
  //   children: [
  //     {
  //       path: "",
  //       element: <Navigate to="dashboard" />,
  //     },
  //     {
  //       path: "dashboard",
  //       element: <ManagerDashboard />,
  //     },
  //   ],
  // },

  // {
  //   path: "/tl",
  //   element: (
  //     <ProtectedRoute allowedRoles={["team-leader"]}>
  //       <AppLay />
  //     </ProtectedRoute>
  //   ),
  //   children: [
  //     {
  //       path: "",
  //       element: <Navigate to="dashboard" />,
  //     },
  //     {
  //       path: "dashboard",
  //       element: <TLDashboard />,
  //     },
  //     {
  //       path: "company",
  //       element: <TLCompany />,
  //     },
  //     {
  //       path: "submission",
  //       element: <TLSubmission />,
  //     },
  //   ],
  // },

  {
    path: "/mho",
    element: (
      <ProtectedRoute allowedRoles={["mho"]}>
        <AppLay />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Navigate to="dashboard" />,
      },
      {
        path: "dashboard",
        element: <MHODashboard />,
      },
      {
        path: "agent",
        element: <MHOAgent />,
      },
      {
        path: "submission",
        element: <MHOSubmission />,
      },
      {
        path: "business-actor",
        element: <MHOCompany />,
      },
      {
        path: "activities",
        element: <MHOActivities />,
      },

      {
        path: "learning-module",
        element: <MHOLearningModule />,
      },
    ],
  },

  // {
  //   path: "/agent",
  //   element: (
  //     <ProtectedRoute allowedRoles={["agent"]}>
  //       <AppLay />
  //     </ProtectedRoute>
  //   ),
  //   children: [
  //     {
  //       path: "",
  //       element: <Navigate to="/dashboard" />,
  //     },
  //     {
  //       path: "dashboard",
  //       element: <AgentDashboard />,
  //     },
  //     {
  //       path: "company",
  //       element: <AgentCompany />,
  //     },
  //     {
  //       path: "submission",
  //       element: <AgentSubmission />,
  //     },
  //     {
  //       path: "media",
  //       element: <AgentMedia />,
  //     },
  //     {
  //       path: "faq",
  //       element: <AgentFAQ />,
  //     },
  //     {
  //       path: "post-test",
  //       element: <AgentPostTest />,
  //     },
  //     {
  //       path: "learning-module",
  //       element: <AgentLearningModule />,
  //     },
  //   ],
  // },

  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
