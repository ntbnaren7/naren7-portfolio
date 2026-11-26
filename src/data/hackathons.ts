type HackathonItem = {
  name: string;
  project: string;
  logos?: { image: string; name: string }[];
  date: string;
  location: string;
  hours?: number;
  badge?: "Winner" | "Top 1%" | "Runner-up" | "Pre-Finale";
  placement?: string;
  note: string;
  problem: string;
  solution?: string;
  role?: string;
  tech?: string[];
  whatIBuilt?: string[];
  showcase?: {
    title: string;
    images: { file: string; alt: string }[];
  };
  githubUrl?: string;
  demoUrl?: string;
  galleryUrl?: string;
};

export const hackathons: HackathonItem[] = [
  {
    name: "Cerebral Valley × DeepMind Hackathon",
    project: "Conclave",
    logos: [
      { image: "cerebral-valley.svg", name: "Cerebral Valley" },
      { image: "deepmind.svg", name: "DeepMind" },
    ],
    date: "July 11, 2026",
    location: "WeWork Roshni Tech Hub, Bangalore",
    hours: 7,
    note: "Live design reviews with four AI stakeholders that raise concerns as the team talks.",
    problem:
      "Design reviews can miss assumptions when specialists are outside the room.",
    solution:
      "Conclave brings four AI stakeholders into live design reviews. Gemini Live streams audio to each agent, a shared context engine tracks decisions, and an arbitrator chooses when to interrupt.",
    role: "Lead AI Architect & Full Stack Developer",
    tech: [
      "Gemini Live API",
      "WebSocket Audio",
      "Multi-Agent Orchestration",
      "Typed Event Bus",
      "Shared Blackboard",
      "Urgency Arbitration",
      "Attention Budget",
      "Semantic Compression",
      "Decision Graph",
      "TypeScript",
      "Node.js",
    ],
    showcase: {
      title: "Google DeepMind Bangalore Hackathon",
      images: [
        {
          file: "conclave-team.webp",
          alt: "The four Conclave teammates working around a table at the hackathon",
        },
        {
          file: "deepmind-bangalore-poster.webp",
          alt: "Google DeepMind Bangalore Hackathon event poster",
        },
      ],
    },
    whatIBuilt: [
      "Built the typed event bus and shared blackboard.",
      "Built an arbitration kernel to prioritize and budget interruptions.",
      "Built parallel Gemini Live sessions and real-time interruption logic.",
    ],
    githubUrl: "https://github.com/ntbnaren7/conclave",
    galleryUrl:
      "https://www.linkedin.com/posts/naren-tech_googledeepmind-gemini-google-activity-7483148291568861184-6nIj",
  },
  {
    name: "Cashfree × Sarvam AI Buildathon",
    project: "Attest",
    logos: [
      { image: "cashfree.svg", name: "Cashfree" },
      { image: "sarvam.svg", name: "Sarvam AI" },
    ],
    date: "November 21, 2026",
    location: "Cashfree Office, Ecoworld, Bengaluru",
    note: "Built Attest, a multilingual collections desk that verifies payments and reconciles balances.",
    problem:
      "Merchants and lenders have to reconcile payment claims across screenshots, chats, handwritten records, and transaction histories. Stale balances can lead to unnecessary follow-ups.",
    solution:
      "Attest uses Sarvam AI to handle voice, chat, and document scans in English, Hindi, Tamil, and Kannada. Cashfree verification updates balances, and operators approve actions that move money.",
    tech: ["Python", "Sarvam AI", "Cashfree"],
    githubUrl: "https://github.com/ntbnaren7/attest",
  },
  {
    name: "Amazon ML Challenge 2025",
    project: "Smart Product Pricing",
    logos: [{ image: "amazon-science.svg", name: "Amazon Science" }],
    date: "October 11 - 13, 2025",
    location: "Online",
    hours: 48,
    placement: "Rank #816 Globally, 1st Place Campus Level",
    badge: "Top 1%",
    note: "Built a pricing model that estimates product prices from catalog data.",
    problem:
      "Predict product prices from catalog metadata under a highly sensitive SMAPE metric that disproportionately penalizes small errors on low-priced items.",
    solution:
      "A feature engineering and gradient boosting regression pipeline optimized using logarithmic target transformations and MAE loss.",
    role: "ML Engineer",
    tech: ["Python", "LightGBM", "Scikit-learn", "Pandas", "NumPy"],
    whatIBuilt: [
      "Engineered an automated, large-scale data cleaning and EDA pipeline (processing 75k+ rows) to handle missing values, extreme outliers via Winsorization, and skewed distributions.",
      "Built a robust machine learning architecture utilizing LightGBM and RidgeCV with iterative hyperparameter tuning and aggressive K-Fold cross-validation target encoding.",
      "Stabilized model training by applying log target transformations (`np.log1p`) and optimizing on MAE to directly mitigate the SMAPE metric's sensitivity on low-priced items.",
    ],
    githubUrl: "https://github.com/ntbnaren7/amazon-ml-challenge-2025",
  },
  {
    name: "LTTS TECHgium 9th Edition",
    project: "Harmony Aura",
    logos: [{ image: "ltts.svg", name: "L&T Technology Services" }],
    date: "November 10, 2025 - March 10, 2026",
    location: "LTTS campus, Mysore",
    hours: 24,
    badge: "Pre-Finale",
    note: "Built a safety dashboard that tracks worker stress and machine health in real time.",
    problem:
      "Industrial environments lack proactive, synchronized monitoring of both human physiological stress and heavy machinery telemetry to prevent accidents before they occur.",
    solution:
      "A real-time industrial safety ecosystem that merges workforce biometrics with machine data using edge computing, digital twins, and AI predictive maintenance.",
    role: "ML Engineer",
    tech: [
      "Python",
      "TensorFlow",
      "Scikit-Learn",
      "CNN",
      "Firebase Realtime Database",
      "ESP32 (C++)",
      "React",
      "Flutter",
    ],
    whatIBuilt: [
      "Integrated a Deep Learning module utilizing a 1D-CNN to analyze time-series vibration data for predictive maintenance and fault detection.",
      "Developed a Cognitive Intelligence Score (CIS) algorithm that calculates high-precision risk factors in real time by correlating human biometrics with machine state data.",
      "Architected a unified multi-pillar ecosystem consisting of a React-based web dashboard and dual Flutter mobile apps (Supervisor and Operator), all synchronized via a centralized Firebase Realtime Uplink.",
    ],
    githubUrl: "https://github.com/ntbnaren7/harmony-aura-os",
  },
  {
    name: "SaaSathoN'26",
    project: "scribe",
    logos: [
      { image: "lakshya.jpeg", name: "Lakshya" },
      { image: "ssn.png", name: "SSN College of Engineering" },
    ],
    date: "April 11 - 12, 2026",
    location: "SSN College of Engineering, Chennai",
    hours: 36,
    badge: "Winner",
    note: "Built a tool that turns a brand website into ready-to-publish marketing posts.",
    problem:
      "Brands and marketers struggle to consistently generate engaging, on-brand social media content tailored to specific platforms.",
    solution:
      "An AI-powered platform that analyzes a brand's URL and automatically generates platform-specific marketing posts using Google GenAI.",
    role: "Full Stack Developer",
    tech: [
      "Next.js",
      "React",
      "Supabase",
      "Google GenAI",
      "GSAP",
      "Framer Motion",
      "Tailwind CSS",
      "Razorpay",
    ],
    whatIBuilt: [
      "Engineered a fault-tolerant LLM inference engine with a multi-tier provider cascade to ensure high availability via graceful degradation.",
      "Designed an asynchronous, self-chaining worker pipeline in Next.js with strict idempotency guards to safely bypass serverless timeout limits.",
      "Developed advanced prompt architectures enforcing strict JSON schema adherence for complex generation workflows like brand persona extraction.",
      "Implemented robust security and LLM prompt-injection defenses to securely process untrusted DOM inputs scraped via Puppeteer.",
    ],
    githubUrl: "https://github.com/ntbnaren7/usescribe",
    demoUrl: "https://usescribe.in",
    galleryUrl:
      "https://www.linkedin.com/posts/naren-tech_saasathon-saas-scribe-share-7459209406929453056-OhZF/",
  },
  {
    name: "Auristra'26",
    project: "DriveOS",
    date: "March 25 - 26, 2026",
    location: "Takshashila University, Villupuram",
    hours: 48,
    badge: "Winner",
    note: "Built a driver dashboard that combines live hazard detection with vehicle-to-vehicle alerts.",
    problem:
      "Gap between low-level sensor telemetry and high-level driver interfaces for hazard detection.",
    solution:
      "An intelligent V2X ecosystem combining edge computer vision with a CarPlay-inspired dashboard.",
    role: "Full Stack & Edge ML Developer",
    tech: [
      "React",
      "Vite",
      "ONNX Runtime",
      "OpenCV",
      "Firebase",
      "YOLOv8s",
      "Flutter",
      "Dart",
    ],
    whatIBuilt: [
      "Built 'Benthic Vision' (YOLOv8s/OpenCV) for real-time edge anomaly detection.",
      "Designed a glassmorphic React dashboard as the central HMI for live vision and V2X alerts.",
      "Engineered a Firebase V2X backend and Flutter app for mobile mesh fleet tracking.",
    ],
    githubUrl: "https://github.com/ntbnaren7/drive-os",
    galleryUrl:
      "https://www.linkedin.com/posts/naren-tech_%F0%9D%97%AA%F0%9D%97%BC%F0%9D%97%BB-%F0%9D%97%94%F0%9D%97%A8%F0%9D%97%A5%F0%9D%97%9C%F0%9D%97%A6%F0%9D%97%A7%F0%9D%97%A5%F0%9D%97%94%F0%9F%AE%F0%9F%B2-a-48-hour-national-activity-7451285263906979840-0OCl",
  },
  {
    name: "Hackcelerate'26",
    project: "WI4ED",
    date: "January 30 - 31, 2026",
    location: "SRM Institute of Science & Tech., Chennai",
    hours: 24,
    placement: "First runner-up",
    badge: "Runner-up",
    note: "Built a mobile dashboard that spots unusual power usage and flags appliance risks.",
    problem:
      "Current smart home energy monitoring systems lack real-time, high-fidelity anomaly detection and predictive maintenance capabilities, offering unengaging interfaces and basic historical data.",
    solution:
      "A real-time, AI-augmented smart home energy dashboard designed as a futuristic IoT control panel with Waveform AI for deep electrical signature analysis and Neural Sentinel for predictive maintenance.",
    role: "Mobile App Developer",
    tech: ["Flutter", "Dart", "Provider", "FL Chart", "Custom Painter API"],
    whatIBuilt: [
      "Developed an edge-intelligent mobile application with a premium 'OLED Black' UI and glassmorphic design for real-time electrical safety monitoring.",
      "Engineered intelligent power analytics featuring real-time consumption scorecards, appliance signature recognition, and predictive health scoring to preemptively detect appliance failures.",
      "Implemented a Safety & Anomaly Center with actionable alerts for inrush growth and sustained overloads, alongside a smart historical timeline for tracking usage patterns.",
    ],
    githubUrl: "https://github.com/ntbnaren7/wi4ed-intelligence-mobile-app",
    galleryUrl:
      "https://www.linkedin.com/posts/naren-tech_finished-%F0%9D%9F%AE-%F0%9D%97%AE%F0%9D%98%81-%F0%9D%97%9B%F0%9D%97%AE%F0%9D%97%B0%F0%9D%97%B8%F0%9D%97%B0%F0%9D%97%B2%F0%9D%97%B9%F0%9D%97%B2%F0%9D%97%BF%F0%9D%97%AE%F0%9D%98%81%F0%9D%97%B2-activity-7426701480973365248-__pH",
  },
];
