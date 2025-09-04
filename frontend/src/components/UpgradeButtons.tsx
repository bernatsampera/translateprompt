import {type UserDetails} from "@/api/userApi";
import {
  SUBSCRIPTION_PLANS,
  getCheckoutUrl,
  getRecommendedPlan
} from "@/config/subscriptionPlans";
import {canUpgrade, isQuotaRunningLow, needsUpgrade} from "@/utils/userUtils";
import React from "react";

interface UpgradeButtonsProps {
  user: UserDetails;
}

const UpgradeButtons: React.FC<UpgradeButtonsProps> = ({user}) => {
  const showUpgradeOptions = needsUpgrade(user) || canUpgrade(user);
  const recommendedPlan = getRecommendedPlan(user.quota_limit, user.quota_used);
  const quotaLow = isQuotaRunningLow(user.quota_used, user.quota_limit);

  if (!showUpgradeOptions) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6 mt-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {needsUpgrade(user) ? "Upgrade Your Plan" : "Increase Your Quota"}
        </h3>

        {quotaLow && (
          <p className="text-amber-700 text-sm font-medium mb-2">
            ⚠️ You're running low on tokens (
            {Math.round((user.quota_used / user.quota_limit) * 100)}% used)
          </p>
        )}

        {recommendedPlan && (
          <p className="text-blue-700 text-sm mb-4">
            📈 Based on your usage, we recommend the{" "}
            <strong>{recommendedPlan.name}</strong> plan
          </p>
        )}

        <p className="text-gray-600 text-sm">
          Choose a plan that fits your translation needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isRecommended = recommendedPlan?.id === plan.id;
          const isCurrentOrLower = user.quota_limit >= plan.quota;

          // Don't show plans that are lower than current
          if (isCurrentOrLower && user.subscription_status === "active") {
            return null;
          }

          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                isRecommended
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : plan.popular
                  ? "border-green-500"
                  : "border-gray-200"
              }`}
            >
              {(isRecommended || plan.popular) && (
                <div
                  className={`absolute -top-2 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium ${
                    isRecommended
                      ? "bg-blue-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {isRecommended ? "Recommended" : "Popular"}
                </div>
              )}

              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                  {plan.name}
                </h4>
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.price}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  {plan.quota.toLocaleString()} tokens/month
                </p>
              </div>

              <ul className="text-sm text-gray-600 mb-4 space-y-1">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href={getCheckoutUrl(plan, user.user_id)}
                className={`block w-full text-center py-2 px-4 rounded-md font-medium transition-colors ${
                  isRecommended || plan.popular
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                }`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {needsUpgrade(user) ? "Get Started" : "Upgrade"}
              </a>
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Secure checkout powered by LemonSqueezy • Cancel anytime
        </p>
      </div>
    </div>
  );
};

export default UpgradeButtons;
