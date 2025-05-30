import { useNavigate } from "react-router-dom";

const AgentAccessBlocked = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Header */}
      <div className="w-full h-20 bg-gradient-to-r from-[#1975a6] to-[#87d1f8] flex items-end justify-start px-6 py-3 mb-3 rounded-3xl text-white">
        <h1 className="font-normal text-3xl">Post Test</h1>
      </div>

      {/* Instruction & Buttons */}
      <div className="mt-6 text-left">
        <p className="font-medium text-sm mb-1">
          Please study the modules in the LMS and complete the tests to gain access to the features.
        </p>

        <div className="flex justify-start gap-4">
          <button
            onClick={() => navigate("/agent/learning-module/")}
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
          >
            Learn LMS
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentAccessBlocked;
