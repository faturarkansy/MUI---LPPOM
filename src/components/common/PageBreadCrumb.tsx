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
      <div className="border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-100 w-full mb-2">
        <div className="p-3">
          <h1 className="text-2xl font-bold">{pageTitle}</h1>
        </div>
      </div>

      <div className="w-full h-8 bg-white flex items-center justify-start px-6 py-3 rounded-md text-dark shadow-sm">
        <ol className="flex items-center font-medium whitespace-nowrap">
          {breadcrumbItems.map((item, index) => (
            <li key={index} className="inline-flex items-center text-sm">
              {index > 0 && (
                <span className="mx-2 flex items-center">
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
