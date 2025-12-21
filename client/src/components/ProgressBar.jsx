export const ProgressBar = ({
  current,
  total,
  showLabel = true,
  color = "green",
}) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  const colorClasses = {
    green: "bg-[#58CC02]",
    blue: "bg-[#1CB0F6]",
    orange: "bg-[#FF9600]",
  };

  return (
    <div className="w-full">
      <div className="progress-bar">
        <div
          className={`progress-bar-fill ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1 text-sm text-[var(--text-secondary)]">
          <span>
            {current} / {total}
          </span>
          <span>{percentage}%</span>
        </div>
      )}
    </div>
  );
};
