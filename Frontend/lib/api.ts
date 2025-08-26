import axios from "axios";

// Base API instance
const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL_Auth}/auth/api`,
  withCredentials: true,
});

export default api;
