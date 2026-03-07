import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vertical vs. Horizontal Development: What Non-Technical Founders Must Know | thelaunch.space",
  description: "Your 70%-complete MVP got canceled because stakeholders couldn't see value. Learn the vertical slice approach that shows progress weekly—not months later.",
  openGraph: {
    title: "Vertical vs. Horizontal Development: What Non-Technical Founders Must Know | thelaunch.space",
    description: "Your 70%-complete MVP got canceled because stakeholders couldn't see value. Learn the vertical slice approach that shows progress weekly—not months later.",
    url: "https://thelaunch.space/blogs/startup-mvps/mvp-canceled-at-70-percent",
    siteName: "thelaunch.space",
    type: "article",
    publishedTime: "2026-03-07T00:00:00.000Z",
    authors: ["thelaunch.space"],
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Vertical vs. Horizontal Development: What Non-Technical Founders Must Know" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vertical vs. Horizontal Development: What Non-Technical Founders Must Know | thelaunch.space",
    description: "Your 70%-complete MVP got canceled because stakeholders couldn't see value. Learn the vertical slice approach that shows progress weekly—not months later.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: "https://thelaunch.space/blogs/startup-mvps/mvp-canceled-at-70-percent" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Vertical vs. Horizontal Development: What Non-Technical Founders Must Know",
  description: "Your 70%-complete MVP got canceled because stakeholders couldn't see value. Learn the vertical slice approach that shows progress weekly—not months later.",
  url: "https://thelaunch.space/blogs/startup-mvps/mvp-canceled-at-70-percent",
  datePublished: "2026-03-07T00:00:00.000Z",
  dateModified: "2026-03-07T00:00:00.000Z",
  author: { "@type": "Organization", name: "thelaunch.space", url: "https://thelaunch.space" },
  publisher: {
    "@type": "Organization",
    name: "thelaunch.space",
    url: "https://thelaunch.space",
    logo: { "@type": "ImageObject", url: "https://thelaunch.space/logo.png" }
  },
  image: "https://thelaunch.space/og-image.png",
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://thelaunch.space/blogs/startup-mvps/mvp-canceled-at-70-percent" },
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
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">Vertical vs. Horizontal Development: What Non-Technical Founders Must Know</h1>
          <div className="flex items-center gap-3 text-sm text-text-secondary mb-10">
            <span>thelaunch.space</span><span>·</span>
            <time dateTime="2026-03-07">Mar 7, 2026</time><span>·</span>
            <span>10 min read</span>
          </div>

          <p className="text-lg md:text-xl text-text-primary leading-relaxed mb-8">
            A tech lead recently shared a painful lesson on Reddit: his project was canceled at <span className="text-text-primary font-semibold">70% completion</span>. Not because the code was bad. Not because the timeline slipped dramatically. The leadership group pulled the plug because they <span className="text-text-primary font-semibold">"could not see any value coming from it."</span>
          </p>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            Three months of work. A solid team. Transparent updates throughout. And still—canceled. His mistake? He split the project into "sensible technical deliverables." Infrastructure first, then internal tooling, then the user-facing features. By the time the project was 70% done, stakeholders had seen nothing they could actually use.
          </p>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            This isn't a rare story. According to the <a href="https://www.standishgroup.com/" target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline">Standish Group's CHAOS reports</a>, 31.1% of software projects are canceled before completion. Another 52.7% finish over budget—averaging 189% of the original estimate. If you're a non-technical founder working with developers or agencies, this should concern you.
          </p>

          <div className="bg-border-color/30 border border-border-color rounded-xl p-8 my-10 text-center">
            <p className="text-3xl md:text-4xl font-bold text-text-primary mb-2">31% canceled · 53% over budget</p>
            <p className="text-sm md:text-base text-text-secondary">Software project failure rates from industry research spanning three decades</p>
          </div>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            The difference between projects that survive and those that get canceled often comes down to one architectural decision you've probably never heard of: <span className="text-text-primary font-semibold">vertical vs. horizontal development</span>.
          </p>

          <hr className="border-border-color my-12" />

          <h2 className="text-2xl md:text-3xl font-bold mt-16 mb-4">The Hidden Trap: Horizontal Development</h2>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            Here's what horizontal development looks like in practice. Your dev team (or agency) starts by building the database layer. Then the API. Then the backend logic. Finally, months later, they build the user interface that ties it all together.
          </p>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            Each layer makes technical sense. Databases need to exist before APIs can query them. APIs need to exist before the frontend can call them. It feels logical. But here's the problem: for weeks or months, you see nothing you can actually click, test, or show to a customer.
          </p>

          <div className="space-y-4 my-8">
            <div className="bg-border-color/20 rounded-xl p-5">
              <p className="text-text-primary font-semibold mb-1">Week 1-4: Database architecture</p>
              <p className="text-text-secondary text-base leading-relaxed">You get schema diagrams and technical documents. Nothing to demo.</p>
            </div>
            <div className="bg-border-color/20 rounded-xl p-5">
              <p className="text-text-primary font-semibold mb-1">Week 5-8: Backend API development</p>
              <p className="text-text-secondary text-base leading-relaxed">You get endpoint lists and Postman collections. Still nothing users can see.</p>
            </div>
            <div className="bg-border-color/20 rounded-xl p-5">
              <p className="text-text-primary font-semibold mb-1">Week 9-12: Frontend integration</p>
              <p className="text-text-secondary text-base leading-relaxed">Finally, screens appear. But if there's a fundamental misunderstanding? You discover it three months in.</p>
            </div>
          </div>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            The tech lead from Reddit fell into this exact trap. His updates were technically accurate—"infrastructure 80% complete," "tooling integration on track." But to executives who don't read code, these updates translated to: "We've spent three months and have nothing to show for it."
          </p>

          <div className="border-l-4 border-accent-blue pl-6 my-8">
            <p className="text-base md:text-lg text-text-primary font-medium leading-relaxed">"My mistake was sectioning the project into sensible technical deliverables. I should have made the first value-creating end results part of the first deliverable, even if the infrastructure to run it was missing."</p>
            <p className="text-sm text-text-secondary mt-2">— Tech lead, reflecting on his canceled project</p>
          </div>

          <hr className="border-border-color my-12" />

          <h2 className="text-2xl md:text-3xl font-bold mt-16 mb-4">The Antidote: Vertical Slicing</h2>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            Vertical slicing takes a completely different approach. Instead of building layer by layer, you build <span className="text-text-primary font-semibold">feature by feature</span>—each feature touching every layer it needs, from database to UI.
          </p>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            Think of it like eating cake. Horizontal development is eating all the frosting first, then all the cake, then all the filling. Vertical slicing is cutting a full slice—frosting, cake, and filling in every bite. Each slice is a complete experience.
          </p>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            In software terms:
          </p>

          <ul className="list-disc list-inside space-y-2 text-text-secondary text-base md:text-lg mb-6">
            <li><span className="text-text-primary font-semibold">Week 1:</span> Users can sign up and see a dashboard (even if it shows static data)</li>
            <li><span className="text-text-primary font-semibold">Week 2:</span> Users can perform one core action (even if other features are missing)</li>
            <li><span className="text-text-primary font-semibold">Week 3:</span> Users can complete an end-to-end workflow (even if it's rough)</li>
          </ul>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            Every week, you have something demonstrable. Something a stakeholder can click. Something a potential customer can react to. Something that proves the project is progressing toward real value.
          </p>

          <div className="bg-border-color/30 border border-border-color rounded-xl p-6 my-8">
            <p className="text-text-primary font-medium">The key insight: A feature that works end-to-end—even if it's rough—is infinitely more valuable for validation than infrastructure that's "80% complete."</p>
          </div>

          <hr className="border-border-color my-12" />

          <h2 className="text-2xl md:text-3xl font-bold mt-16 mb-4">Why Horizontal Building Feels Like Progress (But Isn't)</h2>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            Developers often default to horizontal building because it matches how they think about systems. Databases are foundational. APIs depend on databases. UI depends on APIs. Building in that order feels efficient from an engineering perspective.
          </p>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            The problem is that <span className="text-text-primary font-semibold">technical milestones are not the same as business value</span>. A completed database schema is progress for a developer. For a founder, investor, or customer, it's invisible.
          </p>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            If you've ever worked with an agency and felt like you were writing checks for months without seeing results, this might be why. They were building horizontally—solid engineering work that simply doesn't translate into demonstrable progress for non-technical stakeholders.
          </p>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            This is particularly dangerous when you're working with outside developers. As we've noted when discussing <a href="/blogs/startup-mvps/why-agency-mvp-failed" className="text-accent-blue hover:underline">why agency MVP projects fail</a>, the disconnect between technical progress and perceived value is one of the leading causes of canceled projects.
          </p>

          <hr className="border-border-color my-12" />

          <h2 className="text-2xl md:text-3xl font-bold mt-16 mb-4">The Friday Demo Test</h2>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            Here's a simple rule to catch horizontal building before it's too late: <span className="text-text-primary font-semibold">If your dev team can't show you something a user can click every Friday, you're in danger.</span>
          </p>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            Not technical documentation. Not architecture diagrams. Not "the API is 80% complete." Something visual. Something you can interact with. Something you could conceivably show to a potential customer and get a reaction.
          </p>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            This isn't about micromanaging your developers. It's about ensuring the project is being built in a way that creates demonstrable value incrementally rather than all at once at the end.
          </p>

          <h3 className="text-xl md:text-2xl font-bold mt-8 mb-3">The Three Checkpoint Questions</h3>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            Every week, ask your dev team these three questions:
          </p>

          <div className="space-y-4 my-8">
            <div className="bg-border-color/20 rounded-xl p-5">
              <p className="text-text-primary font-semibold mb-1">1. "What can a user DO this week that they couldn't last week?"</p>
              <p className="text-text-secondary text-base leading-relaxed">This forces the answer to focus on user actions, not technical completion.</p>
            </div>
            <div className="bg-border-color/20 rounded-xl p-5">
              <p className="text-text-primary font-semibold mb-1">2. "Can I click through this feature end-to-end, even if it's rough?"</p>
              <p className="text-text-secondary text-base leading-relaxed">Rough is fine. Non-existent is not. This catches horizontal building early.</p>
            </div>
            <div className="bg-border-color/20 rounded-xl p-5">
              <p className="text-text-primary font-semibold mb-1">3. "If we paused the project today, what could we ship to 10 beta users?"</p>
              <p className="text-text-secondary text-base leading-relaxed">This is the stress test. If the answer is "nothing," you're building horizontally.</p>
            </div>
          </div>

          <hr className="border-border-color my-12" />

          <h2 className="text-2xl md:text-3xl font-bold mt-16 mb-4">The Stakeholder Communication Gap</h2>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            The Reddit tech lead did everything "right" by engineering standards. He gave transparent updates. He hit his technical milestones. The CEO had approved the plan.
          </p>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            But stakeholders at the executive level don't evaluate progress the way engineers do. They ask simple questions: What can this do for customers today? When will we see revenue potential? Why should we keep funding this?
          </p>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            If your updates sound like "database migration complete" and "API endpoints integrated," you're speaking a language they don't understand. And when budget decisions come up, projects that can't demonstrate value get cut.
          </p>

          <div className="border-l-4 border-accent-blue pl-6 my-8">
            <p className="text-base md:text-lg text-text-primary font-medium leading-relaxed">Vertical slicing isn't just good engineering—it's stakeholder communication translated into code structure.</p>
          </div>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            When you build vertically, your updates change. Instead of "backend 70% complete," you say: "Users can now sign up, create a profile, and see their dashboard. Next week they'll be able to complete their first transaction." That's progress anyone can understand.
          </p>

          <hr className="border-border-color my-12" />

          <h2 className="text-2xl md:text-3xl font-bold mt-16 mb-4">What to Put in Your Agency or Developer Contract</h2>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            If you're hiring developers or an agency, you can protect yourself by building vertical delivery into the contract itself.
          </p>

          <h3 className="text-xl md:text-2xl font-bold mt-8 mb-3">The Weekly Demo Clause</h3>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            Include language that requires weekly demos of working functionality—not just technical updates. Something like:
          </p>

          <div className="bg-border-color/30 border border-border-color rounded-xl p-6 my-8">
            <p className="text-text-primary font-medium">"Developer shall provide weekly demonstrations of user-facing functionality. Each demonstration must show at least one new capability a user can perform that was not available the previous week. Technical progress reports alone do not satisfy this requirement."</p>
          </div>

          <h3 className="text-xl md:text-2xl font-bold mt-8 mb-3">Milestone Payments Tied to User Actions</h3>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            Structure payments around user capabilities, not technical layers:
          </p>

          <ul className="list-disc list-inside space-y-2 text-text-secondary text-base md:text-lg mb-6">
            <li><span className="text-text-primary font-semibold">Payment 1:</span> User can sign up and access the main dashboard</li>
            <li><span className="text-text-primary font-semibold">Payment 2:</span> User can complete core action X end-to-end</li>
            <li><span className="text-text-primary font-semibold">Payment 3:</span> User can perform secondary action Y</li>
            <li><span className="text-text-primary font-semibold">Final payment:</span> Full feature set deployed and tested</li>
          </ul>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            This naturally forces vertical delivery. A developer can't claim "database complete" and ask for payment—the milestone requires demonstrable user capability.
          </p>

          <hr className="border-border-color my-12" />

          <h2 className="text-2xl md:text-3xl font-bold mt-16 mb-4">When Horizontal Building Is Actually Okay</h2>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            Vertical slicing isn't a universal rule. There are legitimate cases where horizontal building makes sense:
          </p>

          <ul className="list-disc list-inside space-y-2 text-text-secondary text-base md:text-lg mb-6">
            <li><span className="text-text-primary font-semibold">Security or compliance refactors:</span> Sometimes you need to rebuild authentication infrastructure before any feature can be touched.</li>
            <li><span className="text-text-primary font-semibold">Major platform migrations:</span> Moving from one database system to another requires horizontal work.</li>
            <li><span className="text-text-primary font-semibold">Performance overhauls:</span> Fixing scaling issues might require deep infrastructure changes that don't produce visible features.</li>
          </ul>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            The key difference: these projects should be understood by stakeholders as infrastructure investments, not feature development. Set expectations accordingly. "This will be two months of invisible but necessary work" is a valid conversation—as long as it happens upfront, not when the project gets canceled.
          </p>

          <hr className="border-border-color my-12" />

          <h2 className="text-2xl md:text-3xl font-bold mt-16 mb-4">What to Do If You're Already Stuck</h2>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            If you're reading this and realizing your current project might be building horizontally, here's a recovery path:
          </p>

          <h3 className="text-xl md:text-2xl font-bold mt-8 mb-3">Week 1: Freeze New Backend Work</h3>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            Stop adding infrastructure. Take what exists and build a clickable prototype using the pieces you have. Even if it uses hardcoded data or mock responses, create something demonstrable.
          </p>

          <h3 className="text-xl md:text-2xl font-bold mt-8 mb-3">Week 2: Demo to 5 Users</h3>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            Show the prototype to real potential users. Gather feedback. This accomplishes two things: it validates (or invalidates) assumptions before more money is spent, and it gives you ammunition to show stakeholders that the project has value.
          </p>

          <h3 className="text-xl md:text-2xl font-bold mt-8 mb-3">Week 3: Replan Around Vertical Slices</h3>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            Take the remaining scope and restructure it into user-facing milestones. What's the next thing a user will be able to do? Build that complete—UI, logic, and data—before moving to the next capability.
          </p>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            If your project has gone off the rails to the point where your <a href="/blogs/founder-advice/dev-disappeared" className="text-accent-blue hover:underline">developer has disappeared mid-project</a>, the same principles apply to whoever picks up the work next: vertical delivery from day one.
          </p>

          <hr className="border-border-color my-12" />

          <h2 className="text-2xl md:text-3xl font-bold mt-16 mb-4">Key Takeaways</h2>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            The 70% cancellation story isn't an anomaly—it's a pattern. Technical progress that doesn't translate into visible value is progress that stakeholders, investors, and even you as a founder can't evaluate.
          </p>

          <div className="space-y-4 my-8">
            <div className="bg-border-color/20 rounded-xl p-5">
              <p className="text-text-primary font-semibold mb-1">Build features, not layers</p>
              <p className="text-text-secondary text-base leading-relaxed">Every sprint should produce something a user can do that they couldn't do before.</p>
            </div>
            <div className="bg-border-color/20 rounded-xl p-5">
              <p className="text-text-primary font-semibold mb-1">Apply the Friday Demo Test</p>
              <p className="text-text-secondary text-base leading-relaxed">If your dev team can't show clickable progress every week, restructure immediately.</p>
            </div>
            <div className="bg-border-color/20 rounded-xl p-5">
              <p className="text-text-primary font-semibold mb-1">Contract for outcomes, not effort</p>
              <p className="text-text-secondary text-base leading-relaxed">Tie payments to user-facing milestones, not technical completion percentages.</p>
            </div>
            <div className="bg-border-color/20 rounded-xl p-5">
              <p className="text-text-primary font-semibold mb-1">Ask the three questions weekly</p>
              <p className="text-text-secondary text-base leading-relaxed">What can users do now? Can I click through it? What could we ship today?</p>
            </div>
          </div>

          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            The tech lead learned this lesson the hard way: "I should have made vertical deliverables instead. They have to show the value that could be created by the new system." Whether you're building at <a href="/" className="text-accent-blue hover:underline">thelaunch.space</a> or working with any development team, this principle holds. Technical progress that stakeholders can't see is progress that can get you canceled at 70%.
          </p>

        </article>

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
