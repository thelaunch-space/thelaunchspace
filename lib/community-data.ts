/**
 * Community reasoning data for the Launch Control communities table.
 * Maps subreddit names to strategic reasons why they're monitored.
 */

export const COMMUNITY_REASONS: Record<string, string> = {
  "r/startups": "High concentration of early-stage founders discussing launch strategies",
  "r/smallbusiness": "Small business owners actively seeking automation and operational efficiency",
  "r/SaaS": "SaaS founders actively seeking content marketing and SEO solutions",
  "r/entrepreneur": "Entrepreneurs exploring growth tactics, many fit the non-technical founder ICP",
  "r/nocode": "Non-technical founders exploring AI tools — strong ICP overlap",
  "r/webdev": "Developers and founders discussing web presence, SEO, and content strategy",
  "r/SEO": "SEO practitioners and business owners looking for content-driven growth",
  "r/digital_marketing": "Marketers discussing content automation and AI-driven workflows",
  "r/growmybusiness": "Business owners actively looking for growth solutions and services",
  "r/Blogging": "Content creators seeking AI writing tools and publishing workflows",
  "r/content_marketing": "Content marketers exploring AI-assisted content production at scale",
  "r/artificial": "AI enthusiasts and early adopters discussing practical AI applications",
  "r/OpenAI": "AI-curious founders evaluating tools for business automation",
  "r/ChatGPT": "Broad AI user base exploring practical business applications of LLMs",
  "r/solopreneur": "Solo founders who need AI employees most — limited time, unlimited tasks",
  "r/indiehackers": "Bootstrapped founders building products, strong overlap with target ICP",
};

export const DEFAULT_COMMUNITY_REASON = "Monitored for ICP-relevant discussions and content opportunities";

export const PLACEHOLDER_COMMUNITIES = [
  { name: "r/startups", count: 87, reason: "High concentration of early-stage founders discussing launch strategies" },
  { name: "r/smallbusiness", count: 64, reason: "Small business owners actively seeking automation and operational efficiency" },
  { name: "r/SaaS", count: 51, reason: "SaaS founders actively seeking content marketing and SEO solutions" },
  { name: "r/entrepreneur", count: 43, reason: "Entrepreneurs exploring growth tactics, many fit the non-technical founder ICP" },
  { name: "r/nocode", count: 38, reason: "Non-technical founders exploring AI tools — strong ICP overlap" },
  { name: "r/webdev", count: 29, reason: "Developers and founders discussing web presence, SEO, and content strategy" },
];

export function getCommunityReason(subreddit: string): string {
  return COMMUNITY_REASONS[subreddit] ?? DEFAULT_COMMUNITY_REASON;
}
