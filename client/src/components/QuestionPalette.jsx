import React from "react";

function QuestionPalette({
  questions,
  answers,
  currentQuestion,
  onJump,
}) {
  return (
    <div className="rounded-xl bg-white p-5 shadow">

      <h2 className="mb-5 text-lg font-semibold">
        Question Palette
      </h2>

      <div className="grid grid-cols-5 gap-3">

        {questions.map((question, index) => {

          let color =
            "bg-gray-300 hover:bg-gray-400";

          if (answers[question.id] !== undefined)
            color =
              "bg-green-500 text-white hover:bg-green-600";

          if (currentQuestion === index)
            color =
              "bg-blue-600 text-white hover:bg-blue-700";

          return (
            <button
              key={question.id}
              onClick={() => onJump(index)}
              className={`h-10 w-10 rounded-full font-semibold transition ${color}`}
            >
              {index + 1}
            </button>
          );
        })}

      </div>

      <div className="mt-6 space-y-2 text-sm">

        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded bg-blue-600"></span>
          Current
        </div>

        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded bg-green-500"></span>
          Answered
        </div>

        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded bg-gray-300"></span>
          Not Answered
        </div>

      </div>

    </div>
  );
}

export default QuestionPalette;