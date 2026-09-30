import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || "",
  headers: { "Content-Type": "application/json" },
  timeout: 120000,
});

export default api;
