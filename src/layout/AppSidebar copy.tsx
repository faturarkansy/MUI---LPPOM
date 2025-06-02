import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { useSidebar } from "../context/SidebarContext";
import {
  BoxIcon,
  ChevronRightIcon,
  HorizontaLDots,
  ListIcon,
  UserCircleIcon,
  UsersIcon,
  BuildingIcon,
  MuiIcon,
  HomeIcon,
  BooksIcon,
  ListDetailIcon,
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
  manager: [
    {
      icon: <HomeIcon />,
      name: "Dashboard",
      path: "manager/dashboard",
    },
  ],
  ["team-leader"]: [
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
          name: "Pelaku Usaha",
          path: "/tl/company/status",
        },
        { name: "Submission", path: "/tl/company/submission" },
      ],
    },
  ],
  mho: [
    // {
    //   icon: <HomeIcon />,
    //   name: "Dashboard",
    //   path: "/mho/dashboard",
    // },
    {
      icon: <UsersIcon />,
      name: "Agent Management",
      path: "/mho/agent",
    },
    {
      icon: <BuildingIcon />,
      name: "Pelaku Usaha",
      path: "/mho/business-actor",
    },
    {
      icon: <ListDetailIcon />,
      name: "Submission",
      path: "/mho/submission",
    },
    {
      icon: <ListIcon />,
      name: "Activities",
      path: "/mho/activities",
    },
    {
      icon: <BooksIcon />,
      name: "LMS",
      subItems: [
        {
          name: "Modul Pembelajaran",
          path: "/mho/learning-module",
        },
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
      icon: <BuildingIcon />,
      name: "Activities",
      path: "/agent/activities",
    },
    {
      icon: <ListDetailIcon />,
      name: "Submission",
      path: "/agent/submission",
    },
    {
      icon: <BooksIcon />,
      name: "E-Learning",
      path: "/agent/e-learning",
    },

    // {
    //   icon: <BoxIcon />,
    //   name: "Marketing",
    //   subItems: [
    //     { name: "Media", path: "/agent/media", pro: false },
    //     { name: "FAQ", path: "/agent/faq", pro: false },
    //   ],
    // },
    // {
    //   name: "LMS",
    //   icon: <ListIcon />,
    //   subItems: [
    //     { name: "Manage Module", path: "/agent/learning-module", pro: false },
    //     { name: "Manage Post Test", path: "/agent/post-test", pro: false },
    //   ],
    // },
  ],
};

interface SidebarProps {
  userRole?: string;
}

const AppSidebar: React.FC<SidebarProps> = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const userLocalData = localStorage.getItem("USER");
  const userRole = JSON.parse(userLocalData || "{}").role || "guest";

  const [openSubmenu, setOpenSubmenu] = useState<{
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});
  // const [agentMenus, setAgentMenus] = useState<NavItem[] | null>(null);

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  // const fallbackAgentMenu = [
  //   {
  //     icon: <BuildingIcon />,
  //     name: "E-Learning",
  //     path: "/agent/e-learning",
  //   },
  // ];

  useEffect(() => {
    let submenuMatched = false;
    const currentNavigation = roleNavigations[userRole] || [];

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
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 right-0 bg-white text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-l border-gray-200 
    ${
      isExpanded || isMobileOpen
        ? "w-[290px]"
        : isHovered
        ? "w-[290px]"
        : "w-[90px]"
    }
    ${isMobileOpen ? "translate-x-0" : "translate-x-full"}
    lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    > */}

      {/* {!isMobile ? ( */}
      <div
        className={`hidden lg:block py-8 ${!isExpanded && !isHovered
          ? "lg:flex justify-center"
          : "flex justify-start"
          }`}
      >
        <h4 className="w-full flex justify-evenly items-center mt-2 font-bold text-gray-800 text-title-sm">
          <MuiIcon className="w-12 h-12" />
          <span>
            {isExpanded || isMobileOpen || isHovered ? " LPPOM MUI" : null}
          </span>
        </h4>
      </div>
      {/* ) : null} */}
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
                  ? agentMenus ?? fallbackAgentMenu
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
