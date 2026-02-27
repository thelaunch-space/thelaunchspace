export type GeoRegion = "IN" | "INTL";

export const GEO_COOKIE_NAME = "geo_region";
export const GEO_COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

interface AgentSavings {
  monthlySavings: string;
  costEquivalent: string;
}

export interface GeoPricing {
  pocPrice: number;
  pocDisplay: string;
  pocOriginalPrice?: string;
  growthPrice: number;
  growthDisplay: string;
  growthOriginalPrice?: string;
  pocCta: string;
  growthCta: string;
  growthLaunchLabel: string;
}

export interface GeoSavingsConfig {
  currencySymbol: string;
  totalMonthly: number;
  totalDisplay: string;
  pricing: GeoPricing;
  agents: Record<string, AgentSavings>;
  comparisonLine: string;
  rationale: string;
}

// Derived getters — computed from config, not hardcoded
export function getMultiplier(config: GeoSavingsConfig): string {
  return Math.floor(config.totalMonthly / config.pricing.pocPrice) + "x";
}

export function getPriceDisplay(config: GeoSavingsConfig): string {
  return config.pricing.pocDisplay;
}

const INTL_CONFIG: GeoSavingsConfig = {
  currencySymbol: "$",
  totalMonthly: 4000,
  totalDisplay: "$4K/mo",
  pricing: {
    pocPrice: 299,
    pocDisplay: "$299",
    pocOriginalPrice: undefined,
    growthPrice: 1500,
    growthDisplay: "$1,500",
    growthOriginalPrice: undefined,
    pocCta: "Set up my team — $299",
    growthCta: "Talk to us",
    growthLaunchLabel: "First month $750 · then $1,500/mo",
  },
  agents: {
    parthasarathi: {
      monthlySavings: "$200",
      costEquivalent: "Project coordination worth ~$200/mo",
    },
    vibhishana: {
      monthlySavings: "$1.5K",
      costEquivalent: "SEO strategy & research worth ~$1.5K/mo",
    },
    vyasa: {
      monthlySavings: "$2.5K",
      costEquivalent: "Content writing & SEO worth ~$2.5K/mo",
    },
    vidura: {
      monthlySavings: "$1K",
      costEquivalent: "SEO strategy & intelligence worth ~$1K/mo",
    },
    valmiki: {
      monthlySavings: "$3.5K",
      costEquivalent: "Replaces a $3.5K/month social media manager",
    },
    sanjaya: {
      monthlySavings: "$4K",
      costEquivalent: "Replaces a $4K/month lead researcher",
    },
  },
  comparisonLine:
    "A mid-tier US agency charges $3K–$5K/mo for 8 managed SEO blogs.",
  rationale:
    "Based on mid-tier US content agency rates. A fully managed SEO blog (strategy + keyword research + writing + on-page SEO) costs $300–$700/post. We use $500 as the mid-point. Sources: WebFX, Verblio, Siege Media pricing data.",
};

const IN_CONFIG: GeoSavingsConfig = {
  currencySymbol: "₹",
  totalMonthly: 64000,
  totalDisplay: "₹64K/mo",
  pricing: {
    pocPrice: 24999,
    pocDisplay: "₹24,999",
    pocOriginalPrice: undefined,
    growthPrice: 120000,
    growthDisplay: "₹1,20,000",
    growthOriginalPrice: undefined,
    pocCta: "Set up my team — ₹24,999",
    growthCta: "Talk to us",
    growthLaunchLabel: "First month ₹65,000 · then ₹1,20,000/mo",
  },
  agents: {
    parthasarathi: {
      monthlySavings: "₹5K",
      costEquivalent: "Project coordination worth ~₹5K/mo",
    },
    vibhishana: {
      monthlySavings: "₹25K",
      costEquivalent: "SEO strategy & research worth ~₹25K/mo",
    },
    vyasa: {
      monthlySavings: "₹35K",
      costEquivalent: "Content writing & SEO worth ~₹35K/mo",
    },
    vidura: {
      monthlySavings: "₹15K",
      costEquivalent: "SEO strategy & intelligence worth ~₹15K/mo",
    },
    valmiki: {
      monthlySavings: "₹50K",
      costEquivalent: "Replaces a ₹50K/month social media manager",
    },
    sanjaya: {
      monthlySavings: "₹60K",
      costEquivalent: "Replaces a ₹60K/month lead researcher",
    },
  },
  comparisonLine:
    "A mid-tier Indian agency charges ₹50K–₹1L/mo for 8 managed SEO blogs.",
  rationale:
    "Based on mid-tier Indian content agency rates. A fully managed SEO blog (strategy + keyword research + writing + on-page SEO) costs ₹5,000–₹10,000/post. We use ₹8,000 as the mid-point. Sources: Justwords, Content Whale, WittyPen, iTrobes pricing data.",
};

export function getGeoConfig(region: GeoRegion): GeoSavingsConfig {
  return region === "IN" ? IN_CONFIG : INTL_CONFIG;
}

// Per-blog package rate — what a mid-tier agency effectively charges
// per fully managed SEO blog (strategy + keyword research + writing + on-page SEO bundled in)
const PER_BLOG_RATE = {
  INTL: 500, // $500/blog — mid-tier US agency effective rate
  IN: 8000, // ₹8,000/blog — mid-tier Indian agency effective rate
};

// Hours per blog — covers research, strategy, writing, SEO optimization, coordination
const HOURS_PER_BLOG = 25;

export function calculateCostSaved(
  stats: { questions: number; briefs: number; blogs: number },
  region: GeoRegion
): number {
  return stats.blogs * PER_BLOG_RATE[region];
}

export function calculateHoursSaved(stats: {
  questions: number;
  briefs: number;
  blogs: number;
}): number {
  return stats.blogs * HOURS_PER_BLOG;
}

export function formatCurrency(amount: number, region: GeoRegion): string {
  if (region === "IN") {
    return "₹" + amount.toLocaleString("en-IN");
  }
  return "$" + amount.toLocaleString("en-US");
}
