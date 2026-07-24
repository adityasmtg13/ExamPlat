import axios from "axios";

const API = "http://localhost:5000/api/profile";

// Get JWT Token
const getToken = () => {
  return localStorage.getItem("token");
};

// Authorization Header
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// Get Profile
export const getProfile = async () => {
  const response = await axios.get(API, authHeader());
  return response.data;
};

// Update Profile
export const updateProfile = async (profileData) => {
  const response = await axios.put(API, profileData, authHeader());
  return response.data;
};

// Upload Profile Photo
export const uploadProfilePhoto = async (imageFile) => {
  const formData = new FormData();

  formData.append("profilePhoto", imageFile);

  const response = await axios.post(
    `${API}/upload-photo`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// Delete Profile Photo
export const deleteProfilePhoto = async () => {
  const response = await axios.delete(
    `${API}/photo`,
    authHeader()
  );

  return response.data;
};