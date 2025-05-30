import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";

export default function AuthPageLayout() {
  const { token, user } = useStateContext();

  if (token && user?.role === "admin") {
    return <Navigate to="/admin/dashboard" />;
  } else if (token && user?.role === "agent") {
    return <Navigate to="/agent/dashboard" />;
  } else if (token && user?.role === "MHO (Mitra Halal Official)") {
    return <Navigate to="/mho/dashboard" />;
  } else if (token && user?.role === "Team Leader") {
    return <Navigate to="/tl/dashboard" />;
  }

  return (
    <div id="guestLayout">
      <Outlet />
    </div>
  );
}
