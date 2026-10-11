/* =====================================================================
   CERTIFICATES — add a certificate by copying one object.

   To attach the real file:
     1) put the PDF in  certificates/   (e.g. certificates/hackviser-core.pdf)
     2) set  pdf: "certificates/hackviser-core.pdf"
     3) optional thumbnail image: thumb: "certificates/hackviser-core.jpg"
   Until a PDF is set, the card shows a clearly labeled placeholder.

   category: Cybersecurity | Artificial Intelligence | Programming |
             Professional Development | Hackathons | Other
   date / verifyUrl: leave null unless you can confirm them from the certificate.
   Nothing here is marked "verified" — the site never claims independent verification.
   ===================================================================== */
window.DATA = window.DATA || {};

window.DATA.certificateCategories = [
  "Cybersecurity",
  "Artificial Intelligence",
  "Programming",
  "Professional Development",
  "Hackathons",
  "Other",
];

window.DATA.certificates = [
  {
    id: "hackviser-core",
    title: "Certified Cybersecurity Foundations (CORE)",
    issuer: "Hackviser",
    category: "Cybersecurity",
    date: null,
    pdf: null,
    thumb: null,
    verifyUrl: null,
  },
  {
    id: "opswat-icip",
    title: "Introduction to Critical Infrastructure Protection (ICIP)",
    issuer: "OPSWAT Academy",
    category: "Cybersecurity",
    date: null,
    pdf: null,
    thumb: null,
    verifyUrl: null,
  },
  {
    id: "google-ai-agents",
    title: "5-Day AI Agents Intensive Course with Google",
    issuer: "Google",
    category: "Artificial Intelligence",
    date: null,
    pdf: null,
    thumb: null,
    verifyUrl: null,
  },
  {
    id: "unstop-js-es6",
    title: "JavaScript ES6 with AI",
    issuer: "Unstop",
    category: "Programming",
    date: null,
    pdf: null,
    thumb: null,
    verifyUrl: null,
  },
  {
    id: "unstop-html",
    title: "HTML with AI",
    issuer: "Unstop",
    category: "Programming",
    date: null,
    pdf: null,
    thumb: null,
    verifyUrl: null,
  },
  {
    id: "ms-office",
    title: "MS Office Certification",
    issuer: "Issuer to be confirmed",
    category: "Professional Development",
    date: null,
    pdf: null,
    thumb: null,
    verifyUrl: null,
  },
  {
    id: "tata-crucible-2025",
    title: "TATA Crucible Campus Quiz 2025",
    issuer: "TATA Crucible",
    category: "Other",
    date: "2025",
    pdf: null,
    thumb: null,
    verifyUrl: null,
  },
  {
    id: "hp-assessment",
    title: "HP Online Assessment",
    issuer: "HP",
    category: "Professional Development",
    date: null,
    pdf: null,
    thumb: null,
    verifyUrl: null,
  },
  {
    id: "daily-quiz-october",
    title: "Daily Quiz (October Series)",
    issuer: "Issuer to be confirmed",
    category: "Other",
    date: null,
    pdf: null,
    thumb: null,
    verifyUrl: null,
  },
  {
    id: "hackfusion-2026",
    title: "HACKFUSION 2026 — Hackathon Participant",
    issuer: "IEEE Robotics & Automation Society × Mohan Babu University",
    category: "Hackathons",
    date: "2026",
    pdf: null,
    thumb: null,
    verifyUrl: null,
  },
];
