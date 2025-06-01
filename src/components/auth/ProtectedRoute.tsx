import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const user = localStorage.getItem("USER");
  const userRole = user ? JSON.parse(user).role : null;

  if (!userRole || !allowedRoles.includes(userRole)) {
    let redirectPath = "/signin";
    // let redirectPath = "#";
    switch (userRole) {
      // case "admin":
      //   redirectPath = "/admin/dashboard";
      //   break;
      // case "manager":
      //   redirectPath = "/manager/dashboard";
      //   break;
      // case "team-leader":
      //   redirectPath = "/tl/dashboard";
      //   break;
      case "mho":
        redirectPath = "/mho/dashboard";
        break;
      // case "agent":
      //   redirectPath = "/agent/dashboard";
      //   break;
    }
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
