import { useEffect, useState } from "react";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import {
  getProfile,
  updateProfile,
  uploadProfilePhoto,
} from "../services/profileService";

function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    alternateEmail: "",
    aadhaar: "",
    fatherName: "",
    fatherPhone: "",
    motherName: "",
    motherPhone: "",
    dob: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    stream: "",
    studentClass: "",
    school: "",
    profilePhoto: "",
  });

  const [loading, setLoading] = useState(true);

  async function fetchProfile() {
    try {
      const res = await getProfile();

      setProfile(res.student);

      localStorage.setItem("student", JSON.stringify(res.student));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePhoto = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      const res = await uploadProfilePhoto(file);

      setProfile(res.student);

      localStorage.setItem(
        "student",
        JSON.stringify(res.student)
      );

      toast.success("Profile Photo Updated");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Photo upload failed.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await updateProfile(profile);

      setProfile(res.student);

      localStorage.setItem(
        "student",
        JSON.stringify(res.student)
      );

      toast.success("Profile Updated Successfully");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Update Failed");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-[80vh]">
          <h2 className="text-2xl font-semibold">
            Loading Profile...
          </h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 py-10">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">

          <h1 className="text-3xl font-bold mb-8 text-center">
            Student Profile
          </h1>

          <div className="flex flex-col items-center mb-10">
            <img
                src={
                    profile.profilePhoto
                        ? profile.profilePhoto
                        : "https://via.placeholder.com/150"
                }
                alt="Profile"
                className="w-40 h-40 rounded-full object-cover border-4 border-blue-600 shadow-md"
            />

            <label className="inline-block mt-4">
                <input
                    type="file"
                    className="hidden"
                    onChange={handlePhoto}
                />

                <span className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition shadow">
                    📷 Change Profile Photo
                </span>
            </label>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >

            <input
              name="name"
              value={profile.name}
              disabled
              className="border p-3 rounded bg-gray-100"
            />

            <input
              name="email"
              value={profile.email}
              disabled
              className="border p-3 rounded bg-gray-100"
            />

            <input
              name="phone"
              value={profile.phone || ""}
              onChange={handleChange}
              placeholder="Phone"
              className="border p-3 rounded"
            />

            <input
              name="alternateEmail"
              value={profile.alternateEmail || ""}
              onChange={handleChange}
              placeholder="Alternate Email"
              className="border p-3 rounded"
            />

            <input
              name="aadhaar"
              value={profile.aadhaar || ""}
              onChange={handleChange}
              placeholder="Aadhaar Number"
              className="border p-3 rounded"
            />

            <input
              name="fatherName"
              value={profile.fatherName || ""}
              onChange={handleChange}
              placeholder="Father Name"
              className="border p-3 rounded"
            />

            <input
              name="fatherPhone"
              value={profile.fatherPhone || ""}
              onChange={handleChange}
              placeholder="Father Phone"
              className="border p-3 rounded"
            />

            <input
              name="motherName"
              value={profile.motherName || ""}
              onChange={handleChange}
              placeholder="Mother Name"
              className="border p-3 rounded"
            />

            <input
              name="motherPhone"
              value={profile.motherPhone || ""}
              onChange={handleChange}
              placeholder="Mother Phone"
              className="border p-3 rounded"
            />

            <input
              type="date"
              name="dob"
              value={profile.dob ? profile.dob.split("T")[0] : ""}
              onChange={handleChange}
              className="border p-3 rounded"
            />

            <select
              name="gender"
              value={profile.gender || ""}
              onChange={handleChange}
              className="border p-3 rounded"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <input
              name="address"
              value={profile.address || ""}
              onChange={handleChange}
              placeholder="Address"
              className="border p-3 rounded"
            />

            <input
              name="city"
              value={profile.city || ""}
              onChange={handleChange}
              placeholder="City"
              className="border p-3 rounded"
            />

            <input
              name="state"
              value={profile.state || ""}
              onChange={handleChange}
              placeholder="State"
              className="border p-3 rounded"
            />

            <input
              name="country"
              value={profile.country || ""}
              onChange={handleChange}
              placeholder="Country"
              className="border p-3 rounded"
            />

            <input
              name="pincode"
              value={profile.pincode || ""}
              onChange={handleChange}
              placeholder="Pincode"
              className="border p-3 rounded"
            />

            <select
              name="stream"
              value={profile.stream || ""}
              onChange={handleChange}
              className="border p-3 rounded"
            >
              <option value="">Select Stream</option>
              <option value="JEE">JEE</option>
              <option value="NEET">NEET</option>
            </select>

            <select
              name="studentClass"
              value={profile.studentClass || ""}
              onChange={handleChange}
              className="border p-3 rounded"
            >
              <option value="">Select Class</option>
              <option value="11">11</option>
              <option value="12">12</option>
              <option value="Dropper">Dropper</option>
            </select>

            <input
              name="school"
              value={profile.school || ""}
              onChange={handleChange}
              placeholder="School / College"
              className="border p-3 rounded md:col-span-2"
            />

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold md:col-span-2"
            >
              Save Changes
            </button>

          </form>

        </div>
      </div>
    </>
  );
}

export default Profile;