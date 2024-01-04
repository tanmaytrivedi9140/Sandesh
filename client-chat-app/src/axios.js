// src/axios.js

import axios from "axios";

// Create an Axios instance with a base URL
const api = axios.create({
  baseURL: "/api", // This assumes that your requests start with '/api' due to the proxy configuration
  timeout: 5000, // Adjust this as needed
});

// Interceptors (optional): You can add interceptors for request and response handling

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can modify the request config here (e.g., add headers)
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // You can modify the response here (e.g., handle errors)
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
