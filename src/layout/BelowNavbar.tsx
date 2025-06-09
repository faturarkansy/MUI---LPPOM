import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    BoxIcon,
    ListIcon,
    UserCircleIcon,
    UsersIcon,
    BuildingIcon,
    HomeIcon,
    BooksIcon,
    ListDetailIcon,
} from "../icons";
import Dashboard from "../icons/dashboard-icon.svg";
import DashboardActive from "../icons/dashboard-active-icon.svg";
import Submission from "../icons/submission-icon.svg";
import SubmissionActive from "../icons/submission-active-icon.svg";
import ELearning from "../icons/elearning-icon.svg";
import ELearningActive from "../icons/elearning-active-icon.svg";
import Profile from "../icons/profile-icon.svg";
import ProfileActive from "../icons/profile-active-icon.svg";

type NavItem = {
    name: string;
    icon: React.ReactNode;
    path?: string;
    subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const roleNavigations: Record<string, NavItem[]> = {
    admin: [
        { icon: <HomeIcon />, name: "Dashboard", path: "/admin/dashboard" },
        {
            icon: <UserCircleIcon />,
            name: "User Management",
            subItems: [{ name: "User", path: "/admin/user" }],
        },
        {
            icon: <BoxIcon />,
            name: "Marketing Kits",
            subItems: [
                { name: "Media", path: "/admin/media" },
                { name: "FAQ", path: "/admin/faq" },
            ],
        },
        {
            name: "LMS Setting",
            icon: <ListIcon />,
            subItems: [
                { name: "Manage Module", path: "/admin/learning-module" },
                { name: "Manage Post Test", path: "/admin/post-test" },
            ],
        },
    ],
    manager: [
        { icon: <HomeIcon />, name: "Dashboard", path: "manager/dashboard" },
    ],
    ["team-leader"]: [
        { icon: <UserCircleIcon />, name: "Dashboard", path: "/mho/dashboard" },
        {
            icon: <BoxIcon />,
            name: "Pelaku Usaha",
            subItems: [
                { name: "Pelaku Usaha", path: "/tl/company/status" },
                { name: "Submission", path: "/tl/company/submission" },
            ],
        },
    ],
    mho: [
        { icon: <UsersIcon />, name: "Agent Management", path: "/mho/agent" },
        { icon: <BuildingIcon />, name: "Pelaku Usaha", path: "/mho/business-actor" },
        { icon: <ListDetailIcon />, name: "Submission", path: "/mho/submission" },
        { icon: <ListIcon />, name: "Activities", path: "/mho/activities" },
        {
            icon: <BooksIcon />,
            name: "LMS",
            subItems: [{ name: "Modul Pembelajaran", path: "/mho/learning-module" }],
        },
    ],
    agent: [
        { icon: <img src={Dashboard} alt="Dashboard" className="w-8 h-8" />, name: "Dashboard", path: "/dashboard" },
        { icon: <img src={Submission} alt="Submission" className="w-8 h-8" />, name: "Submission", path: "/submission" },
        { icon: <img src={ELearning} alt="E-Learning" className="w-8 h-8" />, name: "E-Learning", path: "/e-learning" },
        { icon: <img src={Profile} alt="Profile" className="w-8 h-8" />, name: "Profile", path: "/profile" },
    ],
};

interface BelowNavbarProps {
    userRole?: string;
}

const BelowNavbar: React.FC<BelowNavbarProps> = ({ userRole = "agent" }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = roleNavigations[userRole] || [];

    const flatNav = navItems
        .filter((item) => item.path)
        .map(({ name, icon, path }) => ({ name, icon, path }));

    return (
        <div className="fixed bottom-0 left-0 w-full z-999999 bg-white border-t shadow-md block md:hidden">
            <div className="flex justify-around items-center px-2 py-2">
                {flatNav.map((item) => {
                    const isActive = location.pathname === item.path;
                    let icon = item.icon;
                    if (userRole === "agent" && item.name === "Dashboard") {
                        icon = (
                            <img
                                src={isActive ? DashboardActive : Dashboard}
                                alt="Dashboard"
                                className="w-8 h-8"
                            />
                        );
                    }
                    if (userRole === "agent" && item.name === "Submission") {
                        icon = (
                            <img
                                src={isActive ? SubmissionActive : Submission}
                                alt="Submission"
                                className="w-8 h-8"
                            />
                        );
                    }
                    if (userRole === "agent" && item.name === "E-Learning") {
                        icon = (
                            <img
                                src={isActive ? ELearningActive : ELearning}
                                alt="E-Learning"
                                className="w-8 h-8"
                            />
                        );
                    }
                    if (userRole === "agent" && item.name === "Profile") {
                        icon = (
                            <img
                                src={isActive ? ProfileActive : Profile}
                                alt="Profile"
                                className="w-8 h-8"
                            />
                        );
                    }
                    return (
                        <button
                            key={item.name}
                            onClick={() => navigate(item.path!)}
                            className={`flex flex-col items-center justify-center text-xs p-2 ${isActive ? "text-[#7EC34B]" : "text-gray-500"}`}
                        >
                            <div className="text-xl">{icon}</div>
                            <span className="mt-1 text-[10px]">{item.name}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default BelowNavbar;
