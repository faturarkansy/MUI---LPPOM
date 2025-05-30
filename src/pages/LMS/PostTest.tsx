import React, { useState } from 'react';
import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';

const quizData = [
  {
    id: 1,
    question: 'Lorem ipsum dolor sit amet?',
    options: ['Answer A', 'Answer B', 'Answer C', 'Answer D'],
  },
  {
    id: 2,
    question: 'Quisque efficitur egestas arcu?',
    options: ['Answer A', 'Answer B', 'Answer C', 'Answer D'],
  },
  {
    id: 3,
    question: 'Nunc lacinia placerat arcu?',
    options: ['Answer A', 'Answer B', 'Answer C', 'Answer D'],
  },
  {
    id: 4,
    question: 'Vestibulum ante ipsum primis?',
    options: ['Answer A', 'Answer B', 'Answer C', 'Answer D'],
  },
];



const VerticalCardList = () => {
  const [answers, setAnswers] = useState({});

  const handleChange = (questionId, selectedOption) => {
    setAnswers({
      ...answers,
      [questionId]: selectedOption,
    });
  };
  return (
    <div>
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="FAQ" />
      <div className="p-4 max-w-3xl mx-auto flex flex-col space-y-4">
        {quizData.map((q) => (
          <div key={q.id} className="mb-6 border rounded-lg p-4 shadow-sm">
            <h2 className="font-semibold text-lg mb-2">{q.id}. {q.question}</h2>
            <div className="grid grid-cols-2 gap-4">
              {q.options.map((option, idx) => (
                <label key={idx} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value={option}
                    checked={answers[q.id] === option}
                    onChange={() => handleChange(q.id, option)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

  );
};

export default VerticalCardList;

