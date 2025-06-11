import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const whitelistedPaths = [
    "/",
    "/signin",
    "/agreement",
    "/change-password",
    "/post-test",
    "/e-learning",
    "/result-post-test",
    "/profile",
    "/profile/edit-profile",
    "/profile/change-password",
    "/profile/terms-and-conditions",
];

export default function ProtectedRouteWithWhitelist({
    children,
}: {
    children: React.ReactNode;
}) {
    const location = useLocation();
    const userJson = localStorage.getItem("USER");
    const localUser = userJson ? JSON.parse(userJson) : null;

    const testPassedAt = localUser?.test_passed_at;
    const currentPath = location.pathname;

    if (!testPassedAt || testPassedAt === "null") {
        if (!whitelistedPaths.includes(currentPath)) {
            return <Navigate to="/e-learning" replace />;
        }
    }

    return <>{children}</>;
}
