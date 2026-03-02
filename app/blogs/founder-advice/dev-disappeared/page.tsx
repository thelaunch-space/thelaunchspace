import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developer Disappeared Mid-Project? Here's Your Recovery Plan | thelaunch.space",
  description: "Your developer vanished halfway through your project. Here's the 72-hour triage plan, salvage vs rebuild framework, and how to avoid getting burned again.",
  openGraph: {
    title: "Developer Disappeared Mid-Project? Here's Your Recovery Plan | thelaunch.space",
    description: "Your developer vanished halfway through your project. Here's the 72-hour triage plan, salvage vs rebuild framework, and how to avoid getting burned again.",
    url: "https://thelaunch.space/blogs/founder-advice/dev-disappeared",
    siteName: "thelaunch.space",
    type: "article",
    publishedTime: "2026-03-02T00:00:00.000Z",
    authors: ["thelaunch.space"],
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Developer Disappeared Mid-Project? Here's Your Recovery Plan" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Developer Disappeared Mid-Project? Here's Your Recovery Plan | thelaunch.space",
    description: "Your developer vanished halfway through your project. Here's the 72-hour triage plan, salvage vs rebuild framework, and how to avoid getting burned again.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: "https://thelaunch.space/blogs/founder-advice/dev-disappeared" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Developer Disappeared Mid-Project? Here's Your Recovery Plan",
  description: "Your developer vanished halfway through your project. Here's the 72-hour triage plan, salvage vs rebuild framework, and how to avoid getting burned again.",
  url: "https://thelaunch.space/blogs/founder-advice/dev-disappeared",
  datePublished: "2026-03-02T00:00:00.000Z",
  dateModified: "2026-03-02T00:00:00.000Z",
  author: { "@type": "Organization", name: "thelaunch.space", url: "https://thelaunch.space" },
  publisher: {
    "@type": "Organization",
    name: "thelaunch.space",
    url: "https://thelaunch.space",
    logo: { "@type": "ImageObject", url: "https://thelaunch.space/logo.png" }
  },
  image: "https://thelaunch.space/og-image.png",
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://thelaunch.space/blogs/founder-advice/dev-disappeared" },
};

export default function BlogPost() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-background text-text-primary">
        {/* Back link */}
        <header className="max-w-[720px] mx-auto px-6 md:px-8 pt-8 md:pt-12">
          <a href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-blue text-sm font-medium transition-colors">
            ← thelaunch.space
          </a>
        </header>

        <article className="max-w-[720px] mx-auto px-6 md:px-8 py-12 md:py-16">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">Developer Disappeared Mid-Project? Here's Your Recovery Plan</h1>
          <div className="flex items-center gap-3 text-sm text-text-secondary mb-10">
            <span>thelaunch.space</span><span>·</span>
            <time dateTime="2026-03-02">Mar 02, 2026</time><span>·</span>
            <span>14 min read</span>
          </div>

          <p className="text-lg md:text-xl text-text-primary leading-relaxed mb-8">
            Your developer stopped responding two weeks ago. You've paid $15,000 for a product that's half-finished and doesn't work. Customers are waiting. Investors are asking for updates. And you have no idea if what exists is salvageable or garbage. We've rescued over a dozen projects in exactly this situation at <a href="/" className="text-accent-blue hover:underline">thelaunch.space</a>. Here's the recovery playbook we use.
          </p>

          <div className="bg-border-color/30 border border-border-color rounded-xl p-6 my-8">
            <p className="text-text-primary font-medium">This guide covers three things: What to do in the first 72 hours, how to decide whether to salvage or rebuild, and how to prevent this from happening again. Bookmark this. You may need it.</p>
          </div>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            If you're reading this, you're probably in panic mode. That's understandable. But panic leads to bad decisions. The founders who recover fastest are the ones who treat this like a business problem, not a personal betrayal. The developer who ghosted you might have had personal issues, might have taken on too much work, or might have simply been in over their head. It doesn't matter anymore. What matters is getting your project across the finish line.
          </p>

          <hr className="border-border-color my-12" />

          <h2 className="text-2xl md:text-3xl font-bold mt-16 mb-4">The First 72 Hours: Secure Everything</h2>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            The window for asset recovery narrows quickly. If your developer has gone silent, assume they're not coming back. Here's what to do immediately.
          </p>

          <h3 className="text-xl md:text-2xl font-bold mt-8 mb-3">Hours 0-24: Gain Access to Everything</h3>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            Your first priority is securing code and credentials. If you don't have direct access to your codebase, you have a serious problem that only gets worse with time. According to <a href="https://docs.github.com/en/repositories/creating-and-managing-repositories/transferring-a-repository" target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline">GitHub's official documentation</a>, repository ownership can be transferred, but only if both parties cooperate or if you have organizational admin rights.
          </p>

          <div className="space-y-4 my-8">
            <div className="bg-border-color/20 rounded-xl p-5">
              <p className="text-text-primary font-semibold mb-1">1. Code Repository Access</p>
              <p className="text-text-secondary text-base leading-relaxed">Log into GitHub, GitLab, or Bitbucket. If you can access the repo, clone it immediately to your local machine or a backup service. If you can't, document that fact in writing.</p>
            </div>
            <div className="bg-border-color/20 rounded-xl p-5">
              <p className="text-text-primary font-semibold mb-1">2. Hosting and Database Access</p>
              <p className="text-text-secondary text-base leading-relaxed">Check your hosting provider (Vercel, Netlify, AWS, Heroku). Can you log in? Do you have the database credentials? Export everything you can access.</p>
            </div>
            <div className="bg-border-color/20 rounded-xl p-5">
              <p className="text-text-primary font-semibold mb-1">3. Third-Party Services</p>
              <p className="text-text-secondary text-base leading-relaxed">APIs, payment processors, email services, analytics. Make a list of every external service your app uses. Check which accounts you control versus which are under the developer's credentials.</p>
            </div>
            <div className="bg-border-color/20 rounded-xl p-5">
              <p className="text-text-primary font-semibold mb-1">4. Documentation and Designs</p>
              <p className="text-text-secondary text-base leading-relaxed">Wireframes, Figma files, specifications, meeting notes. Anything that explains what was supposed to be built. This becomes critical for whoever takes over.</p>
            </div>
          </div>

          <h3 className="text-xl md:text-2xl font-bold mt-8 mb-3">Hours 24-48: Document and Communicate</h3>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            Now that you've secured what you can access, create a paper trail. This protects you legally and helps your next developer understand the situation.
          </p>

          <ul className="list-disc list-inside space-y-2 text-text-secondary text-base md:text-lg mb-6">
            <li>Screenshot all communication with the developer (email, Slack, WhatsApp)</li>
            <li>Document every payment made with dates and amounts</li>
            <li>List what was promised versus what was actually delivered</li>
            <li>Send one final professional message with a 48-hour deadline for response</li>
          </ul>

          <div className="border-l-4 border-accent-blue pl-6 my-8">
            <p className="text-base md:text-lg text-text-primary font-medium leading-relaxed">Don't threaten legal action in your first message. Focus on recovering assets. A reasonable message like "I need access to the repository and all project files by Friday to continue the project" often works better than threats that make developers defensive or hostile.</p>
          </div>

          <h3 className="text-xl md:text-2xl font-bold mt-8 mb-3">Hours 48-72: Make a Call</h3>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            If you've heard nothing by now, you need to accept they're not coming back. The question becomes: Do you pursue the developer legally, or do you move forward without them?
          </p>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            In our experience, legal action rarely makes business sense for projects under $50,000. The time, money, and emotional energy spent fighting usually exceeds what you'd recover. If you have a strong contract with clear IP ownership clauses, a lawyer's demand letter might prompt action. But for most founders, the faster path to revenue is moving forward with someone new.
          </p>

          <div className="bg-border-color/30 border border-border-color rounded-xl p-8 my-10 text-center">
            <p className="text-3xl md:text-4xl font-bold text-text-primary mb-2">31%</p>
            <p className="text-sm md:text-base text-text-secondary">of software projects are abandoned before completion, according to project management research from <a href="https://teamstage.io/project-management-statistics/" target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline">TeamStage</a>. You're not alone.</p>
          </div>

          <hr className="border-border-color my-12" />

          <h2 className="text-2xl md:text-3xl font-bold mt-16 mb-4">Assessing What You Have: The Technical Triage</h2>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            You've secured your assets. Now you need to understand what you actually have. This is where most non-technical founders feel lost. Here's how to evaluate your situation without being able to read code yourself.
          </p>

          <h3 className="text-xl md:text-2xl font-bold mt-8 mb-3">The Five Questions That Matter</h3>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            Before you hire anyone or make any decisions, you need answers to these questions. A technical person can answer them in 2-4 hours of review.
          </p>

          <div className="space-y-4 my-8">
            <div className="bg-border-color/20 rounded-xl p-5">
              <p className="text-text-primary font-semibold mb-1">1. Does the code actually run?</p>
              <p className="text-text-secondary text-base leading-relaxed">Can someone start the application locally? Does it load? Does anything work at all? This is your baseline. Some abandoned projects are 80% complete but functional. Others are a collection of files that never worked together.</p>
            </div>
            <div className="bg-border-color/20 rounded-xl p-5">
              <p className="text-text-primary font-semibold mb-1">2. What percentage is actually complete?</p>
              <p className="text-text-secondary text-base leading-relaxed">Not what the developer claimed. What actually works when you click through it? Map every feature that was promised against what exists and functions.</p>
            </div>
            <div className="bg-border-color/20 rounded-xl p-5">
              <p className="text-text-primary font-semibold mb-1">3. How maintainable is the code?</p>
              <p className="text-text-secondary text-base leading-relaxed">Is there documentation? Comments? A logical structure? Or is it spaghetti that only the original developer could understand? This determines how expensive it will be for someone new to work with it.</p>
            </div>
            <div className="bg-border-color/20 rounded-xl p-5">
              <p className="text-text-primary font-semibold mb-1">4. What's the technology stack?</p>
              <p className="text-text-secondary text-base leading-relaxed">Is it built with modern, well-supported tools? Or outdated frameworks that make hiring difficult? A project built in React or Next.js is easier to staff than one built in an obscure framework from 2015.</p>
            </div>
            <div className="bg-border-color/20 rounded-xl p-5">
              <p className="text-text-primary font-semibold mb-1">5. Are there security issues?</p>
              <p className="text-text-secondary text-base leading-relaxed">Hardcoded passwords, exposed API keys, missing authentication checks. Security problems can turn a "90% complete" project into a liability that needs a full rewrite.</p>
            </div>
          </div>

          <h3 className="text-xl md:text-2xl font-bold mt-8 mb-3">Getting a Quick Technical Assessment</h3>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            You have two options: pay for a formal audit or get an informal opinion from someone you trust.
          </p>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            <span className="text-text-primary font-semibold">Paid audit ($500-$2,000):</span> A senior developer spends 2-8 hours reviewing your codebase and gives you a written report. This is worth it if you're deciding between spending $10,000+ on salvage versus rebuild. The audit fee is insurance against a bad decision.
          </p>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            <span className="text-text-primary font-semibold">Informal review (free or favor):</span> If you know a technical founder or senior developer, ask them to spend an hour looking at your repo. They can give you a gut check: "This looks salvageable" or "This is a mess, start over."
          </p>

          <div className="border-l-4 border-accent-blue pl-6 my-8">
            <p className="text-base md:text-lg text-text-primary font-medium leading-relaxed">Be wary of developers who want to audit and then do the rescue work. Their incentive is to recommend whatever option pays them more. Get the audit from someone who won't be doing the actual work.</p>
          </div>

          <hr className="border-border-color my-12" />

          <h2 className="text-2xl md:text-3xl font-bold mt-16 mb-4">Salvage vs. Rebuild: The Decision Framework</h2>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            This is the question that haunts abandoned-project founders. Your gut says "Don't throw away what I've paid for." But sometimes rebuilding is faster and cheaper than fixing a broken foundation.
          </p>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            According to research from <a href="https://www.jhavtech.com.au/fix-vs-rebuild-failing-software-project/" target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline">JhavTech Studios</a>, salvaging is typically 30-60% faster than rebuilding when the core architecture is sound. But the operative phrase is "when the core architecture is sound." Bad architecture makes salvage more expensive than starting fresh.
          </p>

          <h3 className="text-xl md:text-2xl font-bold mt-8 mb-3">When to Salvage</h3>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            Salvaging makes sense when you have a solid foundation with incomplete features. Think of it like a house that's framed and wired but missing the kitchen. The structure is there. You're finishing, not fixing.
          </p>

          <ul className="list-disc list-inside space-y-2 text-text-secondary text-base md:text-lg mb-6">
            <li>Core functionality exists and works (authentication, database, basic flows)</li>
            <li>Code quality is reasonable even if incomplete</li>
            <li>You've paid more than 50% of the estimated project cost</li>
            <li>The technology stack is modern and well-supported</li>
            <li>Timeline is critical and salvaging is faster</li>
            <li>You have documentation of what was planned</li>
          </ul>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            Typical salvage cost: 40-70% of the original project budget. If you've already paid $15,000 for a $20,000 project, expect to spend another $8,000-$14,000 to finish via salvage.
          </p>

          <h3 className="text-xl md:text-2xl font-bold mt-8 mb-3">When to Rebuild</h3>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            Rebuilding makes sense when the existing code is more liability than asset. Sometimes you're better off taking the lessons learned (and the specs and designs) and starting clean.
          </p>

          <ul className="list-disc list-inside space-y-2 text-text-secondary text-base md:text-lg mb-6">
            <li>Code quality is poor (no structure, no documentation, security issues)</li>
            <li>Less than 30% of features actually work</li>
            <li>The technology choices were wrong for your needs</li>
            <li>Multiple developers have looked at it and said "start over"</li>
            <li>You've learned the original requirements were wrong anyway</li>
            <li>Fixing the foundation would cost more than rebuilding</li>
          </ul>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            Typical rebuild cost: Similar to starting fresh, but you have clearer specs now. You know what you want because you've seen what doesn't work.
          </p>

          <div className="bg-border-color/30 border border-border-color rounded-xl p-8 my-10 text-center">
            <p className="text-3xl md:text-4xl font-bold text-text-primary mb-2">15-40%</p>
            <p className="text-sm md:text-base text-text-secondary">of IT budgets go toward managing technical debt, according to <a href="https://www.alixpartners.com/insights/102joz4/the-rising-tax-in-tech-debt-do-you-know-the-true-cost-of-change/" target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline">AlixPartners</a>. Inheriting someone else's technical debt means inheriting their shortcuts and mistakes.</p>
          </div>

          <h3 className="text-xl md:text-2xl font-bold mt-8 mb-3">The Hybrid Approach</h3>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            Sometimes the answer isn't either/or. You might salvage the database and business logic while rebuilding the user interface. Or keep the backend architecture but rebuild how it connects to the frontend.
          </p>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            In our experience at thelaunch.space, the hybrid approach works well when: the data model is correct but the UI is broken, the backend is solid but the frontend is a mess, or the core logic is sound but the code organization is chaos. A good technical advisor can suggest creative solutions that save both time and money.
          </p>

          <hr className="border-border-color my-12" />

          <h2 className="text-2xl md:text-3xl font-bold mt-16 mb-4">Finding a Rescue Partner You Can Trust</h2>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            You've been burned. The last thing you want is to hand money to another developer who'll disappear. Here's how to find someone who can actually finish your project.
          </p>

          <h3 className="text-xl md:text-2xl font-bold mt-8 mb-3">What Makes Someone Good at Rescues</h3>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            Rescue work is a specific skill. Not every talented developer is good at it. You need someone who can read and understand code they didn't write, has worked with messy codebases before, can give honest assessments without ego, and understands business constraints, not just technical ones.
          </p>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            The best rescue developers have done this before. Ask for specific examples: "Tell me about a project you took over from someone else. What state was it in? What did you do? How long did it take?"
          </p>

          <h3 className="text-xl md:text-2xl font-bold mt-8 mb-3">Red Flags in Rescue Vendors</h3>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            Watch for these warning signs. Ironically, they're often the same red flags you missed with your first developer.
          </p>

          <div className="space-y-4 my-8">
            <div className="bg-border-color/20 rounded-xl p-5">
              <p className="text-text-primary font-semibold mb-1">They trash-talk without analysis</p>
              <p className="text-text-secondary text-base leading-relaxed">"This code is garbage, we need to rewrite everything" before spending real time understanding it is a red flag. Good rescue developers reserve judgment until they've actually looked.</p>
            </div>
            <div className="bg-border-color/20 rounded-xl p-5">
              <p className="text-text-primary font-semibold mb-1">They promise unrealistic timelines</p>
              <p className="text-text-secondary text-base leading-relaxed">"I can fix everything in two weeks" for a project that took six months is almost certainly wrong. Rescue work reveals surprises. Honest estimates include buffer.</p>
            </div>
            <div className="bg-border-color/20 rounded-xl p-5">
              <p className="text-text-primary font-semibold mb-1">They want full payment upfront</p>
              <p className="text-text-secondary text-base leading-relaxed">You just got burned by someone who took money and disappeared. Milestone-based payments protect both parties. Any developer who insists on full payment before delivery isn't sharing the risk.</p>
            </div>
            <div className="bg-border-color/20 rounded-xl p-5">
              <p className="text-text-primary font-semibold mb-1">They can't explain their process</p>
              <p className="text-text-secondary text-base leading-relaxed">"What's your process for taking over an abandoned project?" should have a clear answer. If they're making it up as they go, you'll pay for their learning curve.</p>
            </div>
          </div>

          <h3 className="text-xl md:text-2xl font-bold mt-8 mb-3">Questions to Ask Before Hiring</h3>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            These questions reveal whether someone is actually equipped to rescue your project.
          </p>

          <ul className="list-disc list-inside space-y-2 text-text-secondary text-base md:text-lg mb-6">
            <li>"Have you taken over incomplete projects before? Tell me about one specifically."</li>
            <li>"What's your process for evaluating existing code before you start work?"</li>
            <li>"How do you decide whether to salvage versus rebuild?"</li>
            <li>"What will you need from me to take over this project?"</li>
            <li>"How will we communicate during the project? How often will I see progress?"</li>
            <li>"What happens if we discover the project is in worse shape than expected?"</li>
          </ul>

          <div className="border-l-4 border-accent-blue pl-6 my-8">
            <p className="text-base md:text-lg text-text-primary font-medium leading-relaxed">The AI-first advantage: In 2026, developers using AI coding tools like Claude Code or Cursor can assess and work with unfamiliar codebases much faster than traditional developers. At thelaunch.space, we typically complete technical assessments in 2-3 days versus the 1-2 weeks traditional rescue services quote.</p>
          </div>

          <hr className="border-border-color my-12" />

          <h2 className="text-2xl md:text-3xl font-bold mt-16 mb-4">Prevention: Protecting Yourself on the Next Project</h2>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            The best rescue is the one you never need. Here are the warning signs to watch during development and the structures that protect you.
          </p>

          <h3 className="text-xl md:text-2xl font-bold mt-8 mb-3">10 Warning Signs Your Developer Might Disappear</h3>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            These patterns often precede a ghosting. If you see three or more, start contingency planning.
          </p>

          <ol className="list-decimal list-inside space-y-2 text-text-secondary text-base md:text-lg mb-6">
            <li><span className="text-text-primary font-semibold">Response times are getting longer.</span> Two-hour replies become two-day replies.</li>
            <li><span className="text-text-primary font-semibold">Demos keep getting postponed.</span> "It's almost ready" for weeks in a row.</li>
            <li><span className="text-text-primary font-semibold">They're vague about blockers.</span> Can't explain specifically what's holding things up.</li>
            <li><span className="text-text-primary font-semibold">Excuses are personal, not technical.</span> Family emergencies, health issues, moving. Once is life. Repeatedly is a pattern.</li>
            <li><span className="text-text-primary font-semibold">They resist giving you repository access.</span> "I'll add you when it's cleaner" is a red flag.</li>
            <li><span className="text-text-primary font-semibold">Milestone dates slip without explanation.</span> You learn about delays after they happen, not before.</li>
            <li><span className="text-text-primary font-semibold">They're taking on other clients.</span> Your project becomes one of many, not the priority.</li>
            <li><span className="text-text-primary font-semibold">Communication goes from proactive to reactive.</span> You're always the one following up.</li>
            <li><span className="text-text-primary font-semibold">Quality is declining.</span> Recent work has more bugs than earlier work.</li>
            <li><span className="text-text-primary font-semibold">They stop asking questions.</span> A developer who stops seeking clarification is either confident or checked out.</li>
          </ol>

          <h3 className="text-xl md:text-2xl font-bold mt-8 mb-3">Project Structures That Protect You</h3>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            These aren't about distrust. They're about creating accountability structures that keep projects on track. Good developers appreciate clarity.
          </p>

          <div className="space-y-4 my-8">
            <div className="bg-border-color/20 rounded-xl p-5">
              <p className="text-text-primary font-semibold mb-1">Milestone-based payments</p>
              <p className="text-text-secondary text-base leading-relaxed">Never pay more than 30% upfront. Structure payments around demonstrated, working features. "Login works" not "login is done."</p>
            </div>
            <div className="bg-border-color/20 rounded-xl p-5">
              <p className="text-text-primary font-semibold mb-1">Weekly demos (non-negotiable)</p>
              <p className="text-text-secondary text-base leading-relaxed">You should see working software every week. Not promises. Not "it works on my machine." A demo you can click through.</p>
            </div>
            <div className="bg-border-color/20 rounded-xl p-5">
              <p className="text-text-primary font-semibold mb-1">Shared repository from day one</p>
              <p className="text-text-secondary text-base leading-relaxed">Code lives in a repository you own and control. The developer contributes to your repo, not the other way around.</p>
            </div>
            <div className="bg-border-color/20 rounded-xl p-5">
              <p className="text-text-primary font-semibold mb-1">Documentation requirements</p>
              <p className="text-text-secondary text-base leading-relaxed">Part of every milestone is documentation. How does this feature work? How would another developer continue it? This protects you if they leave.</p>
            </div>
            <div className="bg-border-color/20 rounded-xl p-5">
              <p className="text-text-primary font-semibold mb-1">IP ownership in the contract</p>
              <p className="text-text-secondary text-base leading-relaxed">The contract should explicitly state that all code, designs, and documentation belong to you. According to <a href="https://www.wolterskluwer.com/en/solutions/bizfilings/tools-and-resources/tools-forms/independent-contractor-agreement-template" target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline">standard contractor agreement best practices</a>, this should be explicit, not assumed.</p>
            </div>
          </div>

          <div className="bg-border-color/30 border border-border-color rounded-xl p-8 my-10 text-center">
            <p className="text-3xl md:text-4xl font-bold text-text-primary mb-2">70%</p>
            <p className="text-sm md:text-base text-text-secondary">of software projects fail to deliver promised outcomes without proper management processes, per <a href="https://teamstage.io/project-management-statistics/" target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline">TeamStage research</a>. Clear milestones and accountability structures are the difference between the 70% that fail and the 30% that succeed.</p>
          </div>

          <hr className="border-border-color my-12" />

          <h2 className="text-2xl md:text-3xl font-bold mt-16 mb-4">Your Recovery Checklist</h2>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            Here's everything covered in this guide as a checklist you can work through.
          </p>

          <h3 className="text-xl md:text-2xl font-bold mt-8 mb-3">First 72 Hours</h3>

          <ul className="list-disc list-inside space-y-2 text-text-secondary text-base md:text-lg mb-6">
            <li>Secure code repository access (or document that you can't)</li>
            <li>Export all databases and backups you can access</li>
            <li>Document all third-party service credentials</li>
            <li>Save all communication history</li>
            <li>Send professional final message with 48-hour deadline</li>
            <li>Document payments made versus deliverables received</li>
          </ul>

          <h3 className="text-xl md:text-2xl font-bold mt-8 mb-3">Technical Assessment</h3>

          <ul className="list-disc list-inside space-y-2 text-text-secondary text-base md:text-lg mb-6">
            <li>Get answers to the five key questions</li>
            <li>Decide: paid audit, informal review, or move forward blind</li>
            <li>Understand your salvage vs. rebuild options</li>
          </ul>

          <h3 className="text-xl md:text-2xl font-bold mt-8 mb-3">Finding a Rescue Partner</h3>

          <ul className="list-disc list-inside space-y-2 text-text-secondary text-base md:text-lg mb-6">
            <li>Look for rescue-specific experience</li>
            <li>Watch for red flags (trash-talking, unrealistic timelines, upfront payment demands)</li>
            <li>Ask the key questions before committing</li>
            <li>Structure with milestones and demos</li>
          </ul>

          <h3 className="text-xl md:text-2xl font-bold mt-8 mb-3">Future Prevention</h3>

          <ul className="list-disc list-inside space-y-2 text-text-secondary text-base md:text-lg mb-6">
            <li>Watch for the 10 warning signs during development</li>
            <li>Implement protective structures from day one</li>
            <li>Get IP ownership explicitly in writing</li>
          </ul>

          <hr className="border-border-color my-12" />

          <h2 className="text-2xl md:text-3xl font-bold mt-16 mb-4">You Will Get Through This</h2>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            Losing a developer mid-project feels like a crisis. And it is. But it's a solvable one. Founders recover from this every day. The ones who recover fastest are the ones who treat it like a business problem, make decisions based on data rather than emotion, and find partners who've been through it before.
          </p>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            At thelaunch.space, we've rescued education platforms, fintech tools, healthcare apps, and e-commerce systems. We've seen codebases that were 90% done and needed a push across the finish line. We've seen codebases that were better burned to the ground. The common thread is that every founder came out the other side with a working product.
          </p>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            If you're dealing with an abandoned project right now and aren't sure whether to salvage or rebuild, <a href="/blogs/startup-mvps/why-agency-mvp-failed" className="text-accent-blue hover:underline">understanding why your first approach failed</a> can help you avoid the same mistakes. And if you're earlier in the process, still trying to <a href="/blogs/startup-mvps/how-to-find-technical-cofounder" className="text-accent-blue hover:underline">find the right technical partner</a>, the principles in this guide apply there too.
          </p>

          <div className="border-l-4 border-accent-blue pl-6 my-8">
            <p className="text-base md:text-lg text-text-primary font-medium leading-relaxed">The most expensive mistake isn't paying for code that didn't work. It's letting a bad experience stop you from building what your customers need. Your domain expertise is still valuable. The problem you're solving is still real. You just need a better path to get there.</p>
          </div>

        </article>

        {/* Footer CTA */}
        <footer className="max-w-[720px] mx-auto px-6 md:px-8 pb-16">
          <div className="border-t border-border-color pt-10">
            <p className="text-text-secondary mb-4">Have an idea? We ship MVPs in 21 days.</p>
            <a href="/?cta=open" className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-accent-blue to-accent-purple px-10 text-base font-semibold text-white shadow-[0_20px_35px_rgba(37,99,235,0.35)] transition-transform hover:-translate-y-0.5">
              Get Your Launch Roadmap
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}
