import axiosInstance from "./axiosConfig";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const USER_BASE_URL = `${BASE_URL}/user`;

export interface UserDetails {
  user_id: string;
  token_count: number;
  lemonsqueezy_customer_id: string | null;
  subscription_status: "active" | "cancelled" | "free_tier" | null;
  quota_limit: number;
  quota_used: number;
  billing_portal_url: string | null;
}

export const getUserDetails = async () => {
  const response = await axiosInstance.get(`${USER_BASE_URL}/details`);
  return response.data;
};
