export const getStudent = () => {
  try {
    const stored = localStorage.getItem("student");
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export const setStudent = (student) => {
  try {
    if (student == null) {
      localStorage.removeItem("student");
    } else {
      localStorage.setItem("student", JSON.stringify(student));
    }
    window.dispatchEvent(new Event("studentUpdated"));
  } catch (error) {
    console.error("Failed to write student to storage", error);
  }
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const removeToken = () => {
  localStorage.removeItem("token");
};