export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  quota: number;
  features: string[];
  checkoutUrl: string;
  popular?: boolean;
}

// Note: Replace these URLs with your actual LemonSqueezy checkout URLs
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "pro",
    name: "Pro",
    price: "$7/month",
    quota: 500000,
    features: [
      "500K tokens per month",
      "Advanced translation features",
      "Custom glossaries",
      "Language rules",
      "Priority support"
    ],
    checkoutUrl:
      "https://translate-prompt.lemonsqueezy.com/buy/bfa7d2b2-37d3-4b87-873f-49ed84f29c61",
    popular: true
  },
  {
    id: "power",
    name: "Power User",
    price: "$22/month",
    quota: 2000000,
    features: [
      "2M tokens per month",
      "Everything in Pro",
      "Advanced AI models",
      "Custom integrations",
      "Dedicated support"
    ],
    checkoutUrl:
      "https://translate-prompt.lemonsqueezy.com/buy/POWER_USER_PRODUCT_ID"
  }
];

/**
 * Get checkout URL with user ID parameter
 */
export const getCheckoutUrl = (
  plan: SubscriptionPlan,
  userId: string
): string => {
  return `${plan.checkoutUrl}?checkout[custom][user_id]=${userId}`;
};

/**
 * Get recommended plan based on user's current quota usage
 */
export const getRecommendedPlan = (
  currentQuota: number,
  currentUsage: number
): SubscriptionPlan | null => {
  // If using >80% of quota, recommend upgrade
  const usagePercentage =
    currentQuota > 0 ? (currentUsage / currentQuota) * 100 : 0;

  if (usagePercentage > 80) {
    // Find the next tier up
    const currentPlan = SUBSCRIPTION_PLANS.find(
      (plan) => plan.quota >= currentQuota
    );
    const currentIndex = currentPlan
      ? SUBSCRIPTION_PLANS.indexOf(currentPlan)
      : -1;

    if (currentIndex < SUBSCRIPTION_PLANS.length - 1) {
      return SUBSCRIPTION_PLANS[currentIndex + 1];
    }
  }

  return null;
};
