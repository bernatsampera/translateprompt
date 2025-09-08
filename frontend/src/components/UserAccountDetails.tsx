import {type UserDetails} from "@/api/userApi";
import {
  formatQuotaUsage,
  formatSubscriptionStatus,
  getQuotaUsagePercentage,
  getSubscriptionStatusBadgeStyle,
  isQuotaRunningLow
} from "@/utils/userUtils";
import React from "react";

interface UserAccountDetailsProps {
  user: UserDetails;
  email: string;
}

const UserAccountDetails: React.FC<UserAccountDetailsProps> = ({
  user,
  email
}) => {
  const quotaPercentage = getQuotaUsagePercentage(
    user.quota_used,
    user.quota_limit
  );
  const quotaLow = isQuotaRunningLow(user.quota_used, user.quota_limit);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">
        Account Details
      </h3>

      <div className="space-y-4">
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="font-medium text-gray-700">Email</span>
          <span className="text-gray-600 font-mono text-sm">{email}</span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="font-medium text-gray-700">Subscription Status</span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getSubscriptionStatusBadgeStyle(
              user.subscription_status
            )}`}
          >
            {formatSubscriptionStatus(user.subscription_status)}
          </span>
        </div>

        <div className="py-2 border-b border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-gray-700">Quota Usage</span>
            <span
              className={`text-gray-900 ${
                quotaLow ? "font-semibold text-amber-600" : ""
              }`}
            >
              {formatQuotaUsage(user.quota_used, user.quota_limit)}
            </span>
          </div>

          {user.quota_limit > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  quotaLow ? "bg-amber-500" : "bg-blue-500"
                }`}
                style={{width: `${Math.min(quotaPercentage, 100)}%`}}
              />
            </div>
          )}

          {quotaLow && (
            <p className="text-xs text-amber-600 mt-1">
              You're running low on tokens. Consider upgrading your plan.
            </p>
          )}
        </div>

        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="font-medium text-gray-700">Customer ID</span>
          <span className="text-gray-600 font-mono text-sm">
            {user.lemonsqueezy_customer_id || "Free Tier"}
          </span>
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="font-medium text-gray-700">Billing Portal</span>
          <div>
            {user.billing_portal_url ? (
              <a
                href={user.billing_portal_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
              >
                Manage Billing
              </a>
            ) : (
              <span className="text-gray-500 text-sm">Not available</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAccountDetails;
