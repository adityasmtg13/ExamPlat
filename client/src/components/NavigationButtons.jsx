import React from "react";

function NavigationButtons({
  currentQuestion,
  totalQuestions,
  onPrevious,
  onNext,
  onClear,
  onSubmit,
}) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4">

      <button
        onClick={onPrevious}
        disabled={currentQuestion === 0}
        className="rounded-lg bg-gray-500 px-5 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        Previous
      </button>

      <button
        onClick={onClear}
        className="rounded-lg bg-yellow-500 px-5 py-2 font-semibold text-white hover:bg-yellow-600"
      >
        Clear Response
      </button>

      {currentQuestion === totalQuestions - 1 ? (
        <button
          onClick={onSubmit}
          className="rounded-lg bg-red-600 px-5 py-2 font-semibold text-white hover:bg-red-700"
        >
          Submit Exam
        </button>
      ) : (
        <button
          onClick={onNext}
          className="rounded-lg bg-[#103f7c] px-5 py-2 font-semibold text-white hover:bg-[#0d3262]"
        >
          Save & Next
        </button>
      )}
    </div>
  );
}

export default NavigationButtons;