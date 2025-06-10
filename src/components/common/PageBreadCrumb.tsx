import React from "react";
import { Link, useLocation } from "react-router-dom";

interface BreadcrumbProps {
  pageTitle: string;
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle }) => {
  const location = useLocation();

  // Parse and format breadcrumb items from URL
  const breadcrumbItems = React.useMemo(() => {
    const cleanPath = location.pathname.split("?")[0].split("#")[0];
    const pathSegments = cleanPath.split("/").filter((segment) => segment);

    const customDisplayNames: Record<string, string> = {
      dashboard: "Dashboard",
      submission: "Submissions",
      users: "Users",
      // Tambahkan lainnya jika perlu
    };

    return pathSegments.map((segment, index) => {
      const path = "/" + pathSegments.slice(0, index + 1).join("/");
      const displayName = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      const finalDisplayName =
        customDisplayNames[segment.toLowerCase()] ?? displayName;

      return {
        path,
        displayName: finalDisplayName,
        isLast: index === pathSegments.length - 1,
      };
    });
  }, [location.pathname]);

  return (
    <div className="flex flex-wrap items-center justify-between gap-1">
      {/* Header */}
      <div className="w-full h-20 bg-gradient-to-r from-[#1975a6] to-[#87d1f8] flex items-end justify-start px-6 py-3 mb-2 rounded-2xl text-white">
        <h1 className="font-normal text-3xl">{pageTitle}</h1>
      </div>
      {/* Breadcrumb in gradient bar */}
      <div className="w-full h-8 bg-gradient-to-r from-[#1975a6] to-[#87d1f8] flex items-center justify-start px-6 py-3 rounded-3xl text-white">
        <ol className="flex items-center font-medium whitespace-nowrap">
          {breadcrumbItems.map((item, index) => (
            <li key={index} className="inline-flex items-center text-sm">
              {index > 0 && (
                <span className="mx-0.5 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-chevron-right"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </span>
              )}
              {!item.isLast ? (
                <Link to={item.path} className="hover:underline">
                  {item.displayName}
                </Link>
              ) : (
                <span>{item.displayName}</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default PageBreadcrumb;
