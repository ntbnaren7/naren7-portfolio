type HackathonItem = {
  name: string;
  project: string;
  location: string;
  badge?: "Winner" | "Top 1%" | "Runner-up" | "Pre-Finale";
  placement?: string;
  solution: string;
  role: string;
  tech: string[];
  whatIBuilt: string[];
  showcase: {
    title?: string;
    linkedinPreview?: { author: string; summary: string };
    rationale: string;
    images: {
      file: string;
      alt: string;
      width: number;
      height: number;
      crop?: "top";
      expandable?: boolean;
    }[];
  };
  githubUrl?: string;
  demoUrl?: string;
  linkedinUrl?: string;
};

export const hackathons: HackathonItem[] = [
  {
    name: "Cerebral Valley × DeepMind Hackathon",
    project: "Conclave",
    location: "WeWork Roshni Tech Hub, Bangalore",
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
      rationale:
        "A design review can miss risks when specialists are outside the room. Conclave surfaces those concerns while the team can still change course and keeps a record of the decisions.",
      images: [
        {
          file: "conclave-team.webp",
          width: 960,
          height: 960,
          alt: "The four Conclave teammates working around a table at the hackathon",
          crop: "top",
        },
        {
          file: "deepmind-bangalore-poster.webp",
          width: 960,
          height: 960,
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
    linkedinUrl:
      "https://www.linkedin.com/posts/naren-tech_googledeepmind-gemini-google-activity-7483148291568861184-6nIj",
  },
  {
    name: "Cashfree × Sarvam AI Buildathon",
    project: "Attest",
    location: "Cashfree Office, Ecoworld, Bengaluru",
    solution:
      "Attest brings voice, chat, and document scans into a collections desk that reconciles balances across four Indian languages. Cashfree verifies payments, and operators approve actions that move money.",
    role: "Full Stack Developer",
    tech: [
      "Sarvam AI",
      "Cashfree Relay",
      "Document OCR",
      "FastAPI",
      "SQLite",
      "React",
      "TypeScript",
      "Python",
    ],
    showcase: {
      rationale:
        "When payment evidence is scattered across chats, screenshots, and paper ledgers, teams can chase balances that have already been paid. Attest helps operators verify the evidence before following up.",
      images: [
        {
          file: "cashfree-sarvam-attest.webp",
          width: 1100,
          height: 773,
          alt: "The Attest team at the Cashfree × Sarvam AI Buildathon",
        },
        {
          file: "cashfree-sarvam-office.webp",
          width: 900,
          height: 586,
          alt: "Inside the Cashfree office in Bengaluru during the buildathon",
        },
      ],
    },
    whatIBuilt: [
      "Integrated Cashfree payment verification and the reconciliation engine into the operations desk.",
      "Built the dashboard and connected customer chat, document scanning, and payment approvals.",
    ],
    githubUrl: "https://github.com/ntbnaren7/attest",
    linkedinUrl:
      "https://www.linkedin.com/posts/sanjay-t-43878229a_psnacet-sarvam-cashfree-activity-7530241441739030528-5U4A",
  },
  {
    name: "Amazon ML Challenge 2025",
    project: "Smart Product Pricing",
    location: "Online",
    placement: "Rank #816 Globally, 1st Place Campus Level",
    badge: "Top 1%",
    solution:
      "Our regression pipeline estimated prices from product descriptions, pack sizes, and other catalog data.",
    role: "ML Engineer",
    tech: [
      "LightGBM",
      "RidgeCV",
      "Target Encoding",
      "Scikit-learn",
      "Pandas",
      "NumPy",
      "Python",
    ],
    showcase: {
      linkedinPreview: {
        author: "Naren A",
        summary:
          "Our team finished #816 on the public leaderboard out of 80,000+ registrations and took first place on campus. I worked with Naveen Kumar K M, Rahman MS, and Vikash J D.",
      },
      rationale:
        "Sellers need consistent price estimates across large catalogs. The challenge’s scoring metric made even small errors on low-priced items costly.",
      images: [
        {
          file: "amazon-mlc-results.webp",
          width: 1500,
          height: 584,
          alt: "Amazon ML Challenge 2025 results shared in the LinkedIn post",
        },
      ],
    },
    whatIBuilt: [
      "Built the cleaning and feature pipeline for over 75,000 records, including outlier handling and cross-validated target encoding.",
      "Trained LightGBM and RidgeCV models on log-transformed prices and tuned them against the challenge metric.",
    ],
    githubUrl: "https://github.com/ntbnaren7/amazon-ml-challenge-2025",
    linkedinUrl:
      "https://www.linkedin.com/posts/naren-tech_machinelearning-ml-amazonmlchallenge2025-activity-7404207236002340865-WPQj",
  },
  {
    name: "LTTS TECHgium 9th Edition",
    project: "Harmony Aura",
    location: "Virtual proof-of-concept round",
    badge: "Pre-Finale",
    solution:
      "Harmony Aura combines machine telemetry and worker biometrics in an industrial safety monitoring system. A shared live feed powers a supervisor dashboard and mobile apps for operators.",
    role: "ML Engineer",
    tech: [
      "1D CNN",
      "Digital Twin",
      "TensorFlow",
      "Scikit-learn",
      "Firebase",
      "ESP32",
      "React",
      "Flutter",
      "Python",
    ],
    showcase: {
      rationale:
        "Machine faults and worker stress are often tracked separately. Seeing both together helps supervisors respond to unsafe conditions earlier.",
      images: [
        {
          file: "ltts-techgium-certificate.webp",
          width: 1800,
          height: 1273,
          alt: "TECHgium certificate recognizing Harmony Aura’s participation in the virtual proof-of-concept round",
          expandable: true,
        },
        {
          file: "ltts-techgium-shortlist.webp",
          width: 1897,
          height: 294,
          alt: "TECHgium email confirming the shortlist for the proof-of-concept presentation",
          expandable: true,
        },
      ],
    },
    whatIBuilt: [
      "Built a 1D CNN for detecting machine faults from vibration time series.",
      "Developed a risk score that combines worker biometrics with machine state and synced it across the dashboard and mobile apps.",
    ],
    githubUrl: "https://github.com/ntbnaren7/harmony-aura",
  },
  {
    name: "SaaSathoN'26",
    project: "Scribe",
    location: "SSN College of Engineering, Chennai",
    badge: "Winner",
    solution:
      "Scribe analyzes a brand’s website and turns what it learns into platform-specific marketing posts. We launched it during SaaSathoN and won first place.",
    role: "Full Stack Developer",
    tech: [
      "Provider Fallbacks",
      "Background Workers",
      "Gemini",
      "Next.js",
      "Supabase",
      "TypeScript",
    ],
    showcase: {
      rationale:
        "Getting from a website to a campaign usually means repeating the same brand research for every channel. Scribe carries the brand context into each draft.",
      images: [
        {
          file: "saasathon-scribe-trophy.webp",
          width: 800,
          height: 800,
          alt: "SaaSathoN first-place trophy beside the Scribe demo",
        },
      ],
    },
    whatIBuilt: [
      "Built an inference layer that falls back across model providers when a request fails.",
      "Built the background generation pipeline and defined schemas for brand profiles and content drafts.",
    ],
    githubUrl: "https://github.com/ntbnaren7/usescribe",
    demoUrl: "https://usescribe.in",
    linkedinUrl:
      "https://www.linkedin.com/posts/naren-tech_saasathon-saas-scribe-share-7459209406929453056-OhZF/",
  },
  {
    name: "Auristra'26",
    project: "DriveOS",
    location: "Takshashila University, Villupuram",
    badge: "Winner",
    solution:
      "DriveOS detects road hazards at the edge and shares them through a vehicle-to-vehicle mesh. Its dashboard brings the camera feed and hazard alerts into one view.",
    role: "Full Stack & Edge ML Developer",
    tech: [
      "Vehicle-to-Vehicle Mesh",
      "Edge Inference",
      "YOLOv8s",
      "ONNX Runtime",
      "OpenCV",
      "Firebase",
      "React",
      "Flutter",
    ],
    showcase: {
      rationale:
        "A pothole detected by one vehicle can warn others before they reach it. DriveOS turns local camera detections into shared road alerts.",
      images: [
        {
          file: "auristra-driveos-team.webp",
          width: 1100,
          height: 734,
          alt: "The DriveOS team onstage at Auristra",
        },
        {
          file: "auristra-takshashila-campus.webp",
          width: 751,
          height: 1000,
          alt: "Courtyard at Takshashila University during Auristra",
        },
      ],
    },
    whatIBuilt: [
      "Built Benthic Vision, the real-time YOLOv8s and OpenCV detection pipeline that runs at the edge.",
      "Built the driver dashboard and connected it to a Firebase-backed mobile app for sharing hazard alerts.",
    ],
    githubUrl: "https://github.com/ntbnaren7/drive-os",
    linkedinUrl:
      "https://www.linkedin.com/feed/update/urn:li:activity:7451285263906979840/",
  },
  {
    name: "Hackcelerate'26",
    project: "WI4ED",
    location: "SRM Institute of Science & Tech., Chennai",
    placement: "First runner-up",
    badge: "Runner-up",
    solution:
      "WI4ED is a smart plug with a companion app that shows live power use, identifies unusual appliance behavior, and can alert the user or cut power.",
    role: "Mobile App Developer",
    tech: [
      "FL Chart",
      "Flutter",
      "Dart",
      "Provider",
      "Electrical Signature Analysis",
    ],
    showcase: {
      rationale:
        "An energy total can tell you how much power an appliance used. WI4ED looks for patterns like sustained overload so you can act while it’s happening.",
      images: [
        {
          file: "hackcelerate-wi4ed-team.webp",
          width: 1100,
          height: 825,
          alt: "The WI4ED team receiving the second-place award at Hackcelerate",
        },
        {
          file: "hackcelerate-wi4ed-award.webp",
          width: 563,
          height: 1000,
          alt: "Hackcelerate second-place award cheque",
        },
      ],
    },
    whatIBuilt: [
      "Built the Flutter dashboard for live power, appliance signatures, and consumption history.",
      "Built the safety center for overload alerts and appliance health scores.",
    ],
    githubUrl: "https://github.com/ntbnaren7/wi4ed-intelligence-mobile-app",
    linkedinUrl:
      "https://www.linkedin.com/posts/naren-tech_finished-%F0%9D%9F%AE-%F0%9D%97%AE%F0%9D%98%81-%F0%9D%97%9B%F0%9D%97%AE%F0%9D%97%B0%F0%9D%97%B8%F0%9D%97%B0%F0%9D%97%B2%F0%9D%97%B9%F0%9D%97%B2%F0%9D%97%BF%F0%9D%97%AE%F0%9D%98%81%F0%9D%97%B2-activity-7426701480973365248-__pH",
  },
];
