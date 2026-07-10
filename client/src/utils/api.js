import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});
API.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ===================== AUTH =====================

export const registerUser = (userData) =>
  API.post("/auth/register", userData);

export const loginUser = (userData) =>
  API.post("/auth/login", userData);

// ==================== COURSES ====================

export const generateCourse = (topic) =>
  API.post("/courses/generate", { topic });

export const getAllCourses = () =>
  API.get("/courses");

export const getCourse = (id) =>
  API.get(`/courses/${id}`);

export const deleteCourse = (id) =>
  API.delete(`/courses/${id}`);

// ==================== LESSONS ====================

export const getLesson = (id) =>
  API.get(`/lessons/${id}`);

export const generateLesson = (id) =>
  API.post(`/lessons/${id}/generate`);

export default API;