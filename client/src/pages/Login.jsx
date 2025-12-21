import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/Button";

export const Login = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Login State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register State
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState("student");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {
      const user = JSON.parse(localStorage.getItem("user"));
      navigate(user.role === "teacher" ? "/teacher" : "/dashboard");
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (regPassword.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const result = await register(regName, regEmail, regPassword, regRole);
    if (result.success) {
      navigate(regRole === "teacher" ? "/teacher" : "/dashboard");
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] overflow-hidden">


      <div className="min-h-screen flex items-center justify-center p-4 perspective-1000">
        <div className={`relative w-full max-w-5xl h-[700px] transition-all duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>

          {/* FRONT - LOGIN */}
          <div className="absolute w-full h-full backface-hidden">
            <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-8 bg-[var(--bg-secondary)] rounded-[32px] shadow-[var(--shadow-soft)] overflow-hidden">

              {/* Left Side - Hero */}
              <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] text-white relative">
                <div className="relative z-10 animate-fade-in">
                  <span className="text-6xl mb-6 block drop-shadow-md">🌱</span>
                  <h1 className="text-5xl font-bold mb-6 leading-tight">Grow Your Knowledge</h1>
                  <p className="text-blue-100 text-lg mb-8">Ready to continue your journey?</p>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="flex items-center justify-center p-8 md:p-12">
                <div className="w-full max-w-md">
                  <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Welcome Back</h2>
                  <p className="text-[var(--text-secondary)] mb-8">Sign in to your account.</p>

                  <form onSubmit={handleLogin} className="space-y-4">
                    {error && !isFlipped && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input"
                      required
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input"
                      required
                    />
                    <Button type="submit" fullWidth disabled={loading}>
                      {loading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>

                  <div className="mt-8 text-center bg-gray-50 p-4 rounded-xl">
                    <p className="text-[var(--text-secondary)]">New here?</p>
                    <button
                      onClick={() => setIsFlipped(true)}
                      className="text-[var(--primary)] font-bold hover:underline"
                    >
                      Create an Account &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BACK - REGISTER */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180">
            <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-8 bg-[var(--bg-secondary)] rounded-[32px] shadow-[var(--shadow-soft)] overflow-hidden">

              {/* Left Side - Form (Swapped for effect) */}
              <div className="flex items-center justify-center p-8 md:p-12 order-2 md:order-1">
                <div className="w-full max-w-md">
                  <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Join us!</h2>
                  <p className="text-[var(--text-secondary)] mb-6">Create your account.</p>

                  <form onSubmit={handleRegister} className="space-y-3">
                    {error && isFlipped && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

                    <input
                      type="text"
                      placeholder="Full Name"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="input"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="input"
                      required
                    />
                    <input
                      type="password"
                      placeholder="Password (min 6 chars)"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="input"
                      required
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <button type="button" onClick={() => setRegRole('student')} className={`p-2 rounded-lg border ${regRole === 'student' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-200'}`}>🎓 Student</button>
                      <button type="button" onClick={() => setRegRole('teacher')} className={`p-2 rounded-lg border ${regRole === 'teacher' ? 'bg-orange-50 border-orange-500 text-orange-700' : 'border-gray-200'}`}>👨‍🏫 Teacher</button>
                    </div>

                    <Button type="submit" fullWidth disabled={loading}>
                      {loading ? "Creating..." : "Sign Up"}
                    </Button>
                  </form>

                  <div className="mt-6 text-center bg-gray-50 p-4 rounded-xl">
                    <p className="text-[var(--text-secondary)]">Already have an account?</p>
                    <button
                      onClick={() => setIsFlipped(false)}
                      className="text-[var(--primary)] font-bold hover:underline"
                    >
                      &larr; Back to Login
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side - Hero */}
              <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-bl from-[var(--success)] to-[var(--primary)] text-white relative order-1 md:order-2">
                <div className="relative z-10 animate-fade-in">
                  <span className="text-6xl mb-6 block drop-shadow-md">🚀</span>
                  <h1 className="text-5xl font-bold mb-6 leading-tight">Start Your Adventure</h1>
                  <p className="text-green-100 text-lg mb-8">Join thousands of students learning in a calm, effective way.</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
