import { Navigate } from "react-router-dom";
// import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  //   const { userRole } = useAuth();
  const user = localStorage.getItem("USER");
  console.log("user protected route: ", user);
  const userRole = user ? JSON.parse(user).role : null;
  console.log("userRole protected route: ", userRole);

  if (!userRole || !allowedRoles.includes(userRole)) {
    let redirectPath = "/signin";
    switch (userRole) {
      case "admin":
        redirectPath = "/admin/dashboard";
        break;
      case "agent":
        redirectPath = "/agent/agent-agreement";
        break;
      case "MHO (Mitra Halal Official)":
        redirectPath = "/mho/dashboard";
        break;
    }
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
