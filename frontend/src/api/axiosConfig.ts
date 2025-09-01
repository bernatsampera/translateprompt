import axios from "axios";
import {toast} from "sonner";

// Create axios instance with default config
const axiosInstance = axios.create({
  timeout: 30000, // 30 seconds timeout,
  withCredentials: true // Include cookies in requests for SuperTokens authentication
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
    // console.log("axiosconfig error", error);
    // Handle different types of errors
    let errorMessage = "An unexpected error occurred";

    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data;
      // console.log("error.response", error.response);

      if (status === 401) {
        // Show a more appealing toast with an action button for 401 errors
        toast.error("Authentication Required", {
          duration: 8000,
          description:
            "Create your personal glossary and unlock advanced features by signing up or logging in.",
          action: {
            label: "Sign In",
            onClick: () => {
              window.location.href = "/auth";
            }
          }
        });
        return Promise.reject(error); // Return early to avoid the generic toast below
      }

      // Handle different error response formats
      if (typeof data === "string") {
        errorMessage = data;
      } else if (data?.detail) {
        errorMessage = data.detail;
      } else if (data?.message) {
        errorMessage = data.message;
      } else if (data?.error) {
        errorMessage = data.error;
      } else {
        errorMessage = `Error ${status}: ${JSON.stringify(data)}`;
      }
      errorMessage = JSON.stringify(data); // kind of hacky to be able to render when the errorMessage is an object
    } else if (error.request) {
      // Request was made but no response received
      // console.log("error.request", error.request);

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
