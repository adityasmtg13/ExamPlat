import { Navigate, useLocation } from "react-router-dom";
import { getStudent, getToken } from "../storage";
import { isProfileComplete } from "../utils/profileUtils";

function ProtectedRoute({ children }) {
  const token = getToken();
  const student = getStudent();
  const location = useLocation();

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