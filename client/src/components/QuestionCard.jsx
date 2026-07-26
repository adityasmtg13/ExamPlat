import React from "react";

function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
}) {
  if (!question) return null;

  return (
    <div className="rounded-xl bg-white p-6 shadow">

      <h2 className="mb-2 text-lg font-semibold text-[#103f7c]">
        Question {questionNumber} of {totalQuestions}
      </h2>

      <p className="mb-6 text-lg font-medium">
        {question.question}
      </p>

      <div className="space-y-3">
        {question.options.map((option, index) => (
          <label
            key={index}
            className={`flex cursor-pointer items-center rounded-lg border p-4 transition
            ${
              selectedAnswer === index
                ? "border-blue-600 bg-blue-50"
                : "hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name={question.id}
              checked={selectedAnswer === index}
              onChange={() => onSelectAnswer(question.id, index)}
              className="mr-3"
            />

            {option}
          </label>
        ))}
      </div>
    </div>
  );
}

export default QuestionCard;