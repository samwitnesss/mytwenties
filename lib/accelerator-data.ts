// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type AssetType =
  | 'session_notes'
  | 'roadmap'
  | 'business_plan'
  | 'offer_strategy'
  | 'client_playbook'
  | 'brand_blueprint'
  | 'portfolio_builder'
  | 'strategic_plan'
  | 'growth_roadmap';

export type Tier = 'free' | 'paid' | 'accelerator';

export type Priority = 'must' | 'should' | 'bonus';

export type TaskPriority = 'must_do' | 'should_do' | 'bonus';

export interface PortalUser {
  id: string;
  firstName: string;
  tier: Tier;
  programWeek: number;
  programStartDate?: string;
}

// ── Session Notes ──────────────────────────────

export interface KeyMoment {
  quote: string;
  context: string;
}

export interface Reframe {
  headline: string;
  body: string;
}

export interface NextStep {
  action: string;
  deadline: string;
  priority: Priority;
}

export interface SessionNotesData {
  session_number: number;
  date: string;
  client_name: string;
  current_situation: string;
  building_toward: string;
  direction: string;
  key_moments: KeyMoment[];
  reframe: Reframe;
  next_steps: NextStep[];
}

// ── Roadmap ────────────────────────────────────

export interface Resource {
  title: string;
  url_hint: string;
}

export interface RoadmapTask {
  title: string;
  description: string;
  priority: TaskPriority;
  time_estimate: string;
  sub_steps: string[];
  tips: string[];
  resources: Resource[];
}

export interface RoadmapWeek {
  week: number;
  theme: string;
  tasks: RoadmapTask[];
  milestone: string;
  checkpoint_question: string;
}

export interface Contingency {
  falling_behind: string;
  ahead_of_schedule: string;
}

export interface RoadmapData {
  direction: string;
  hours_per_week: number;
  pacing: string;
  starting_level: string;
  personal_note: string;
  weeks: RoadmapWeek[];
  contingency: Contingency;
}

// ── Asset Config ───────────────────────────────

export interface AssetConfig {
  title: string;
  description: string;
  icon: string;
  week_unlock: number;
}

// ─────────────────────────────────────────────
// Sample Data
// ─────────────────────────────────────────────

export const SAMPLE_SESSION_NOTES: SessionNotesData = {
  session_number: 1,
  date: '2026-03-10',
  client_name: 'Jordan',

  current_situation:
    'Jordan is a 24-year-old marketing manager at a mid-stage SaaS company, responsible for running paid campaigns and supporting content operations. On the side, he has been taking on freelance video editing projects for the past year and a half — mostly through referrals from former colleagues. He currently brings in around $1,500–$2,500/month from side work, mostly one-off projects with no recurring structure. Jordan is energized by the video work in a way his day job no longer makes him feel, and he has been quietly building the conviction that he could turn this into something real. He knows the B2B space well from his marketing role and sees a clear gap: SaaS companies spend heavily on content but consistently underproduce on video. He has not yet made a formal offer to the market, does not have a defined niche or service package, and has not done outbound. His main obstacle is not skill — it is structure. He needs a business, not just a hobby that earns money.',

  building_toward:
    'A fully independent B2B SaaS video production business that earns at least $8,000/month from retainer clients within six months — allowing Jordan to leave his job with confidence and build work that is both financially serious and creatively aligned.',

  direction: 'B2B SaaS Video Production',

  key_moments: [
    {
      quote:
        "I keep waiting to feel ready, but I think I've been ready for a while. I'm just scared to say it out loud.",
      context:
        "Said about ten minutes in, when we were talking about why Jordan hadn't made his first official offer yet. This was the honest crux underneath all the tactical questions.",
    },
    {
      quote:
        "The stuff I do for my day job I could do in my sleep. The video work — I'm actually thinking about it in the shower.",
      context:
        "Jordan was describing the difference in how he experiences his two types of work. This was important to name, because it is the fuel that will carry him through the early hard parts of building a business.",
    },
    {
      quote:
        "I don't want to do wedding videos or reels for restaurants. I want to work with companies that have a real problem and a budget.",
      context:
        "Came up when we were talking about niche. Jordan has strong instincts about the kind of clients he wants — he just had not framed it as a positioning decision yet. This clarity is a real asset.",
    },
  ],

  reframe: {
    headline: 'You are not a freelancer trying to get more gigs. You are a business deciding who to serve.',
    body:
      'The shift that needs to happen is not about picking up more clients — it is about building something with a point of view. You already know the SaaS space, you already know what good video looks like inside a marketing funnel, and you already have receipts. The reframe is this: stop pricing yourself as someone who executes tasks and start positioning yourself as someone who solves a specific, costly problem for a specific kind of company. That is where the leverage is. That is what justifies retainers, referrals, and rates that make leaving your job make sense.',
  },

  next_steps: [
    {
      action:
        "Write a one-paragraph positioning statement that names your ICP (ideal client profile): the type of SaaS company, their stage, and the specific video problem you solve for them. Don't overthink it — write the version that's true right now.",
      deadline: '2026-03-14',
      priority: 'must',
    },
    {
      action:
        'Pull your three best existing video projects and write two sentences per project explaining the business outcome the client got — not just what you made, but what it did.',
      deadline: '2026-03-14',
      priority: 'must',
    },
    {
      action:
        'Draft a single-tier offer: one deliverable set, one monthly price, one type of client. Keep it simple. We will pressure-test it on the next call.',
      deadline: '2026-03-17',
      priority: 'must',
    },
    {
      action:
        "List 10 SaaS companies in your network or adjacent to it — former employers, companies you've used, brands you follow — that you could realistically send a warm message to in the next 30 days.",
      deadline: '2026-03-17',
      priority: 'should',
    },
  ],
};

// ─────────────────────────────────────────────

export const SAMPLE_ROADMAP: RoadmapData = {
  direction: 'B2B SaaS Video Production',
  hours_per_week: 10,
  pacing: 'Steady',
  starting_level: 'Freelancer with existing side income',

  personal_note: `Jordan, I built this roadmap around one constraint: you have about 10 hours a week right now, and that has to count. So everything in here is sequenced to get you to your first real offer in the market as fast as possible — not the perfect offer, just a real one. The first two weeks are about positioning and portfolio, because without those two things, outreach is just noise. Weeks three and four are where it gets interesting: you will be having actual conversations with real potential clients, learning what lands and what doesn't, and ideally closing your first retainer.

I want to name something I noticed in our first session: you have more to work with than you think. You know the SaaS space from the inside. You have existing work you can point to. And you have a clear point of view on the kind of clients you want to work with. Most people starting a video business are guessing at all three of those things. You are not guessing — you are just not organized yet. This roadmap fixes that. Trust the process, do the reps, and let's get you out of that job.`,

  weeks: [
    {
      week: 1,
      theme: 'Offer & Positioning',
      milestone: 'A defined one-page offer you can send to anyone in the next 7 days',
      checkpoint_question:
        'If someone asked you right now what you do and who it is for, could you say it in two sentences without hedging?',
      tasks: [
        {
          title: 'Write your ICP one-pager',
          description:
            'Define exactly who you serve: company stage, team size, the problem they have with video, and why that problem is expensive. This becomes the foundation of every offer, outreach message, and sales call you do.',
          priority: 'must_do',
          time_estimate: '2 hours',
          sub_steps: [
            'Write a one-sentence description of your ideal client (company type, stage, role of the person you speak with)',
            'Write three bullet points describing the video problem they have and what it costs them in missed pipeline or poor conversion',
            'Write one sentence on why you, specifically, are the right person to solve it',
            'Read it out loud and cut anything that sounds like marketing copy',
          ],
          tips: [
            'Be uncomfortably specific. "B2B SaaS companies with a sales team doing demos but no supporting video content" is a real ICP. "Companies that need video" is not.',
            'If you find yourself hedging ("or also companies that…"), that is a sign you need to cut, not add.',
          ],
          resources: [
            { title: 'April Dunford – Obviously Awesome (ICP chapter)', url_hint: 'obviouslyawesome.com' },
            { title: 'Steph Smith – Positioning essay', url_hint: 'stephsmith.io/positioning' },
          ],
        },
        {
          title: 'Build your one-tier offer',
          description:
            'Design a single, clean service package with a defined deliverable set, a monthly retainer price, and a clear outcome statement. One offer. Not three tiers. Not "it depends."',
          priority: 'must_do',
          time_estimate: '2.5 hours',
          sub_steps: [
            'Decide on the core deliverable: e.g., 4 short-form product explainer videos per month, edited and ready to publish',
            'Set your price — aim for a number that makes the business real, not the number you think they will say yes to',
            'Write the outcome statement: "By the end of month one, you will have X assets that do Y"',
            'Format it into a one-page PDF or Notion doc you can attach to any email',
          ],
          tips: [
            'Your first offer does not have to be your final offer. It just has to be real and sendable.',
            'Price anchored to their problem, not your hours. What does a bad demo video cost a SaaS company in lost deals?',
            'Name the offer. "The SaaS Video Starter Pack" is more memorable and ownable than "Monthly Video Package."',
          ],
          resources: [
            { title: 'Alex Hormozi – $100M Offers (core offer design)', url_hint: 'acquisition.com/offers' },
            { title: 'Notion offer doc template', url_hint: 'notion.so/templates' },
          ],
        },
        {
          title: 'Audit and organize your existing work',
          description:
            'Pull your three to five best existing video projects. Write a two-sentence outcome summary for each one — not what you made, but what it did for the client. This becomes your proof.',
          priority: 'must_do',
          time_estimate: '1.5 hours',
          sub_steps: [
            'List every project you have done in the last 18 months',
            'Pick the three to five that are most relevant to SaaS or B2B clients',
            'For each, write: what was the brief, what did you deliver, and what happened after',
            'If you do not have a measurable outcome, write what the client said — a quote is still social proof',
          ],
          tips: [
            'Do not wait until your work is perfect to show it. Clients are buying your judgment and reliability more than your reel.',
            'If you have a before/after (their old content vs. yours), that is gold. Show the contrast.',
          ],
          resources: [
            { title: 'Wistia — How SaaS companies use video', url_hint: 'wistia.com/learn/marketing/saas-video' },
          ],
        },
      ],
    },
    {
      week: 2,
      theme: 'Portfolio & First Outreach',
      milestone: 'A live portfolio page and five warm outreach messages sent',
      checkpoint_question:
        'Does your portfolio show someone the problem you solve, or does it just show your editing style?',
      tasks: [
        {
          title: 'Build a simple portfolio page',
          description:
            'Set up a single-page site or Notion portfolio that leads with your ICP and offer, then shows your work with the outcome summaries you wrote in week one. This does not need to be beautiful — it needs to be credible.',
          priority: 'must_do',
          time_estimate: '3 hours',
          sub_steps: [
            'Choose a format: a simple website (Framer, Webflow, or a landing page tool) or a clean Notion page',
            'Write the headline: name the client, name the problem, name the result — not "freelance video editor"',
            'Embed or link three to five portfolio pieces with outcome summaries',
            'Add a single CTA: "Book a 20-minute intro call" with a Calendly link',
          ],
          tips: [
            'The headline is the most important thing on the page. "I help B2B SaaS companies turn their product demos into video that converts" is a real headline.',
            'Do not add a "rates" page yet. Let the conversation happen first.',
          ],
          resources: [
            { title: 'Framer — free portfolio site builder', url_hint: 'framer.com' },
            { title: 'Calendly — free scheduling tool', url_hint: 'calendly.com' },
          ],
        },
        {
          title: 'Build your outreach list',
          description:
            'Identify 15 warm contacts — people you have worked with, companies you know, or founders in your network — who fit your ICP or who could refer you to someone who does.',
          priority: 'must_do',
          time_estimate: '1.5 hours',
          sub_steps: [
            'Go through LinkedIn connections and sort by: former colleagues at SaaS companies, people who work in marketing at SaaS companies, and founders you have met',
            'Add each person to a simple spreadsheet: name, company, relationship, why they are a fit',
            'Flag the top five as "warmest" — people who would recognize your name and reply',
            'Do not filter too hard. If you are unsure whether they are a fit, keep them on the list.',
          ],
          tips: [
            'You are not cold outreaching yet. This week is about warm contacts only — people who have a reason to hear from you.',
            'Think about who has seen your work, mentioned your videos, or said anything like "you should do this for real."',
          ],
          resources: [
            { title: 'Apollo.io — outreach list building (free tier)', url_hint: 'apollo.io' },
          ],
        },
        {
          title: 'Send five warm outreach messages',
          description:
            'Write and send a short, direct message to your five warmest contacts. Not a pitch — a genuine check-in that naturally mentions what you are building and asks one question.',
          priority: 'must_do',
          time_estimate: '2 hours',
          sub_steps: [
            'Write a two-paragraph message: paragraph one is a genuine connection point (what you have been up to, a recent thing you noticed about their company), paragraph two is a one-sentence mention of what you are building and a low-stakes ask ("Would love to hear your thoughts" or "Know anyone who might be a fit?")',
            'Personalize each message — do not use a template verbatim',
            'Send via LinkedIn DM, email, or WhatsApp depending on your relationship',
            'Log each one in your spreadsheet with the date sent',
          ],
          tips: [
            'The goal of the first message is not to close — it is to open a conversation. Keep it short enough that they can reply in 30 seconds.',
            'If you have been meaning to catch up with someone, this is permission to do that. The business mention is secondary.',
          ],
          resources: [
            { title: 'Justin Welsh – LinkedIn outreach framework', url_hint: 'justinwelsh.me' },
          ],
        },
        {
          title: 'Set up a simple CRM tracker',
          description:
            'Build a lightweight system to track every conversation — name, company, status, next action, and date. This does not need to be a tool — a Notion table or a Google Sheet works fine.',
          priority: 'should_do',
          time_estimate: '45 minutes',
          sub_steps: [
            'Set up columns: Name, Company, Status (Contacted / Replied / Meeting Booked / Proposal Sent / Client), Last Touch, Next Action',
            'Add your 15 outreach contacts to start',
            'Set a recurring 15-minute calendar block each Friday to update it',
          ],
          tips: [
            'The goal is to never let a warm conversation go cold because you forgot to follow up.',
            'Simple beats fancy here. A Notion table you actually open beats a full CRM you never log into.',
          ],
          resources: [
            { title: 'Notion — free CRM template', url_hint: 'notion.so/templates/crm' },
          ],
        },
      ],
    },
    {
      week: 3,
      theme: 'Calls & Conversion',
      milestone: 'At least two discovery calls completed and a proposal sent to one prospect',
      checkpoint_question:
        'Do you know exactly what questions to ask on a discovery call, and what you are listening for?',
      tasks: [
        {
          title: 'Build your discovery call framework',
          description:
            'Write the five questions you will ask on every discovery call, and the criteria you will use to decide if someone is a real prospect or not. Go into every call with a structure.',
          priority: 'must_do',
          time_estimate: '1.5 hours',
          sub_steps: [
            'Write five open questions: their current video situation, what they have tried, what a win looks like, who else is involved in the decision, and timeline',
            'Add two qualifying questions: budget range and whether they have worked with external video help before',
            'Write down your "green flags" (signs this is a real opportunity) and "red flags" (signs this will be a bad fit)',
            'Practice the call out loud at least once before your first real call',
          ],
          tips: [
            'The best discovery calls feel like a good conversation, not an interrogation. Ask, then listen — do not rush to pitch.',
            'If you sense a red flag, name it. "I want to make sure this is actually a fit before we go further" builds trust, it does not lose deals.',
          ],
          resources: [
            { title: 'Sandler Sales Methodology — discovery framework overview', url_hint: 'sandler.com/blog/discovery' },
            { title: 'Close.com — discovery call questions guide', url_hint: 'close.com/resources/discovery-call-questions' },
          ],
        },
        {
          title: 'Run your first two discovery calls',
          description:
            'Book and run at least two intro calls with contacts from your outreach list. Use your framework. Take notes on what surprised you. Every call teaches you something about your offer and your market.',
          priority: 'must_do',
          time_estimate: '3 hours (including prep and debrief)',
          sub_steps: [
            'Follow up with any contacts who have not replied yet — a one-line check-in is fine',
            'Confirm the meeting 24 hours in advance with a short agenda so they show up prepared',
            'During the call, take notes on their exact words — the language they use to describe their problem is the language you should be using in your offer',
            'Within one hour of each call, write a three-sentence debrief: what you learned, what you would do differently, and what the next step is',
          ],
          tips: [
            'You do not need to close on the first call. You need to understand their situation well enough to know if a proposal makes sense.',
            'Ask "What would have to be true for this to be a no-brainer for you?" You will get more honest signal than any other question.',
          ],
          resources: [
            { title: 'Loom — record your call debrief for your own review', url_hint: 'loom.com' },
          ],
        },
        {
          title: 'Send one proposal',
          description:
            'If one of your discovery calls is a real fit, send a written proposal within 48 hours of the call. Use your offer from week one as the foundation, and tailor the outcome statement to what you learned about their specific situation.',
          priority: 'must_do',
          time_estimate: '2 hours',
          sub_steps: [
            'Open with a one-paragraph summary of what you heard on the call — show them you listened',
            'Present your offer with a specific outcome tied to their stated goal',
            'Include the monthly investment and a 30-day engagement to start',
            "End with a clear next step: \"Let me know if you'd like to move forward and I'll send the agreement\"",
          ],
          tips: [
            'Keep the proposal to one page if possible. Long proposals feel like homework.',
            'Do not apologize for your price. State it clearly and let there be silence.',
          ],
          resources: [
            { title: 'Bonsai — freelance proposal templates', url_hint: 'hellobonsai.com' },
            { title: 'AND.CO — proposal and contract tools', url_hint: 'and.co' },
          ],
        },
      ],
    },
    {
      week: 4,
      theme: 'First Retainer Client',
      milestone: 'A signed agreement and first payment from your first retainer client',
      checkpoint_question:
        'What would need to be true for you to have one paying retainer client by the end of this week?',
      tasks: [
        {
          title: 'Follow up on open proposals and conversations',
          description:
            'Any proposal you sent last week that has not received a response gets a short, confident follow-up. Any conversation that stalled gets a re-engaged message. Persistence is part of the process.',
          priority: 'must_do',
          time_estimate: '1 hour',
          sub_steps: [
            'Check your CRM: who has not responded in 5+ days?',
            "Send a one-line follow-up: \"Happy to answer any questions — just let me know if you'd like to move forward or if the timing isn't right.\"",
            'If a conversation has stalled for more than 10 days, send a fresh value-add: a short video tip, a resource relevant to their problem, or a quick observation about something you noticed on their site',
          ],
          tips: [
            'Most deals close on the fifth to eighth touch. Following up is not annoying — it is professional.',
            'A "not right now" is useful data. Ask if you can follow up in 60 days.',
          ],
          resources: [
            { title: 'Woodpecker — email follow-up sequencing tool', url_hint: 'woodpecker.co' },
          ],
        },
        {
          title: 'Close your first retainer and send the agreement',
          description:
            'When someone says yes, move fast. Send a simple one-page agreement within the same day, along with the first invoice. Do not let momentum die.',
          priority: 'must_do',
          time_estimate: '2 hours',
          sub_steps: [
            'Use a simple service agreement template — it should cover: scope, deliverables, payment terms, and a 30-day cancellation clause',
            'Send the agreement via DocuSign, HelloSign, or a PDF they can sign and return',
            'Send the invoice for the first month at the same time — or request a deposit if that is your structure',
            'Confirm the kickoff call and set expectations for how the working relationship will run',
          ],
          tips: [
            'The moment someone says yes is not the moment to renegotiate the scope or add uncertainty. Confirm what they agreed to and execute.',
            'A simple one-page agreement protects both of you and signals that you run a real business.',
          ],
          resources: [
            { title: 'HelloSign — simple e-signature tool', url_hint: 'hellosign.com' },
            { title: 'Wave — free invoicing for freelancers', url_hint: 'waveapps.com' },
          ],
        },
        {
          title: 'Deliver a remarkable first week',
          description:
            'The first week with a new client is the most important. Overdeliver on communication and responsiveness, even before you deliver the first video. Clients stay because they feel taken care of.',
          priority: 'must_do',
          time_estimate: '3 hours',
          sub_steps: [
            'Send a welcome message with a clear outline of what happens in the first 30 days',
            'Schedule the kickoff call and come prepared with three to five questions about their brand, audience, and content goals',
            'Deliver a first draft before the deadline — even if it is rough, showing momentum matters',
            'Ask for feedback in writing so you have a record and can iterate clearly',
          ],
          tips: [
            'The easiest way to get a second month is to make the first month feel effortless for the client.',
            'Send a short Loom update mid-month so they feel in the loop without needing a full call.',
          ],
          resources: [
            { title: 'Loom — async video updates for clients', url_hint: 'loom.com' },
          ],
        },
        {
          title: 'Expand outreach to ten new contacts',
          description:
            'Even while you are closing your first client, keep the pipeline moving. Add ten more contacts to your outreach list and send five new messages this week.',
          priority: 'should_do',
          time_estimate: '2 hours',
          sub_steps: [
            'Use LinkedIn to find second-degree connections at SaaS companies in the 50–500 employee range',
            'Look specifically for heads of marketing, content leads, or founders',
            'Write a slightly refined version of your week-two outreach message based on what you have learned from your discovery calls',
            'Log everyone in your CRM before you send',
          ],
          tips: [
            'One retainer client is a start. Two is a business. Keep moving.',
            'The learnings from your first two calls should make your outreach messages sharper — use that.',
          ],
          resources: [
            { title: 'LinkedIn Sales Navigator — trial available', url_hint: 'linkedin.com/sales' },
          ],
        },
      ],
    },
  ],

  contingency: {
    falling_behind:
      'If you are behind by the end of week two — no portfolio live, no outreach sent — do not try to catch up on everything at once. Pick the one task that unlocks the next thing: in almost every case, that is sending your first outreach message, even if it goes to a link that is not perfect yet. Progress compounds, but only if you start. Cut the bonus tasks entirely for the rest of the month, reduce your must-dos to the single most important one per week, and use any extra time to protect the quality of your core deliverables. You are not failing — you are learning what this actually takes. That is useful.',
    ahead_of_schedule:
      'If you close your first client before week four, that is a great problem to have — but do not stop there. Use the extra time to double your outreach volume, get a second discovery call booked, and start thinking about what your offer looks like at month three. The goal is not one client: it is a business that can replace your income. Getting your first client early means you have runway to iterate on your offer, tighten your positioning, and build the kind of social proof that makes the next client easier to close. Bank the momentum, not the comfort.',
  },
};

// ─────────────────────────────────────────────
// Asset Config
// ─────────────────────────────────────────────

export const ASSET_CONFIG: Record<AssetType, AssetConfig> = {
  session_notes: {
    title: 'Session Notes',
    description: 'Key moments, reframes, and next steps from your coaching sessions.',
    icon: '📋',
    week_unlock: 1,
  },
  roadmap: {
    title: 'Roadmap',
    description: 'Your week-by-week action plan with tasks, milestones, and checkpoints.',
    icon: '🗺️',
    week_unlock: 2,
  },
  business_plan: {
    title: 'Business Plan',
    description: 'A structured plan covering your model, revenue targets, and path to profitability.',
    icon: '📊',
    week_unlock: 3,
  },
  offer_strategy: {
    title: 'Offer Strategy',
    description: 'Your pricing structure, packaging decisions, and positioning rationale.',
    icon: '💰',
    week_unlock: 4,
  },
  client_playbook: {
    title: 'Client Playbook',
    description: 'Scripts, frameworks, and templates for discovery calls, proposals, and onboarding.',
    icon: '🤝',
    week_unlock: 5,
  },
  brand_blueprint: {
    title: 'Brand Blueprint',
    description: 'Your visual identity, voice, and positioning assets for showing up consistently.',
    icon: '🎨',
    week_unlock: 7,
  },
  portfolio_builder: {
    title: 'Portfolio Builder',
    description: 'A guided framework for curating and presenting your work to attract ideal clients.',
    icon: '🖼️',
    week_unlock: 8,
  },
  strategic_plan: {
    title: 'Strategic Plan',
    description: 'A longer-horizon plan for scaling, hiring, and evolving your business model.',
    icon: '🎯',
    week_unlock: 11,
  },
  growth_roadmap: {
    title: 'Growth Roadmap',
    description: 'Month-by-month targets and initiatives for your next phase of growth.',
    icon: '📈',
    week_unlock: 12,
  },
};
