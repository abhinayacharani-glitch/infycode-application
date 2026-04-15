export const COURSE_MAP = {
  // POPULAR COURSES
  'cid-108': {
    id: 'cid-108',
    title: "Full-Stack React & Next.js Masterclass",
    description: "Master React 18, Next.js 14, and the complete T3 stack to build high-performance web applications.",
    duration: "12 Weeks",
    students: "2.4k",
    rating: 4.9,
    level: "Intermediate",
    progress: 0,
    category: "Development",
    trainer: {
      name: "Mohan Krishna",
      role: "Senior Full-Stack Developer",
      experience: "8+ Years",
      specialization: "React, Next.js, Node.js"
    },
    batch: {
      name: "Regular Batch",
      id: "CR-108",
      startDate: "Jan 15, 2026",
      timing: "Mon, Wed, Fri — 10:00 AM to 12:00 PM",
      duration: "12 Weeks · Online Live"
    },
    objective: "Master the most in-demand frontend technologies. From React fundamentals and advanced hooks to Next.js Server Components and App Router, you'll build 3 production-ready projects including a full-scale AI-SaaS platform.",
    benefits: [
      { icon: "learning", label: "Project Based", desc: "Build & deploy 3 real-world apps" },
      { icon: "trainer", label: "Live Mentorship", desc: "Weekly 1:1 doubt clearing sessions" },
      { icon: "access", label: "T3 Stack", desc: "Master Typescript, tRPC, and Tailwind" },
      { icon: "projects", label: "Job Ready", desc: "Portfolio reviews and mock interviews" }
    ],
    modules: [
      {
        id: 'beginner',
        title: "Beginner Level",
        duration: "3 Weeks",
        mainTopicGroups: [
          {
            title: "React Foundations",
            subtopics: [
              { id: 'react-intro', title: "Why React? & Setup", duration: "45 min" },
              { id: 'react-jsx', title: "JSX & Component Architecture", duration: "60 min" },
              { id: 'react-props', title: "Props & State Management", duration: "50 min" }
            ]
          }
        ]
      },
      {
        id: 'intermediate',
        title: "Intermediate Level",
        duration: "4 Weeks",
        mainTopicGroups: [
          {
            title: "Advanced Patterns & Hooks",
            subtopics: [
              { id: 'react-hooks-adv', title: "Mastering useEffect & Custom Hooks", duration: "75 min" },
              { id: 'react-context', title: "Global State with Context API", duration: "90 min" },
              { id: 'react-perf', title: "Performance Optimization Patterns", duration: "65 min" }
            ]
          }
        ]
      },
      {
        id: 'advanced',
        title: "Advanced Level",
        duration: "5 Weeks",
        mainTopicGroups: [
          {
            title: "Next.js 14 & Enterprise Deployment",
            subtopics: [
              { id: 'next-router', title: "App Router & Server Components", duration: "120 min" },
              { id: 'next-actions', title: "Server Actions & T3 Stack", duration: "90 min" },
              { id: 'ai-saas', title: "Building an AI SaaS with Stripe", duration: "180 min" }
            ]
          }
        ]
      }
    ]
  },

  'cid-109': {
    id: 'cid-109',
    title: "Advanced Python for Data Engineering",
    description: "Architect scalable data pipelines, master ETL processes, and handle Big Data with Python and Spark.",
    duration: "8 Weeks",
    students: "1.8k",
    rating: 4.8,
    level: "Advanced",
    progress: 0,
    trainer: {
      name: "Sarah Williams",
      role: "Data Engineering Lead",
      experience: "9+ Years",
      specialization: "Python, Apache Spark, Airflow"
    },
    batch: {
      name: "Expert Batch",
      id: "CR-109",
      startDate: "Feb 10, 2026",
      timing: "Tue, Thu — 7:00 PM to 9:00 PM",
      duration: "8 Weeks · Online Live"
    },
    objective: "Master complex data processing. Learn to build production-grade ETL pipelines using Airflow, process massive datasets with Spark, and implement data quality checks.",
    benefits: [
      { icon: "data", label: "Big Data Tech", desc: "Spark, Kafka, and Airflow" },
      { icon: "cloud", label: "Cloud Native", desc: "Deploy to AWS & Snowflake" }
    ],
    modules: [
      {
        id: 'beginner',
        title: "Beginner Level",
        duration: "2 Weeks",
        mainTopicGroups: [
          {
            title: "Python for Data Core",
            subtopics: [
              { id: 'py-basics', title: "Advanced Data Structures in Python", duration: "45 min" },
              { id: 'py-file', title: "Efficient File Handling & Serialization", duration: "60 min" }
            ]
          }
        ]
      },
      {
        id: 'intermediate',
        title: "Intermediate Level",
        duration: "3 Weeks",
        mainTopicGroups: [
          {
            title: "Big Data & ETL Foundations",
            subtopics: [
              { id: 'py-etl', title: "Building ETL Pipelines with Pandas", duration: "75 min" },
              { id: 'spark-intro', title: "Introduction to Apache Spark", duration: "90 min" }
            ]
          }
        ]
      },
      {
        id: 'advanced',
        title: "Advanced Level",
        duration: "3 Weeks",
        mainTopicGroups: [
          {
            title: "Data Orchestration",
            subtopics: [
              { id: 'airflow-core', title: "Orchestrating Dags with Airflow", duration: "120 min" },
              { id: 'cloud-data', title: "Scalable Data Warehousing", duration: "100 min" }
            ]
          }
        ]
      }
    ]
  },

  'cid-110': {
    id: 'cid-110',
    title: "Enterprise Java Spring Boot Architecture",
    description: "Design and build microservices-based enterprise architectures with Spring Boot and Cloud.",
    duration: "10 Weeks",
    students: "950+",
    rating: 4.9,
    level: "Expert",
    progress: 0,
    trainer: {
      name: "Amit Patel",
      role: "Enterprise Architect",
      experience: "15+ Years",
      specialization: "Java, Spring Cloud, Docker"
    },
    batch: {
      name: "Architect Batch",
      id: "CR-110",
      startDate: "March 5, 2026",
      timing: "Saturday — 10:00 AM to 2:00 PM",
      duration: "10 Weeks · Online Live"
    },
    objective: "Deep dive into enterprise systems. Master Spring Cloud, Microservices, and high-performance database design.",
    benefits: [
      { icon: "arch", label: "Architecture focus", desc: "Learn system design patterns" },
      { icon: "scale", label: "Scalability", desc: "Build for millions of users" }
    ],
    modules: [
      {
        id: 'beginner',
        title: "Beginner Level",
        duration: "3 Weeks",
        mainTopicGroups: [
          {
            title: "Java Core & Spring Intro",
            subtopics: [
              { id: 'java-intro', title: "Java JVM Architecture & Setup", duration: "90 min" },
              { id: 'spring-intro', title: "Spring Core & Dependency Injection", duration: "75 min" }
            ]
          }
        ]
      },
      {
        id: 'intermediate',
        title: "Intermediate Level",
        duration: "3 Weeks",
        mainTopicGroups: [
          {
            title: "Microservices Development",
            subtopics: [
              { id: 'sb-rest', title: "Building REST APIs with Spring Boot", duration: "120 min" },
              { id: 'sb-data', title: "Spring Data JPA & Hibernate", duration: "100 min" }
            ]
          }
        ]
      },
      {
        id: 'advanced',
        title: "Advanced Level",
        duration: "4 Weeks",
        mainTopicGroups: [
          {
            title: "Cloud Native Java",
            subtopics: [
              { id: 'sc-eureka', title: "Service Discovery with Eureka", duration: "120 min" },
              { id: 'sb-docker', title: "Dockerizing Java Applications", duration: "90 min" }
            ]
          }
        ]
      }
    ]
  },

  'cid-111': {
    id: 'cid-111',
    title: "Generative AI & LLM Systems Design",
    description: "Build intelligence into your apps using GPT-4, LangChain, and Vector Databases.",
    duration: "6 Weeks",
    students: "1.2k",
    rating: 5.0,
    level: "Intermediate",
    progress: 0,
    trainer: { name: "Anish Kumar", role: "AI Researcher", experience: "6 Years", specialization: "NLP, PyTorch" },
    batch: { id: "CR-111", startDate: "Feb 20, 2026", timing: "Weekend", duration: "6 Weeks" },
    objective: "Master the architecture of modern AI systems. Learn to leverage LLMs for real-world automation, from prompt engineering to building autonomous agents.",
    benefits: [
      { icon: "ai", label: "LLM Mastery", desc: "Work with GPT-4 and Llama 3" },
      { icon: "rag", label: "RAG Pipeline", desc: "Build searchable knowledge bases" }
    ],
    modules: [
      {
        id: 'beginner',
        title: "Beginner Level",
        duration: "1.5 Weeks",
        mainTopicGroups: [
          {
            title: "Foundations of GenAI",
            subtopics: [
              { id: 'ai-intro', title: "How Transformers Work", duration: "45 min" },
              { id: 'prompt-eng', title: "Professional Prompt Engineering", duration: "60 min" }
            ]
          }
        ]
      },
      {
        id: 'intermediate',
        title: "Intermediate Level",
        duration: "2 Weeks",
        mainTopicGroups: [
          {
            title: "AI App Development",
            subtopics: [
              { id: 'langchain', title: "LangChain Orchestration", duration: "120 min" },
              { id: 'vector-db', title: "Pinecone & Vector DB Implementation", duration: "90 min" }
            ]
          }
        ]
      },
      {
        id: 'advanced',
        title: "Advanced Level",
        duration: "2.5 Weeks",
        mainTopicGroups: [
          {
            title: "Production AI Systems",
            subtopics: [
              { id: 'fine-tune', title: "Fine-tuning Small Language Models", duration: "180 min" },
              { id: 'ai-agents', title: "Building Autonomous Task Agents", duration: "150 min" }
            ]
          }
        ]
      }
    ]
  },
  
  'cid-112': {
    id: 'cid-112',
    title: "Modern Data Analytics with Power BI",
    description: "Data visualization and business intelligence for the modern era.",
    duration: "4 Weeks",
    students: "3.5k",
    rating: 4.8,
    level: "Beginner",
    progress: 0,
    trainer: { name: "Rajesh S.", role: "BI Lead", experience: "10 Years", specialization: "Power BI, SQL" },
    batch: { id: "CR-112", startDate: "March 1, 2026", duration: "4 Weeks" },
    objective: "Transform raw data into actionable insights. Master data cleaning, modeling, and storytelling through interactive dashboards.",
    benefits: [
      { icon: "viz", label: "Impactful Viz", desc: "Create high-end business reports" },
      { icon: "dax", label: "DAX Mastery", desc: "Complex calculations made easy" }
    ],
    modules: [
      {
        id: 'beginner',
        title: "Beginner Level",
        duration: "1 Week",
        mainTopicGroups: [
          {
            title: "Data Loading & ETL",
            subtopics: [
              { id: 'pq-intro', title: "Power Query Fundamentals", duration: "60 min" },
              { id: 'bi-connect', title: "Connecting to diverse Data Sources", duration: "45 min" }
            ]
          }
        ]
      },
      {
        id: 'intermediate',
        title: "Intermediate Level",
        duration: "1.5 Weeks",
        mainTopicGroups: [
          {
            title: "Data Modeling & DAX",
            subtopics: [
              { id: 'bi-model', title: "Star Schema & Data Relationships", duration: "90 min" },
              { id: 'bi-dax', title: "Calculated Columns vs Measures", duration: "120 min" }
            ]
          }
        ]
      },
      {
        id: 'advanced',
        title: "Advanced Level",
        duration: "1.5 Weeks",
        mainTopicGroups: [
          {
            title: "Reporting & Security",
            subtopics: [
              { id: 'bi-rls', title: "Implementing Row-Level Security", duration: "75 min" },
              { id: 'bi-service', title: "Power BI Service & Automation", duration: "60 min" }
            ]
          }
        ]
      }
    ]
  },

  'cid-113': {
    id: 'cid-113',
    title: "Cloud Infrastructure Specialist (AWS)",
    description: "Master AWS services and infrastructure as code.",
    duration: "8 Weeks",
    students: "800+",
    rating: 4.7,
    level: "Intermediate",
    progress: 0,
    trainer: { name: "Michael Chang", role: "Cloud Architect", experience: "14 Years", specialization: "AWS, Terraform" },
    batch: { id: "CR-113", startDate: "Jan 25, 2026", duration: "8 Weeks" },
    objective: "Build resilient cloud architectures. Master core AWS services and learn to manage infrastructure as code using Terraform.",
    benefits: [
      { icon: "cloud", label: "AWS SAA-C03", desc: "Prepare for Architect Certification" },
      { icon: "iac", label: "IaC focus", desc: "Terraform & CloudFormation" }
    ],
    modules: [
      {
        id: 'beginner',
        title: "Beginner Level",
        duration: "2 Weeks",
        mainTopicGroups: [
          {
            title: "Global Infrastructure",
            subtopics: [
              { id: 'aws-compute', title: "EC2 & Autoscaling Basics", duration: "90 min" },
              { id: 'aws-storage', title: "S3 & EFS Storage Solutions", duration: "75 min" }
            ]
          }
        ]
      },
      {
        id: 'intermediate',
        title: "Intermediate Level",
        duration: "3 Weeks",
        mainTopicGroups: [
          {
            title: "Networking & Databases",
            subtopics: [
              { id: 'aws-vpc', title: "VPC Design & Route 53", duration: "120 min" },
              { id: 'aws-rds', title: "RDS & DynamoDB Management", duration: "90 min" }
            ]
          }
        ]
      },
      {
        id: 'advanced',
        title: "Advanced Level",
        duration: "3 Weeks",
        mainTopicGroups: [
          {
            title: "Advanced Ops",
            subtopics: [
              { id: 'aws-lambda', title: "Serverless with AWS Lambda", duration: "100 min" },
              { id: 'aws-cicd', title: "AWS CodePipeline & DevOps", duration: "120 min" }
            ]
          }
        ]
      }
    ]
  },

  'cid-114': {
    id: 'cid-114',
    title: "Responsive Web Design Professional",
    description: "HTML5, CSS3, and Modern Layouts with a focus on mobile-first design.",
    duration: "6 Weeks",
    students: "5.6k",
    rating: 4.9,
    level: "Beginner",
    progress: 0,
    trainer: { name: "Sneha P.", role: "Frontend UI Lead", experience: "7 Years", specialization: "CSS, Animations" },
    batch: { id: "CR-114", startDate: "Feb 5, 2026", duration: "6 Weeks" },
    objective: "Master the art of creating pixel-perfect, responsive websites. Learn modern layouts like Flexbox and CSS Grid.",
    benefits: [
      { icon: "ui", label: "UI Focus", desc: "Animations and Micro-interactions" },
      { icon: "mobile", label: "Mobile First", desc: "Perfect on all device sizes" }
    ],
    modules: [
      {
        id: 'beginner',
        title: "Beginner Level",
        duration: "2 Weeks",
        mainTopicGroups: [
          {
            title: "Modern HTML & CSS",
            subtopics: [
              { id: 'css-box', title: "The Modern Box Model", duration: "60 min" },
              { id: 'css-flex', title: "Flexbox Layout Mastery", duration: "90 min" }
            ]
          }
        ]
      },
      {
        id: 'intermediate',
        title: "Intermediate Level",
        duration: "2 Weeks",
        mainTopicGroups: [
          {
            title: "Responsive Structures",
            subtopics: [
              { id: 'css-grid', title: "CSS Grid & Area Layouts", duration: "100 min" },
              { id: 'css-media', title: "Responsive Media Queries", duration: "75 min" }
            ]
          }
        ]
      },
      {
        id: 'advanced',
        title: "Advanced Level",
        duration: "2 Weeks",
        mainTopicGroups: [
          {
            title: "Polished UX",
            subtopics: [
              { id: 'css-anim', title: "Keyframe Animations & Transitions", duration: "90 min" },
              { id: 'css-perf', title: "Web Performance & Accessibility", duration: "120 min" }
            ]
          }
        ]
      }
    ]
  },

  'cid-115': {
    id: 'cid-115',
    title: "UX Research & Product Design Strategy",
    description: "Master user research, wireframing, and product flows using industry standard tools.",
    duration: "8 Weeks",
    students: "2.1k",
    rating: 4.8,
    level: "Intermediate",
    progress: 0,
    trainer: { name: "David K.", role: "Product Designer", experience: "12 Years", specialization: "UX Research, Figma" },
    batch: { id: "CR-115", startDate: "April 1, 2026", duration: "8 Weeks" },
    objective: "Master the user-centric design process. Learn to conduct professional user research and build high-fidelity prototypes.",
    benefits: [
      { icon: "figma", label: "Figma Pro", desc: "Design Systems & Collaboration" },
      { icon: "ux", label: "UX Research", desc: "Case studies & User Testing" }
    ],
    modules: [
      {
        id: 'beginner',
        title: "Beginner Level",
        duration: "2 Weeks",
        mainTopicGroups: [
          {
            title: "Design Thinking",
            subtopics: [
              { id: 'ux-empathy', title: "Empathy Maps & User Personas", duration: "75 min" },
              { id: 'ux-story', title: "User Stories & Journey Mapping", duration: "60 min" }
            ]
          }
        ]
      },
      {
        id: 'intermediate',
        title: "Intermediate Level",
        duration: "3 Weeks",
        mainTopicGroups: [
          {
            title: "Visual Design & Figma",
            subtopics: [
              { id: 'figma-basics', title: "Getting started with Figma", duration: "120 min" },
              { id: 'figma-proto', title: "Interactive Prototyping", duration: "90 min" }
            ]
          }
        ]
      },
      {
        id: 'advanced',
        title: "Advanced Level",
        duration: "3 Weeks",
        mainTopicGroups: [
          {
            title: "Product Strategy",
            subtopics: [
              { id: 'ux-test', title: "Usability Testing & Iteration", duration: "100 min" },
              { id: 'ux-hand', title: "Design Handoff & Documentation", duration: "90 min" }
            ]
          }
        ]
      }
    ]
  },

  'cid-116': {
    id: 'cid-116',
    title: "Python for Financial Modeling",
    description: "Quant finance, data analysis, and algorithmic trading foundations.",
    duration: "5 Weeks",
    students: "1.5k",
    rating: 4.7,
    level: "Advanced",
    progress: 0,
    trainer: { name: "Dr. Arvan P.", role: "Quant Tech Lead", experience: "10 Years", specialization: "Pandas, NumPy, Finance" },
    batch: { id: "CR-116", startDate: "Feb 15, 2026", duration: "5 Weeks" },
    objective: "Apply Python to the world of finance. Learn to analyze stock data, build risk models, and backtest trading strategies.",
    benefits: [
      { icon: "quant", label: "Quant Finance", desc: "Financial math & ML" },
      { icon: "trade", label: "Algo Trading", desc: "Live strategy backtesting" }
    ],
    modules: [
      {
        id: 'beginner',
        title: "Beginner Level",
        duration: "1 Week",
        mainTopicGroups: [
          {
            title: "Data Core for Finance",
            subtopics: [
              { id: 'fin-numpy', title: "NumPy for Financial Calculation", duration: "90 min" },
              { id: 'fin-pandas', title: "Pandas DataFrames for Stock Data", duration: "120 min" }
            ]
          }
        ]
      },
      {
        id: 'intermediate',
        title: "Intermediate Level",
        duration: "2 Weeks",
        mainTopicGroups: [
          {
            title: "Analysis & Metrics",
            subtopics: [
              { id: 'fin-stats', title: "Statistical Analysis of Returns", duration: "100 min" },
              { id: 'fin-risk', title: "Risk Metrics: VAR & Sharpe Ratio", duration: "90 min" }
            ]
          }
        ]
      },
      {
        id: 'advanced',
        title: "Advanced Level",
        duration: "2 Weeks",
        mainTopicGroups: [
          {
            title: "Trading Strategies",
            subtopics: [
              { id: 'fin-back', title: "Backtesting Strategy Frameworks", duration: "180 min" },
              { id: 'fin-ml', title: "Intro to ML for Asset Pricing", duration: "150 min" }
            ]
          }
        ]
      }
    ]
  }
};