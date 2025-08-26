import axios from "axios";

// Base API instance
const api = axios.create({
  baseURL: "http://localhost:5000/auth/api",
  withCredentials: true,
});

export default api;
