import { useNavigate } from "react-router-dom";
import AddIcon from "../../../../src/icons/add.svg";
import CardAgentSubmission from "../../../components/card/CardAgentSubmission";


const AgentSubmission = () => {
  const navigate = useNavigate();
  return (
    <div>
      {/* Header */}
      <div className="w-full h-20 bg-gradient-to-r from-[#1975a6] to-[#87d1f8] flex items-end justify-start px-6 py-3 mb-3 rounded-3xl text-white">
        <h1 className="font-normal text-3xl">Submissions</h1>
      </div>

      {/* Breadcrumb */}
      <div className="w-full h-9 bg-gradient-to-r from-[#1975a6] to-[#87d1f8] flex items-center justify-start px-6 py-3 rounded-3xl text-white">
        <ol className="flex items-center font-medium whitespace-nowrap">
          <li className="inline-flex items-center text-sm">Submissions</li>
        </ol>
      </div>

      {/* Tombol */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => navigate("/agent/submission/add-submission")}
          className="mt-3 py-2 px-3 inline-flex items-center gap-x-2 text-sm font-bold border-2 border-[#7EC34B] rounded-lg bg-white text-[#7EC34B] hover:bg-gray-200 hover:text-[#7EC34B] focus:outline-hidden focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
        >
          <img src={AddIcon} alt="Add Icon" className="w-4 h-4" />
          Add New
        </button>
      </div>
      <CardAgentSubmission />
    </div>
  );
};

export default AgentSubmission;
