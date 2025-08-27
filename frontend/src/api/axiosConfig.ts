import axios from "axios";
import {toast} from "sonner";

// Create axios instance with default config
const axiosInstance = axios.create({
  timeout: 30000 // 30 seconds timeout
});

// Request interceptor (optional - for logging requests)
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add request logging here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - automatically handles errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Return successful responses as-is
    return response;
  },
  (error) => {
    // Handle different types of errors
    let errorMessage = "An unexpected error occurred";

    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data;

      errorMessage = data?.message || data?.detail || `Error ${status}`;
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = "Network error - please check your connection";
    } else {
      // Something else happened
      errorMessage = error.message || "An unexpected error occurred";
    }

    // Show toast notification
    toast.error("Error", {
      duration: 5000,
      description: errorMessage
    });

    // Log error for debugging (optional)
    console.error("API Error:", {
      message: errorMessage,
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data
    });

    // Reject the promise so the calling code can still handle it if needed
    return Promise.reject(error);
  }
);

export default axiosInstance;
