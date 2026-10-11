/* =====================================================================
   PROFILE CONFIG  —  edit this file to update your personal details.
   Anything set to null is hidden or shown as an "add this" placeholder.
   ===================================================================== */
window.DATA = window.DATA || {};

window.DATA.profile = {
  name: "BUKKE GANESH NAIK",
  shortName: "Ganesh",
  siteTitle: "Bukke Ganesh Naik | Cybersecurity & Software Development Portfolio",
  headline: "Cybersecurity Engineer in Progress | AI & Full-Stack Developer | Technology Enthusiast",
  roles: [
    "Aspiring Cybersecurity Engineer",
    "AI & Full-Stack Developer",
    "Software Engineering Enthusiast",
  ],
  heroText:
    "I build technology-driven projects, explore cybersecurity, and develop practical applications using modern programming tools. I am continuously learning, building, and preparing to solve real-world problems through secure and intelligent software.",

  degree: "B.Tech in Computer Science and Engineering – Cyber Security",
  university: "Mohan Babu University, Tirupati, Andhra Pradesh, India",
  graduation: "2029 (expected)",

  email: "bukkeganeshnaik@gmail.com",
  github: "https://github.com/bukkeganeshnaik224-eng",
  githubUsername: "bukkeganeshnaik224-eng",
  linkedin: null, // e.g. "https://www.linkedin.com/in/your-handle"  (button hidden while null)

  photo: "assets/images/profile.jpg",

  // Availability badge shown in the hero. Set show:false to hide.
  availability: {
    show: true,
    text: "Open to internships & collaborations",
    status: "open", // "open" | "busy"
  },

  // Resume. Put your PDF at documents/resume.pdf (or change the path).
  // The site checks whether the file exists; if not, it shows "coming soon".
  resume: {
    file: "documents/resume.pdf",
    downloadName: "Bukke-Ganesh-Naik-Resume.pdf",
    showPreview: true, // embed a preview in the documents section
  },

  // PRIVACY: phone is never rendered unless you explicitly set it AND showPhone is true.
  phone: null,
  showPhone: false,

  about: [
    "I am a Computer Science and Engineering student specializing in Cyber Security at Mohan Babu University. My interests include cybersecurity, software development, artificial intelligence, and building practical web applications.",
    "I enjoy exploring new technologies, developing projects, strengthening my technical skills, and collaborating with others. My goal is to combine secure engineering practices with modern software development to build useful, reliable, and intelligent applications.",
  ],

  aboutCards: [
    {
      n: "01",
      title: "Cybersecurity",
      icon: "shield",
      text: "Learning network security, cyber threats, vulnerabilities, and security best practices.",
    },
    {
      n: "02",
      title: "Software Development",
      icon: "code",
      text: "Building projects using Java, Python, SQL, HTML, CSS, and JavaScript.",
    },
    {
      n: "03",
      title: "Artificial Intelligence",
      icon: "cpu",
      text: "Exploring AI-powered applications and AI agent technologies.",
    },
  ],

  terminal: {
    prompt: "ganesh@portfolio:~$",
    interests: ["Cybersecurity", "Artificial Intelligence", "Full-Stack Development", "Software Engineering"],
    status: "Learning | Building | Improving",
  },

  // Contact form. Real delivery requires an endpoint, e.g. a free Formspree form:
  //   1) create a form at https://formspree.io  2) paste its URL below.
  // While null, the form opens the visitor's email app (mailto) and says so honestly.
  contactForm: {
    endpoint: null, // e.g. "https://formspree.io/f/xxxxxxx"
  },

  seo: {
    description:
      "Portfolio of Bukke Ganesh Naik: cybersecurity, software development, artificial intelligence, projects, certifications, and technical learning.",
    siteUrl: "", // set to your deployed URL, e.g. "https://ganesh.vercel.app"
  },
};
