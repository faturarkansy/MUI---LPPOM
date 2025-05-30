import { useState } from "react";
import CompanyForm from "../../../components/form/CompanyForm";

const AgentCompanySubmission = () => {
  const [activeTab, setActiveTab] = useState("companyProfile");

  return (
    <div>
      {/* Title & Breadcrumb */}
      <div className="flex justify-between items-center">
        <div className="text-left">
          <h3 className="text-[25px] font-bold text-gray-900">
            Agent Management
          </h3>
          <ol className="flex items-center whitespace-nowrap">
            <li className="inline-flex items-center">
              <div className="flex items-center text-sm text-black dark:text-neutral-500">
                Agent
              </div>
              <svg
                className="shrink-0 mx-2 size-4 text-gray-400 dark:text-neutral-600"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6"></path>
              </svg>
            </li>
            <li className="inline-flex items-center">
              <div className="flex items-center text-sm text-black dark:text-neutral-500">
                Applicant
              </div>
            </li>
          </ol>
        </div>
      </div>
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-neutral-700 mt-4">
        <nav className="flex gap-x-1" role="tablist">
          {[
            { id: "companyProfile", label: "Profil Perusahaan" },
            { id: "submissionExam", label: "Submission Exam" },
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
        {activeTab === "companyProfile" && <CompanyForm />}
        {activeTab === "submissionExam" && (
          <div>This is Section for submission exam.</div>
        )}
      </div>
    </div>
  );
};

export default AgentCompanySubmission;
