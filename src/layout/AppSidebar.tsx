import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { useSidebar } from "../context/SidebarContext";
import axios from "axios";
import {
  UserIcon,
  BoxIcon,
  ChevronRightIcon,
  HorizontaLDots,
  ListIcon,
  UserCircleIcon,
  UsersIcon,
  BuildingIcon,
  MuiIcon,
  HomeIcon,
} from "../icons";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

// Define navigation items for different roles
const roleNavigations: Record<string, NavItem[]> = {
  admin: [
    {
      icon: <HomeIcon />,
      name: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      icon: <UserCircleIcon />,
      name: "User Management",
      subItems: [{ name: "User", path: "/admin/user", pro: false }],
    },
    {
      icon: <BoxIcon />,
      name: "Marketing Kits",
      subItems: [
        { name: "Media", path: "/admin/media", pro: false },
        { name: "FAQ", path: "/admin/faq", pro: false },
      ],
    },
    {
      name: "LMS Setting",
      icon: <ListIcon />,
      subItems: [
        { name: "Manage Module", path: "/admin/learning-module", pro: false },
        { name: "Manage Post Test", path: "/admin/post-test", pro: false },
      ],
    },
  ],
  tl: [
    {
      icon: <HomeIcon />,
      name: "Dashboard",
      path: "/tl/dashboard",
    },
    {
      icon: <UsersIcon />,
      name: "Agent Management",
      path: "/tl/agent",
    },
    {
      icon: <BuildingIcon />,
      name: "Business",
      subItems: [
        { name: "List Activities", path: "#" },
        { name: "Add Activities", path: "#" },
      ],
    },
    // {
    //   icon: <BoxIcon />,
    //   name: "Activities",
    //   subItems: [
    //     { name: "List Activities", path: "#" },
    //     { name: "Add Activities", path: "#" },
    //   ],
    // },
  ],
  mho: [
    {
      icon: <UserCircleIcon />,
      name: "Dashboard",
      path: "/mho/dashboard",
    },
    {
      icon: <BoxIcon />,
      name: "Pelaku Usaha",
      subItems: [
        {
          name: "Status Pelaku Usaha",
          path: "/mho/pelaku-usaha/status",
        },
        { name: "Submission", path: "/mho/pelaku-usaha/submission" },
      ],
    },
    {
      icon: <BoxIcon />,
      name: "Activities",
      subItems: [
        { name: "List Activities", path: "#" },
        { name: "Add Activities", path: "#" },
      ],
    },
  ],
  agent: [
    // {
    //   icon: <UserCircleIcon />,
    //   name: "Dashboard",
    //   path: "/agent/dashboard",
    // },
    {
      icon: <UserIcon />,
      name: "Pelaku Usaha",
      path: "/agent/pelaku-usaha",
    },
    {
      icon: <ListIcon />,
      name: "Submissions",
      path: "/agent/submission",
    },
    {
      icon: <BuildingIcon />,
      name: "Activities",
      path: "/agent/activities",
    },
    {
      icon: <BoxIcon />,
      name: "Marketing Kits",
      subItems: [
        { name: "Media", path: "/agent/media", pro: false },
        { name: "FAQ", path: "/agent/faq", pro: false },
      ],
    },
    {
      name: "LMS Setting",
      icon: <ListIcon />,
      subItems: [
        { name: "Manage Module", path: "/agent/learning-module", pro: false },
        { name: "Manage Post Test", path: "/agent/post-test", pro: false },
      ],
    },
  ],
};

interface SidebarProps {
  userRole?: string;
}

const AppSidebar: React.FC<SidebarProps> = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const user = localStorage.getItem("USER");
  let userRole = "";
  if (user) {
    const parsedRole = JSON.parse(user).role;
    // userRole = parsedRole === "MHO (Mitra Halal Official)" ? "mho" : parsedRole;
    if (parsedRole === "Team Leader") {
      userRole = "tl";
    } else if (parsedRole === "MHO (Mitra Halal Official)") {
      userRole = "mho";
    } else {
      userRole = parsedRole;
    }
  }

  const [openSubmenu, setOpenSubmenu] = useState<{
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [agentMenus, setAgentMenus] = useState<NavItem[] | null>(null);

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  // 🟢 Fetch user detail saat mount
  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await axios.get("/users", {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("TOKEN") || "")}`,
          },
        });

        const userData = response.data;
        // console.log("Fetched user:", userData);

        if (
          userData.roles.some((role: any) => role.name === "agent") &&
          userData.tnc_accept_at &&
          userData.test_passed_at
        ) {
          // Format tnc_accept_at & test_passed_at valid
          if (
            /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(userData.tnc_accept_at) &&
            /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(userData.test_passed_at)
          ) {
            setAgentMenus(roleNavigations["agent"]);
          } else {
            setAgentMenus(null);
          }
        } else {
          setAgentMenus(null);
        }
      } catch (error) {
        console.error("Failed to fetch user detail:", error);
        setAgentMenus(null);
      }
    };

    fetchUserDetail();
  }, []);

  useEffect(() => {
    let submenuMatched = false;
    const currentNavigation =
      userRole === "agent" && !agentMenus
        ? []
        : agentMenus ?? roleNavigations[userRole] ?? [];

    console.log("location: ", location);

    currentNavigation.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu({ index });
            submenuMatched = true;
          }
        });
      }
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive, userRole]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (prevOpenSubmenu && prevOpenSubmenu.index === index) {
        return null;
      }
      return { index };
    });
  };

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index)}
              className={`menu-item group ${openSubmenu?.index === index
                ? "menu-item-active text-[#7EC34B] bg-[#F0F9E8]"
                : "menu-item-inactive"
                } cursor-pointer ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
                }`}
            >
              <span
                className={`menu-item-icon-size  ${openSubmenu?.index === index
                  ? "menu-item-icon-active text-[#7EC34B]"
                  : "menu-item-icon-inactive"
                  }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronRightIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.index === index
                    ? "rotate-90 text-[#7EC34B]"
                    : ""
                    }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${isActive(nav.path)
                  ? "menu-item-active text-[#7EC34B] bg-[#F0F9E8]"
                  : "menu-item-inactive"
                  }`}
              >
                <span
                  className={`menu-item-icon-size ${isActive(nav.path)
                    ? "menu-item-icon-active text-[#7EC34B]"
                    : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.index === index
                    ? `${subMenuHeight[`${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${isActive(subItem.path)
                        ? "menu-dropdown-item-active text-[#7EC34B] bg-[#F0F9E8]"
                        : "menu-dropdown-item-inactive"
                        }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 bg-white text-gray-900 h-screen transition-all duration-300 ease-in-out z-50
        border-gray-200
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        // Posisi & border
        ${isMobileOpen ? "right-0 border-l" : "right-0 border-l translate-x-full"}
        lg:left-0 lg:right-auto lg:border-r lg:translate-x-0
      `}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >
        <h4 className="w-full flex justify-evenly items-center mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
          <MuiIcon className="w-12 h-12" />
          {isExpanded ? " LPPOM MUI" : null}
        </h4>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {/* {renderMenuItems(
                userRole === "agent"
                  ? agentMenus || []
                  : roleNavigations[userRole] || []
              )} */}
              {renderMenuItems(roleNavigations[userRole] || [])}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
