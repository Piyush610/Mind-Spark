import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { QuestionCard } from "../components/QuestionCard";
import { ProgressBar } from "../components/ProgressBar";
import { HeartDisplay } from "../components/XPBadge";
import { Button } from "../components/Button";
import api from "../api/axios";

export const Quiz = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [hearts, setHearts] = useState(5);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [subjectId]);

  const fetchQuestions = async () => {
    try {
      const [questionsRes, subjectRes] = await Promise.all([
        api.get(`/questions/${subjectId}?fresh=true`),
        api.get(`/subjects/${subjectId}`),
      ]);
      setQuestions(questionsRes.data);
      setSubject(subjectRes.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
      if (error.response?.status === 404) {
        navigate("/dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    // Save the answer
    const newAnswers = [
      ...answers,
      {
        questionId: questions[currentIndex]._id,
        selectedAnswer,
      },
    ];
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      // Move to next question
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
    } else {
      // Submit quiz
      submitQuiz(newAnswers);
    }
  };

  const submitQuiz = async (finalAnswers) => {
    setSubmitting(true);
    try {
      const { data } = await api.post("/quiz/submit", {
        subjectId,
        answers: finalAnswers,
      });

      // Navigate to result page with state
      navigate(`/result/${subjectId}`, {
        state: { result: data },
        replace: true,
      });
    } catch (error) {
      console.error("Error submitting quiz:", error);
      if (error.response?.data?.result) {
        // Already attempted
        navigate(`/result/${subjectId}`, {
          state: { result: error.response.data },
          replace: true,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-6xl mb-6 animate-bounce">⚡</div>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] mb-2">
          Generating Questions...
        </h2>
        <p className="text-[var(--text-secondary)] text-center max-w-md">
          Our AI is crafting a unique quiz just for you using Gemini 1.5 Flash.
        </p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  // Guard against empty state or loading issues
  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-[var(--text-secondary)]">
          No questions available. Please try again later.
          <button
            onClick={() => navigate("/dashboard")}
            className="block mt-4 text-blue-500 hover:underline mx-auto"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-20 pb-8 px-4 max-w-3xl mx-auto">
        {/* Quiz Header */}
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
            <HeartDisplay hearts={hearts} maxHearts={5} />
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{subject?.icon}</span>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">
              {subject?.name} Quiz
            </h1>
          </div>

          <ProgressBar
            current={currentIndex + 1}
            total={questions.length}
            showLabel={false}
          />
        </div>

        {/* Question */}
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={handleSelectAnswer}
        />

        {/* Action Button */}
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleNext}
            disabled={selectedAnswer === null || submitting}
            size="lg"
          >
            {submitting
              ? "Submitting..."
              : isLastQuestion
                ? "Submit Quiz"
                : "Next Question"}
          </Button>
        </div>
      </main>
    </div>
  );
};
