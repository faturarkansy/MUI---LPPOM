import { useState } from "react";
import AddIcon from "../../../../src/icons/add.svg";
import CardAgentSubmission from "../../../components/card/CardAgentSubmission";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import SubmissionAddModal from "../../../components/modal/SubmissionAddModal";


const AgentSubmission = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<boolean>(false);

  const handleOpenAddModal = () => setIsAddModalOpen(true);
  const handleCloseAddModal = () => setIsAddModalOpen(false);

  return (
    <div>
      <PageBreadcrumb pageTitle="Submissions" />


      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="mt-3 py-2 px-3 inline-flex items-center gap-x-2 text-sm font-bold border-2 border-[#7EC34B] rounded-lg bg-white text-[#7EC34B] hover:bg-gray-200 hover:text-[#7EC34B] focus:outline-hidden focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
        >
          <img src={AddIcon} alt="Add Icon" className="w-4 h-4" />
          Add New
        </button>
      </div>
      <CardAgentSubmission />
      <SubmissionAddModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        refreshTrigger={refreshTrigger}
        setRefreshTrigger={setRefreshTrigger}
      />

    </div>

  );
};

export default AgentSubmission;
