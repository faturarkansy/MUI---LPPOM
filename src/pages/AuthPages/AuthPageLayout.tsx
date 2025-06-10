import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";

export default function AuthPageLayout() {
  const { token, user } = useStateContext();

  if (token && user?.role === "agent") {
    const userJson = localStorage.getItem("USER");
    const localUser = userJson ? JSON.parse(userJson) : null;

    const tncAcceptAt = localUser?.tnc_accept_at;
    const passwordChangeAt = localUser?.password_change_at;
    const testPassedAt = localUser?.test_passed_at;

    // Jika belum tnc, arahkan ke /agreement
    if (!tncAcceptAt || tncAcceptAt === "null") {
      return <Navigate to="/agreement" />;
    } else if (!passwordChangeAt || passwordChangeAt === "null") {
      return <Navigate to="/change-password" />;
    } else if (!testPassedAt || testPassedAt === "null") {
      return <Navigate to="/e-learning" />;
    } else {
      return <Navigate to="/dashboard" />;
    }

    return <Outlet />;
  }

  if (token && user?.role === "mho") {
    return <Navigate to="/mho/agent" />;
  }

  return (
    <div id="guestLayout">
      <Outlet />
    </div>
  );
}
