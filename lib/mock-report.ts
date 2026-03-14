export const mockReport = {
  userId: 'mock-user',
  firstName: 'Jordan',
  generatedAt: '2026-03-12T10:00:00Z',

  identity_profile: {
    headline: "You're the Builder Who Got Told to Sit Down",
    summary: "You have the mind of someone who creates things from nothing — ideas, systems, experiences, content. The problem isn't that you lack direction. The problem is that you've spent years being told to slow down, be realistic, or wait your turn. You didn't fit the school mould. You don't fit the 9-to-5 mould. You're not supposed to. You're wired for something different, and deep down you've always known it.",
    core_truth: "You don't need to find your passion. You need to stop letting fear of imperfection keep you from shipping the thing that's already inside you.",
    tags: ['Creative thinker', 'Self-aware', 'High potential', 'Emotionally intense', 'Systems builder']
  },

  archetype: {
    primary: {
      name: 'The Architect',
      score: 0.88,
      description: "You build systems, frameworks, and structures — even when no one asks you to. You see how things connect. You're drawn to understanding root causes, not surface symptoms. You feel most alive when you're designing something that works elegantly.",
      traits: ['Systemic thinker', 'High standards', 'Internally driven', 'Pattern recogniser'],
      shadow: "Your need for perfection becomes a cage. You research endlessly because starting means risking imperfection. The architecture is beautiful. The building never gets built."
    },
    secondary: {
      name: 'The Connector',
      score: 0.71,
      description: "People naturally come to you. Not because you try, but because you listen in a way that makes people feel seen. You have an unusual ability to understand what someone needs before they say it."
    },
    radar_scores: [
      { axis: 'Architect', value: 88 },
      { axis: 'Connector', value: 71 },
      { axis: 'Creator', value: 65 },
      { axis: 'Disruptor', value: 58 },
      { axis: 'Performer', value: 42 },
      { axis: 'Analyst', value: 78 },
      { axis: 'Caretaker', value: 55 },
      { axis: 'Explorer', value: 63 }
    ]
  },

  hidden_dynamics: [
    {
      name: 'The Competence Paradox',
      description: "You're far more capable than you believe, but your high standards mean you measure yourself against an impossible bar. You see everyone else's highlights and your own behind-the-scenes. This isn't humility — it's a distorted lens that's been costing you for years.",
      implication: "Every time you say 'I'm not ready yet,' you're choosing the comfort of potential over the reality of impact. The world doesn't need your perfect version. It needs your current version."
    },
    {
      name: 'Depth Over Breadth, But Width Is Holding You Back',
      description: "You're genuinely multi-talented. The problem is you've used that breadth as an excuse not to go deep on one thing long enough to see results. You pivot before the compounding kicks in.",
      implication: "Pick the one direction that aligns most with your wiring and stay in it for 6 months minimum. Curiosity is a superpower. Scattered curiosity is sabotage."
    },
    {
      name: 'You Need Proof From Yourself, Not From Others',
      description: "You seek external validation not because you're weak, but because you haven't built enough evidence from your own track record yet. The fix isn't to care less about what others think — it's to take enough action that you have receipts.",
      implication: "Start small, ship fast, collect proof. Every small win rewires the narrative you tell yourself."
    }
  ],

  strengths: [
    {
      rank: 1,
      name: 'Strategic Thinking',
      score: 0.91,
      description: "You see three moves ahead. When most people are reacting, you're already designing the system that makes the right outcome inevitable. This is rare and wildly valuable.",
      income_angle: 'High-ticket consulting, product strategy, business design'
    },
    {
      rank: 2,
      name: 'Deep Communication',
      score: 0.84,
      description: "You can explain complex things simply. More importantly, you make people feel understood. This is the foundation of trust — and trust is the foundation of everything that pays well.",
      income_angle: 'Coaching, content, sales, education'
    },
    {
      rank: 3,
      name: 'Creative Problem-Solving',
      score: 0.79,
      description: "You approach problems from angles others don't consider. You're not bound by how things have always been done. This is the skill that creates asymmetric outcomes.",
      income_angle: 'Product creation, consulting, entrepreneurship'
    },
    {
      rank: 4,
      name: 'Emotional Intelligence',
      score: 0.76,
      description: "You read rooms and people accurately. You know when someone's holding back, what they actually need, and how to create the conditions for honest conversation.",
      income_angle: 'Leadership, coaching, high-stakes sales'
    }
  ],

  blind_spots: [
    {
      name: 'Execution Avoidance',
      severity: 0.82,
      description: "You confuse thinking about doing with doing. Your planning phase is extended indefinitely because action makes failure real and failure feels like proof of your worst fear about yourself.",
      source_strength: 'Strategic Thinking',
      reframe: "The strategy isn't the work. The strategy is how you plan to do the work. At some point the plan has to become a Tuesday morning."
    },
    {
      name: 'Intimacy With Your Own Sabotage',
      severity: 0.65,
      description: "You know exactly what you're doing when you self-sabotage. This awareness becomes a strange comfort — you can explain the pattern without having to change it.",
      source_strength: 'Deep Communication',
      reframe: "Understanding why you do something doesn't exempt you from doing something different. Insight without action is just a well-articulated excuse."
    }
  ],

  energy_map: [
    { label_left: 'Solo', label_right: 'Social', score: -0.3 },
    { label_left: 'Structured', label_right: 'Spontaneous', score: 0.4 },
    { label_left: 'Practical', label_right: 'Conceptual', score: 0.65 },
    { label_left: 'Stable', label_right: 'High-Risk', score: 0.2 },
    { label_left: 'Follower', label_right: 'Leader', score: 0.75 }
  ],

  the_mirror: {
    headline: "The hardest thing to say to you.",
    body: [
      "You've been protecting yourself from disappointment by not fully committing to anything. If you never really try, you can never really fail. But you also never really live.",
      "The version of you that's holding back — the one waiting for the right moment, the right skill, the right permission — that version isn't keeping you safe. It's keeping you small.",
      "You already know what you want to do. You've known for a while. The story you tell yourself about not knowing is just a more comfortable way to stay still.",
      "The people you admire didn't figure it out before they started. They figured it out because they started."
    ]
  },

  famous_parallels: [
    {
      name: 'Ira Glass',
      connection: "The Taste-Talent Gap is real for you. You have exceptional taste and can see exactly how good your work should be — which makes it painful to produce work that isn't there yet. Ira spent years producing things that didn't match his vision before it clicked.",
      key_lesson: "The only way through the gap is volume. You have to make a lot of bad things to make good things.",
      image_search_term: 'Ira Glass journalist'
    },
    {
      name: 'Paul Graham',
      connection: "Like you, PG is a systemic thinker who built frameworks for understanding things most people take for granted. He writes about startup founders but the patterns apply to anyone building something from scratch.",
      key_lesson: "Make something people want. Start with one person, not a thousand.",
      image_search_term: 'Paul Graham Y Combinator'
    }
  ],

  directions: [
    {
      title: 'Personal Brand + Education Business',
      type: 'entrepreneurial',
      fit_score: 0.89,
      why_it_fits: "Your strategic thinking, communication depth, and ability to simplify complex ideas make you naturally suited to teaching what you know. You don't need to be the world's foremost expert — you need to be 10 steps ahead of the person you're teaching.",
      what_it_looks_like: "A content platform (YouTube, newsletter, or podcast) that builds an audience around one specific topic you know deeply, monetised through a course, cohort, or 1:1 coaching.",
      income_potential: {
        month_3: '$0–$500/mo — building the platform, first audience',
        month_6: '$500–$3,000/mo — first product launched, initial sales',
        month_12: '$3,000–$15,000/mo — audience compounding, recurring revenue'
      }
    },
    {
      title: 'Strategy Consulting / Fractional Work',
      type: 'hybrid',
      fit_score: 0.74,
      why_it_fits: "Businesses pay premium prices for people who can see what they can't. Your ability to identify root problems and design elegant solutions is a scarce skill in the market.",
      what_it_looks_like: "Working with 2-4 small businesses at a time as a fractional strategist or advisor. Starting by doing it free for one business to build a case study.",
      income_potential: {
        month_3: '$0–$2,000/mo — finding first client',
        month_6: '$2,000–$5,000/mo — 2 clients, refining offer',
        month_12: '$5,000–$12,000/mo — referrals, premium positioning'
      }
    },
    {
      title: 'Product or SaaS (Longer Horizon)',
      type: 'entrepreneurial',
      fit_score: 0.67,
      why_it_fits: "If you want to build something that scales beyond your time, a digital product or software tool aligned with your expertise is the long-horizon play. It requires more patience but aligns with your systems-building instincts.",
      what_it_looks_like: "Identify a specific pain point in a niche you understand deeply. Build a simple tool (MVP) or partner with a developer. This is a 12–24 month path to meaningful revenue.",
      income_potential: {
        month_3: '$0 — still building',
        month_6: '$0–$500/mo — early users, validation',
        month_12: '$500–$5,000/mo — if product-market fit found'
      }
    }
  ],

  dream_day: {
    headline: "What your life looks like when you stop holding back.",
    body: "You wake up without an alarm — not because you're lazy, but because you built a life that doesn't require one. It's 8:30am. You make coffee. Before anything else, you spend an hour on the thing you're building — writing, designing, making. This is the work that's yours. Nobody assigned it. Nobody can take it away.\n\nBy noon you've done the thing that matters most. The rest of the day is calls, conversations, creating — all pulling in the same direction. You're not scattered anymore. You know exactly what game you're playing.\n\nThe money is enough. Not 'rich' in the way people use that word to mean untouchable — but free. You pay for what you want. You don't check the price at a restaurant. You travel when you want. You say yes to things that matter and no to everything that doesn't.\n\nBut the best part isn't the freedom. It's knowing. Knowing what you're for, knowing what you're building, knowing what you're worth. That certainty — that groundedness — is what you've been looking for this whole time."
  },

  shareable_card: {
    archetype: 'The Architect',
    top_strength: 'Strategic Thinking',
    card_headline: "Built to build. Wired to go first.",
    subtext: "MyTwenties Assessment"
  }
}

export type MockReport = typeof mockReport & {
  business_blueprint?: {
    model: string
    why_it_fits: string
    first_steps: string[]
    realistic_timeline: string
  }
  career_map?: {
    headline: string
    why: string
    roles: Array<{ title: string; description: string; income: string }>
  }
  highest_leverage_move?: {
    move: string
    why_now: string
    how_to_start: string
    worst_case: string
  }
  reading_list?: Array<{ title: string; author: string; why: string }>
  ai_mentor_prompt?: string
  the_letter?: string[]
}
