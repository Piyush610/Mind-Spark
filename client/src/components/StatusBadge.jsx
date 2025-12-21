export const StatusBadge = ({ status }) => {
  const isDoingFine = status === "doing_fine";

  return (
    <span
      className={`status-badge ${
        isDoingFine ? "status-doing-fine" : "status-needs-support"
      }`}
    >
      <span>{isDoingFine ? "✓" : "!"}</span>
      <span>{isDoingFine ? "Doing Fine" : "Needs Support"}</span>
    </span>
  );
};
