/* =====================================================================
   PROJECTS — add a new project by copying one object and editing it.

   status:  "live" | "prototype" | "in-progress"   (shown as a badge)
   live / repo:  a URL string, or null (button then shows "Link not added")
   show:    false hides a project without deleting it
   theme:   "ai" | "robot" | "health" | "skill"   (picks the preview graphic)
   Only describe what is actually built. Do not add metrics you cannot back up.
   ===================================================================== */
window.DATA = window.DATA || {};

window.DATA.projects = [
  {
    id: "ai-nexus",
    title: "AI_Nexus",
    status: "live",
    theme: "ai",
    summary: "An AI-powered web application, built and deployed as a live project.",
    highlights: [
      "Application development",
      "User interface design",
      "Practical usability",
      "End-to-end development and deployment",
    ],
    tech: ["AI", "Web App", "Vercel"],
    live: "https://ai-nexus-phi-nine.vercel.app",
    repo: null, // add your repository URL here
    screenshot: null, // e.g. "assets/projects/ai-nexus.png"
    show: true,
  },
  {
    id: "nexus-swarm",
    title: "NEXUS-SWARM",
    subtitle: "Multi-Robot Task Negotiation Engine",
    status: "in-progress",
    theme: "robot",
    summary:
      "A hackathon project by Team Akatsuki: an autonomous multi-robot negotiation and mission intelligence platform where robots bid for tasks, form coalitions, and recover when a teammate fails.",
    highlights: [
      "Deterministic local decision engine; AI/LLM layer is optional and modular",
      "Designed demo: coalition forms, a robot fails mid-mission, a new coalition takes over",
      "Dashboard, digital twin view, trust scoring and judge mode planned",
    ],
    tech: ["React", "TypeScript", "FastAPI", "SQLAlchemy", "WebSockets", "Tailwind"],
    live: null,
    repo: null,
    screenshot: null,
    show: true,
  },
  {
    id: "robotwin",
    title: "RoboTwin",
    subtitle: "Predictive Self-Healing Autonomous Fleet",
    status: "in-progress",
    theme: "robot",
    summary:
      "A digital twin for a simulated fleet of 500+ robots built around a Monitor, Predict, Prevent, Adapt, Recover loop for robot health, battery and risk assessment.",
    highlights: [
      "Fleet monitoring and failure-prediction engine",
      "Self-healing and recovery workflow",
      "Failure injection lab and what-if simulation planned",
    ],
    tech: ["React", "TypeScript", "FastAPI", "scikit-learn", "NetworkX", "PostgreSQL"],
    live: null,
    repo: null,
    screenshot: null,
    show: true,
  },

  /* ---- Hidden until you confirm them. Set show:true and fill in details. ---- */
  {
    id: "aarogyasathi-ai",
    title: "AAROGYASATHI AI",
    status: "prototype",
    theme: "health",
    summary: "Add the real purpose, features and technologies of this project here.",
    highlights: [],
    tech: [],
    live: null,
    repo: null,
    screenshot: null,
    show: false,
  },
  {
    id: "skillgap-ai",
    title: "SkillGap AI",
    status: "prototype",
    theme: "skill",
    summary: "Replaced by AI_Nexus on your resume. Re-enable only if you still want it listed.",
    highlights: [],
    tech: [],
    live: null,
    repo: null,
    screenshot: null,
    show: false,
  },
];
