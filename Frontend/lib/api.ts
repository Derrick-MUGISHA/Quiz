import axios from "axios";

// Base API instance
const api = axios.create({
  baseURL: "https://quiz-2-sb0l.onrender.com/auth/api",
  withCredentials: true,
});

export default api;
