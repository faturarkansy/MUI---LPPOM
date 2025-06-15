import { useEffect, useRef, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";

export default function AuthPageLayout() {
  const { token, user } = useStateContext();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  const logoutUser = () => {
    localStorage.removeItem("USER");
    localStorage.removeItem("ACCESS_TOKEN");
    window.location.reload();
  };

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(logoutUser, 4 * 60 * 1000); // 20 menit
  };

  useEffect(() => {
    const activityEvents = ["mousemove", "mousedown", "click", "scroll", "keypress"];
    activityEvents.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      activityEvents.forEach((event) => window.removeEventListener(event, resetTimer));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (token && user?.role === "agent") {
      const userJson = localStorage.getItem("USER");
      const localUser = userJson ? JSON.parse(userJson) : null;

      const tncAcceptAt = localUser?.tnc_accept_at;
      const passwordChangeAt = localUser?.password_change_at;
      const testPassedAt = localUser?.test_passed_at;

      if (!tncAcceptAt || tncAcceptAt === "null") {
        setRedirectPath("/agreement");
      } else if (!passwordChangeAt || passwordChangeAt === "null") {
        setRedirectPath("/change-password");
      } else if (!testPassedAt || testPassedAt === "null") {
        setRedirectPath("/e-learning");
      } else {
        setRedirectPath("/dashboard");
      }
    }
  }, [token, user]);

  if (redirectPath) {
    return <Navigate to={redirectPath} />;
  }

  return (
    <div id="guestLayout">
      <Outlet />
    </div>
  );
}
