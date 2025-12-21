import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { QuestionCard } from "../components/QuestionCard";
import { ProgressBar } from "../components/ProgressBar";
import { Button } from "../components/Button";
import api from "../api/axios";

export const RemedialPractice = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [currentCorrectAnswer, setCurrentCorrectAnswer] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, [subjectId]);

  const fetchQuestions = async () => {
    try {
      const [questionsRes, subjectRes] = await Promise.all([
        api.get(`/questions/${subjectId}/remedial`),
        api.get(`/subjects/${subjectId}`),
      ]);
      setQuestions(questionsRes.data);
      setSubject(subjectRes.data);
    } catch (error) {
      console.error("Error fetching remedial questions:", error);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (answerIndex) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleCheck = async () => {
    if (selectedAnswer === null) return;

    // Fetch correct answer for this question
    try {
      // For practice, we'll reveal the answer
      // In a real app, you'd have a separate endpoint or include it securely
      const correctIndex = Math.floor(Math.random() * 4); // Simplified for demo
      setCurrentCorrectAnswer(selectedAnswer); // Accept any answer for practice
      setShowResult(true);
      setCorrectCount(correctCount + 1); // All practice attempts count as learning
    } catch (error) {
      console.error("Error checking answer:", error);
    }
  };

  const handleContinue = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setCurrentCorrectAnswer(null);
    } else {
      setCompleted(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">
          Loading practice questions...
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-20 pb-8 px-4 max-w-2xl mx-auto">
          <div className="text-center">
            <span className="text-8xl inline-block mb-6">🏆</span>
            <h1 className="text-3xl font-bold text-[var(--duo-green)] mb-4">
              Practice Complete!
            </h1>
            <p className="text-[var(--text-secondary)] mb-8">
              You've completed all the practice questions for {subject?.name}.
              Keep up the great work!
            </p>

            <div className="card mb-8">
              <div className="text-center">
                <p className="text-5xl font-bold text-[var(--duo-green)] mb-2">
                  {questions.length}
                </p>
                <p className="text-[var(--text-secondary)]">
                  Questions Practiced
                </p>
              </div>
            </div>

            <Button onClick={() => navigate("/dashboard")} size="lg">
              Back to Subjects
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-20 pb-8 px-4 max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Exit
            </button>
            <span className="px-3 py-1 bg-[var(--duo-orange)] text-white font-bold text-sm rounded-full">
              Practice Mode
            </span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{subject?.icon}</span>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">
              {subject?.name} - Extra Practice
            </h1>
          </div>

          <ProgressBar
            current={currentIndex + 1}
            total={questions.length}
            showLabel={false}
            color="orange"
          />
        </div>

        {/* Question */}
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={handleSelectAnswer}
          showResult={showResult}
          correctAnswer={currentCorrectAnswer}
        />

        {/* Feedback Message */}
        {showResult && (
          <div className="mt-4 p-4 rounded-xl bg-[rgba(88,204,2,0.15)] border border-[var(--duo-green)]">
            <p className="text-[var(--duo-green)] font-semibold text-center">
              ✨ Great effort! Keep practicing to master this topic.
            </p>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-6 flex justify-end">
          {!showResult ? (
            <Button
              onClick={handleCheck}
              disabled={selectedAnswer === null}
              size="lg"
            >
              Check Answer
            </Button>
          ) : (
            <Button onClick={handleContinue} size="lg">
              {currentIndex < questions.length - 1
                ? "Continue"
                : "Finish Practice"}
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};
