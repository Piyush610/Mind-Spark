import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { StudentDashboard } from "./pages/StudentDashboard";
import { Quiz } from "./pages/Quiz";
import { Result } from "./pages/Result";
import { RemedialPractice } from "./pages/RemedialPractice";
import { TeacherDashboard } from "./pages/TeacherDashboard";
import { Materials } from "./pages/Materials";
import { TeacherMaterials } from "./pages/TeacherMaterials";
import { ChatBot } from "./components/ChatBot";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:subjectId"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Quiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/result/:subjectId"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Result />
              </ProtectedRoute>
            }
          />
          <Route
            path="/remedial/:subjectId"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <RemedialPractice />
              </ProtectedRoute>
            }
          />
          <Route
            path="/materials/:subjectId"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Materials />
              </ProtectedRoute>
            }
          />

          {/* Teacher Routes */}
          <Route
            path="/teacher"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/materials"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <TeacherMaterials />
              </ProtectedRoute>
            }
          />

          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <ChatBot />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
