import { useNavigate, useLocation } from "react-router-dom";
import { useStateContext } from "./ContextProvider";

export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useStateContext();

  const checkAuth = () => {
    const publicPages = ["/signin", "/signup", "/"];
    const isPublicPage = publicPages.includes(location.pathname);

    if (!token && !isPublicPage) {
      navigate("/signin", {
        replace: true,
        state: { from: location },
      });
    }
  };

  const login = (userRole: string, accessToken: string) => {
    localStorage.setItem("USER", userRole);
    localStorage.setItem("ACCESS_TOKEN", accessToken);
    navigate(`/${userRole.toLowerCase()}/dashboard`, { replace: true });
  };

  const logout = () => {
    localStorage.removeItem("USER");
    localStorage.removeItem("ACCESS_TOKEN");
    navigate("/signin", { replace: true });
  };

  return { checkAuth, login, logout, user, token };
};
