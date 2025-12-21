import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/Button";

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const result = await register(name, email, password, role);

    if (result.success) {
      navigate(role === "teacher" ? "/teacher" : "/dashboard");
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-6xl mb-4 block">⚡</span>
          <h1 className="text-3xl font-bold text-[var(--duo-green)]">
            Join MindSpark
          </h1>
          <p className="text-[var(--text-secondary)] mt-2">
            Create your account to start learning
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-[rgba(255,75,75,0.15)] text-[var(--duo-red)] text-sm font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="At least 6 characters"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    role === "student"
                      ? "border-[var(--duo-green)] bg-[rgba(88,204,2,0.1)]"
                      : "border-[var(--border-color)] hover:border-[var(--duo-blue)]"
                  }`}
                >
                  <span className="text-3xl block mb-2">🎓</span>
                  <span className="font-bold text-[var(--text-primary)]">
                    Student
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("teacher")}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    role === "teacher"
                      ? "border-[var(--duo-green)] bg-[rgba(88,204,2,0.1)]"
                      : "border-[var(--border-color)] hover:border-[var(--duo-blue)]"
                  }`}
                >
                  <span className="text-3xl block mb-2">👨‍🏫</span>
                  <span className="font-bold text-[var(--text-primary)]">
                    Teacher
                  </span>
                </button>
              </div>
            </div>

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[var(--text-secondary)]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[var(--duo-blue)] font-bold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
