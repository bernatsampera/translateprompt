import {type UserDetails} from "@/api/userApi";

/**
 * Format subscription status for display
 */
export const formatSubscriptionStatus = (
  status: UserDetails["subscription_status"]
): string => {
  if (!status) return "Not set";
  return status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

/**
 * Format quota usage with percentage
 */
export const formatQuotaUsage = (used: number, limit: number): string => {
  const percentage = limit > 0 ? Math.round((used / limit) * 100) : 0;
  return `${used.toLocaleString()} / ${limit.toLocaleString()} (${percentage}%)`;
};

/**
 * Get subscription status badge styles
 */
export const getSubscriptionStatusBadgeStyle = (
  status: UserDetails["subscription_status"]
): string => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

/**
 * Check if user needs upgrade (free tier or no subscription)
 */
export const needsUpgrade = (user: UserDetails): boolean => {
  return (
    !user.subscription_status ||
    user.subscription_status === "free_tier" ||
    user.subscription_status === "cancelled"
  );
};

/**
 * Check if user can upgrade (has active subscription but could get more)
 */
export const canUpgrade = (user: UserDetails): boolean => {
  return user.subscription_status === "active" && user.quota_limit < 2000000; // Assuming 2M is max
};

/**
 * Get quota usage percentage
 */
export const getQuotaUsagePercentage = (
  used: number,
  limit: number
): number => {
  return limit > 0 ? Math.round((used / limit) * 100) : 0;
};

/**
 * Check if quota is running low (>80%)
 */
export const isQuotaRunningLow = (used: number, limit: number): boolean => {
  return getQuotaUsagePercentage(used, limit) > 80;
};
