import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../axios-client";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";

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
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [nextExamId, setNextExamId] = useState<number | null>(null);

  // Ambil data soal
  useEffect(() => {
    const fetchQuestionsFromExamTest = async () => {
      try {
        const res = await axiosClient.get("/exam-tests/create");
        const examData = res.data;

        // Ambil dan format soal dari field `work`
        const formatted = examData.work.map((item: any) => ({
          id: item.quiz.id,
          ask_image: item.quiz.ask_image || "",
          ask_text: item.quiz.ask_text || "",
          a: item.quiz.a || "",
          b: item.quiz.b || "",
          c: item.quiz.c || "",
          d: item.quiz.d || "",
          e: item.quiz.e || "",
          key: "", // key tidak tersedia di endpoint ini
        }));

        setQuestions(formatted);
        setNextExamId(examData.id); // gunakan id dari exam-test
      } catch (error) {
        console.error("Gagal mengambil data dari /exam-tests/create:", error);
      }
    };

    fetchQuestionsFromExamTest();
  }, []);


  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      if (nextExamId !== null) {
        formData.append("exam_id", String(nextExamId));
      }

      Object.entries(answers).forEach(([questionId, answer]) => {
        formData.append(`answer[${questionId}]`, answer);
      });

      await axiosClient.post("/exam-tests", formData);

      navigate("/result-post-test", {
        state: { status: "submitted" },
      });
    } catch (error) {
      console.error("Gagal mengirim jawaban:", error);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Post Test" />

      {questions.length === 0 ? (

        <div className="text-center text-gray-500 text-sm font-medium mt-20">
          Upps Soal Belum Tersedia
        </div>
      ) : (
        <>
          {questions.map((q, index) => (
            <div
              key={q.id}
              className="w-full max-w-full bg-white border border-gray-200 rounded-xl shadow-sm my-4 p-4"
            >
              <h3 className="font-semibold mb-2 text-left">
                {index + 1}. {q.ask_text}
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
                  <label
                    key={key}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value={q[key as keyof QuestionType]}
                      checked={answers[q.id] === key}
                      onChange={() => handleAnswerChange(q.id, key)}
                      className="form-radio text-blue-500"
                    />
                    <span>{q[key as keyof QuestionType]}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </>
      )}


      <div className="mt-6 text-right">
        <button
          onClick={handleSubmit}
          className="sm:py-2 py-1.5 sm:px-3 px-2 bg-black text-white text-xs sm:text-sm font-bold border-2 border-black rounded-md sm:rounded-lg hover:bg-gray-400 hover:text-black"
          disabled={nextExamId === null}
        >
          Submit
        </button>
      </div>

    </div>
  );
};

export default AgentPostTest;
