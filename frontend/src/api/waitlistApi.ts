import axiosInstance from "./axiosConfig";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const WAITLIST_BASE_URL = `${BASE_URL}/waitlist`;

export const addToWaitlist = async (email: string) => {
  const response = await axiosInstance.post(`${WAITLIST_BASE_URL}/add`, {
    email
  });
  return response.data;
};
