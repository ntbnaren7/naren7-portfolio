type BlogResource = {
  source: string;
  title: string;
  description: string;
  url: string;
};

type BlogEditorial = {
  accent: "cool" | "warm";
  cover: string;
  coverAlt: string;
  resources: BlogResource[];
};

export const blogEditorial: Record<string, BlogEditorial> = {
  "why-gemini-never-feels-as-good-as-claude-to-me": {
    accent: "cool",
    cover: "/images/blogs/gemini-cover.webp",
    coverAlt:
      "Two glowing paths through a circuit board, one looping around a fault light and the other tracing back through several chips.",
    resources: [
      {
        source: "Anthropic Engineering",
        title: "Building effective agents",
        description:
          "Workflow patterns for breaking problems down and checking an agent’s work.",
        url: "https://www.anthropic.com/research/building-effective-agents",
      },
      {
        source: "METR",
        title: "Rethinking how to measure AI coding productivity",
        description:
          "Why the researchers redesigned their study of how AI tools affect developers working in real repositories.",
        url: "https://metr.org/blog/2026-02-24-uplift-update/",
      },
      {
        source: "Reddit · r/programming",
        title: "Developers discuss the METR study",
        description:
          "A thread on debugging with AI, reviewing its output, and where the tools save time.",
        url: "https://www.reddit.com/r/programming/comments/1lwk6nj/measuring_the_impact_of_ai_on_experienced/",
      },
    ],
  },
  "is-entrepreneurship-gen-z-main-character-moment": {
    accent: "warm",
    cover: "/images/blogs/entrepreneurship-cover.webp",
    coverAlt:
      "A young maker checks a prototype at a home workbench beside a laptop and packages ready to ship.",
    resources: [
      {
        source: "Gusto Insights",
        title: "What Gen Z founders are building",
        description:
          "Survey and payroll data on young founders, hands-on businesses, and how they use AI.",
        url: "https://gusto.com/resources/gusto-insights/gen-z-entrepreneurship-2026",
      },
      {
        source: "Y Combinator · Paul Graham",
        title: "Do Things That Don’t Scale",
        description:
          "On recruiting your earliest users by hand and learning what they need.",
        url: "https://www.ycombinator.com/library/96-do-things-that-don-t-scale",
      },
      {
        source: "Reddit · r/startups",
        title: "How are Gen Z founders getting started?",
        description:
          "Firsthand accounts of starting side businesses and testing ideas with customers.",
        url: "https://www.reddit.com/r/startups/comments/1ovxml6/how_are_gen_z_starting_new_businesses_i_will_not/",
      },
    ],
  },
};
