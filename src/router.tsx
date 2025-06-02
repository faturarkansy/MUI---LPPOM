import { Navigate, createBrowserRouter } from "react-router-dom";

import NotFound from "./pages/OtherPage/NotFound";
import AppLay from "./layout/AppLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import AuthLayouts from "./pages/AuthPages/AuthPageLayout";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";

import AdminDashboard from "./pages/Admin/Dashboard/AdminDashboard";
import AdminUser from "./pages/Admin/UserManagement/AdminUser";
import AdminMedia from "./pages/Admin/Marketing/AdminMedia";
import AdminFAQ from "./pages/Admin/Marketing/AdminFAQ";
// import AdminInsentif from "./pages/Admin/Insentif/AdminInsentif";
// import AdminCalculator from "./pages/Admin/Calculator/AdminCalculator";
import AdminPostTest from "./pages/Admin/LMS/AdminPostTest";
import AdminLearningModule from "./pages/Admin/LMS/AdminLearningModule";

import TLDashboard from "./pages/TL/Dashboard/TLDashboard";
import TLAgent from "./pages/TL/Agent/TLAgent";

import SupervisorDashboard from "./pages/Supervisor/Dashboard/SupervisorDashboard";
import SupervisorStatusPelakuUsaha from "./pages/Supervisor/PelakuUsaha/SupervisorStatusPelakuUsaha";
import SupervisorSubmission from "./pages/Supervisor/PelakuUsaha/SupervisorSubmission";
// import SupervisorInsentif from "./pages/Supervisor/Insentif/SupervisorInsentif";
// import SupervisorCalculator from "./pages/Supervisor/Calculator/SupervisorCalculator";

import AgentDashboard from "./pages/Agent/Dashboard/AgentDashboard";
import AgentChangePassword from "./pages/AuthPages/ChangePassword";
import AgentAddSubmission from "./pages/Agent/PelakuUsaha/AgentAddSubmission";
import AgentSubmission from "./pages/Agent/PelakuUsaha/AgentSubmission";
import AgentPelakuUsaha from "./pages/Agent/PelakuUsaha/AgentPelakuUsaha";
import AgentMedia from "./pages/Agent/Marketing/AgentMedia";
import AgentFAQ from "./pages/Agent/Marketing/AgentFAQ";
// import AgentInsentif from "./pages/Agent/Insentif/AgentInsentif";
// import AgentCalculator from "./pages/Agent/Calculator/AgentCalculator";
import AgentAgreement from "./pages/Agent/StartingKit/AgentAgreement";
import AgentActivities from "./pages/Agent/Activities/AgentActivities";
import AgentStartPostTest from "./pages/Agent/StartingKit/AgentStartPostTest";
import AgentResultPostTest from "./pages/Agent/StartingKit/AgentResultPostTest";
import AgentPostTest from "./pages/Agent/StartingKit/AgentPostTest";
import AgentLearningModule from "./pages/Agent/StartingKit/AgentLearningModule";
import AgentAccessBlocked from "./pages/Agent/StartingKit/AgentAccessBlocked";

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
      {
        path: "signup",
        element: <SignUp />,
      },
    ],
  },

  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
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
        element: <AdminDashboard />,
      },
      {
        path: "user",
        element: <AdminUser />,
      },
      {
        path: "media",
        element: <AdminMedia />,
      },
      {
        path: "faq",
        element: <AdminFAQ />,
      },
      // {
      //   path: "insentif",
      //   element: <AdminInsentif />,
      // },
      // {
      //   path: "calculator",
      //   element: <AdminCalculator />,
      // },
      {
        path: "post-test",
        element: <AdminPostTest />,
      },
      {
        path: "learning-module",
        element: <AdminLearningModule />,
      },
    ],
  },

  {
    path: "/tl",
    element: (
      <ProtectedRoute allowedRoles={["Team Leader"]}>
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
        element: <TLDashboard />,
      },
      {
        path: "agent",
        element: <TLAgent />,
      },
      // {
      //   path: "pelaku-usaha/status",
      //   element: <SupervisorStatusPelakuUsaha />,
      // },
      // {
      //   path: "pelaku-usaha/submission",
      //   element: <SupervisorSubmission />,
      // },
    ],
  },

  {
    path: "/mho",
    element: (
      <ProtectedRoute allowedRoles={["MHO (Mitra Halal Official)"]}>
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
        element: <SupervisorDashboard />,
      },
      {
        path: "pelaku-usaha/status",
        element: <SupervisorStatusPelakuUsaha />,
      },
      {
        path: "pelaku-usaha/submission",
        element: <SupervisorSubmission />,
      },
    ],
  },
  {
    path: "/agent/agent-agreement",
    element: (
      <ProtectedRoute allowedRoles={["agent"]}>
        <AgentAgreement />
      </ProtectedRoute>
    ),
  },
  {
    path: "/agent/change-password",
    element: (
      <ProtectedRoute allowedRoles={["agent"]}>
        <AgentChangePassword />
      </ProtectedRoute>
    ),
  },
  {
    path: "/agent/agent-agreement",
    element: (
      <ProtectedRoute allowedRoles={["agent"]}>
        <AgentAgreement />
      </ProtectedRoute>
    ),
  },
  {
    path: "/agent",
    element: (
      <ProtectedRoute allowedRoles={["agent"]}>
        <AppLay />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <AgentDashboard />,
      },
      {
        path: "dashboard",
        element: <AgentDashboard />,
      },
      {
        path: "submission/add-submission",
        element: <AgentAddSubmission />,
      },
      {
        path: "submission",
        element: <AgentSubmission />,
      },
      {
        path: "pelaku-usaha",
        element: <AgentPelakuUsaha />,
      },
      {
        path: "media",
        element: <AgentMedia />,
      },
      {
        path: "faq",
        element: <AgentFAQ />,
      },
      {
        path: "agent-access-blocked",
        element: <AgentAccessBlocked />,
      },
      {
        path: "start-post-test",
        element: <AgentStartPostTest />,
      },
      {
        path: "post-test",
        element: <AgentPostTest />,
      },
      {
        path: "learning-module",
        element: <AgentLearningModule />,
      },
      {
        path: "agent-agreement",
        element: <AgentAgreement />,
      },
      {
        path: "result-post-test",
        element: <AgentResultPostTest />,
      },
      {
        path: "activities",
        element: <AgentActivities />,
      },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
