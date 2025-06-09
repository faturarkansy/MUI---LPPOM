import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { useSidebar } from "../context/SidebarContext";
import Profile from "../icons/profile-icon-white.svg";
import {
  BoxIcon,
  ChevronRightIcon,
  HorizontaLDots,
  ListIcon,
  UserCircleIcon,
  UserIcon,
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
    {
      icon: <BuildingIcon />,
      name: "Dashboard",
      path: "dashboard",
    },
    {
      icon: <ListDetailIcon />,
      name: "Submission",
      path: "submission",
    },
    {
      icon: <BooksIcon />,
      name: "E-Learning",
      path: "e-learning",
    },
    {
      icon: <UserIcon />,
      name: "Profile",
      path: "profile",
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


  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );



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

  const [isMobile, setIsMobile] = useState(false);
  const [userData, setUserData] = useState<{ name?: string; email?: string }>({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("USER") || "{}");
    setUserData({ name: user.name, email: user.email });
  }, []);

  const handleSignOut = () => {
    localStorage.clear();
    window.location.href = "/signin";
  };


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's 'lg' breakpoint
    };

    handleResize(); // Cek saat pertama kali
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-2">
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
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0  bg-white text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-gray-200
      ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
      ${isMobile ? `${isMobileOpen ? "right-0" : "-right-full"} border-l` : "left-0 border-r"}
      ${isMobile ? "" : "lg:left-0 lg:translate-x-0"}
    `}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >

      {/* Info Agen di Mobile */}
      {isMobile && isMobileOpen && (
        <div className="flex flex-row items-center py-4 px-6 bg-gradient-to-r from-[#d1e9bf] to-[#87c75a] text-white shadow">

          <img
            src={Profile}
            alt="Profile"
            className="w-8 h-8 rounded-full mr-3"
          />
          <div className="flex flex-col">
            <p className="text-xl font-bold">{userData?.name || "Profile tidak ditemukan"}</p>
            <p className="text-xs font-semibold">{userData?.email || "Email tidak ditemukan"}</p>
          </div>


        </div>
      )}


      {/* Logo */}
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

      {/* Menu */}
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar px-6">
        <nav className="mb-6 lg:mt-0 mt-4">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-2 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
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
              {renderMenuItems(roleNavigations[userRole] || [])}
            </div>
          </div>
        </nav>
        {isMobile && isMobileOpen && (
          <div className="pb-6 mt-auto">
            <button
              onClick={handleSignOut}
              className="w-full py-2 bg-black text-white rounded-md font-semibold text-sm hover:bg-gray-800 transition"
            >
              Logout
            </button>
          </div>
        )}

      </div>


    </aside>
  );
};

export default AppSidebar;
