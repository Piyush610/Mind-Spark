import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { StatusBadge } from "../components/StatusBadge";
import { XPBadge } from "../components/XPBadge";
import { Button } from "../components/Button";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export const Result = () => {
  const { subjectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { updateUserXP } = useAuth();

  const [result, setResult] = useState(location.state?.result || null);
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(!location.state?.result);

  useEffect(() => {
    if (!result) {
      fetchResult();
    } else {
      // Update XP if we have a result from submission
      if (result.xpEarned) {
        updateUserXP(result.xpEarned);
      }
      fetchSubject();
    }
  }, []);

  const fetchResult = async () => {
    try {
      const { data } = await api.get(`/quiz/results/${subjectId}`);
      setResult(data);
      setSubject(data.subjectId);
    } catch (error) {
      console.error("Error fetching result:", error);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubject = async () => {
    try {
      const { data } = await api.get(`/subjects/${subjectId}`);
      setSubject(data);
    } catch (error) {
      console.error("Error fetching subject:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">Loading result...</div>
      </div>
    );
  }

  const isDoingFine = result.status === "doing_fine";
  const score = result.score || result.result?.score || 0;
  const xpEarned = result.xpEarned || result.result?.xpEarned || 0;
  const status = result.status || result.result?.status;
  const correctAnswers = result.correctAnswers || result.correctCount || 0;
  const totalQuestions = result.totalQuestions || 0;

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-20 pb-8 px-4 max-w-2xl mx-auto">
        <div className="text-center">
          {/* Result Icon */}
          <div className="mb-6">
            <span className="text-8xl inline-block animate-bounce">
              {isDoingFine ? "🎉" : "💪"}
            </span>
          </div>

          {/* Subject Info */}
          {subject && (
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-4xl">{subject.icon}</span>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                {subject.name}
              </h1>
            </div>
          )}

          {/* Main Message */}
          <h2
            className={`text-3xl font-bold mb-2 ${
              isDoingFine
                ? "text-[var(--duo-green)]"
                : "text-[var(--duo-orange)]"
            }`}
          >
            {isDoingFine ? "Great Job!" : "Keep Practicing!"}
          </h2>
          <p className="text-[var(--text-secondary)] mb-8">
            {isDoingFine
              ? "You've demonstrated good understanding of this subject!"
              : "Don't worry, practice makes perfect. Try the extra exercises!"}
          </p>

          {/* Stats Card */}
          <div className="card mb-8">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p
                  className="text-4xl font-bold"
                  style={{
                    color: isDoingFine
                      ? "var(--duo-green)"
                      : "var(--duo-orange)",
                  }}
                >
                  {score}%
                </p>
                <p className="text-sm text-[var(--text-secondary)]">Score</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-[var(--text-primary)]">
                  {correctAnswers}/{totalQuestions}
                </p>
                <p className="text-sm text-[var(--text-secondary)]">Correct</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-[var(--duo-orange)]">
                  +{xpEarned}
                </p>
                <p className="text-sm text-[var(--text-secondary)]">
                  XP Earned
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-[var(--border-color)] flex justify-center">
              <StatusBadge status={status} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            {!isDoingFine && (
              <Button
                onClick={() => navigate(`/remedial/${subjectId}`)}
                variant="primary"
                size="lg"
              >
                Practice More
              </Button>
            )}
            {isDoingFine || result.retakeAllowed ? (
              <Button
                onClick={async () => {
                  try {
                    await api.post("/quiz/reset", { subjectId });
                    navigate(`/quiz/${subjectId}`);
                  } catch (error) {
                    console.error("Error resetting quiz:", error);
                    alert(error.response?.data?.message || "Cannot reset quiz");
                  }
                }}
                variant={!isDoingFine ? "outline" : "primary"}
                size="lg"
              >
                Retake Quiz
              </Button>
            ) : (
              <div className="flex flex-col items-center">
                <Button disabled variant="outline" size="lg">
                  Retake Locked
                </Button>
                <p className="text-xs text-[var(--duo-orange)] mt-2">
                  Ask your teacher to unlock retake
                </p>
              </div>
            )}
            <Button
              onClick={() => navigate("/dashboard")}
              variant="outline"
              size="lg"
            >
              Back to Subjects
            </Button>
          </div>

          {isDoingFine && (
            <p className="text-xs text-[var(--text-secondary)] mb-6">
              * Retaking the quiz will reset your score and remove XP earned for
              this attempt.
            </p>
          )}

          {/* Motivation Message */}
          {!isDoingFine && (
            <div className="mt-8 p-4 rounded-xl bg-[rgba(255,150,0,0.1)] border border-[var(--duo-orange)]">
              <p className="text-[var(--duo-orange)] font-semibold">
                🌟 Tip: Complete the practice exercises to strengthen your
                understanding!
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
