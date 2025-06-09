import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../axios-client";

interface ExamResult {
  id: number;
  user_id: number;
  point: string;
  status: boolean;
  start: string;
  end: string | null;
}

const AgentResultPostTest = () => {
  const [isPassed, setIsPassed] = useState<boolean | null>(null);
  const [point, setPoint] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExamResult = async () => {
      try {
        const storedUser = localStorage.getItem("USER");
        if (!storedUser) return;

        const user = JSON.parse(storedUser);
        const userId = user.id;

        const response = await axiosClient.get("/exam-tests");
        const exams: ExamResult[] = response.data.data;

        const userExams = exams.filter((exam) => exam.user_id === userId);

        if (userExams.length > 0) {
          const latestExam = userExams.reduce((latest, current) =>
            current.id > latest.id ? current : latest
          );

          setIsPassed(latestExam.status === true);
          setPoint(latestExam.point);
        }
      } catch (error) {
        console.error("Gagal mengambil data hasil post test:", error);
      }
    };

    fetchExamResult();
  }, []);

  if (isPassed === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600 text-lg">Memuat hasil post test...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4">
          {isPassed ? "Selamat!" : "Maaf!"}
        </h1>
        <p className="text-lg mb-2">
          {isPassed
            ? "Anda telah lulus Post-Test."
            : "Anda belum lulus Post-Test."}
        </p>
        <p className="text-sm text-gray-600 mb-6">
          Grade: {point} poin
        </p>
        <button
          onClick={() =>
            navigate(isPassed ? "/dashboard" : "/e-learning")
          }
          className="px-6 py-2 rounded-md bg-black text-white rounded hover:bg-gray-400"
        >
          {isPassed ? "Ke Dashboard" : "Kembali ke E-Learning"}
        </button>
      </div>
    </div>
  );
};

export default AgentResultPostTest;
