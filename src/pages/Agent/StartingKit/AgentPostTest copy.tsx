import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../axios-client";

type QuestionType = {
  id: number;
  ask_image: string;
  ask_text: string;
  a: string;
  b: string;
  c: string;
  d: string;
  e: string;
  key: string;
};

const AgentPostTest = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 4;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get("/ext/quizzes");
        const rawData = response.data.data;

        console.log("API Raw Data:", rawData);

        // Sama seperti di file 1: mapping data biar match ke QuestionType
        const formattedData = rawData.map((item: any) => ({
          id: item.id,
          ask_image: item.ask_image || "",
          ask_text: item.ask_text || "",
          a: item.a || "",
          b: item.b || "",
          c: item.c || "",
          d: item.d || "",
          e: item.e || "",
          key: item.key || "",
        }));

        setQuestions(formattedData);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };

    fetchData();
  }, []);

  // Pagination logic
  const indexOfLast = currentPage * questionsPerPage;
  const indexOfFirst = indexOfLast - questionsPerPage;
  const currentQuestions = questions.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(questions.length / questionsPerPage);

  return (
    <div>
      {/* Header */}
      <div className="w-full h-20 bg-gradient-to-r from-[#1975a6] to-[#87d1f8] flex items-end justify-start px-6 py-3 mb-3 rounded-3xl text-white">
        <h1 className="font-normal text-3xl">Post Test</h1>
      </div>

      {currentQuestions.map((q, index) => (
        <div
          key={q.id}
          className="w-full max-w-full sm:mx-0 bg-white border border-gray-200 rounded-xl shadow-sm my-4 p-4"
        >
          <h3 className="font-semibold mb-2 text-left">
            {indexOfFirst + index + 1}. {q.ask_text}
          </h3>

          {q.ask_image && (
            <img
              src={q.ask_image}
              alt="Question Illustration"
              className="mb-2 max-w-full rounded"
            />
          )}

          <div className="grid grid-cols-2 gap-4">
            {["a", "b", "c", "d", "e"].map((key) => (
              <label key={key} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={`question-${q.id}`}
                  value={q[key as keyof QuestionType]}
                  className="form-radio text-blue-500"
                />
                <span>{q[key as keyof QuestionType]}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <div
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded cursor-pointer ${page === currentPage
              ? "bg-black text-white"
              : "bg-gray-200 text-black"
              }`}
          >
            {page}
          </div>
        ))}
      </div>

      <div className="mt-6 text-right">
        <button
          onClick={() => navigate("/agent/dashboard")}
          className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default AgentPostTest;
