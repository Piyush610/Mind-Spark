import { useNavigate } from "react-router-dom";
import { StatusBadge } from "./StatusBadge";

export const SubjectCard = ({ subject, onClick }) => {
  const navigate = useNavigate();

  const score = subject.score;

  const getText = () => {
    if (subject.completed) {
      return "View Result";
    }
    return "Start Quiz";
  };

  const handleActionButtonClick = (e) => {
    e.stopPropagation();
    if (onClick) {
      onClick(subject);
    } else if (subject.completed) {
      navigate(`/result/${subject._id}`);
    } else {
      navigate(`/quiz/${subject._id}`);
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick(subject);
    } else if (!subject.completed) {
      navigate(`/quiz/${subject._id}`);
    } else {
      // Navigate to result page for any completed subject
      // From there, users can choose to Retake or Practice
      navigate(`/result/${subject._id}`);
    }
  };

  return (
    <div
      className={`subject-card ${subject.completed ? "completed" : ""}`}
      onClick={handleClick}
      style={{ borderColor: subject.completed ? subject.color : undefined }}
    >
      <div className="subject-icon">{subject.icon}</div>
      <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">
        {subject.name}
      </h3>
      <p className="text-[var(--text-secondary)] mb-4">{subject.description}</p>

      {/* Progress Bar (if student) */}
      {score !== undefined && (
        <div className="w-full mb-4">
          <div
            className={`text-center font-bold text-2xl mb-1 ${
              score >= 40 ? "text-[var(--duo-green)]" : "text-[var(--duo-blue)]"
            }`}
          >
            {score}%
          </div>
          {subject.status === "needs_support" && (
            <div className="flex justify-center mb-2">
              <StatusBadge status="needs_support" />
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2 w-full mt-auto">
        {subject.hasMaterials && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/materials/${subject._id}`);
            }}
            className="flex-1 py-2 px-3 rounded-xl border-2 border-[var(--border-color)] text-[var(--text-primary)] font-bold hover:bg-[var(--bg-hover)] transition-colors"
          >
            📖 Materials
          </button>
        )}
        <button
          onClick={handleActionButtonClick}
          className="flex-1 py-2 px-3 rounded-xl bg-[var(--bg-secondary)] text-[var(--duo-green)] font-bold uppercase tracking-wide"
        >
          {getText()}
        </button>
      </div>
    </div>
  );
};
