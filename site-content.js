/**
 * SCILAND LAB — content configuration
 * Edit this file to update the lab name, SciLand project copy and report links.
 * All public links are intentionally empty until you supply the real URL.
 */
window.SCILAND_CONTENT = {
  labName: "SciLand Lab",  // Lab display name; edit here if you want different branding.
  labShortName: "SCILAND",
  institution: "Scientific Embodied Intelligence · Research Lab",
  location: "Research in robotics, AI & scientific discovery",
  heroEyebrow: "SCIENTIFIC EMBODIED INTELLIGENCE / 2026",
  heroTitleFirst: "Intelligence for the",
  heroTitleSecond: "laboratory of tomorrow.",
  heroDescription: "We explore how embodied AI can perceive, reason and act with precision — transforming scientific workflows into reliable, adaptive robotic systems.",
  mission: "Scientific discovery deserves intelligence that can act in the real world.",
  missionCopy: "Our research connects robot learning, trustworthy AI and autonomous scientific experimentation. From precise manipulation to long-horizon protocol execution, we study what it takes to make intelligent laboratory systems capable, verifiable and adaptable.",
  contactEmail: "", // e.g. lab@university.edu — left blank on purpose
  githubUrl: "", // Add the lab's organization URL when available
  projects: [
    {
      id: "sciland",
      number: "01",
      category: "LAB PLATFORM",
      status: "In development",
      statusTone: "active",
      title: "SciLand 1.0",
      subtitle: "A scientific embodied laboratory platform",
      summary: "Connecting robot manipulation with real laboratory workflows — from foundational pick-and-place to precision handling and structured task evaluation.",
      details: "SciLand 1.0 explores the foundations of embodied intelligence in scientific laboratory settings. Current work includes deploying a physical robot, defining reproducible manipulation tasks and designing progressively harder levels of precision and autonomy. Public materials and demonstrations will be linked here when ready.",
      tags: ["Embodied Robotics", "Scientific Automation", "Real-World Systems"],
      image: "assets/project-sciland.svg",
      link: ""
    }
  ],
  reports: [
    {
      id: "sciland-report",
      type: "Technical Report",
      year: "2026",
      title: "SciLand 1.0: A Scientific Embodied Laboratory Platform",
      description: "Platform overview, experimental setup, task structure and initial evaluation methodology.",
      status: "In preparation",
      summary: "The SciLand 1.0 technical report will document the laboratory platform, the design of scientific manipulation tasks and the evaluation approach. The report is being prepared; a public PDF has not been added.",
      url: ""
    },
    {
      id: "task-taxonomy",
      type: "Research Notes",
      year: "2026",
      title: "Fine-Grained Scientific Manipulation: Task Taxonomy",
      description: "An evolving L0–L5 categorization of embodied laboratory manipulation requirements.",
      status: "Working notes",
      summary: "An early task taxonomy ranging from basic translation and placement to precise alignment, liquid handling and autonomous long-horizon laboratory protocols. This is a working research artifact, not a published benchmark.",
      url: ""
    }
  ]
};
