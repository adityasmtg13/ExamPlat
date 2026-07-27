import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import RegisterExam from "./pages/RegisterExam";
import MockTests from "./pages/MockTests";
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
import Analytics from "./pages/Analytics";

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
          path="/mock-test/instructions/:registrationId"
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
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rank-predictor"
          element={
            <ProtectedRoute>
              <ComingSoon
                title="Rank Predictor"
                description="Estimate your expected rank with AI-assisted predictions."
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/college-predictor"
          element={
            <ProtectedRoute>
              <ComingSoon
                title="College Predictor"
                description="Discover the best-fit colleges based on your profile and performance."
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/predictor"
          element={
            <ProtectedRoute>
              <ComingSoon
                title="Predictor"
                description="Compare rank and college prediction tools in one place."
              />
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
      </Routes>
    </>
  );
}

export default App;