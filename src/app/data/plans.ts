import * as m from "../../paraglide/messages.js";

export type PlanSlug = "minimum" | "standard" | "best";

export interface PricingPlan {
  slug: PlanSlug;
  label: string;
  price: string;
  commitment: string;
  description: string;
  highlight: string | null;
  guaranteeNote: string | null;
  features: string[];
  featured: boolean;
}

export function getPricingPlans(): PricingPlan[] {
  return [
    {
      slug: "minimum",
      label: m.plan_minimum_label(),
      price: m.plan_minimum_price(),
      commitment: m.plan_minimum_commitment(),
      description: m.plan_minimum_description(),
      highlight: null,
      guaranteeNote: m.plan_minimum_guarantee_note(),
      features: [
        m.plan_minimum_feature_1(),
        m.plan_minimum_feature_2(),
        m.plan_minimum_feature_3(),
        m.plan_minimum_feature_4(),
        m.plan_minimum_feature_5(),
      ],
      featured: false,
    },
    {
      slug: "standard",
      label: m.plan_standard_label(),
      price: m.plan_standard_price(),
      commitment: m.plan_standard_commitment(),
      description: m.plan_standard_description(),
      highlight: m.plan_standard_highlight(),
      guaranteeNote: null,
      features: [
        m.plan_standard_feature_1(),
        m.plan_standard_feature_2(),
        m.plan_standard_feature_3(),
        m.plan_standard_feature_4(),
        m.plan_standard_feature_5(),
      ],
      featured: false,
    },
    {
      slug: "best",
      label: m.plan_best_label(),
      price: m.plan_best_price(),
      commitment: m.plan_best_commitment(),
      description: m.plan_best_description(),
      highlight: m.plan_best_highlight(),
      guaranteeNote: null,
      features: [
        m.plan_best_feature_1(),
        m.plan_best_feature_2(),
        m.plan_best_feature_3(),
        m.plan_best_feature_4(),
        m.plan_best_feature_5(),
        m.plan_best_feature_6(),
      ],
      featured: true,
    },
  ];
}

/** @deprecated Use getPricingPlans() for i18n support */
export const pricingPlans = getPricingPlans();

export function getPlanBySlug(slug?: string) {
  const plans = getPricingPlans();
  if (!slug) return plans[0];
  const plan = plans.find((item) => item.slug === slug);
  return plan ?? plans[0];
}
