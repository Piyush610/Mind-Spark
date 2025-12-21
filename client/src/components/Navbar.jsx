import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { XPBadge, StreakBadge } from "./XPBadge";

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 navbar-soft z-50">
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to={user?.role === "teacher" ? "/teacher" : "/dashboard"}
          className="flex items-center gap-2"
        >
          <span className="text-2xl">🌱</span>
          <span className="text-xl font-bold text-[var(--primary)]">
            MindSpark
          </span>
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <>
              {user.role === "student" && (
                <>
                  <StreakBadge streak={user.streak || 0} />
                  <XPBadge xp={user.xp || 0} />
                </>
              )}

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    {user.name}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] capitalize">
                    {user.role}
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)] transition-colors"
                  title="Logout"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-[var(--text-secondary)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--primary)] px-3 py-2">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary text-sm py-2 px-4">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
