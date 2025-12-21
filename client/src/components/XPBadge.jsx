export const XPBadge = ({ xp, size = "md" }) => {
  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-2",
  };

  return (
    <div className={`xp-badge ${sizeClasses[size]}`}>
      <span>⚡</span>
      <span>{xp} XP</span>
    </div>
  );
};

export const StreakBadge = ({ streak }) => {
  return (
    <div className="inline-flex items-center gap-1 px-3 py-1 bg-[#FF9600] text-white font-bold text-sm rounded-full">
      <span>🔥</span>
      <span>{streak}</span>
    </div>
  );
};

export const HeartDisplay = ({ hearts, maxHearts = 5 }) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(maxHearts)].map((_, i) => (
        <span
          key={i}
          className={`text-xl ${
            i < hearts ? "text-[#FF4B4B]" : "text-[var(--text-muted)]"
          }`}
        >
          {i < hearts ? "❤️" : "🖤"}
        </span>
      ))}
    </div>
  );
};
