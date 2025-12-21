import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { StatusBadge } from "../components/StatusBadge";
import api from "../api/axios";

export const TeacherDashboard = () => {
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    doingFine: 0,
    needsSupport: 0,
  });
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [filters, setFilters] = useState({ subjectId: "", status: "" });

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      const [resultsRes, subjectsRes] = await Promise.all([
        api.get("/quiz/results/teacher", { params: filters }),
        api.get("/subjects"),
      ]);
      setResults(resultsRes.data.results);
      setSummary(resultsRes.data.summary);
      setSubjects(subjectsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-20 pb-8 px-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
              Teacher Dashboard
            </h1>
            <p className="text-[var(--text-secondary)]">
              Monitor student performance and identify those needing support
            </p>
          </div>
          <Link to="/teacher/materials" className="btn btn-secondary">
            📚 Manage Materials
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[rgba(28,176,246,0.2)] flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">
                Total Attempts
              </p>
              <p className="text-2xl font-bold text-[var(--duo-blue)]">
                {summary.total}
              </p>
            </div>
          </div>

          <div className="card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[rgba(88,204,2,0.2)] flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Doing Fine</p>
              <p className="text-2xl font-bold text-[var(--duo-green)]">
                {summary.doingFine}
              </p>
            </div>
          </div>

          <div className="card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[rgba(255,150,0,0.2)] flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">
                Needs Support
              </p>
              <p className="text-2xl font-bold text-[var(--duo-orange)]">
                {summary.needsSupport}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
                Filter by Subject
              </label>
              <select
                value={filters.subjectId}
                onChange={(e) =>
                  handleFilterChange("subjectId", e.target.value)
                }
                className="input"
              >
                <option value="">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.icon} {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
                Filter by Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="input"
              >
                <option value="">All Status</option>
                <option value="doing_fine">Doing Fine</option>
                <option value="needs_support">Needs Support</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--bg-tertiary)]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[var(--text-secondary)]">
                    Student
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[var(--text-secondary)]">
                    Subject
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[var(--text-secondary)]">
                    Score
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[var(--text-secondary)]">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[var(--text-secondary)]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {results.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-[var(--text-secondary)]"
                    >
                      No results found
                    </td>
                  </tr>
                ) : (
                  results.map((result) => (
                    <tr key={result._id} className="hover:bg-[var(--bg-hover)]">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-[var(--text-primary)]">
                            {result.userId?.name || "Unknown"}
                          </p>
                          <p className="text-sm text-[var(--text-secondary)]">
                            {result.userId?.email || ""}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">
                            {result.subjectId?.icon}
                          </span>
                          <span className="text-[var(--text-primary)]">
                            {result.subjectId?.name || "Unknown"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="text-lg font-bold"
                          style={{
                            color:
                              result.score >= 40
                                ? "var(--duo-green)"
                                : "var(--duo-orange)",
                          }}
                        >
                          {result.score}%
                        </span>
                        <span className="text-sm text-[var(--text-secondary)] ml-2">
                          ({result.correctAnswers}/{result.totalQuestions})
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={result.status} />
                      </td>
                      <td className="px-6 py-4">
                        {result.retakeAllowed ? (
                          <span className="text-[var(--duo-green)] text-sm font-bold">
                            Unlocked
                          </span>
                        ) : (
                          <button
                            onClick={async () => {
                              try {
                                await api.post("/quiz/allow-retake", {
                                  resultId: result._id,
                                });
                                // Refresh data
                                fetchData();
                              } catch (error) {
                                console.error("Error unlocking retake:", error);
                              }
                            }}
                            className="text-[var(--duo-blue)] hover:text-[var(--text-primary)] font-semibold text-sm"
                          >
                            Unlock Retake
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Stats for Needs Support */}
        {summary.needsSupport > 0 && (
          <div className="mt-6 p-4 rounded-xl bg-[rgba(255,150,0,0.1)] border border-[var(--duo-orange)]">
            <h3 className="font-bold text-[var(--duo-orange)] mb-2">
              ⚠️ Attention Required
            </h3>
            <p className="text-[var(--text-secondary)]">
              {summary.needsSupport} student
              {summary.needsSupport > 1 ? "s" : ""} need
              {summary.needsSupport === 1 ? "s" : ""} additional support.
              Consider providing extra resources or one-on-one assistance.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
