import { useLocation, useNavigate } from "react-router-dom";

const AgentResultPostTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const status = location.state?.status;

  const isPassed = status === "passed";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4">
          {isPassed ? "Selamat!" : "Maaf!"}
        </h1>
        <p className="text-lg mb-6">
          {isPassed
            ? "Anda berhasil lulus Post Test."
            : "Anda belum berhasil lulus Post Test."}
        </p>
        <button
          onClick={() =>
            navigate(isPassed ? "/agent/dashboard" : "/agent/learning-module")
          }
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isPassed ? "Kembali ke Dashboard" : "Belajar Lagi"}
        </button>
      </div>
    </div>
  );
};

export default AgentResultPostTest;
