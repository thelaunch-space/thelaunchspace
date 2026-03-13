import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "When Your Spreadsheet CRM Starts Losing You Money (The 100-Lead Threshold) | thelaunch.space",
  description: "The exact revenue point where spreadsheet lead management costs more than a CRM. 100-lead threshold math, migration frameworks, and what most guides get wrong.",
  openGraph: {
    title: "When Your Spreadsheet CRM Starts Losing You Money (The 100-Lead Threshold) | thelaunch.space",
    description: "The exact revenue point where spreadsheet lead management costs more than a CRM. 100-lead threshold math, migration frameworks, and what most guides get wrong.",
    url: "https://thelaunch.space/blogs/growth-strategy/2026-03-02-spreadsheet-to-crm-100-lead-threshold",
    siteName: "thelaunch.space",
    type: "article",
    publishedTime: "2026-03-13T00:00:00.000Z",
    authors: ["thelaunch.space"],
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "When Your Spreadsheet CRM Starts Losing You Money (The 100-Lead Threshold)" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "When Your Spreadsheet CRM Starts Losing You Money (The 100-Lead Threshold) | thelaunch.space",
    description: "The exact revenue point where spreadsheet lead management costs more than a CRM. 100-lead threshold math, migration frameworks, and what most guides get wrong.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: "https://thelaunch.space/blogs/growth-strategy/2026-03-02-spreadsheet-to-crm-100-lead-threshold" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "When Your Spreadsheet CRM Starts Losing You Money (The 100-Lead Threshold)",
  description: "The exact revenue point where spreadsheet lead management costs more than a CRM. 100-lead threshold math, migration frameworks, and what most guides get wrong.",
  url: "https://thelaunch.space/blogs/growth-strategy/2026-03-02-spreadsheet-to-crm-100-lead-threshold",
  datePublished: "2026-03-13T00:00:00.000Z",
  dateModified: "2026-03-13T00:00:00.000Z",
  author: { "@type": "Organization", name: "thelaunch.space", url: "https://thelaunch.space" },
  publisher: {
    "@type": "Organization",
    name: "thelaunch.space",
    url: "https://thelaunch.space",
    logo: { "@type": "ImageObject", url: "https://thelaunch.space/logo.png" }
  },
  image: "https://thelaunch.space/og-image.png",
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://thelaunch.space/blogs/growth-strategy/2026-03-02-spreadsheet-to-crm-100-lead-threshold" },
};

export default function BlogPost() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-background text-text-primary">
        <header className="max-w-[720px] mx-auto px-6 md:px-8 pt-8 md:pt-12">
          <a href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-blue text-sm font-medium transition-colors">
            ← thelaunch.space
          </a>
        </header>

        <article className="max-w-[720px] mx-auto px-6 md:px-8 py-12 md:py-16">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">When Your Spreadsheet CRM Starts Losing You Money (The 100-Lead Threshold)</h1>
          <div className="flex items-center gap-3 text-sm text-text-secondary mb-10">
            <span>thelaunch.space</span><span>·</span>
            <time dateTime="2026-03-13">Mar 13, 2026</time><span>·</span>
            <span>11 min read</span>
          </div>

          <p className="text-lg md:text-xl text-text-primary leading-relaxed mb-8">
            Your Google Sheet with 47 leads isn&apos;t the problem. It&apos;s efficient, free, and you know exactly where everything is. The problem starts somewhere around lead 100—when you miss a follow-up that costs you a $3,000 deal because you forgot to check the spreadsheet on Friday, and you realize the &quot;free&quot; system just became very expensive.
          </p>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            Every business hits this threshold differently, but the pattern is consistent: spreadsheets work until they suddenly don&apos;t. This guide gives you the framework to identify exactly when you&apos;ve crossed that line—and what to do about it without overcomplicating your sales process.
          </p>

          <div className="bg-border-color/30 border border-border-color rounded-xl p-8 my-10 text-center">
            <p className="text-3xl md:text-4xl font-bold text-text-primary mb-2">$128,000</p>
            <p className="text-sm md:text-base text-text-secondary">Average annual revenue small businesses lose to missed lead follow-ups</p>
          </div>

          <hr className="border-border-color my-12" />

          <h2 className="text-2xl md:text-3xl font-bold mt-16 mb-4">The Hidden Cost of &quot;Free&quot; Lead Management</h2>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            Spreadsheets don&apos;t charge monthly fees. That&apos;s the appeal. But they extract payment in other ways—ways that don&apos;t show up on your P&L statement until you trace back why revenue flatlined.
          </p>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            The data is clear: <span className="text-text-primary font-semibold">73% of generated leads never convert</span>, and the majority of those losses come from follow-up failures, not product problems. When you&apos;re managing leads in a spreadsheet, every follow-up depends on you remembering to check the sheet, scrolling to the right row, and manually tracking the last touchpoint. That system works at 20 leads. At 100? You&apos;re playing memory games with your revenue.
          </p>

          <div className="border-l-4 border-accent-blue pl-6 my-8">
            <p className="text-base md:text-lg text-text-primary font-medium leading-relaxed">Leads contacted within 5 minutes are 21x more likely to convert than those contacted after 30 minutes. 87% of small businesses respond after that 5-minute window closes. The spreadsheet didn&apos;t send a reminder. You were in a meeting.</p>
          </div>

          <h3 className="text-xl md:text-2xl font-bold mt-8 mb-3">What Spreadsheet &quot;Efficiency&quot; Actually Costs</h3>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            Let&apos;s run real numbers. Say you have 150 active leads in your pipeline, with an average deal value of $2,500. Industry data shows:
          </p>

          <ul className="list-disc list-inside space-y-2 text-text-secondary text-base md:text-lg mb-6">
            <li><span className="text-text-primary font-semibold">5% of leads slip through cracks monthly</span> due to manual tracking failures</li>
            <li><span className="text-text-primary font-semibold">20% of spreadsheet data becomes stale or duplicated</span> within a year</li>
            <li><span className="text-text-primary font-semibold">Each minute of follow-up delay reduces conversion by 15%</span></li>
          </ul>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            At 150 leads × 5% monthly slippage × $2,500 average deal = <span className="text-text-primary font-semibold">$18,750 in annual missed revenue</span> from follow-up failures alone. That&apos;s before accounting for the 2-3 hours per week you spend manually updating status columns, deduplicating entries, and rebuilding broken formulas.
          </p>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            HubSpot&apos;s free CRM costs $0. Their Starter plan is $20/user/month. That&apos;s $240/year per user to stop losing $18,750. The math isn&apos;t close.
          </p>

          <hr className="border-border-color my-12" />

          <h2 className="text-2xl md:text-3xl font-bold mt-16 mb-4">The 7 Warning Signs You&apos;ve Outgrown Your Spreadsheet</h2>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            Not everyone at 100 leads needs a CRM. Some businesses at 50 leads desperately need one. The threshold isn&apos;t about lead count—it&apos;s about <span className="text-text-primary font-semibold">failure patterns</span>. If you&apos;re experiencing three or more of these signals, your spreadsheet has become a liability.
          </p>

          <div className="space-y-4 my-8">
            <div className="bg-border-color/20 rounded-xl p-5">
              <p className="text-text-primary font-semibold mb-1">1. You&apos;ve missed a follow-up that cost you money</p>
              <p className="text-text-secondary text-base leading-relaxed">Not &quot;almost missed&quot;—actually missed. A deal you should have closed, lost because the lead went cold while sitting in row 73 of your spreadsheet without a reminder.</p>
            </div>
            <div className="bg-border-color/20 rounded-xl p-5">
              <p className="text-text-primary font-semibold mb-1">2. You scroll to find leads instead of searching or filtering</p>
              <p className="text-text-secondary text-base leading-relaxed">When your lead list is short, scrolling works. When you&apos;re scanning 150 rows looking for &quot;that guy from the conference,&quot; you&apos;re wasting time you could spend selling.</p>
            </div>
            <div className="bg-border-color/20 rounded-xl p-5">
              <p className="text-text-primary font-semibold mb-1">3. You can&apos;t answer &quot;what&apos;s the average time from first contact to close?&quot;</p>
              <p className="text-text-secondary text-base leading-relaxed">Basic pipeline analytics require structured data. If you don&apos;t know your conversion rate or average deal cycle, you&apos;re guessing at growth strategy.</p>
            </div>
            <div className="bg-border-color/20 rounded-xl p-5">
              <p className="text-text-primary font-semibold mb-1">4. You have duplicate entries for the same contact</p>
              <p className="text-text-secondary text-base leading-relaxed">Someone emailed from their personal address, then their work address. Now they&apos;re in your sheet twice, with different notes. Which version is accurate?</p>
            </div>
            <div className="bg-border-color/20 rounded-xl p-5">
              <p className="text-text-primary font-semibold mb-1">5. Multiple team members edit the same sheet</p>
              <p className="text-text-secondary text-base leading-relaxed">Version conflicts, overwritten notes, &quot;who changed this?&quot; conversations. Google Sheets handles concurrent editing, but it doesn&apos;t handle concurrent sales process.</p>
            </div>
            <div className="bg-border-color/20 rounded-xl p-5">
              <p className="text-text-primary font-semibold mb-1">6. You&apos;ve said &quot;I need to remember to follow up&quot; in the past week</p>
              <p className="text-text-secondary text-base leading-relaxed">If follow-ups depend on memory instead of automated reminders, you&apos;re one busy week away from losing deals. Memory doesn&apos;t scale.</p>
            </div>
            <div className="bg-border-color/20 rounded-xl p-5">
              <p className="text-text-primary font-semibold mb-1">7. Your formula broke and you don&apos;t know when</p>
              <p className="text-text-secondary text-base leading-relaxed">Pipeline value showing $0? Someone deleted the wrong row and your SUMIF references are off. How long has your data been wrong?</p>
            </div>
          </div>

          <div className="bg-border-color/30 border border-border-color rounded-xl p-6 my-8">
            <p className="text-text-primary font-medium">Three or more signals? It&apos;s time. But before you jump to enterprise CRM demos, read the next section—most small businesses overcomplicate this transition.</p>
          </div>

          <hr className="border-border-color my-12" />

          <h2 className="text-2xl md:text-3xl font-bold mt-16 mb-4">Why Most CRM Guides Get It Wrong</h2>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            Search &quot;spreadsheet to CRM&quot; and you&apos;ll find articles comparing 47 different platforms with feature matrices that would make an enterprise IT director&apos;s eyes glaze over. That&apos;s not what a freelancer or small agency needs.
          </p>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            The typical advice: &quot;Evaluate your requirements, create a selection committee, run a 90-day pilot.&quot; That&apos;s advice written for companies with procurement departments. If you&apos;re a 2-person consulting shop losing leads in a Google Sheet, you need something different.
          </p>

          <div className="border-l-4 border-accent-blue pl-6 my-8">
            <p className="text-base md:text-lg text-text-primary font-medium leading-relaxed">The real question isn&apos;t &quot;which CRM has the best features?&quot; It&apos;s &quot;what&apos;s the minimum system that stops me from losing deals?&quot; For most small businesses, that bar is surprisingly low.</p>
          </div>

          <h3 className="text-xl md:text-2xl font-bold mt-8 mb-3">What You Actually Need (And Don&apos;t Need)</h3>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            <span className="text-text-primary font-semibold">You need:</span>
          </p>

          <ul className="list-disc list-inside space-y-2 text-text-secondary text-base md:text-lg mb-6">
            <li><span className="text-text-primary font-semibold">Automated follow-up reminders</span> — the single feature that prevents most lead loss</li>
            <li><span className="text-text-primary font-semibold">A visual pipeline</span> — see what stage every deal is at without reading rows</li>
            <li><span className="text-text-primary font-semibold">Basic email integration</span> — log conversations without copy-pasting</li>
            <li><span className="text-text-primary font-semibold">Mobile access</span> — update status from your phone after a meeting</li>
          </ul>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            <span className="text-text-primary font-semibold">You don&apos;t need (yet):</span>
          </p>

          <ul className="list-disc list-inside space-y-2 text-text-secondary text-base md:text-lg mb-6">
            <li>AI lead scoring (you don&apos;t have enough data)</li>
            <li>Complex workflow automation (you&apos;re not a sales machine)</li>
            <li>Team hierarchy and permissions (you&apos;re 2-3 people)</li>
            <li>Custom API integrations (you have bigger problems to solve first)</li>
          </ul>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            Most businesses at the spreadsheet-to-CRM threshold get sold features they&apos;ll never use. A free or $15/month CRM with reminders, pipeline view, and email sync solves 90% of the problem. Start there.
          </p>

          <hr className="border-border-color my-12" />

          <h2 className="text-2xl md:text-3xl font-bold mt-16 mb-4">The 3 CRM Tiers: Match Your Stage</h2>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            Instead of comparing 47 tools, here&apos;s how to think about your options in three practical tiers:
          </p>

          <h3 className="text-xl md:text-2xl font-bold mt-8 mb-3">Tier 1: Free CRMs (Up to 100 Leads)</h3>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            <a href="https://www.hubspot.com/crm" target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline">HubSpot Free CRM</a> is the obvious choice here. It includes:
          </p>

          <ul className="list-disc list-inside space-y-2 text-text-secondary text-base md:text-lg mb-6">
            <li>Unlimited contacts (1,000 marketing contacts limit)</li>
            <li>Deal pipeline with drag-and-drop</li>
            <li>Task reminders and scheduling</li>
            <li>Email integration with tracking</li>
            <li>Mobile app</li>
            <li>2 users with full access</li>
          </ul>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            <span className="text-text-primary font-semibold">Limitations:</span> No automation, HubSpot branding on forms/emails, limited reporting, 1 pipeline. For a solo freelancer or 2-person team managing under 100 active leads, these limitations don&apos;t matter.
          </p>

          <h3 className="text-xl md:text-2xl font-bold mt-8 mb-3">Tier 2: Starter Plans ($15-30/month, 100-500 Leads)</h3>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            When free limits pinch—or you need basic automation—Starter tiers from <a href="https://www.hubspot.com/pricing/sales" target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline">HubSpot Sales Hub</a> ($20/user/month) or <a href="https://www.pipedrive.com/en/pricing" target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline">Pipedrive Essential</a> ($15/user/month) unlock:
          </p>

          <ul className="list-disc list-inside space-y-2 text-text-secondary text-base md:text-lg mb-6">
            <li>Basic workflow automation (auto-assign, status triggers)</li>
            <li>Multiple pipelines</li>
            <li>Branded email templates</li>
            <li>Enhanced reporting</li>
            <li>More users with edit access</li>
          </ul>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            For a 3-5 person agency or consultant with growing lead volume, this tier provides the automation that prevents the manual follow-up failures your spreadsheet couldn&apos;t solve.
          </p>

          <h3 className="text-xl md:text-2xl font-bold mt-8 mb-3">Tier 3: Professional Plans ($50-100/month, 500+ Leads)</h3>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            If you&apos;re at 500+ leads with a sales team, you need pipeline forecasting, lead scoring, advanced automation, and proper team management. That&apos;s Professional tier territory. But if you&apos;re reading this article, you&apos;re probably not there yet—and that&apos;s fine.
          </p>

          <div className="bg-border-color/30 border border-border-color rounded-xl p-6 my-8">
            <p className="text-text-primary font-medium">Start with Tier 1. Upgrade when you hit its limits, not before. The biggest CRM migration mistake is buying Professional features for Starter-stage problems.</p>
          </div>

          <hr className="border-border-color my-12" />

          <h2 className="text-2xl md:text-3xl font-bold mt-16 mb-4">The One-Week Migration Playbook</h2>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            You don&apos;t need a 90-day implementation plan. You need a week of focused transition. Here&apos;s the playbook:
          </p>

          <h3 className="text-xl md:text-2xl font-bold mt-8 mb-3">Day 1: Clean Your Spreadsheet</h3>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            Before importing anything, clean your data:
          </p>

          <ul className="list-disc list-inside space-y-2 text-text-secondary text-base md:text-lg mb-6">
            <li>Remove obvious duplicates (same email, different rows)</li>
            <li>Delete leads that are clearly dead (no response in 6+ months, &quot;unsubscribed&quot; notes)</li>
            <li>Standardize status columns (pick 4-5 stages: New, Contacted, Qualified, Proposal, Closed)</li>
            <li>Export to CSV with consistent column headers</li>
          </ul>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            Most import problems come from messy source data. Spend an hour here to save hours later.
          </p>

          <h3 className="text-xl md:text-2xl font-bold mt-8 mb-3">Day 2: Import and Map</h3>

          <ul className="list-disc list-inside space-y-2 text-text-secondary text-base md:text-lg mb-6">
            <li>Create your CRM account (start with free tier)</li>
            <li>Import your CSV</li>
            <li>Map columns to CRM fields (name, email, company, status, notes)</li>
            <li>Set up 4-5 deal stages that match your actual sales process</li>
          </ul>

          <h3 className="text-xl md:text-2xl font-bold mt-8 mb-3">Day 3: Connect Email</h3>

          <ul className="list-disc list-inside space-y-2 text-text-secondary text-base md:text-lg mb-6">
            <li>Integrate Gmail/Outlook (most CRMs do this in 2 clicks)</li>
            <li>Enable email tracking (know when leads open your messages)</li>
            <li>Install the browser extension for easy logging</li>
          </ul>

          <h3 className="text-xl md:text-2xl font-bold mt-8 mb-3">Day 4-5: Build Your Workflow</h3>

          <ul className="list-disc list-inside space-y-2 text-text-secondary text-base md:text-lg mb-6">
            <li>Set default follow-up reminders (e.g., 3 days after first contact)</li>
            <li>Create task templates for common follow-up sequences</li>
            <li>Assign existing leads to pipeline stages based on their current status</li>
            <li>Set up mobile app notifications</li>
          </ul>

          <h3 className="text-xl md:text-2xl font-bold mt-8 mb-3">Day 6-7: Run Parallel</h3>

          <ul className="list-disc list-inside space-y-2 text-text-secondary text-base md:text-lg mb-6">
            <li>Keep your spreadsheet accessible but stop updating it</li>
            <li>Log all new leads only in the CRM</li>
            <li>Complete your normal sales activities using CRM workflow</li>
            <li>Note friction points (but don&apos;t customize yet—adapt first)</li>
          </ul>

          <div className="border-l-4 border-accent-blue pl-6 my-8">
            <p className="text-base md:text-lg text-text-primary font-medium leading-relaxed">The goal of week one isn&apos;t perfection—it&apos;s function. Get leads into the CRM, get reminders working, stop using the spreadsheet for active deals. Optimization comes in month two.</p>
          </div>

          <hr className="border-border-color my-12" />

          <h2 className="text-2xl md:text-3xl font-bold mt-16 mb-4">When NOT to Switch Yet</h2>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            CRMs solve specific problems. If you don&apos;t have those problems, adding a CRM creates overhead without benefit.
          </p>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            <span className="text-text-primary font-semibold">Stay on your spreadsheet if:</span>
          </p>

          <ul className="list-disc list-inside space-y-2 text-text-secondary text-base md:text-lg mb-6">
            <li><span className="text-text-primary font-semibold">You have fewer than 30 active leads</span> — At this volume, a spreadsheet with color-coding works fine. The mental overhead of learning new software isn&apos;t worth it.</li>
            <li><span className="text-text-primary font-semibold">Your sales cycle is extremely short</span> — If leads convert within 1-2 touchpoints, you don&apos;t need complex tracking. The value of CRMs comes from managing longer, multi-touch relationships.</li>
            <li><span className="text-text-primary font-semibold">You haven&apos;t lost a deal to follow-up failure</span> — If your current system genuinely works and you&apos;re not experiencing the 7 warning signs, don&apos;t fix what isn&apos;t broken.</li>
            <li><span className="text-text-primary font-semibold">You&apos;re in launch mode on something else</span> — If you&apos;re in the middle of a product launch or major client project, this isn&apos;t the week to add new systems. Finish the sprint, then transition.</li>
          </ul>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            There&apos;s no shame in spreadsheets. <a href="/" className="text-accent-blue hover:underline">We&apos;ve worked with businesses</a> generating $500K+ annually on Google Sheets. The question isn&apos;t &quot;should I have a CRM?&quot; It&apos;s &quot;is my current system costing me money?&quot;
          </p>

          <hr className="border-border-color my-12" />

          <h2 className="text-2xl md:text-3xl font-bold mt-16 mb-4">The 100-Lead Math</h2>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            Why 100 leads as a threshold? Here&apos;s the math:
          </p>

          <ul className="list-disc list-inside space-y-2 text-text-secondary text-base md:text-lg mb-6">
            <li><span className="text-text-primary font-semibold">At 50 leads:</span> You can keep most details in your head. Manual follow-up works because the cognitive load is manageable.</li>
            <li><span className="text-text-primary font-semibold">At 100 leads:</span> You can no longer remember who needs what. Follow-up becomes dependent on checking the sheet, which you&apos;ll forget to do consistently.</li>
            <li><span className="text-text-primary font-semibold">At 150+ leads:</span> Spreadsheet management itself becomes a time sink. You&apos;re spending more time organizing than selling.</li>
          </ul>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            The threshold varies by deal value. If you&apos;re selling $50K enterprise contracts with 3-month sales cycles, you might hit capacity at 30 leads. If you&apos;re selling $500 products with 1-week cycles, you might push to 200 before breaking.
          </p>

          <div className="bg-border-color/30 border border-border-color rounded-xl p-8 my-10 text-center">
            <p className="text-3xl md:text-4xl font-bold text-text-primary mb-2">80%</p>
            <p className="text-sm md:text-base text-text-secondary">Of sales require 5+ follow-ups. If your spreadsheet doesn&apos;t remind you, you&apos;ll give up at 1-2 attempts like 48% of salespeople do.</p>
          </div>

          <hr className="border-border-color my-12" />

          <h2 className="text-2xl md:text-3xl font-bold mt-16 mb-4">The Bottom Line</h2>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            Your spreadsheet isn&apos;t inherently bad. It served you well when you were starting out, and it might serve you well for years if your business stays small and simple. The problem is that spreadsheets don&apos;t scale with you—and they fail silently. You don&apos;t know you&apos;ve lost a deal until it&apos;s gone.
          </p>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            The 100-lead threshold isn&apos;t a rule. It&apos;s a signal to check for patterns: missed follow-ups, data chaos, time sink. If those patterns exist, the cost of staying on spreadsheets exceeds the cost of switching—usually by a factor of 10x or more.
          </p>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            Start with a free CRM. Migrate in a week. See if it fixes your problems before you pay anything. If HubSpot Free stops your follow-up failures, you&apos;ve solved a five-figure problem with a zero-dollar tool. That&apos;s the kind of ROI that makes CRM adoption obvious in hindsight—the question is whether you recognize the threshold before or after the losses add up.
          </p>

          <div className="bg-border-color/30 border border-border-color rounded-xl p-6 my-8">
            <p className="text-text-primary font-medium">Ready to audit your lead management? Start with the 7 warning signs. If three or more apply, block 4 hours this week to set up HubSpot Free. The migration is easier than you think—and the cost of not migrating is higher than you realize.</p>
          </div>

        </article>

        <footer className="max-w-[720px] mx-auto px-6 md:px-8 pb-16">
          <div className="border-t border-border-color pt-10">
            <p className="text-text-secondary mb-4">Need help building systems that scale with you? We ship MVPs in 21 days.</p>
            <a href="/?cta=open" className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-accent-blue to-accent-purple px-10 text-base font-semibold text-white shadow-[0_20px_35px_rgba(37,99,235,0.35)] transition-transform hover:-translate-y-0.5">
              Get Your Launch Roadmap
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}
