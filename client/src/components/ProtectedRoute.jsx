import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { getStudent, getToken } from "../storage";
import { isProfileComplete } from "../utils/profileUtils";

function ProtectedRoute({ children }) {
  const token = getToken();
  const student = getStudent();
  const location = useLocation();

  useEffect(() => {
    if (!token || isProfileComplete(student) || ["/profile"].includes(location.pathname)) {
      return;
    }

    const pageName = location.pathname.startsWith("/dashboard")
      ? "Dashboard"
      : location.pathname.startsWith("/register-exam")
        ? "Registration"
        : location.pathname.startsWith("/mock-test") || location.pathname.startsWith("/mock-tests")
          ? "Mock Tests"
          : location.pathname.startsWith("/payment")
            ? "Payments"
            : location.pathname.startsWith("/marks")
              ? "Marks"
              : location.pathname.startsWith("/analytics") || location.pathname.startsWith("/predictor") || location.pathname.startsWith("/rank-predictor") || location.pathname.startsWith("/college-predictor")
                ? "Analytics"
                : "this page";

    toast.info(`Please complete your profile to access ${pageName}.`, {
      duration: 3000,
    });
  }, [location.pathname, student, token]);

  // Not logged in
  if (!token) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  const publicProfileRoutes = ["/profile"];

  // Logged in but profile not completed
  if (
    !isProfileComplete(student) &&
    !publicProfileRoutes.includes(location.pathname)
  ) {
    return (
      <Navigate
        to="/profile"
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;