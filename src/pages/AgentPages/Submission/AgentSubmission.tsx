// AgentSubmission.tsx
import { useState } from "react";
import AddIcon from "../../../../src/icons/add.svg";
import CardAgentSubmission from "../../../components/card/CardAgentSubmission";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import SubmissionAddModal from "../../../components/modal/SubmissionAddModal";
import SubmissionFilterModal from "../../../components/modal/FilterModal";
import { useNavigate } from "react-router-dom";


const AgentSubmission = () => {
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterAppliedTrigger, setFilterAppliedTrigger] = useState<number>(0);
  const [selectedBusinessScale, setSelectedBusinessScale] = useState<string | null>(null);
  const [selectedSubmissionType, setSelectedSubmissionType] = useState<string | null>(null);


  const handleCloseAddModal = () => setIsAddModalOpen(false);

  const [filterOptions, setFilterOptions] = useState({
    name: "",
    id: "",
    date: "",
    status: "",
    scale: "",
    submissionType: "",
  });

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchQuery(searchText);
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Submissions" />

      <div className="mt-4 flex justify-end lg:justify-between items-center">
        <div className="flex flex-col rounded-lg w-full overflow-x-auto dark:bg-gray-800 items-end">
          <div className="flex flex-col w-full gap-2 lg:flex-row lg:items-center justify-end">
            <form onSubmit={handleSearchSubmit} className="w-full lg:w-sm">
              <input
                type="search"
                id="default-search"
                className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                placeholder="Search..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </form>

            <button
              type="button"
              onClick={() => setIsFilterModalOpen(true)}
              className="lg:block px-6 p-2 border rounded-lg text-white bg-[#1874A5] hover:bg-[#20516b] ml-0 lg:ml-2"
            >
              Filter
            </button>

            <button
              type="button"
              onClick={() => navigate("/submission/add-submission")}
              className="lg:block px-6 p-2 border rounded-lg text-white bg-[#1874A5] hover:bg-[#20516b] ml-0 lg:ml-2"
            >
              Tambah submission
            </button>
          </div>
        </div>
      </div>

      <CardAgentSubmission
        searchQuery={searchQuery}
        filters={filterOptions}
        filterAppliedTrigger={filterAppliedTrigger}
        selectedBusinessScale={selectedBusinessScale}
        selectedSubmissionType={selectedSubmissionType}
      />

      <SubmissionAddModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        refreshTrigger={refreshTrigger}
        setRefreshTrigger={setRefreshTrigger}
      />

      <SubmissionFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filterOptions}
        setFilters={setFilterOptions}
        onApply={() => {
          setFilterAppliedTrigger(prev => prev + 1);
          setSelectedBusinessScale(filterOptions.scale || null);
          setSelectedSubmissionType(filterOptions.submissionType || null);
        }}
      />
    </div>
  );
};

export default AgentSubmission;
