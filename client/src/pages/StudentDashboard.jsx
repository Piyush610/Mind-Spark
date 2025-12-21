import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Navbar } from "../components/Navbar";
import { SubjectCard } from "../components/SubjectCard";
import { XPBadge } from "../components/XPBadge";
import api from "../api/axios";

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ completed: 0, total: 0, totalXP: 0 });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const { data } = await api.get("/subjects");
      setSubjects(data);

      const completed = data.filter((s) => s.completed).length;
      setStats({
        completed,
        total: data.length,
        totalXP: user.xp || 0,
      });
    } catch (error) {
      console.error("Error fetching subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">Loading subjects...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-20 pb-8 px-4 max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-[var(--text-secondary)]">
            Continue your learning journey
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[rgba(88,204,2,0.2)] flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Progress</p>
              <p className="text-xl font-bold text-[var(--text-primary)]">
                {stats.completed} / {stats.total} Subjects
              </p>
            </div>
          </div>

          <div className="card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[rgba(255,150,0,0.2)] flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Total XP</p>
              <p className="text-xl font-bold text-[var(--duo-orange)]">
                {stats.totalXP} XP
              </p>
            </div>
          </div>

          <div className="card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[rgba(255,75,75,0.2)] flex items-center justify-center">
              <span className="text-2xl">🔥</span>
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Streak</p>
              <p className="text-xl font-bold text-[var(--duo-red)]">
                {user.streak || 0} Days
              </p>
            </div>
          </div>
        </div>

        {/* Subjects Section */}
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">
            Choose a Subject
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {subjects.map((subject) => (
              <SubjectCard key={subject._id} subject={subject} />
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
          <h3 className="text-sm font-bold text-[var(--text-secondary)] mb-3">
            How it works
          </h3>
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[var(--duo-green)]"></span>
              <span className="text-[var(--text-secondary)]">
                Doing Fine (Score ≥ 40%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[var(--duo-orange)]"></span>
              <span className="text-[var(--text-secondary)]">
                Needs Support (Score &lt; 40%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[var(--border-color)]"></span>
              <span className="text-[var(--text-secondary)]">
                Not attempted yet
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
