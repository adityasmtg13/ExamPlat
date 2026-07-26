import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

import RegistrationForm from "../components/RegistrationForm";
import RegistrationHistory from "../components/RegistrationHistory";

import { getProfile } from "../services/profileService";
import {
  createRegistration,
  getRegistrationHistory,
} from "../services/registrationService";

function RegisterExam() {
  const [student, setStudent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setPageLoading(true);

      const profile = await getProfile();
      const history = await getRegistrationHistory();

      setStudent(profile.student || profile);

      setRegistrations(
        history.registrations || history || []
      );
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "Failed to load registration details."
      );
    } finally {
      setPageLoading(false);
    }
  };

  const handleRegister = async (examType) => {
    try {
      setLoading(true);

      const response = await createRegistration(examType);

      alert(response.message);

      const history = await getRegistrationHistory();

      setRegistrations(
        history.registrations || history || []
      );
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="bg-white rounded-3xl shadow-md border border-gray-200 p-8">

          <h1 className="text-3xl md:text-4xl font-bold text-[#103f7c]">
            Register for Examination
          </h1>

          <p className="text-gray-600 mt-2">
            Complete your examination registration below.
          </p>

          {pageLoading ? (
            <div className="py-20 text-center text-lg font-semibold">
              Loading...
            </div>
          ) : (
            <>
              <div className="mt-8">
                <RegistrationForm
                  student={student}
                  loading={loading}
                  onRegister={handleRegister}
                />
              </div>

              <div className="mt-10">
                <RegistrationHistory
                  registrations={registrations}
                />
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default RegisterExam;