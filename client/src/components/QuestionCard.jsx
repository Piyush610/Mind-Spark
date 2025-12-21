export const QuestionCard = ({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
  showResult = false,
  correctAnswer = null,
}) => {
  return (
    <div className="soft-card p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <span className="text-sm text-[var(--text-secondary)]">
          Question {questionNumber} of {totalQuestions}
        </span>
        <h2 className="text-xl font-bold text-[var(--text-primary)] mt-2">
          {question.questionText}
        </h2>
      </div>

      <div className="space-y-3">
        {question.options.map((option, index) => {
          let optionClass = "option-btn";

          if (showResult) {
            if (index === correctAnswer) {
              optionClass += " correct";
            } else if (index === selectedAnswer && index !== correctAnswer) {
              optionClass += " incorrect";
            }
          } else if (index === selectedAnswer) {
            optionClass += " selected";
          }

          return (
            <button
              key={index}
              className={optionClass}
              onClick={() => !showResult && onSelectAnswer(index)}
              disabled={showResult}
            >
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--bg-tertiary)] text-sm font-bold mr-3">
                {String.fromCharCode(65 + index)}
              </span>
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};
