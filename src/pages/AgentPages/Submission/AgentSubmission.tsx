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


  const handleCloseAddModal = () => setIsAddModalOpen(false);

  const [filterOptions, setFilterOptions] = useState({
    name: "",
    id: "",
    date: "",
    status: "",
  });

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchQuery(searchText); // Simpan query pencarian
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Submissions" />

      <div className="flex justify-between items-center mb-0 sm:mb-3">
        <div className="flex items-center gap-3">
          {/* Search Field */}
          <form onSubmit={handleSearchSubmit} className="mt-3 flex items-center">
            <label htmlFor="default-search" className="sr-only">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="hidden sm:inline w-4 h-4 text-black" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                className="block w-40 sm:w-48 md:w-64 sm:ps-10 ps-2 text-xs sm:text-sm text-black font-bold border-2 border-black rounded-l-md sm:rounded-l-lg bg-transparent sm:py-2 py-1.5 sm:px-3 px-2 focus:outline-none"
                placeholder="Search..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <button type="submit" className="sm:py-2 py-1.5 sm:px-3 px-2 bg-black text-white text-xs sm:text-sm font-bold border-t-2 border-r-2 border-b-2 border-black rounded-r-md sm:rounded-r-lg hover:bg-gray-400 hover:text-black">
              {/* Teks hanya muncul di layar besar */}
              <span className="hidden sm:inline text-sm font-bold ">Search</span>

              {/* Icon hanya muncul di layar kecil */}
              <svg
                className="sm:hidden w-4 h-4 text-white hover:text-white"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </button>
          </form>

          <button
            className="mt-3 sm:py-2 py-1.5 sm:px-3 px-2 bg-black text-white text-xs sm:text-sm font-bold border-2 border-black rounded-md sm:rounded-lg hover:bg-gray-400 hover:text-black"
            onClick={() => setIsFilterModalOpen(true)}>
            Filter
          </button>
        </div>

        <button
          onClick={() => navigate("/submission/add-submission")}
          className="mt-3 sm:py-2 py-1.5 sm:px-3 px-2 inline-flex items-center gap-x-2 text-xs sm:text-sm font-bold border-2 border-[#7EC34B] rounded-lg bg-white text-[#7EC34B] hover:bg-gray-200"
        >
          <img src={AddIcon} alt="Add Icon" className="w-3 sm:w-4 h-3 sm:h-4" />
          Add New
        </button>
      </div>

      <CardAgentSubmission
        searchQuery={searchQuery}
        filters={filterOptions}
        filterAppliedTrigger={filterAppliedTrigger}
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
          setFilterAppliedTrigger(prev => prev + 1); // Ini akan memicu useEffect di CardAgentSubmission
        }}
      />
    </div>
  );
};

export default AgentSubmission;
