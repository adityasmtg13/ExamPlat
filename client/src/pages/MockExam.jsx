import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";

import QuestionCard from "../components/QuestionCard";
import QuestionPalette from "../components/QuestionPalette";
import NavigationButtons from "../components/NavigationButtons";

import {
  getMockQuestions,
  submitMockExam,
} from "../services/mockTestService";

function MockExam() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // { questionId : selectedOptionIndex }
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    loadExam();
  }, []);

  const loadExam = async () => {
    try {
      const response = await getMockQuestions(attemptId);

      setExam(response);
      setQuestions(response.questions);
    } catch (error) {
      alert(error.message || "Unable to load exam.");
      navigate("/mock-tests");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (questionId, optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handleJump = (index) => {
    setCurrentQuestion(index);
  };

  const handleClear = () => {
    const questionId = questions[currentQuestion].id;

    setAnswers((prev) => {
      const updated = { ...prev };
      delete updated[questionId];
      return updated;
    });
  };

  const handleSubmit = async () => {
    const confirmSubmit = window.confirm(
      "Are you sure you want to submit this mock test?"
    );

    if (!confirmSubmit) return;

    try {
      setSubmitting(true);

      const response = await submitMockExam(
        attemptId,
        answers
      );

      navigate("/mock-result", {
        state: response.result,
      });
    } catch (error) {
      alert(
        error.message ||
          "Failed to submit mock examination."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />

        <div className="flex h-[80vh] items-center justify-center">
          <h2 className="text-2xl font-semibold text-[#103f7c]">
            Loading Examination...
          </h2>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />

        <div className="flex h-[80vh] items-center justify-center">
          <h2 className="text-xl font-semibold">
            No questions available.
          </h2>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="mx-auto max-w-7xl px-5 py-8">

        {/* Header */}

        <div className="mb-6 flex flex-col items-center justify-between rounded-xl bg-white p-6 shadow md:flex-row">

          <div>
            <h1 className="text-2xl font-bold text-[#103f7c]">
              {exam.attempt.examType}
            </h1>

            <p className="text-gray-600">
              Attempt {exam.attempt.attemptNumber}
            </p>
          </div>

          <div className="mt-5 text-center md:mt-0">
            <p className="text-sm text-gray-500">
              Mode
            </p>

            <h2 className="text-2xl font-bold text-green-600">
              Practice (No Time Limit)
            </h2>
          </div>

        </div>

        <div className="grid gap-6 lg:grid-cols-4">

          {/* Question */}

          <div className="lg:col-span-3">

            <QuestionCard
              question={question}
              questionNumber={currentQuestion + 1}
              totalQuestions={questions.length}
              selectedAnswer={answers[question.id]}
              onSelectAnswer={handleSelectAnswer}
            />

            <NavigationButtons
              currentQuestion={currentQuestion}
              totalQuestions={questions.length}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onClear={handleClear}
              onSubmit={handleSubmit}
              submitting={submitting}
            />

          </div>

          {/* Question Palette */}

          <QuestionPalette
            questions={questions}
            answers={answers}
            currentQuestion={currentQuestion}
            onJump={handleJump}
          />

        </div>

      </div>
    </div>
  );
}

export default MockExam;