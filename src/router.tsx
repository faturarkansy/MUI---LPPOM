import { Navigate, createBrowserRouter } from "react-router-dom";

import NotFound from "./pages/OtherPage/NotFound";
import AppLay from "./layout/AppLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import AuthLayouts from "./pages/AuthPages/AuthPageLayout";
import SignIn from "./pages/AuthPages/SignIn";
// import SignUp from "./pages/AuthPages/SignUp";

import MHODashboard from "./pages/MHOPages/Dashboard/MHODashboard";
import MHOAgent from "./pages/MHOPages/Agent/MHOAgent";
import MHOSubmission from "./pages/MHOPages/Submission/MHOSubmission";
import MHOCompany from "./pages/MHOPages/Company/MHOCompany";
import MHOActivities from "./pages/MHOPages/Activities/MHOActivities";
// import MHOLearningModule from "./pages/MHOPages/LMS/MHOLearningModule";

import AgentDashboard from "./pages/AgentPages/Dashboard/AgentDashboard";
import AgentAgreement from "./pages/AgentPages/StartingKit/AgentAgreement";
import AgentChangePassword from "./pages/AuthPages/ChangePassword";

import AgentCompany from "./pages/AgentPages/Submission/AgentCompany";
import AgentSubmission from "./pages/AgentPages/Submission/AgentSubmission";
import AgentAddSubmission from "./pages/AgentPages/Submission/AgentAddSubmission";
import AgentDetailSubmission from "./pages/AgentPages/Submission/AgentDetailSubmission";
import AgentAddActivity from "./pages/AgentPages/Submission/AgentAddActivity";

import AgentProfile from "./pages/AgentPages/Profile/AgentProfile";
import AgentEditProfile from "./pages/AgentPages/Profile/AgentEditProfile";
import AgentProfileChangePassword from "./pages/AgentPages/Profile/AgentChangePassword";
import AgentProfileAgreement from "./pages/AgentPages/Profile/AgentAgreement";

import AgentActivities from "./pages/AgentPages/Activities/AgentActivities";
import AgentMedia from "./pages/AgentPages/Marketing/AgentMedia";
import AgentFAQ from "./pages/AgentPages/Marketing/AgentFAQ";
import AgentPostTest from "./pages/AgentPages/LMS/AgentPostTest";
import AgentLearningModule from "./pages/AgentPages/LMS/AgentLearningModule";
import AgentResultPostTest from "./pages/AgentPages/LMS/AgentResultPostTest";

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

      // {
      //   path: "learning-module",
      //   element: <MHOLearningModule />,
      // },
    ],
  },

  {
    path: "agreement",
    element: (
      <ProtectedRoute allowedRoles={["agent"]}>
        <AgentAgreement />
      </ProtectedRoute>
    ),
  },

  {
    path: "change-password",
    element: (
      <ProtectedRoute allowedRoles={["agent"]}>
        <AgentChangePassword />
      </ProtectedRoute>
    ),
  },

  {
    path: "/",
    element: (
      <ProtectedRoute allowedRoles={["agent"]}>
        <AppLay />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Navigate to="/submission" />,
      },
      {
        path: "dashboard",
        element: <AgentDashboard />,
      },
      {
        path: "submission",
        element: <AgentSubmission />,
      },
      {
        path: "submission/add-submission/",
        element: <AgentAddSubmission />,
      },
      {
        path: "submission/detail-submission/",
        element: <AgentDetailSubmission />,
      },
      {
        path: "submission/detail-submission/add-activity",
        element: <AgentAddActivity />,
      },

      {
        path: "profile",
        element: <AgentProfile />,
      },
      {
        path: "profile/edit-profile",
        element: <AgentEditProfile />,
      },
      {
        path: "profile/change-password",
        element: <AgentProfileChangePassword />,
      },
      {
        path: "profile/terms-and-conditions",
        element: <AgentProfileAgreement />,
      },
      {
        path: "company",
        element: <AgentCompany />,
      },
      {
        path: "activities",
        element: <AgentActivities />,
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
        path: "post-test",
        element: <AgentPostTest />,
      },
      {
        path: "e-learning",
        element: <AgentLearningModule />,
      },
      {
        path: "result-post-test",
        element: <AgentResultPostTest />,
      },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
