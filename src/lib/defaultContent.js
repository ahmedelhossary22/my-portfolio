// Default content for the whole portfolio.
// The website shows this until you save changes from /admin — after that,
// whatever is stored in Firestore (document: site/content) replaces it.
// Tip: wrap text in **double stars** to make it bold in the About paragraphs.

const skillCategories = [
  {
    title: "PROGRAMMING LANGUAGES",
    items: [
      { name: "Python", detail: "AI, Data Science & Automation", icon: "PY" },
      { name: "Java", detail: "Object-Oriented Programming", icon: "JV" },
      { name: "JavaScript", detail: "Web Development", icon: "JS" },
      { name: "C++", detail: "Programming Fundamentals", icon: "C+" },
      { name: "C", detail: "Programming Fundamentals", icon: "C" },
      { name: "Dart", detail: "Flutter Development", icon: "D" },
    ],
  },
  {
    title: "FRAMEWORKS & LIBRARIES",
    items: [
      { name: "Flutter", detail: "Cross-Platform Mobile Apps", icon: "FL" },
      { name: "Pandas", detail: "Data Manipulation", icon: "PD" },
      { name: "NumPy", detail: "Numerical Computing", icon: "NP" },
      { name: "Scikit-learn", detail: "Machine Learning", icon: "ML" },
      { name: "TensorFlow / Keras", detail: "Deep Learning", icon: "TF" },
      { name: "OpenCV", detail: "Computer Vision", icon: "CV" },
    ],
  },
  {
    title: "AI & MACHINE LEARNING",
    items: [
      { name: "Machine Learning", detail: "Predictive Modeling", icon: "ML" },
      { name: "Deep Learning", detail: "Neural Networks", icon: "DL" },
      { name: "Computer Vision", detail: "Image Processing", icon: "CV" },
      { name: "Data Science", detail: "Analysis & Insights", icon: "DS" },
    ],
  },
  {
    title: "AI AUTOMATION & TOOLS",
    items: [
      { name: "n8n", detail: "Workflow Automation", icon: "N8" },
      { name: "LLM Integration", detail: "AI-Powered Workflows", icon: "AI" },
      { name: "REST APIs", detail: "System Integration", icon: "API" },
      { name: "Prompt Engineering", detail: "LLM Applications", icon: "PE" },
    ],
  },
  {
    title: "WEB & BACKEND",
    items: [
      { name: "HTML5", detail: "Web Structure", icon: "H5" },
      { name: "CSS3", detail: "Responsive Styling", icon: "C3" },
      { name: "Firebase", detail: "Backend & Authentication", icon: "FB" },
      { name: "REST APIs", detail: "API Integration", icon: "API" },
    ],
  },
  {
    title: "DATA & VISUALIZATION",
    items: [
      { name: "Data Analysis", detail: "Exploration & Insights", icon: "DA" },
      { name: "Power BI", detail: "Interactive Reports", icon: "BI" },
      {
        name: "Data Visualization",
        detail: "Communicating Insights",
        icon: "DV",
      },
    ],
  },
];

const projects = [
  {
    number: "01",
    title: "FIFA World Cup 2026 Data Analysis",
    category: "DATA SCIENCE · FOOTBALL ANALYTICS",
    description:
      "Football data collection, cleaning, integration, and analysis to explore player, team, and match statistics.",
    tech: ["Python", "Pandas", "APIs", "Web Scraping", "Analytics"],
    overview: [
      "This project explores football data for the FIFA World Cup 2026. It covers collecting data from different sources, cleaning and combining it into one consistent dataset, and analyzing player, team, and match statistics to find patterns and insights.",
      "The goal is to turn raw football data into something easy to explore and understand.",
    ],
    technologies: [
      { name: "Python", use: "Main language for the whole data pipeline." },
      { name: "Pandas", use: "Cleaning, merging, and analyzing the datasets." },
      { name: "APIs", use: "Collecting football data from online sources." },
      { name: "Web Scraping", use: "Gathering data that is not available through an API." },
      { name: "Analytics", use: "Exploring statistics and presenting the insights." },
    ],
    type: "analytics",
    github:
      "https://github.com/ahmedelhossary22/FIFA-World-Cup-2026-Data-Analysis",
  },
  {
    number: "02",
    title: "Waste Classifier",
    category: "DEEP LEARNING · COMPUTER VISION",
    description:
      "A team project exploring image classification for waste sorting and intelligent recycling.",
    tech: ["Python", "Deep Learning", "Computer Vision"],
    overview: [
      "A team project that explores image classification for waste sorting. A deep learning model learns to recognize different types of waste from images, with the aim of supporting smarter recycling.",
      "My role was as a contributor to the team.",
    ],
    technologies: [
      { name: "Python", use: "Used to build and train the model." },
      { name: "Deep Learning", use: "Neural networks that learn to classify waste images." },
      { name: "Computer Vision", use: "Processing and preparing images for the model." },
    ],
    type: "ai",
    contribution: "Contributor to a team project",
    github: "https://github.com/seifalmaz/waste-classifier",
  },
  {
    number: "03",
    title: "Task Management System",
    category: "SOFTWARE ENGINEERING",
    description: "A task-management project developed using Python and R.",
    tech: ["Python", "R", "Task Management"],
    overview: [
      "A task-management project built with Python and R. It focuses on organizing tasks, tracking their progress, and reviewing what has been completed.",
    ],
    technologies: [
      { name: "Python", use: "Core application logic." },
      { name: "R", use: "Used alongside Python in the project." },
      { name: "Task Management", use: "Creating, organizing, and tracking tasks." },
    ],
    type: "tasks",
    github:
      "https://github.com/ahmedelhossary22/Task-Management-System-Python-and-R-language-project",
  },
  {
    number: "04",
    title: "Gesture Recognition",
    category: "COMPUTER VISION · AI",
    description:
      "A collaborative computer vision project focused on recognizing human gestures from visual input.",
    tech: ["Python", "Computer Vision", "Gesture Recognition"],
    overview: [
      "A collaborative computer vision project focused on recognizing human gestures from visual input. The system analyzes images or video and identifies the gesture being shown.",
      "My role was as a contributor to the team.",
    ],
    technologies: [
      { name: "Python", use: "Used to implement the project." },
      { name: "Computer Vision", use: "Analyzing visual input to detect gestures." },
      { name: "Gesture Recognition", use: "Identifying which gesture is being performed." },
    ],
    type: "vision",
    contribution: "Contributor to a team project",
    github: "https://github.com/seifalmaz/gesture-recognition",
  },
  {
    number: "05",
    title: "Event App",
    category: "MOBILE DEVELOPMENT",
    description:
      "A Flutter application for exploring and managing events, using Firebase services.",
    tech: ["Flutter", "Dart", "Firebase"],
    overview: [
      "A Flutter mobile application for exploring and managing events. It uses Firebase services for the backend, so event data is stored and managed in the cloud.",
    ],
    technologies: [
      { name: "Flutter", use: "Building the cross-platform mobile interface." },
      { name: "Dart", use: "The programming language behind the app." },
      { name: "Firebase", use: "Backend services and data storage." },
    ],
    type: "mobile",
    github: "https://github.com/ahmedelhossary22/Event_App",
  },
  {
    number: "06",
    title: "News App",
    category: "MOBILE DEVELOPMENT",
    description:
      "A Flutter mobile application for browsing news through a mobile-friendly interface.",
    tech: ["Flutter", "Dart", "REST APIs"],
    overview: [
      "A Flutter mobile application for browsing the latest news through a clean, mobile-friendly interface. News content is loaded from an online service through REST APIs.",
    ],
    technologies: [
      { name: "Flutter", use: "Building the mobile interface." },
      { name: "Dart", use: "The programming language behind the app." },
      { name: "REST APIs", use: "Fetching news content from an online source." },
    ],
    type: "news",
    github: "https://github.com/ahmedelhossary22/news_app",
  },
  {
    number: "07",
    title: "Islami App",
    category: "MOBILE DEVELOPMENT",
    description: "An Islamic-themed mobile application developed with Flutter.",
    tech: ["Flutter", "Dart"],
    overview: [
      "An Islamic-themed mobile application developed with Flutter, designed for a simple and focused mobile experience.",
    ],
    technologies: [
      { name: "Flutter", use: "Building the mobile interface." },
      { name: "Dart", use: "The programming language behind the app." },
    ],
    type: "islamic",
    github: "https://github.com/ahmedelhossary22/Islami-App-Flutter",
  },
];

const milestones = [
  {
    period: "2023",
    title: "The Beginning — Curiosity & First Inspiration",
    description:
      "My journey into technology began in 2023, during my final year of high school. I started exploring programming, learning about the technology industry, and discovering my passion for computer science.",
    icon: "light",
    skills: [
      "Programming Fundamentals",
      "Problem-Solving",
      "Computer Science Exploration",
      "Self-Learning",
    ],
  },
  {
    period: "2023 – Expected Graduation: 2027",
    title: "Starting My Computer Science Degree",
    description:
      "I began my Computer Science degree in 2023, building a strong foundation in programming, computational thinking, and software development while applying theoretical concepts through coursework and practical projects.",
    icon: "education",
    skills: [
      "Data Structures",
      "Object-Oriented Programming",
      "Algorithms",
      "C and C++",
      "Java and Python",
      "Database Fundamentals",
      "Software Engineering",
    ],
  },
  {
    period: "June 28, 2025 – September 2025",
    title: "Flutter Development — Route Academy",
    description:
      "I developed my mobile development skills through Flutter training at Route Academy, learning how to structure mobile interfaces and build applications using Dart and Flutter.",
    icon: "code",
    skills: [
      "Dart Programming",
      "Flutter Fundamentals",
      "Widgets and Layouts",
      "Responsive UI",
      "Navigation Between Screens",
      "Mobile App Development",
    ],
  },
  {
    period: "June 28, 2025 – November 22, 2025",
    title: "Flutter Development — Route Academy",
    description:
      "I continued developing my Flutter skills, strengthening my understanding of application structure, reusable components, and the process of building functional mobile applications.",
    icon: "mobile",
    skills: [
      "Dart",
      "Flutter Architecture",
      "Reusable Widgets",
      "State Management Fundamentals",
      "REST API Integration",
      "Firebase Fundamentals",
      "Debugging and Testing",
    ],
  },
  {
    period: "February 2026 – Present",
    title: "Machine Learning — Instant",
    description:
      "I began studying machine learning in February 2026, focusing on preparing data, understanding machine learning algorithms, training models, and evaluating their performance on practical datasets.",
    icon: "ai",
    skills: [
      "Python for Data Science",
      "NumPy",
      "Pandas",
      "Data Preprocessing",
      "Exploratory Data Analysis",
      "Feature Engineering",
      "Machine Learning Algorithms",
      "Model Evaluation",
    ],
  },
  {
    period: "July 2026 – Present",
    title: "AI Automation — DEPI",
    description:
      "I started my AI Automation journey through DEPI in July 2026, focusing on connecting applications, automating workflows, integrating APIs, and using large language models to build practical AI-powered solutions.",
    icon: "automation",
    skills: [
      "n8n Workflow Automation",
      "Triggers and Workflow Nodes",
      "REST API Integration",
      "Webhooks",
      "JSON Data Handling",
      "LLM Integration",
      "Prompt Engineering",
      "Workflow Error Handling",
    ],
  },
  {
    period: "Present",
    title: "The Journey Continues",
    description:
      "I continue learning, experimenting, and building projects across AI, machine learning, data science, automation, and software development. My goal is to turn technical knowledge into practical solutions that solve real problems.",
    icon: "rocket",
    skills: [
      "Continuous Learning",
      "Project-Based Development",
      "Technical Problem-Solving",
      "AI-Powered Applications",
      "Software Development",
    ],
  },
];

export const defaultContent = {
  hero: {
    badge: "AI AUTOMATION ENGINEER · DATA SCIENTIST",
    titleBefore: "Building",
    titleHighlight: "Intelligent",
    titleAfter: "Systems That\nSolve\nReal Problems.",
    description:
      "Hi, I'm Ahmed Elhossary. I build intelligent solutions that combine AI, machine learning, and software engineering — focused on practical, scalable, and user-centric applications. My expertise includes AI-powered automation, data analytics, computer vision, and LLM integrations.",
    primaryButton: "Explore My Work",
    secondaryButton: "Let's Connect",
    meta: ["⌖ Cairo, Egypt", "⌁ Software Engineering", "© Graduating 2027"],
    photo: "/Ahmed Elhossary.jpeg",
    cvLabel: "Download CV",
    cvUrl: "/Ahmed_Elhossary_CV.pdf",
  },
  ticker: {
    items: [
      "MACHINE LEARNING",
      "DATA SCIENCE",
      "COMPUTER VISION",
      "AI AUTOMATION",
      "DEEP LEARNING",
    ],
  },
  about: {
    headingMain: "Building intelligent solutions",
    headingAccent: "with purpose.",
    paragraphs: [
      "Hello, I'm **Ahmed Elhossary** — an AI Automation Engineer and Software Engineering professional interested in building practical, intelligent digital solutions.",
      "My work spans machine learning, deep learning, computer vision, data analytics, and AI-powered automation. I enjoy turning data and emerging AI technologies into useful tools that solve real-world problems.",
      "I also build software applications, including Flutter mobile apps and web-based solutions, and work with APIs, LLM integrations, and automated workflows to connect systems and simplify processes.",
    ],
    quickInfo: [
      { label: "NAME", value: "Ahmed Elhossary" },
      { label: "LOCATION", value: "Cairo, Egypt" },
      { label: "ROLE", value: "AI Automation & Software Engineering" },
      { label: "FOCUS", value: "AI, Automation, Data & Applications" },
    ],
    strengths: [
      { label: "AI ENGINEERING", icon: "ai" },
      { label: "DATA SCIENCE", icon: "data" },
      { label: "BACKEND", icon: "backend" },
      { label: "MOBILE DEVELOPMENT", icon: "mobile" },
    ],
  },
  skills: {
    title: "What I Work With",
    description:
      "Technologies and tools I use to build intelligent systems, automate workflows, analyze data, and develop digital products.",
    categories: skillCategories,
  },
  projects: {
    title: "Projects deserve more than a screenshot.",
    description:
      "Explore my work across AI, data analytics, computer vision, and mobile development. Select a project to discover its details.",
    items: projects,
  },
  journey: {
    title: "My Story So Far",
    subtitle:
      "From my first lines of code to exploring AI and building applications, here is how my technical journey has evolved.",
    introTitle:
      "A path shaped by curiosity, fundamentals, and building real products.",
    introText:
      "Each stage has helped me develop a stronger foundation in software engineering while exploring mobile development, machine learning, and AI automation. I am continuously connecting what I learn with practical projects and real-world problems.",
    milestones,
    closingTitle: "Learning never stops.",
    closingText:
      "My goal is to combine software engineering, data science, machine learning, and intelligent automation to create practical digital products and solutions.",
  },
  contact: {
    headingBefore: "Have a problem",
    headingHighlight: "worth solving?",
    description:
      "Have a question, an idea, or a project in mind? Send me a message and I'll get back to you as soon as I can.",
    github: "https://github.com/ahmedelhossary22",
    linkedin:
      "https://www.linkedin.com/in/ahmed-elhossary-ai-engineer/?isSelfProfile=true",
    footerLeft: "AI · Automation · Data · Software",
    footerCenter: "Designed to explore. Built to solve.",
  },
};
