import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import RegisterExam from "./pages/RegisterExam";
import MockTests from "./pages/MockTests";
import MockTestsJEE from "./pages/MockTestsJEE";
import MockTestsNEET from "./pages/MockTestsNEET";
import ComingSoon from "./pages/ComingSoon";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import ScrollToTop from "./components/ScrollToTop";

// Payment Pages
import Payment from "./pages/Payment";
import MockUPIPayment from "./pages/MockUPIPayment";
import MockQRCode from "./pages/MockQRCode";
import MockCardPayment from "./pages/MockCardPayment";
import PaymentSuccess from "./pages/PaymentSuccess";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

// Mock Test Pages
import MockInstructions from "./pages/MockInstructions";
import MockExam from "./pages/MockExam";
import MockResult from "./pages/MockResult";
import Marks from "./pages/Marks";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import Settings from "./pages/Settings";
import AuditLogs from "./pages/AuditLogs";

function App() {
  return (
    <>
      <ScrollToTop />

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
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
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
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
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
          path="/mock-test/instructions/:testId"
          element={<MockInstructions />}
        />

        <Route path="/mock-test/exam/:attemptId" element={<MockExam />} />

        <Route
          path="/mock-test/result/:attemptId"
          element={
            <ProtectedRoute>
              <MockResult />
            </ProtectedRoute>
          }
        />

        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

        {/* Payment Routes */}
        <Route
          path="/payment/:registrationId"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment/upi"
          element={
            <ProtectedRoute>
              <MockUPIPayment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment/qr"
          element={
            <ProtectedRoute>
              <MockQRCode />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment/card"
          element={
            <ProtectedRoute>
              <MockCardPayment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment/success"
          element={
            <ProtectedRoute>
              <PaymentSuccess />
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
          path="/mock-tests/jee"
          element={
            <ProtectedRoute>
              <MockTestsJEE />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mock-tests/neet"
          element={
            <ProtectedRoute>
              <MockTestsNEET />
            </ProtectedRoute>
          }
        />

        <Route
          path="/marks"
          element={
            <ProtectedRoute>
              <Marks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rank-predictor"
          element={
            <ProtectedRoute>
              <Navigate to="/analytics" replace />
            </ProtectedRoute>
          }
        />

        <Route
          path="/college-predictor"
          element={
            <ProtectedRoute>
              <Navigate to="/analytics" replace />
            </ProtectedRoute>
          }
        />

        <Route
          path="/predictor"
          element={
            <ProtectedRoute>
              <Navigate to="/analytics" replace />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <ComingSoon
                title="Notifications"
                description="Stay updated with the latest announcements and exam updates."
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/audit-logs"
          element={
            <ProtectedRoute>
              <AuditLogs />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;