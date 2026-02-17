# Cost Savings Research — Blog Content Pipeline

> **Created:** 2026-02-17
> **Purpose:** Data-backed cost research for the "Cost Saved" numbers on `/hire-your-24x7-team` pitch page and Launch Control dashboard. Credibility is critical — every number must be traceable to real sources.
> **Status:** RESEARCH COMPLETE — awaiting Krishna's review and decision on implementation approach.

---

## Table of Contents

1. [Roles Needed for a Blog Content Pipeline](#1-roles-needed-for-a-blog-content-pipeline)
2. [Agent Coverage Map — What Our Agents Replace](#2-agent-coverage-map)
3. [Gaps — What the Agents Don't Cover Yet](#3-gaps)
4. [India Market Costs](#4-india-market-costs)
5. [US/International Market Costs](#5-usinternational-market-costs)
6. [Side-by-Side Summary](#6-side-by-side-summary)
7. [Current Numbers on the Site vs. Research-Backed Numbers](#7-current-vs-research-backed)
8. [Recommended Numbers for the Landing Page](#8-recommended-numbers)
9. [Implementation Direction](#9-implementation-direction)
10. [All Sources](#10-all-sources)

---

## 1. Roles Needed for a Blog Content Pipeline

To produce 20-25 high-quality SEO blog posts per month (what our 3 agents do), a startup would traditionally need these human roles:

| # | Role | What They Do | Hours/Month | Full-Time or Part-Time? |
|---|------|-------------|-------------|------------------------|
| 1 | **Content/SEO Strategist** | Plans topics, keyword clusters, content calendar, editorial direction, competitive gap analysis | 20-30 hrs | Part-time |
| 2 | **Market/Community Researcher** | Scans Reddit, Quora, forums for ICP questions and pain points. Filters signal from noise. | 30-40 hrs | Part-time |
| 3 | **SEO Keyword Researcher** | Search volume, keyword difficulty, ranking potential, AI citation opportunities | 25-35 hrs | Part-time (often same person as #1) |
| 4 | **Research Brief Writer** | Takes validated topics → comprehensive briefs with angle, outline, sources, competitive positioning | 40-50 hrs | Full-time at 90 briefs/mo |
| 5 | **Blog Writer** | Takes brief → full 1,500-3,000 word SEO blog post with brand voice, research, citations | 80-120 hrs | Full-time (heaviest role) |
| 6 | **SEO On-Page Optimizer** | Meta titles/descriptions, JSON-LD, OpenGraph, heading hierarchy, internal linking | 10-15 hrs | Part-time (often same person as writer) |
| 7 | **Editor / Quality Reviewer** | Reviews each post for accuracy, voice, quality. Approves or requests revisions. | 15-25 hrs | Part-time |
| 8 | **Web Dev / CMS Manager** | Formats, publishes, maintains blog infrastructure, handles deployments | 10-15 hrs | Part-time |
| 9 | **Project Manager / Ops** | Coordinates team, tracks pipeline status, manages deadlines, runs health checks | 15-20 hrs | Part-time |

**Total human hours needed: 245-350 hours/month**
**Minimum realistic team: 3-4 people (2 full-time + 1-2 part-time contractors)**

---

## 2. Agent Coverage Map

How our 3 active OpenClaw agents map to these roles:

| Role | Agent | Coverage Level | Notes |
|------|-------|---------------|-------|
| Content/SEO Strategist | Vibhishana + config files | **PARTIAL** | Strategy is hardcoded in SOUL.md files. No agent dynamically adjusts strategy based on what's working. |
| Market/Community Researcher | Vibhishana | **FULL** (Reddit) | Core function. 9AM daily Reddit scan + question extraction. **Gap:** Only Reddit — no Quora, LinkedIn groups, HN, Indie Hackers, Facebook groups. |
| SEO Keyword Researcher | Vibhishana | **FULL** (qualitative) | Each brief includes keyword research, competitive gap analysis, AI citation opportunities. **Gap:** No Ahrefs/SEMrush for exact search volume/difficulty scores. |
| Research Brief Writer | Vibhishana | **FULL** | ~3 briefs/day (11AM, 2PM, 5PM). 5-part strategic structure. Quality threshold enforced. |
| Blog Writer | Vyasa | **FULL** | Picks best brief, deep research via web_search, writes full TSX blog with Tailwind, submits GitHub PR. |
| SEO On-Page Optimizer | Vyasa + page template | **FULL** | Meta tags, JSON-LD, OpenGraph, heading hierarchy all baked into the blog template. Sitemap auto-generated. |
| Editor / Quality Reviewer | **Krishna (manual)** | **NONE** from agents | Krishna manually reviews every PR. No automated quality gate. |
| Web Dev / CMS Manager | Vyasa (PR) + Netlify | **PARTIAL** | Vyasa creates file + submits PR. Krishna merges. Netlify auto-deploys. Infrastructure maintained by Claude Code. |
| Project Manager / Ops | Parthasarathi | **PARTIAL** | 4x daily health checks + 7PM due diligence. Coordinates via Slack. But no active bottleneck identification or capacity planning. |

**What the 3 agents cover: ~200-280 hours/month of human-equivalent work**
**What remains manual: ~60-80 hours/month (editorial review, PR merging, infrastructure)**

---

## 3. Gaps

Roles where NO agent currently covers the work. These are real gaps in the pipeline — not just nice-to-haves.

| Gap | What's Missing | Impact | Hours/Month if Hired |
|-----|---------------|--------|---------------------|
| **Graphic Design** | All blogs share the same generic OG image. No custom featured images, infographics, or illustrations. | Lower CTR on social shares and Google Discover. Posts look identical when shared. | 20-30 hrs |
| **Content Distribution** | Blogs published but not promoted anywhere. No social sharing, no Reddit engagement, no newsletter. | Organic search is the only discovery channel. New blogs with no backlinks/social signals take months to rank. | 30-40 hrs |
| **Analytics & Performance** | No tracking of which blogs rank, drive traffic, or get cited by AI tools. | No feedback loop. System can't learn what content works. Flying blind. | 15-20 hrs |
| **Content Refreshing** | Published blogs never updated. Stats, links, tool references go stale. | Domain authority decay as content ages. Google rewards freshness, especially in AI tools space. | 10-15 hrs |
| **Link Building / Outreach** | No outreach for backlinks. No guest posting, broken link opportunities, resource page submissions. | Backlinks are the #1 ranking factor for new domains. Without them, even great content won't rank for competitive keywords. | 20-30 hrs |
| **Email Marketing** | Lead capture exists but no nurture sequences or newsletter. | Captured leads go cold. No re-engagement. Blog content not leveraged for email. | 10-15 hrs |

**Total gap hours: 105-150 hours/month**

---

## 4. India Market Costs

Exchange rate used: **1 USD = 83 INR**

### Role-by-Role Breakdown

#### Content/SEO Strategist

| Hiring Model | Monthly Cost (INR) | Monthly Cost (USD) | Sources |
|---|---|---|---|
| Freelancer (Low) | ₹15,000 - ₹25,000 | $180 - $300 | [SagIPL SEO Pricing Guide](https://blog.sagipl.com/seo-pricing-guide/), [Digital Hari SEO Freelancer Salary](https://digitalhari.in/the-ultimate-guide-to-seo-freelancer-salaries-in-india-2025-by-hariharan-gandhi/) |
| Freelancer (Mid) | ₹30,000 - ₹50,000 | $360 - $600 | [BeTopSEO](https://betopseo.com/blogs/seo-services-cost-in-india/) |
| Freelancer (High) | ₹75,000 - ₹1,50,000 | $900 - $1,800 | [Aflah Zaman SEO Cost India](https://aflahzaman.com/blog/how-much-does-seo-cost-india/) |
| Full-time (Low) | ₹25,000 - ₹30,000 | $300 - $360 | [WsCube Tech SEO Salary](https://www.wscubetech.com/blog/seo-salary-india/) |
| Full-time (Mid) | ₹37,500 - ₹70,000 | $450 - $845 | [Digital Vidya SEO Salary](https://www.digitalvidya.com/blog/seo-salary/), [upGrad SEO Salary](https://www.upgrad.com/blog/seo-salary-india-seo-manager-salary-india/) |
| Full-time (High) | ₹1,00,000 - ₹2,00,000 | $1,205 - $2,410 | [IIDE SEO Salary](https://iide.co/blog/seo-salary-in-india/) |

**Realistic for our scope:** ₹35,000-50,000/mo ($420-$600) freelancer

#### Market/Community Researcher

| Hiring Model | Monthly Cost (INR) | Monthly Cost (USD) | Sources |
|---|---|---|---|
| Freelancer | ₹15,000 - ₹25,000 | $180 - $300 | [Side Hustles India Freelancer Rates](https://sidehustlesindia.com/blog/freelancer-rates-india) |
| Full-time (Low) | ₹20,000 - ₹25,000 | $240 - $300 | [PayScale India Market Researcher](https://www.payscale.com/research/IN/Job=Market_Researcher/Salary) |
| Full-time (Mid) | ₹30,000 - ₹45,000 | $360 - $540 | [Glassdoor India Market Research Analyst](https://www.glassdoor.co.in/Salaries/market-research-analyst-salary-SRCH_KO0,23.htm) |
| Full-time (High) | ₹55,000 - ₹85,000 | $665 - $1,025 | [Glassdoor India 90th percentile](https://www.glassdoor.co.in/Salaries/market-research-analyst-salary-SRCH_KO0,23.htm) |

**Realistic:** ₹15,000-25,000/mo ($180-$300) part-time freelancer. This role is often combined with SEO strategist.

#### SEO Blog Writer

**Per-article rates (for a ~2,000-word SEO blog):**

| Writer Level | Cost Per Article (INR) | Cost Per Article (USD) | Sources |
|---|---|---|---|
| Entry-level | ₹1,000 - ₹2,000 | $12 - $24 | [Textuar Content Writing Rates](https://textuar.com/blog/content-writing-rates/), [DAS Writing Prices](https://www.daswritingservices.com/content-writing-prices-chart/) |
| Mid-level | ₹3,000 - ₹6,000 | $36 - $72 | [Zenith Ways Blog Charges](https://thezenithways.substack.com/p/how-much-should-you-charge-or-pay), [Kalam Kagaz Price Chart](https://www.kalamkagaz.com/content-writing-price-chart-in-india-usa/) |
| Experienced | ₹6,000 - ₹10,000 | $72 - $120 | [Credible Content Rates](https://credible-content.com/website-blog-content-writing-rates-india/) |
| Expert/Niche | ₹10,000 - ₹16,000+ | $120 - $193+ | [Zenith Ways](https://thezenithways.substack.com/p/how-much-should-you-charge-or-pay) |

**Monthly cost for 20-25 articles:**

| Model | Monthly (INR) | Monthly (USD) |
|---|---|---|
| Freelancer (low) | ₹25,000 - ₹50,000 | $300 - $600 |
| Freelancer (mid) | ₹75,000 - ₹1,50,000 | $900 - $1,800 |
| Freelancer (high) | ₹1,50,000 - ₹4,00,000 | $1,800 - $4,820 |
| Full-time employee | ₹25,000 - ₹45,000 | $300 - $540 |

**Note:** A single full-time writer at ₹30-40K/mo can produce 15-20 articles/month. For 20-25 high-quality SEO articles, you need 1.5-2 writers = ₹45,000-80,000/mo.

Sources: [Glassdoor India SEO Content Writer](https://www.glassdoor.co.in/Salaries/seo-content-writer-salary-SRCH_KO0,18.htm), [Internshala Content Writer Salary](https://internshala.com/blog/content-writer-salary-in-india/)

**Agency/platform pricing:**
- **WittyPen:** ₹2,500-6,000 per 2,000-word article — [WittyPen](https://wittypen.com/content-writing-services-india)
- **DAS Writing:** ₹6,000-18,000 per 2,000 words (ghostwriting at ₹3-9/word) — [DAS Writing](https://www.daswritingservices.com/content-writing-prices-chart/)
- **Textuar:** Bulk discount at 90K+ words/mo, ~₹2-5/word — [Textuar](https://textuar.com/blog/content-writing-rates/)

#### Editor/QA

| Hiring Model | Monthly Cost (INR) | Monthly Cost (USD) | Sources |
|---|---|---|---|
| Freelancer (per-article editing) | ₹12,500 - ₹50,000 (25 articles x ₹500-2,000) | $150 - $600 | Per-article editing rates from [Textuar](https://textuar.com/blog/content-writing-rates/) |
| Full-time (low) | ₹30,000 - ₹40,000 | $360 - $480 | [Glassdoor India Content Editor](https://www.glassdoor.co.in/Salaries/content-editor-salary-SRCH_KO0,14.htm) |
| Full-time (mid) | ₹45,000 - ₹62,000 | $540 - $750 | [Glassdoor India Content Editor](https://www.glassdoor.co.in/Salaries/content-editor-salary-SRCH_KO0,14.htm) |

**Realistic:** ₹20,000-35,000/mo ($240-$420) part-time freelance retainer

#### Content Project Manager

| Hiring Model | Monthly Cost (INR) | Monthly Cost (USD) | Sources |
|---|---|---|---|
| Freelancer | ₹20,000 - ₹40,000 | $240 - $480 | [Side Hustles India](https://sidehustlesindia.com/blog/freelancer-rates-india), [xFlowPay Freelancer Charges](https://www.xflowpay.com/blog/freelancer-charges) |
| Full-time (low) | ₹40,000 - ₹65,000 | $480 - $780 | [Glassdoor India Project Manager](https://www.glassdoor.co.in/Salaries/project-manager-salary-SRCH_KO0,15.htm) |
| Full-time (mid) | ₹70,000 - ₹1,20,000 | $845 - $1,445 | [upGrad Project Manager Salary](https://www.upgrad.com/blog/project-manager-salary-india-freshers-experienced/) |

**Realistic:** ₹25,000-40,000/mo ($300-$480) part-time freelancer. Full-time PM is overkill for this team size.

#### Graphic Designer

| Hiring Model | Monthly Cost (INR) | Monthly Cost (USD) | Sources |
|---|---|---|---|
| Freelancer (per image) | ₹500 - ₹3,000 | $6 - $36 | [TOPS International](https://www.tops-int.com/blog/freelance-graphic-designer-rates-in-india), [Cpluz](https://cpluz.com/blog/top-10-freelance-graphic-design-rates-in-india-get-what-you-pay-for-in-2025/) |
| Freelancer (retainer) | ₹15,000 - ₹30,000 | $180 - $360 | [Internshala Graphic Designer Cost](https://internshala.com/blog/employer-cost-to-hire-graphic-designer/) |
| Full-time (low) | ₹18,000 - ₹25,000 | $215 - $300 | [PayScale India Graphic Designer](https://www.payscale.com/research/IN/Job=Graphic_Designer/Salary), [Indeed India](https://in.indeed.com/career/graphic-designer/salaries) |
| Full-time (mid) | ₹30,000 - ₹50,000 | $360 - $600 | [Glassdoor India Graphic Designer](https://www.glassdoor.co.in/Salaries/graphic-designer-salary-SRCH_KO0,16.htm), [AND Academy](https://www.andacademy.com/resources/blog/graphic-design/graphic-designer-salary-in-india/) |

**Realistic:** ₹15,000-30,000/mo ($180-$360) part-time freelancer

### India Totals

#### Freelancer Team

| Role | Low (INR) | Mid (INR) | High (INR) |
|---|---|---|---|
| SEO Strategist | ₹20,000 | ₹40,000 | ₹75,000 |
| Community Researcher | ₹15,000 | ₹25,000 | ₹40,000 |
| SEO Blog Writer(s) | ₹50,000 | ₹1,00,000 | ₹2,50,000 |
| Editor/QA | ₹15,000 | ₹25,000 | ₹45,000 |
| Content PM | ₹20,000 | ₹35,000 | ₹60,000 |
| Graphic Designer | ₹15,000 | ₹25,000 | ₹50,000 |
| **TOTAL** | **₹1,35,000 ($1,625)** | **₹2,50,000 ($3,010)** | **₹5,20,000 ($6,265)** |

#### Full-Time Employee Team

| Role | Low (INR) | Mid (INR) | High (INR) |
|---|---|---|---|
| SEO Strategist | ₹30,000 | ₹50,000 | ₹1,00,000 |
| Community Researcher | ₹25,000 | ₹35,000 | ₹60,000 |
| SEO Blog Writer (x2) | ₹50,000 | ₹80,000 | ₹1,20,000 |
| Editor/QA | ₹35,000 | ₹50,000 | ₹80,000 |
| Content PM | ₹45,000 | ₹80,000 | ₹1,50,000 |
| Graphic Designer | ₹20,000 | ₹35,000 | ₹60,000 |
| **TOTAL** | **₹2,05,000 ($2,470)** | **₹3,30,000 ($3,975)** | **₹5,70,000 ($6,865)** |

**Note:** Add 15-30% for PF, insurance, benefits = mid-range becomes ~₹3,80,000-4,30,000/mo ($4,575-$5,180)

#### Agency

| Tier | Monthly (INR) | Monthly (USD) | Sources |
|---|---|---|---|
| Budget | ₹60,000 - ₹1,00,000 | $720 - $1,205 | [iTrobes](https://www.itrobes.com/content-marketing-cost-india/), [EvenDigit](https://www.evendigit.com/content-marketing-agency-cost-india/) |
| Mid-tier | ₹1,50,000 - ₹3,00,000 | $1,800 - $3,615 | [upGrowth](https://upgrowth.in/digital-marketing-pricing-how-much-does-it-cost/), [DAS Writing](https://www.daswritingservices.com/content-marketing-cost-in-india/) |
| Premium | ₹3,00,000 - ₹6,00,000+ | $3,615 - $7,230+ | [Clutch](https://clutch.co/agencies/content-marketing/pricing), [Digital Agency Network](https://digitalagencynetwork.com/content-marketing-pricing/) |

---

## 5. US/International Market Costs

All figures in USD.

### Role-by-Role Breakdown

#### Content/SEO Strategist

| Hiring Model | Monthly Cost (USD) | Sources |
|---|---|---|
| Freelancer | $1,500 - $3,000 - $5,000+ | Retainer range. Hourly: $60-$150/hr. [Upwork](https://www.upwork.com/hire/content-strategists/), SE Ranking survey |
| Full-time (base) | $5,700 - $6,800 - $9,500 | $68K-$102K/yr. [Glassdoor SEO Content Strategist](https://www.glassdoor.com/Salaries/seo-content-strategist-salary-SRCH_KO0,22.htm), [PayScale Content Strategist](https://www.payscale.com/research/US/Job=Content_Strategist/Salary/c5b06387/Search-Engine-Optimization-SEO), [Built In](https://builtin.com/salaries/us/content-strategist) |
| Full-time (fully loaded +30%) | $7,400 - $8,850 - $12,350 | BLS: benefits/taxes avg 30% above base — [BLS June 2025](https://www.bls.gov/news.release/ecec.nr0.htm) |

#### Market/Community Researcher

| Hiring Model | Monthly Cost (USD) | Sources |
|---|---|---|
| Freelancer | $1,000 - $2,500 - $4,000 | Part-time retainer. $30-$75/hr on Upwork, ~10-15 hrs/week |
| Full-time (base) | $4,500 - $6,000 - $8,300 | $54K-$81K/yr. [Glassdoor Market Researcher](https://www.glassdoor.com/Salaries/market-researcher-salary-SRCH_KO0,17.htm) ($72K avg), [Indeed](https://www.indeed.com/career/market-researcher/salaries) ($81K avg) |
| Full-time (fully loaded) | $5,850 - $7,800 - $10,800 | +30% for benefits |

#### SEO Blog Writer

**Per-article rates (2,000-word SEO blog):**

| Writer Level | Per Article (USD) | Sources |
|---|---|---|
| Budget | $100 - $200 | [Ruul Freelance Writer Rates](https://ruul.io/blog/freelance-writer-rates) |
| Mid-range | $300 - $500 | [Copyblogger](https://copyblogger.com/freelance-writing-rates/), [ClearVoice](https://www.clearvoice.com/resources/how-much-to-pay-a-freelance-writer/) |
| Expert/Niche | $500 - $1,000+ | [Upwork SEO Writer Rates](https://www.upwork.com/hire/seo-writers/cost/) |
| Premium agency | $1,500 - $2,500 | [Siege Media](https://www.siegemedia.com/creation/content-marketing-cost), [Animalz](https://discoveredlabs.com/blog/animalz-pricing-2026-retainers-real-costs-and-roi-analysis) |

**Monthly cost for 20-25 articles:**

| Model | Monthly (USD) |
|---|---|
| Freelancer team (mid-range, $400/post avg) | $8,000 - $12,500 |
| Full-time writer (1 person) | $5,000 - $7,000 base ($6,500-$9,100 loaded) |
| Full-time writers (need 2-3 for this volume) | $13,000 - $21,000 - $27,000 loaded |
| Premium agency (per article) | $30,000 - $62,500 |

Sources: [Glassdoor Content Writer](https://www.glassdoor.com/Salaries/content-writer-salary-SRCH_KO0,14.htm), [Indeed Content Writer](https://www.indeed.com/career/content-writer/salaries), [ZipRecruiter](https://www.ziprecruiter.com/Salaries/Content-Writer-Salary), [PayScale](https://www.payscale.com/research/US/Job=Content_Writer/Salary)

#### Editor/QA

| Hiring Model | Monthly Cost (USD) | Sources |
|---|---|---|
| Freelancer | $1,500 - $3,000 - $5,000 | EFA rates: $35-$65/hr. Copy editing ~$0.027/word (Reedsy). [Editorial Freelancers Association](https://www.the-efa.org/rates/) |
| Full-time (base) | $4,900 - $6,400 - $8,500 | $59K-$77K/yr. [Glassdoor Content Editor](https://www.glassdoor.com/Salaries/content-editor-salary-SRCH_KO0,14.htm) |
| Full-time (fully loaded) | $6,400 - $8,300 - $11,000 | +30% |

#### Content Project Manager

| Hiring Model | Monthly Cost (USD) | Sources |
|---|---|---|
| Freelancer | $2,000 - $4,000 - $6,000 | Part-time PM retainer, $50-$100/hr |
| Full-time (base) | $6,000 - $8,000 - $12,400 | $72K-$113K/yr. [Glassdoor Content PM](https://www.glassdoor.com/Salaries/content-project-manager-salary-SRCH_KO0,23.htm), [Talent.com](https://www.talent.com/salary?job=content+project+manager) |
| Full-time (fully loaded) | $7,800 - $10,400 - $16,100 | +30% |

#### Graphic Designer

| Hiring Model | Monthly Cost (USD) | Sources |
|---|---|---|
| Freelancer (per post) | $25 - $75 (simple) / $100-$300 (custom) | [ManyPixels Price List](https://www.manypixels.co/blog/get-a-designer/graphic-design-price), [MarketerHire](https://marketerhire.com/blog/graphic-designer-hourly-rate) |
| Freelancer (retainer) | $1,000 - $2,500 - $5,000 | Hourly: $25-$75/hr |
| Full-time (base) | $4,500 - $5,300 - $6,800 | $54K-$64K/yr. [PayScale Graphic Designer](https://www.payscale.com/research/US/Job=Graphic_Designer/Salary), [Glassdoor](https://www.glassdoor.com/Salaries/graphic-designer-salary-SRCH_KO0,16.htm) |
| Full-time (fully loaded) | $5,850 - $6,900 - $8,850 | +30% |

### US Totals

#### Freelancer Team

| Role | Mid-Range Estimate (USD) |
|---|---|
| Content/SEO Strategist | $2,500 |
| Community/Market Researcher | $2,000 |
| SEO Blog Writers (20-25 posts @ $400 avg) | $9,000 |
| Editor/QA | $2,500 |
| Content Project Manager | $3,500 |
| Graphic Designer | $2,000 |
| **TOTAL** | **$21,500/mo** |

**Range: $12,000 - $21,500 - $40,000+/mo**

#### Full-Time Employee Team (fully loaded with benefits/taxes at 1.3x salary)

| Role | Fully Loaded Monthly (USD) |
|---|---|
| Content/SEO Strategist (1) | $8,850 |
| Community/Market Researcher (1) | $7,150 |
| SEO Blog Writers (2.5 avg needed) | $17,550 |
| Editor/QA (1) | $7,500 |
| Content Project Manager (1) | $10,000 |
| Graphic Designer (1) | $6,400 |
| **TOTAL** | **$57,450/mo (~$689K/yr)** |

**Range: $45,000 - $57,000 - $75,000+/mo**

Source for the 30% overhead: [BLS Employer Costs June 2025](https://www.bls.gov/news.release/ecec.nr0.htm), [SBA Employee Cost Guide](https://www.sba.gov/blog/how-much-does-employee-cost-you)

#### US Agency

| Tier | Monthly (USD) | Sources |
|---|---|---|
| Budget | $3,000 - $5,000 | Lower quality, possibly offshore writers |
| Mid-tier | $8,000 - $15,000 | [WebFX Content Marketing Pricing](https://www.webfx.com/content-marketing/pricing/), [Content Matterz Agency Pricing](https://contentmatterz.com/blog/content-marketing-agency-pricing/) |
| Premium (Animalz, Siege Media, Grow & Convert) | $15,000 - $40,000+ | [Siege Media Cost Guide](https://www.siegemedia.com/creation/content-marketing-cost), [Animalz Pricing Analysis](https://discoveredlabs.com/blog/animalz-pricing-2026-retainers-real-costs-and-roi-analysis) |
| Enterprise (full-service) | $30,000 - $60,000+ | [The Digital Elevator Content Marketing Cost](https://thedigitalelevator.com/blog/content-marketing-cost/) |

#### Content Platform Pricing (per-article comparison)

| Platform | Per Post (~2,000 words) | Monthly (20-25 posts) | Sources |
|---|---|---|---|
| Verblio (AI+human) | ~$120 | $2,400-$3,000 + $49.50 fee | [Verblio Pricing](https://www.verblio.com/pricing) |
| Verblio (100% human) | ~$320 | $6,400-$8,000 | [Verblio Pricing](https://www.verblio.com/pricing) |
| ClearVoice | $200-$500+ | $5,000-$12,500 (est.) | [ClearVoice](https://www.clearvoice.com/resources/how-much-to-pay-a-freelance-writer/) |
| Contently | $1,000-$2,000+ | $20,000-$50,000 | [Contently Pricing 2026](https://socialrails.com/blog/contently-pricing) |
| Skyword | $5,000+/mo platform | Enterprise only | [Skyword Pricing](https://www.trustradius.com/products/skyword/pricing) |

---

## 6. Side-by-Side Summary

### Total monthly cost to produce 20-25 SEO blogs/month

| Hiring Model | India (INR) | India (USD) | US/International (USD) |
|---|---|---|---|
| **Freelancer Team (low)** | ₹1,35,000 | $1,625 | $12,000 |
| **Freelancer Team (mid)** | ₹2,50,000 | $3,010 | $21,500 |
| **Freelancer Team (high)** | ₹5,20,000 | $6,265 | $40,000+ |
| **Full-time Team (mid, loaded)** | ₹3,80,000 | $4,575 | $57,000 |
| **Budget Agency** | ₹60,000-1,00,000 | $720-$1,205 | $3,000-$5,000 |
| **Mid-tier Agency** | ₹1,50,000-3,00,000 | $1,800-$3,615 | $8,000-$15,000 |
| **Premium Agency** | ₹3,00,000-6,00,000+ | $3,615-$7,230+ | $15,000-$40,000+ |

---

## 7. Current Numbers on the Site vs. Research-Backed Numbers

### What's on the site now (pitch-data.ts + HookSection.tsx)

| Agent | Current "monthlySavings" | Current "costEquivalent" |
|-------|--------------------------|--------------------------|
| Parthasarathi (Manager) | $2.1K | "Replaces a $2K/month project manager" |
| Vibhishana (Scout) | $3.2K | "Replaces a $3K/month research analyst" |
| Vyasa (Writer) | $5K | "Replaces a $5K/month content marketer" |
| Valmiki (Voice) — coming soon | $3.5K | "Replaces a $3.5K/month social media manager" |
| Sanjaya (Hunter) — coming soon | $4K | "Replaces a $4K/month lead researcher" |
| **Total (3 active)** | **$10.3K/mo** | |

### HookSection cost formula (line 18)
```
costSaved = Math.round((q / 50) * 112.5 + b * 180 + bl * 300 + 5 * 180)
```
- Questions: (q/50) * $112.50 per scan session
- Briefs: $180 per brief
- Blogs: $300 per blog
- Management: 5 * $180 = $900 flat

### Assessment

**For US audience:** Current numbers are actually conservative. Research shows:
- Parthasarathi: Should be $3,000-$5,000 (PM freelancer retainer is $3-4K, full-time is $8-10K loaded)
- Vibhishana: Should be $4,000-$7,500 (researcher $2-2.5K + strategist $1.5-3K + brief writer built in)
- Vyasa: Should be $5,000-$10,000 (20-25 posts at $300-500/post = $6-12.5K, or 1 FTE loaded = $6.5-9K)
- **Research-backed US total: $12,000-$22,500/mo**

**For India audience:** Current numbers feel inflated. Research shows:
- Parthasarathi: Should be ₹25,000-₹50,000 ($300-$600)
- Vibhishana: Should be ₹50,000-₹90,000 ($600-$1,080)
- Vyasa: Should be ₹75,000-₹1,50,000 ($900-$1,800)
- **Research-backed India total: ₹1,50,000-₹2,90,000/mo ($1,800-$3,500)**

---

## 8. Recommended Numbers for the Landing Page

### Per-Agent Numbers (conservative, defensible)

| Agent | US Audience | India Audience |
|-------|------------|----------------|
| Parthasarathi (Manager) | $3.5K/mo | ₹35K/mo |
| Vibhishana (Scout) | $5K/mo | ₹65K/mo |
| Vyasa (Writer) | $7K/mo | ₹1L/mo |
| **Total (3 active)** | **$15.5K/mo** | **₹2L/mo** |

These are mid-range estimates using the "freelancer team" model — the most common hiring approach for the ICP (small business founders who wouldn't hire a full team of employees).

### "Cost Equivalent" Labels

| Agent | US Audience | India Audience |
|-------|------------|----------------|
| Parthasarathi | "Replaces a $3-4K/mo content project manager" | "Replaces a ₹30-40K/mo content PM" |
| Vibhishana | "Replaces a $5K/mo SEO researcher & strategist" | "Replaces a ₹50-70K/mo SEO team" |
| Vyasa | "Replaces a $7K/mo content writer + editor" | "Replaces a ₹80K-1.2L/mo writer team" |

### HookSection formula update (if we proceed)

For US: `costSaved = briefs * 200 + blogs * 400 + management * 200`
For India: `costSaved = briefs * 25 + blogs * 50 + management * 25` (in USD) or equivalent in INR

---

## 9. Implementation Direction

**Krishna's preference (Feb 17):** Auto-detect user geography and show INR for Indian users, USD for international. Fallback: let user toggle between India/International.

**Technical approach (to be planned):**
- Option A: Use browser timezone/locale detection (client-side, no API needed)
- Option B: Use IP-based geolocation (more accurate, needs API or edge middleware)
- Option C: Cloudflare/Netlify headers (if available — Netlify provides `x-country` header)

**Decision status:** Awaiting Krishna's review of this research document before proceeding to implementation.

---

## 10. All Sources

### India Job Boards & Salary Data
- [Glassdoor India — SEO Content Writer](https://www.glassdoor.co.in/Salaries/seo-content-writer-salary-SRCH_KO0,18.htm)
- [Glassdoor India — Content Editor](https://www.glassdoor.co.in/Salaries/content-editor-salary-SRCH_KO0,14.htm)
- [Glassdoor India — Project Manager](https://www.glassdoor.co.in/Salaries/project-manager-salary-SRCH_KO0,15.htm)
- [Glassdoor India — Market Research Analyst](https://www.glassdoor.co.in/Salaries/market-research-analyst-salary-SRCH_KO0,23.htm)
- [Glassdoor India — Graphic Designer](https://www.glassdoor.co.in/Salaries/graphic-designer-salary-SRCH_KO0,16.htm)
- [PayScale India — Content Writer](https://www.payscale.com/research/IN/Job=Content_Writer/Salary)
- [PayScale India — Market Researcher](https://www.payscale.com/research/IN/Job=Market_Researcher/Salary)
- [PayScale India — Graphic Designer](https://www.payscale.com/research/IN/Job=Graphic_Designer/Salary)
- [Indeed India — Market Researcher](https://in.indeed.com/career/market-researcher/salaries)
- [Indeed India — Graphic Designer](https://in.indeed.com/career/graphic-designer/salaries)
- [Internshala — Content Writer Salary 2026](https://internshala.com/blog/content-writer-salary-in-india/)
- [Internshala — Graphic Designer Cost](https://internshala.com/blog/employer-cost-to-hire-graphic-designer/)
- [upGrad — SEO Salary India](https://www.upgrad.com/blog/seo-salary-india-seo-manager-salary-india/)
- [upGrad — Content Writer Salary](https://www.upgrad.com/blog/content-writer-salary-in-india-roles-and-responsibilities/)
- [upGrad — Project Manager Salary](https://www.upgrad.com/blog/project-manager-salary-india-freshers-experienced/)
- [IIDE — SEO Salary India](https://iide.co/blog/seo-salary-in-india/)
- [IIDE — Content Writer Salary](https://iide.co/blog/content-writer-salary/)
- [WsCube Tech — SEO Salary India](https://www.wscubetech.com/blog/seo-salary-india/)
- [Digital Vidya — SEO Salary Guide](https://www.digitalvidya.com/blog/seo-salary/)
- [Digital Scholar — SEO Salary India](https://digitalscholar.in/seo-salary-in-india/)
- [Digital Hari — SEO Freelancer Salary 2025](https://digitalhari.in/the-ultimate-guide-to-seo-freelancer-salaries-in-india-2025-by-hariharan-gandhi/)
- [Careers360 — Graphic Designer Salary](https://design.careers360.com/articles/graphic-designer-salary-in-india)
- [AND Academy — Graphic Designer Salary](https://www.andacademy.com/resources/blog/graphic-design/graphic-designer-salary-in-india/)

### India Freelance & Content Pricing
- [Textuar — Content Writing Rates 2025](https://textuar.com/blog/content-writing-rates/)
- [Kalam Kagaz — Price Chart India](https://www.kalamkagaz.com/content-writing-price-chart-in-india-usa/)
- [DAS Writing — Content Prices India](https://www.daswritingservices.com/content-writing-prices-chart/)
- [Credible Content — Blog Writing Rates India](https://credible-content.com/website-blog-content-writing-rates-india/)
- [Zenith Ways — Blog Writing Charges 2025](https://thezenithways.substack.com/p/how-much-should-you-charge-or-pay)
- [WittyPen — Content Writing India](https://wittypen.com/content-writing-services-india)
- [Side Hustles India — Freelancer Rates](https://sidehustlesindia.com/blog/freelancer-rates-india)
- [xFlowPay — Freelancer Charges India](https://www.xflowpay.com/blog/freelancer-charges)
- [TOPS International — Freelance Graphic Designer Rates India](https://www.tops-int.com/blog/freelance-graphic-designer-rates-in-india)
- [Cpluz — Graphic Design Rates India 2025](https://cpluz.com/blog/top-10-freelance-graphic-design-rates-in-india-get-what-you-pay-for-in-2025/)

### India Agency Pricing
- [iTrobes — Content Marketing Cost India 2025](https://www.itrobes.com/content-marketing-cost-india/)
- [EvenDigit — Content Marketing Agency Cost India](https://www.evendigit.com/content-marketing-agency-cost-india/)
- [upGrowth — Digital Marketing Pricing India](https://upgrowth.in/digital-marketing-pricing-how-much-does-it-cost/)
- [DAS Writing — Content Marketing Cost Monthly](https://www.daswritingservices.com/content-marketing-cost-in-india/)
- [Clutch — Content Marketing Pricing (Global)](https://clutch.co/agencies/content-marketing/pricing)
- [Digital Agency Network — Content Marketing Pricing 2025](https://digitalagencynetwork.com/content-marketing-pricing/)

### India SEO Service Pricing
- [SagIPL — SEO Pricing Guide India 2025](https://blog.sagipl.com/seo-pricing-guide/)
- [Aflah Zaman — SEO Cost India 2026](https://aflahzaman.com/blog/how-much-does-seo-cost-india/)
- [BeTopSEO — SEO Services Cost India](https://betopseo.com/blogs/seo-services-cost-in-india/)

### US Job Boards & Salary Data
- [Glassdoor — Content Writer 2026](https://www.glassdoor.com/Salaries/content-writer-salary-SRCH_KO0,14.htm)
- [Glassdoor — SEO Content Strategist](https://www.glassdoor.com/Salaries/seo-content-strategist-salary-SRCH_KO0,22.htm)
- [Glassdoor — Content Marketing Manager 2026](https://www.glassdoor.com/Salaries/content-marketing-manager-salary-SRCH_KO0,25.htm)
- [Glassdoor — Content Editor 2026](https://www.glassdoor.com/Salaries/content-editor-salary-SRCH_KO0,14.htm)
- [Glassdoor — Content Project Manager](https://www.glassdoor.com/Salaries/content-project-manager-salary-SRCH_KO0,23.htm)
- [Glassdoor — Graphic Designer 2026](https://www.glassdoor.com/Salaries/graphic-designer-salary-SRCH_KO0,16.htm)
- [Glassdoor — Market Researcher](https://www.glassdoor.com/Salaries/market-researcher-salary-SRCH_KO0,17.htm)
- [Indeed — Content Writer](https://www.indeed.com/career/content-writer/salaries)
- [Indeed — Market Researcher](https://www.indeed.com/career/market-researcher/salaries)
- [PayScale — Content Writer 2026](https://www.payscale.com/research/US/Job=Content_Writer/Salary)
- [PayScale — Content Strategist (SEO)](https://www.payscale.com/research/US/Job=Content_Strategist/Salary/c5b06387/Search-Engine-Optimization-SEO)
- [PayScale — Graphic Designer 2026](https://www.payscale.com/research/US/Job=Graphic_Designer/Salary)
- [ZipRecruiter — Content Writer](https://www.ziprecruiter.com/Salaries/Content-Writer-Salary)
- [Talent.com — Content Project Manager](https://www.talent.com/salary?job=content+project+manager)
- [Built In — Content Strategist 2026](https://builtin.com/salaries/us/content-strategist)
- [BLS — Employer Costs for Employee Compensation June 2025](https://www.bls.gov/news.release/ecec.nr0.htm)
- [SBA — How Much Does an Employee Cost You](https://www.sba.gov/blog/how-much-does-employee-cost-you)

### US Freelance & Content Pricing
- [Upwork — Freelance Writing Rates 2026](https://www.upwork.com/resources/freelance-writing-rates)
- [Upwork — SEO Writer Hourly Rates](https://www.upwork.com/hire/seo-writers/cost/)
- [Editorial Freelancers Association — Rates](https://www.the-efa.org/rates/)
- [Copyblogger — Freelance Writing Rates](https://copyblogger.com/freelance-writing-rates/)
- [ClearVoice — How Much to Pay a Freelance Writer](https://www.clearvoice.com/resources/how-much-to-pay-a-freelance-writer/)
- [Ruul — Freelance Writer Rates 2025](https://ruul.io/blog/freelance-writer-rates)
- [ManyPixels — Graphic Design Price List 2026](https://www.manypixels.co/blog/get-a-designer/graphic-design-price)
- [MarketerHire — Graphic Designer Hourly Rate 2025](https://marketerhire.com/blog/graphic-designer-hourly-rate)

### US Agency Pricing
- [WebFX — Content Marketing Pricing 2026](https://www.webfx.com/content-marketing/pricing/)
- [Siege Media — Content Marketing Cost 2025](https://www.siegemedia.com/creation/content-marketing-cost)
- [Animalz — Pricing Analysis 2026](https://discoveredlabs.com/blog/animalz-pricing-2026-retainers-real-costs-and-roi-analysis)
- [The Digital Elevator — Content Marketing Cost 2026](https://thedigitalelevator.com/blog/content-marketing-cost/)
- [Content Matterz — Agency Pricing 2025](https://contentmatterz.com/blog/content-marketing-agency-pricing/)
- [HawkSEM — Marketing Agency Pricing](https://hawksem.com/blog/marketing-agency-pricing/)

### Content Platforms
- [Verblio — Pricing](https://www.verblio.com/pricing)
- [Contently Pricing 2026](https://socialrails.com/blog/contently-pricing)
- [Skyword Pricing](https://www.trustradius.com/products/skyword/pricing)
