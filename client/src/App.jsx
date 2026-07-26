import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import RegisterExam from "./pages/RegisterExam";
import MockTests from "./pages/MockTests";
import ComingSoon from "./pages/ComingSoon";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/register-exam"
        element={
          <ProtectedRoute>
            <RegisterExam />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mock-tests"
        element={
          <ProtectedRoute>
            <MockTests />
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <ComingSoon title="AI Analytics" description="Explore detailed performance insights and exam trends." />
          </ProtectedRoute>
        }
      />

      <Route
        path="/rank-predictor"
        element={
          <ProtectedRoute>
            <ComingSoon title="Rank Predictor" description="Estimate your expected rank with AI-assisted predictions." />
          </ProtectedRoute>
        }
      />

      <Route
        path="/college-predictor"
        element={
          <ProtectedRoute>
            <ComingSoon title="College Predictor" description="Discover the best-fit colleges based on your profile and performance." />
          </ProtectedRoute>
        }
      />

      <Route
        path="/predictor"
        element={
          <ProtectedRoute>
            <ComingSoon title="Predictor" description="Compare rank and college prediction tools in one place." />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <ComingSoon title="Notifications" description="Stay updated with the latest announcements and exam updates." />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;