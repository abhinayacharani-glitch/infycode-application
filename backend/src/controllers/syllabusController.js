import db from "../config/firebase.js";

const syllabusRef = db.ref("syllabuses");

const DEFAULT_SYLLABUSES = [
  {
    title: "Java Full Stack Development",
    modules: [
      { name: "Java Basics", topics: ["Introduction", "Fundamentals", "Methods", "Arrays", "Strings", "Regular Expressions"] },
      { name: "OOP & Interfaces", topics: ["Classes and Objects", "Access Modifiers", "Constructor", "OOP", "Packages", "Interfaces"] },
      { name: "Collections", topics: ["Collections", "Collection Classes", "Collection Interface", "Iterator", "Comparator Interface"] },
      { name: "Exception Handling", topics: ["Exception Handling", "Try Catch Block", "Final, Finally, Finalize", "Chained Exceptions", "Null Pointer Exception", "Method Overloading"] },
      { name: "Java Advanced", topics: ["Multithreading", "Synchronization", "File Handling", "Method References", "Java 8 Streams", "Networking", "JDBC", "Memory Management", "Garbage Collection", "Memory Leaks"] }
    ]
  },
  {
    title: "Python Programming Masterclass",
    modules: [
      { name: "Python Fundamentals", topics: ["Introduction to Python", "Data Types & Variables", "Control Flow (If/Else, Loops)", "Functions & Modules", "List Comprehensions"] },
      { name: "Object Oriented Programming", topics: ["Classes and Objects", "Inheritance", "Polymorphism", "Encapsulation", "Magic Methods"] },
      { name: "Data Science Libraries", topics: ["NumPy Basics", "Pandas DataFrames", "Matplotlib Visualization", "Seaborn"] },
      { name: "Web Development with Django", topics: ["Django Project Structure", "Models and Migrations", "Views and Templates", "Django Rest Framework"] }
    ]
  },
  {
    title: "AWS Cloud Practitioner",
    modules: [
      { name: "Introduction to Cloud", topics: ["Cloud Concepts", "IAM & Security", "Virtual Private Cloud (VPC)"] },
      { name: "Compute Services", topics: ["EC2 Instances", "AWS Lambda (Serverless)", "Elastic Beanstalk"] },
      { name: "Storage & Databases", topics: ["S3 Buckets", "RDS & DynamoDB", "Elastic File System"] },
      { name: "DevOps & Monitoring", topics: ["CloudWatch", "CloudTrail", "CI/CD Pipelines (CodePipeline)"] }
    ]
  },
  {
    title: "Introduction to AI",
    modules: [
      { name: "AI Foundations", topics: ["Introduction to AI", "History of AI", "Types of AI", "Future of AI"] },
      { name: "Machine Learning Basics", topics: ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "Linear Regression", "Decision Trees"] },
      { name: "Deep Learning", topics: ["Neural Networks", "Activation Functions", "Backpropagation", "CNNs", "RNNs"] },
      { name: "Natural Language Processing", topics: ["Text Preprocessing", "Tokenization", "Sentiment Analysis", "Transformers"] },
      { name: "Computer Vision", topics: ["Image Processing", "Object Detection", "Face Recognition"] }
    ]
  },
  {
    title: "Aptitude",
    modules: [
      { name: "Quantitative Aptitude", topics: ["Number Systems", "Percentages", "Profit & Loss", "Ratio & Proportion", "Time & Work", "Time, Speed & Distance"] },
      { name: "Logical Reasoning", topics: ["Blood Relations", "Coding-Decoding", "Direction Sense", "Seating Arrangement", "Puzzles", "Syllogisms"] },
      { name: "Verbal Ability", topics: ["Grammar Basics", "Sentence Correction", "Synonyms & Antonyms", "Reading Comprehension", "Para Jumbles"] },
      { name: "Data Interpretation", topics: ["Tables & Charts", "Bar Graphs", "Pie Charts", "Line Graphs", "Caselet DI"] }
    ]
  },
  {
    title: "React JS Full Stack Development",
    modules: [
      { name: "React Fundamentals", topics: ["JSX & Components", "Props & State", "Hooks (useState, useEffect)", "Handling Events"] },
      { name: "Advanced React", topics: ["Context API", "Custom Hooks", "Higher Order Components", "Render Props"] },
      { name: "State Management", topics: ["Redux Toolkit", "RTK Query", "Zustand"] },
      { name: "Backend with Node.js", topics: ["Express Basics", "MongoDB & Mongoose", "JWT Authentication", "REST API Design"] }
    ]
  },
  {
    title: "MERN Stack Development",
    modules: [
      { name: "Frontend (React)", topics: ["React Router", "Redux Toolkit", "Tailwind CSS"] },
      { name: "Backend (Node & Express)", topics: ["Middleware", "Routing", "Controller Patterns"] },
      { name: "Database (MongoDB)", topics: ["Aggregation Framework", "Indexing", "Data Modeling"] },
      { name: "Deployment", topics: ["Docker", "CI/CD", "AWS/Heroku"] }
    ]
  },
  {
    title: "Ethical Hacking & Cyber Security",
    modules: [
      { name: "Introduction to Security", topics: ["Networking Basics", "Linux for Hackers", "Virtualization"] },
      { name: "Scanning & Enumeration", topics: ["Nmap", "Metasploit", "Vulnerability Scanning"] },
      { name: "Web App Hacking", topics: ["SQL Injection", "XSS", "CSRF", "Broken Auth"] },
      { name: "Network Hacking", topics: ["MITM", "WiFi Hacking", "Firewall Evasion"] }
    ]
  },
  {
    title: "UI/UX Design Mastery",
    modules: [
      { name: "Design Theory", topics: ["Color Theory", "Typography", "Layout & Grids"] },
      { name: "Figma Mastery", topics: ["Auto Layout", "Components & Variants", "Prototyping"] },
      { name: "User Research", topics: ["User Personas", "Journey Mapping", "Wireframing"] },
      { name: "Design Systems", topics: ["Style Guides", "Asset Libraries", "Developer Handoff"] }
    ]
  }
];

/**
 * @desc Get all syllabuses
 * @route GET /api/syllabuses
 */
export const getSyllabuses = async (req, res) => {
  try {
    const snapshot = await syllabusRef.once("value");
    let data = snapshot.val() || {};
    
    // Seed if empty
    if (Object.keys(data).length === 0) {
      console.log("[Syllabus Controller] Seeding default syllabuses...");
      for (const syllabus of DEFAULT_SYLLABUSES) {
        await syllabusRef.push({ ...syllabus, createdAt: new Date().toISOString() });
      }
      const newSnapshot = await syllabusRef.once("value");
      data = newSnapshot.val() || {};
    }

    const syllabuses = Object.entries(data).map(([id, syllabus]) => ({
      id,
      ...syllabus,
    }));
    res.status(200).json({ syllabuses });
  } catch (error) {
    console.error("Error fetching syllabuses:", error);
    res.status(500).json({ error: "Failed to fetch syllabuses" });
  }
};

/**
 * @desc Create a new syllabus
 * @route POST /api/syllabuses
 */
export const createSyllabus = async (req, res) => {
  try {
    const { title, modules } = req.body;
    if (!title || !modules || !Array.isArray(modules)) {
      return res.status(400).json({ error: "Title and modules are required" });
    }

    const newSyllabusRef = syllabusRef.push();
    const newSyllabus = {
      title,
      modules,
      createdAt: new Date().toISOString(),
    };

    await newSyllabusRef.set(newSyllabus);
    res.status(201).json({
      message: "Syllabus created successfully",
      syllabus: { id: newSyllabusRef.key, ...newSyllabus },
    });
  } catch (error) {
    console.error("Error creating syllabus:", error);
    res.status(500).json({ error: "Failed to create syllabus" });
  }
};
