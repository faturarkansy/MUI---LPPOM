import { useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import CardAddSubmission from "../../../components/card/CardAddSubmission";

export default function MHOSubmission() {
  const [activeTab, setActiveTab] = useState("listSubmission");
  return (
    <div>
      <PageBreadcrumb pageTitle="MHO Submission" />
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-neutral-700 mt-4">
        <nav className="flex gap-x-1" role="tablist">
          {[
            { id: "listSubmission", label: "List Submission" },
            { id: "addSubmission", label: "Add Submission" },
          ].map((tab) => (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-t-lg cursor-pointer
                ${
                  activeTab === tab.id
                    ? "border-b-2 border-black bg-gray-100 text-black"
                    : "text-black hover:bg-gray-200"
                }`}
              role="tab"
            >
              {tab.label}
            </div>
          ))}
        </nav>
      </div>
      {/* Tab Contents */}
      <div className="mt-6">
        {activeTab === "listSubmission" && (
          <div>This is Section for list submission.</div>
        )}
        {activeTab === "addSubmission" && <CardAddSubmission />}
      </div>
    </div>
  );
}
