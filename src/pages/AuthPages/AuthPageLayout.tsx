import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";

export default function AuthPageLayout() {
  const { token, user } = useStateContext();

  // if (token && user?.role === "admin") {
  //   return <Navigate to="/admin/dashboard" />;
  // } else if (token && user?.role === "manager") {
  //   return <Navigate to="/manager/dashboard" />;
  // } else if (token && user?.role === "team-leader") {
  //   return <Navigate to="/tl/dashboard" />;
  // } else if (token && user?.role === "mho") {
  //   return <Navigate to="/mho/dashboard" />;
  // } else 
  if (token && user?.role === "agent") {
    return <Navigate to="/agent/agent-agreement" />;
  }

  else if (token && user?.role === "mho") {
    return <Navigate to="/mho/agent" />;
  }

  return (
    <div id="guestLayout">
      <Outlet />
    </div>
  );
}
