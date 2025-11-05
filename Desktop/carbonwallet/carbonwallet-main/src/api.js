// src/api.js
import axios from 'axios';

// ✅ Create axios instance
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // your backend base URL
});

// ✅ Intercept requests to include JWT token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API; // <-- must be default export
