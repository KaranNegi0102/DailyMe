import axios from "axios";

// Configure axios defaults
axios.defaults.withCredentials = true;

// Create a configured axios instance
const api = axios.create({
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
