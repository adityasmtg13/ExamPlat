import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import QuestionCard from "../components/QuestionCard";
import QuestionPalette from "../components/QuestionPalette";
import NavigationButtons from "../components/NavigationButtons";
import { getMockQuestions, submitMockExam } from "../services/mockTestService";

function MockExam() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fullscreenReady, setFullscreenReady] = useState(false);
  const [securityShield, setSecurityShield] = useState(false);
  const [fullscreenError, setFullscreenError] = useState("");
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const answersRef = useRef(answers);
  const wasFullscreenRef = useRef(false);
  const submittingRef = useRef(false);
  const hasSubmittedRef = useRef(false);
  const submitAttemptRef = useRef(null);
  const warningAtRef = useRef(0);
  const shieldTimeoutRef = useRef(null);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const loadExam = useCallback(async () => {
    try {
      const response = await getMockQuestions(attemptId);
      setExam(response);
      setQuestions(response.questions || []);
    } catch (error) {
      toast.error(error.message || "Unable to load exam.");
      navigate("/mock-tests");
    } finally {
      setLoading(false);
    }
  }, [attemptId, navigate]);

  const submitAttempt = useCallback(async ({ automatic = false, reason = "" } = {}) => {
    if (submittingRef.current || hasSubmittedRef.current) return;

    submittingRef.current = true;
    setSubmitting(true);
    try {
      await submitMockExam(attemptId, answersRef.current);
      hasSubmittedRef.current = true;

      if (automatic) {
        toast.warning(`${reason || "Fullscreen was exited."} Your attempt was submitted. If attempts remain, you can start another from the instructions.`);
        const testId = exam?.attempt?.testId;
        navigate(testId ? `/mock-test/instructions/${encodeURIComponent(testId)}` : "/mock-tests", { replace: true });
        return;
      }

      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen().catch(() => {});
      }
      navigate(`/mock-test/result/${attemptId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to submit mock examination.");
      if (automatic) {
        setFullscreenReady(false);
        setFullscreenError("Automatic submission failed. Re-enter fullscreen to continue this attempt, or try submitting again.");
      }
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }, [attemptId, exam, navigate]);

  submitAttemptRef.current = submitAttempt;

  useEffect(() => {
    loadExam();
  }, [loadExam]);

  useEffect(() => {
    if (document.fullscreenElement) {
      wasFullscreenRef.current = true;
      setFullscreenReady(true);
    }

    const handleFullscreenChange = () => {
      if (document.fullscreenElement) {
        wasFullscreenRef.current = true;
        setFullscreenReady(true);
        setFullscreenError("");
        return;
      }

      setFullscreenReady(false);
      if (wasFullscreenRef.current && !hasSubmittedRef.current) {
        submitAttemptRef.current?.({ automatic: true, reason: "Fullscreen was exited." });
      }
    };

    const showWarning = (message) => {
      const now = Date.now();
      if (now - warningAtRef.current > 1200) {
        toast.warning(message);
        warningAtRef.current = now;
      }
    };

    const handleFocus = () => {
      window.clearTimeout(shieldTimeoutRef.current);
      shieldTimeoutRef.current = window.setTimeout(() => setSecurityShield(false), 350);
    };
    const handleBlur = () => {
      setSecurityShield(true);
      showWarning("Leaving the exam window is restricted during the exam.");
    };
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setSecurityShield(true);
        showWarning("Switching tabs is restricted during the exam.");
      } else handleFocus();
    };

    const showScreenshotShield = () => {
      setSecurityShield(true);
      window.clearTimeout(shieldTimeoutRef.current);
      shieldTimeoutRef.current = window.setTimeout(() => setSecurityShield(false), 2200);
      showWarning("Screen capture is restricted during the exam.");
    };

    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();
      const devtoolsShortcut = event.key === "F12"
        || ((event.ctrlKey || event.metaKey) && event.shiftKey && ["i", "j", "c"].includes(key))
        || ((event.ctrlKey || event.metaKey) && key === "u");
      const screenshotShortcut = event.key === "PrintScreen"
        || ((event.metaKey || event.ctrlKey) && event.shiftKey && (["3", "4", "5", "s"].includes(key)
          || ["Digit3", "Digit4", "Digit5"].includes(event.code)));

      if (screenshotShortcut) {
        event.preventDefault();
        event.stopPropagation();
        showScreenshotShield();
      } else if (devtoolsShortcut) {
        event.preventDefault();
        event.stopPropagation();
        showWarning("Developer tools and page inspection shortcuts are disabled during the exam.");
      }
    };

    const blockClipboard = (event) => {
      event.preventDefault();
      event.stopPropagation();
      showWarning("Copy, cut, and paste are disabled during the exam.");
    };
    const blockContextMenu = (event) => {
      event.preventDefault();
      showWarning("Right-click is disabled during the exam.");
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("copy", blockClipboard, true);
    document.addEventListener("cut", blockClipboard, true);
    document.addEventListener("paste", blockClipboard, true);
    document.addEventListener("contextmenu", blockContextMenu, true);
    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("copy", blockClipboard, true);
      document.removeEventListener("cut", blockClipboard, true);
      document.removeEventListener("paste", blockClipboard, true);
      document.removeEventListener("contextmenu", blockContextMenu, true);
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      window.clearTimeout(shieldTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (exam && wasFullscreenRef.current && !document.fullscreenElement && !hasSubmittedRef.current) {
      submitAttemptRef.current?.({ automatic: true, reason: "Fullscreen was exited." });
    }
  }, [exam]);

  const enterFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (!document.documentElement.requestFullscreen) {
          throw new Error("Fullscreen mode is not supported in this browser.");
        }
        await document.documentElement.requestFullscreen();
      }
      wasFullscreenRef.current = true;
      setFullscreenReady(true);
      setFullscreenError("");
    } catch (error) {
      toast.error(error.message || "Please allow fullscreen to continue.");
    }
  };

  const handleSelectAnswer = (questionId, optionIndex) => {
    setAnswers((previous) => {
      const next = { ...previous, [questionId]: optionIndex };
      answersRef.current = next;
      return next;
    });
  };

  const handlePrevious = () => setCurrentQuestion((previous) => Math.max(previous - 1, 0));
  const handleNext = () => setCurrentQuestion((previous) => Math.min(previous + 1, questions.length - 1));
  const handleJump = (index) => setCurrentQuestion(index);
  const handleClear = () => {
    const questionId = questions[currentQuestion]?.id;
    if (!questionId) return;
    setAnswers((previous) => {
      const next = { ...previous };
      delete next[questionId];
      answersRef.current = next;
      return next;
    });
  };

  const handleSubmit = () => {
    if (!window.confirm("Are you sure you want to submit this mock test?")) return;
    submitAttempt({ automatic: false });
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-gray-100"><h2 className="text-2xl font-semibold text-[#103f7c]">Loading Examination...</h2></div>;
  }

  if (!fullscreenReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-5 text-white">
        <div className="max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-8 text-center shadow-2xl">
          <h1 className="text-2xl font-bold">Fullscreen required</h1>
          <p className="mt-3 text-slate-300">{fullscreenError || "Enter fullscreen to view and continue your exam. Exiting fullscreen submits the current attempt."}</p>
          <button type="button" onClick={enterFullscreen} className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500">Enter fullscreen</button>
          {fullscreenError && <button type="button" onClick={() => submitAttempt({ automatic: true, reason: "The attempt was submitted after fullscreen submission failed." })} className="ml-3 mt-6 rounded-xl bg-red-600 px-6 py-3 font-semibold hover:bg-red-500">Retry submission</button>}
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return <div className="flex min-h-screen items-center justify-center bg-gray-100"><h2 className="text-xl font-semibold">No questions available.</h2></div>;
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-100">
      {securityShield && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950 text-center text-white">
          <div className="px-6">
            <h2 className="text-2xl font-bold">Exam screen hidden</h2>
            <p className="mt-2 text-slate-300">Return to the exam window to continue.</p>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-6 flex flex-col items-center justify-between rounded-xl bg-white p-6 shadow md:flex-row">
          <div>
            <h1 className="text-2xl font-bold text-[#103f7c]">{exam?.attempt?.examType}</h1>
            <p className="text-gray-600">Attempt {exam?.attempt?.attemptNumber}</p>
          </div>
          <div className="mt-5 text-center md:mt-0">
            <p className="text-sm text-gray-500">Mode</p>
            <h2 className="text-2xl font-bold text-green-600">Practice (No Time Limit)</h2>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
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
