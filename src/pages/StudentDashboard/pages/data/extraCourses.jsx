export const COURSE_MAP = {
  'java-fs-01': {
    id: 'java-fs-01',
    title: "Java Full Stack",
    description: "Master the complete Java ecosystem from core fundamentals to enterprise Spring Boot and React integration.",
    duration: "6 Months",
    students: 12500,
    rating: 4.9,
    level: "Intermediate",
    progress: 95,
    trainer: {
      name: "Mohan Krishna",
      role: "Senior Java Architect",
      experience: "12+ Years",
      specialization: "Spring Boot, Microservices, React"
    },
    batch: {
      name: "Weekend Batch",
      id: "BID-JAVA-2026-01",
      startDate: "Jan 15, 2026",
      timing: "Sat, Sun — 10:00 AM to 1:00 PM",
      duration: "6 Months · Online Live"
    },
    objective: "This program is designed to transform you into a highly skilled Java Fullstack Developer, capable of architecting and building enterprise-grade applications from scratch. You will go through a structured curriculum spanning backend development with Spring Boot, RESTful API design, cloud deployment, and modern frontend development with React — all taught by industry veterans with real-world experience.",
    benefits: [
      { icon: "learning", label: "Flexible Learning", desc: "Weekend batches fit your schedule" },
      { icon: "trainer", label: "Expert Trainers", desc: "Industry professionals with 10+ years" },
      { icon: "access", label: "Lifetime Access", desc: "Revisit all recordings anytime" },
      { icon: "projects", label: "Real Projects", desc: "Build production-ready applications" }
    ],
    modules: [
      {
        id: 'beginner',
        label: "Beginner Module",
        subtitle: "Java Basics",
        duration: "4 Weeks",
        color: "#10b981",
        topics: [
          { id: 'intro', title: "Introduction to Java & JVM", content: "<p>Learn how to set up JDK, IntelliJ IDEA, and understand JVM architecture, bytecode, and the compilation process.</p>" },
          { id: 'variables', title: "Variables & Data Types", content: "<p>Deep dive into primitives, wrappers, type casting, and memory allocation on the stack and heap.</p>" },
          { id: 'control', title: "Control Statements & Loops", content: "<p>Master if-else conditions, switch-cases, for/while/do-while loops, and break/continue.</p>" },
          { id: 'arrays', title: "Arrays & Strings", content: "<p>Working with single and multi-dimensional arrays, String methods, StringBuilder, and StringBuffer.</p>" },
          { id: 'methods', title: "Methods & Recursion", content: "<p>Defining methods, passing parameters, return types, method overloading, and recursive problem-solving.</p>" },
          { id: 'exception', title: "Exception Handling", content: "<p>Try-catch-finally blocks, custom exceptions, checked vs unchecked exceptions.</p>" },
          { id: 'io', title: "File I/O & Scanner", content: "<p>Reading and writing files using FileReader, BufferedReader, and Scanner for user input.</p>" },
          { id: 'packages', title: "Packages & Access Modifiers", content: "<p>Organizing code with packages, understanding public, private, protected, and default access.</p>" }
        ],
        assignment: "Build a console-based calculator using control flow statements."
      },
      {
        id: 'intermediate',
        label: "Intermediate Module",
        subtitle: "Core OOP",
        duration: "6 Weeks",
        color: "#2563eb",
        topics: [
          { id: 'oops-basics', title: "Object-Oriented Programming: Classes & Objects", content: "<p>Understanding the fundamentals of OOP — classes, objects, constructors, and instance variables.</p>" },
          { id: 'encapsulation', title: "Encapsulation & Inheritance", content: "<p>Protecting data with getters/setters, using extends, and understanding the inheritance chain.</p>" },
          { id: 'polymorphism', title: "Polymorphism & Abstraction", content: "<p>Method overriding, abstract classes, interface implementation, and runtime polymorphism.</p>" },
          { id: 'interfaces', title: "Interfaces & Functional Interfaces", content: "<p>Designing contracts with interfaces, Java 8 default methods, and functional interface patterns.</p>" },
          { id: 'generics', title: "Generics & Type Safety", content: "<p>Writing reusable, type-safe code with generic classes, methods, and bounded type parameters.</p>" },
          { id: 'collections', title: "Java Collections Framework", content: "<p>Using ArrayList, LinkedList, HashMap, HashSet, TreeMap — with real use-case scenarios.</p>" },
          { id: 'streams', title: "Lambda Expressions & Streams API", content: "<p>Functional-style programming using lambdas, Stream operations like filter, map, reduce, and collect.</p>" },
          { id: 'threads', title: "Multithreading & Concurrency", content: "<p>Thread lifecycle, synchronization, Executor framework, and basic concurrent data structures.</p>" }
        ],
        assignment: "Create a hierarchical Bank Account Management system with full OOP principles."
      },
      {
        id: 'advanced',
        label: "Advanced Module",
        subtitle: "Spring Framework",
        duration: "8 Weeks",
        color: "#8b5cf6",
        topics: [
          { id: 'spring-core', title: "Spring Core & Dependency Injection", content: "<p>Understanding the Spring IoC container, bean lifecycle, and annotation-based configuration.</p>" },
          { id: 'spring-boot', title: "Spring Boot Fundamentals", content: "<p>Bootstrapping REST APIs using Spring Boot, auto-configuration, and embedded server setup.</p>" },
          { id: 'jpa', title: "Spring Data JPA & Hibernate", content: "<p>ORM with Hibernate, entities, repositories, JPQL queries, and database relationships.</p>" },
          { id: 'security', title: "Spring Security & JWT Auth", content: "<p>Securing APIs using JWT tokens, role-based access, and OAuth2 integration.</p>" },
          { id: 'react-basics', title: "React for Java Backends", content: "<p>Building React components, managing state with hooks, and consuming REST APIs.</p>" },
          { id: 'react-advanced', title: "React Router & Context API", content: "<p>Multi-page SPAs using React Router and state management with Context and Redux basics.</p>" },
          { id: 'docker', title: "Docker & Containerization", content: "<p>Creating Dockerfiles, building images, running containers, and Docker Compose basics.</p>" },
          { id: 'microservices', title: "Microservices Architecture", content: "<p>Service decomposition, inter-service communication, API gateways, and service discovery.</p>" }
        ],
        assignment: "Develop a full REST API for a Library system with JWT auth and a React frontend."
      }
    ],
    finalAssignment: {
      title: "",
      description: "Build a scalable, secure, and production-ready e-commerce backend with a React storefront.",
      requirements: [
        "React frontend with Redux state management",
        "Spring Boot REST APIs with JWT Authentication",
        "MySQL database with Hibernate ORM",
        "Docker containerization",
        "Responsive UI design"
      ]
    }
  },
  'python-fs-01': {
    id: 'python-fs-01',
    title: "Python Fullstack Bootcamp",
    description: "Learn Python, Django, and React to build robust, scalable web applications.",
    duration: "5 Months",
    students: 12200,
    rating: 4.8,
    level: "Beginner",
    progress: 10,
    trainer: {
      name: "Sarah Williams",
      role: "Lead Python Developer",
      experience: "9+ Years",
      specialization: "Python, Django, Data Science"
    },
    batch: {
      name: "Morning Weekday Batch",
      id: "BID-PY-2026-02",
      startDate: "Feb 1, 2026",
      timing: "Mon–Fri — 7:00 AM to 9:00 AM",
      duration: "5 Months · Online Live"
    },
    objective: "This bootcamp takes you from Python fundamentals to building production-grade web applications using Django and React. You will learn backend engineering, database design, RESTful API architecture, and seamlessly integrate with a React frontend. By the end, you will have the skills to build and deploy full-stack Python applications.",
    benefits: [
      { icon: "🎓", label: "Beginner Friendly", desc: "No prior coding needed" },
      { icon: "👨‍💻", label: "Industry Mentors", desc: "Learn from working developers" },
      { icon: "♾️", label: "Lifetime Access", desc: "All recordings included" },
      { icon: "🚀", label: "Portfolio Ready", desc: "Ship a real Django + React app" }
    ],
    modules: [
      {
        id: 'beginner',
        label: "Beginner Module",
        subtitle: "Python Basics",
        duration: "3 Weeks",
        color: "#10b981",
        topics: [
          { id: 'py-intro', title: "Python Installation & Setup", content: "<p>Install Python, configure VS Code, and write your first Python script.</p>" },
          { id: 'py-syntax', title: "Python Syntax & Variables", content: "<p>Understanding indentation, variable types, and dynamic typing.</p>" },
          { id: 'py-data', title: "Data Structures", content: "<p>Lists, Dictionaries, Sets, Tuples — creation, access, and manipulation.</p>" },
          { id: 'py-control', title: "Control Flow & Loops", content: "<p>Conditional statements, for/while loops, list comprehensions.</p>" },
          { id: 'py-func', title: "Functions & Scope", content: "<p>Defining functions, *args and **kwargs, closures, and decorators.</p>" },
          { id: 'py-modules', title: "Modules & Packages", content: "<p>Importing standard library modules, pip, and creating your own packages.</p>" },
          { id: 'py-files', title: "File Handling", content: "<p>Reading and writing text/CSV files using built-in functions.</p>" }
        ],
        assignment: "Write scripts that manipulate text data and basic data collections."
      },
      {
        id: 'intermediate',
        label: "Intermediate Module",
        subtitle: "OOP & Django",
        duration: "5 Weeks",
        color: "#2563eb",
        topics: [
          { id: 'py-oop', title: "Object Oriented Python", content: "<p>Classes, inheritance, dunder methods, and polymorphism in Python.</p>" },
          { id: 'py-advanced', title: "Advanced Python Concepts", content: "<p>Generators, iterators, context managers, and async programming basics.</p>" },
          { id: 'py-django', title: "Intro to Django Framework", content: "<p>Project setup, apps, URL routing, views, and the Django ORM.</p>" },
          { id: 'py-models', title: "Django Models & Migrations", content: "<p>Designing database schemas, running migrations, and admin interface setup.</p>" },
          { id: 'py-views', title: "Django Views & Templates", content: "<p>Class-based and function-based views, Django template language.</p>" },
          { id: 'py-forms', title: "Django Forms & Authentication", content: "<p>Form validation, CSRF protection, built-in user authentication system.</p>" },
          { id: 'py-staticfiles', title: "Static Files & Media", content: "<p>Serving images, JavaScript, and CSS in development and production.</p>" }
        ],
        assignment: "Create a URL shortener web app in Django with user authentication."
      },
      {
        id: 'advanced',
        label: "Advanced Module",
        subtitle: "DRF & React",
        duration: "6 Weeks",
        color: "#8b5cf6",
        topics: [
          { id: 'py-drf', title: "Django REST Framework Basics", content: "<p>Serializers, viewsets, routers, and building your first API endpoint.</p>" },
          { id: 'py-drf-adv', title: "DRF Authentication & Permissions", content: "<p>Token auth, JWT integration, and fine-grained permission classes.</p>" },
          { id: 'py-react', title: "React & Django Integration", content: "<p>Consuming DRF APIs in a React app, handling CORS, and Axios setup.</p>" },
          { id: 'py-celery', title: "Background Tasks with Celery", content: "<p>Setting up Celery with Redis for asynchronous task handling.</p>" },
          { id: 'py-postgres', title: "PostgreSQL & Advanced Queries", content: "<p>Migrating from SQLite to PostgreSQL, raw queries, and optimizations.</p>" },
          { id: 'py-deploy', title: "Deployment with Railway/Heroku", content: "<p>Configuring production environment variables and deploying your fullstack app.</p>" },
          { id: 'py-testing', title: "Testing Django Applications", content: "<p>Unit and integration tests using Django's test client and pytest.</p>" }
        ],
        assignment: "Build a full Blog API with DRF and consume it in a React frontend."
      }
    ],
    finalAssignment: {
      title: "Social Media Dashboard",
      description: "A comprehensive dashboard for managing posts, followers, and analytics.",
      requirements: [
        "Django backend with DRF",
        "React Frontend with charts",
        "PostgreSQL integration",
        "JWT user auth flow",
        "Deployed to production"
      ]
    }
  },
  'mern-fs-01': {
    id: 'mern-fs-01',
    title: "MERN Stack Developer Program",
    description: "Build modern, scalable web applications using MongoDB, Express, React, and Node.js.",
    duration: "6 Months",
    students: 15400,
    rating: 4.9,
    level: "Intermediate",
    progress: 20,
    trainer: {
      name: "Anjali Sharma",
      role: "MERN Stack Expert",
      experience: "8+ Years",
      specialization: "React, Node.js, MongoDB"
    },
    batch: {
      name: "Weekend Batch",
      id: "BID-MERN-2026-01",
      startDate: "Mar 1, 2026",
      timing: "Sat, Sun — 9:00 AM to 12:00 PM",
      duration: "6 Months · Online Live"
    },
    objective: "Become a complete MERN Stack Developer by mastering the four core technologies: MongoDB for database design, Express.js for server-side routing, React for dynamic UIs, and Node.js for building scalable backend services. This program bridges the gap between theory and real-world development through hands-on projects and mentorship from industry experts.",
    benefits: [
      { icon: "⚡", label: "Fast-Track Learning", desc: "Intensive, structured curriculum" },
      { icon: "👨‍💻", label: "Fullstack Focus", desc: "Frontend + Backend covered" },
      { icon: "♾️", label: "Lifetime Access", desc: "All material always available" },
      { icon: "🚀", label: "Deploy to Cloud", desc: "Ship apps to Vercel & Railway" }
    ],
    modules: [
      {
        id: 'mern-beg',
        label: "Frontend Foundations",
        subtitle: "React Fundamentals",
        duration: "4 Weeks",
        color: "#10b981",
        topics: [
          { id: 'react-basics', title: "React Setup & JSX", content: "<p>Create React App, Vite setup, understanding JSX, and the virtual DOM.</p>" },
          { id: 'react-components', title: "Components & Props", content: "<p>Functional components, passing props, component composition, and prop types.</p>" },
          { id: 'react-state', title: "State & useState Hook", content: "<p>Managing local state, controlled components, and state lifting patterns.</p>" },
          { id: 'react-effects', title: "useEffect & Lifecycle", content: "<p>Data fetching, side effects, cleanup, and the component lifecycle model.</p>" },
          { id: 'react-hooks', title: "Advanced React Hooks", content: "<p>useContext, useRef, useReducer, useMemo, useCallback for performance.</p>" },
          { id: 'react-router', title: "React Router v6", content: "<p>Setting up multi-page SPAs, dynamic routes, protected routes, and nested layouts.</p>" },
          { id: 'react-tailwind', title: "Styling with Tailwind CSS", content: "<p>Utility-first CSS, responsive design, and dark mode configuration.</p>" }
        ],
        assignment: "Build a responsive portfolio website using React and Tailwind CSS."
      },
      {
        id: 'mern-int',
        label: "Backend & API",
        subtitle: "Node.js & MongoDB",
        duration: "6 Weeks",
        color: "#2563eb",
        topics: [
          { id: 'node-basics', title: "Node.js Fundamentals", content: "<p>Node.js architecture, event loop, fs module, and npm ecosystem.</p>" },
          { id: 'express-basics', title: "Express.js & HTTP", content: "<p>REST principles, routing, middleware, request/response lifecycle.</p>" },
          { id: 'express-middleware', title: "Middleware & Error Handling", content: "<p>Custom middleware, error-handling patterns, and request validation.</p>" },
          { id: 'mongodb', title: "MongoDB & Mongoose", content: "<p>Schema design, data modeling, CRUD operations, and indexes.</p>" },
          { id: 'jwt-auth', title: "JWT Authentication", content: "<p>User registration, login, JWT signing/verification, and protecting routes.</p>" },
          { id: 'file-upload', title: "File Uploads & Multer", content: "<p>Handling file uploads, storing on disk and cloud (Cloudinary).</p>" },
          { id: 'rest-api', title: "Advanced REST API Design", content: "<p>Pagination, filtering, sorting, rate limiting, and API versioning.</p>" }
        ],
        assignment: "Create a full Task Manager REST API with JWT authentication and MongoDB."
      },
      {
        id: 'mern-adv',
        label: "Fullstack Integration",
        subtitle: "State Management & Deploy",
        duration: "5 Weeks",
        color: "#8b5cf6",
        topics: [
          { id: 'redux', title: "Redux Toolkit & State Management", content: "<p>Global state with Redux Toolkit, slices, async thunks, and RTK Query.</p>" },
          { id: 'react-query', title: "React Query for Data Fetching", content: "<p>Caching, background refetching, optimistic updates with React Query.</p>" },
          { id: 'socket', title: "Real-Time with Socket.io", content: "<p>WebSocket connections, rooms, broadcasting, and chat applications.</p>" },
          { id: 'payments', title: "Payment Integration", content: "<p>Integrating Razorpay/Stripe payment gateway in MERN apps.</p>" },
          { id: 'testing-mern', title: "Testing with Jest & Supertest", content: "<p>Unit tests for React components, API endpoint testing with Supertest.</p>" },
          { id: 'deployment', title: "Deployment to Vercel & Railway", content: "<p>CI/CD pipelines, environment variables, and frontend + backend deployment.</p>" },
          { id: 'perf', title: "Performance Optimization", content: "<p>Code splitting, lazy loading, image optimization, and Lighthouse audits.</p>" }
        ],
        assignment: "Integrate your Task Manager API with a React frontend using Redux Toolkit."
      }
    ],
    finalAssignment: {
      title: "Full-scale E-Learning Platform",
      description: "A complete platform for hosting and managing online courses with real-time features.",
      requirements: [
        "User & Instructor role management",
        "Video streaming integration",
        "Payment gateway simulation",
        "Real-time chat with Socket.io",
        "Deployed to cloud"
      ]
    }
  },
  'cloud-comp-01': {
    id: 'cloud-comp-01',
    title: "Cloud Computing Mastery",
    description: "Master AWS, Azure, and Google Cloud and deploy enterprise applications at scale.",
    duration: "4 Months",
    students: 9800,
    rating: 4.7,
    level: "Intermediate",
    progress: 75,
    trainer: {
      name: "Michael Chang",
      role: "Cloud Solutions Architect",
      experience: "14+ Years",
      specialization: "AWS, Terraform, Kubernetes"
    },
    batch: {
      name: "Evening Batch",
      id: "BID-CLOUD-2026-01",
      startDate: "Jan 20, 2026",
      timing: "Mon, Wed, Fri — 7:00 PM to 9:30 PM",
      duration: "4 Months · Online Live"
    },
    objective: "Gain comprehensive expertise in cloud infrastructure across AWS, Azure, and GCP. You will learn how to design highly available, fault-tolerant architectures, implement infrastructure as code using Terraform, secure cloud environments, and orchestrate containers with Kubernetes — preparing you for top cloud certification exams.",
    benefits: [
      { icon: "☁️", label: "Multi-Cloud", desc: "AWS, Azure & GCP covered" },
      { icon: "👨‍💻", label: "Certified Trainers", desc: "AWS & GCP certified experts" },
      { icon: "♾️", label: "Lifetime Access", desc: "Labs stay active indefinitely" },
      { icon: "🚀", label: "Hands-on Labs", desc: "100+ real cloud lab exercises" }
    ],
    modules: [
      {
        id: 'beginner',
        label: "Beginner Module",
        subtitle: "Cloud Fundamentals",
        duration: "3 Weeks",
        color: "#10b981",
        topics: [
          { id: 'cloud-models', title: "Cloud Models: IaaS, PaaS, SaaS", content: "<p>Understanding service and deployment models across cloud providers.</p>" },
          { id: 'cloud-intro', title: "Intro to AWS Console", content: "<p>Navigating the AWS management console, IAM basics, and billing setup.</p>" },
          { id: 'ec2', title: "EC2 & Virtual Machines", content: "<p>Launching EC2 instances, choosing instance types, and SSH access.</p>" },
          { id: 's3', title: "S3 & Object Storage", content: "<p>Buckets, object lifecycle, versioning, static website hosting.</p>" },
          { id: 'vpc', title: "VPC & Networking Basics", content: "<p>Subnets, Internet Gateways, route tables, and security groups.</p>" },
          { id: 'rds', title: "RDS & Managed Databases", content: "<p>Setting up MySQL/PostgreSQL on RDS with automated backups.</p>" },
          { id: 'cloudwatch', title: "CloudWatch Monitoring", content: "<p>Setting up dashboards, alarms, and log insights for AWS resources.</p>" }
        ],
        assignment: "Launch a static website hosted on S3 with CloudFront distribution."
      },
      {
        id: 'intermediate',
        label: "Intermediate Module",
        subtitle: "Infra & Security",
        duration: "5 Weeks",
        color: "#2563eb",
        topics: [
          { id: 'iam', title: "IAM: Users, Roles & Policies", content: "<p>Least-privilege access, policy documents, role assumption, and MFA.</p>" },
          { id: 'cloud-network', title: "Advanced VPC & Peering", content: "<p>Multi-AZ VPC design, VPC peering, transit gateway, and Direct Connect.</p>" },
          { id: 'elb', title: "Load Balancers & Auto Scaling", content: "<p>ALB, NLB, target groups, launch templates, and auto-scaling groups.</p>" },
          { id: 'ecs', title: "ECS & Container Services", content: "<p>Running Docker containers on ECS Fargate with task definitions.</p>" },
          { id: 'cloud-iam', title: "Security Best Practices", content: "<p>AWS Config, GuardDuty, AWS WAF, and Security Hub overview.</p>" },
          { id: 'route53', title: "Route 53 & DNS", content: "<p>Domain registration, routing policies, health checks, and failover.</p>" },
          { id: 'sns-sqs', title: "SNS, SQS & Messaging", content: "<p>Decoupled architectures using message queues and pub-sub patterns.</p>" }
        ],
        assignment: "Deploy a multi-tier web app across a custom VPC with auto-scaling."
      },
      {
        id: 'advanced',
        label: "Advanced Module",
        subtitle: "IaC & Kubernetes",
        duration: "6 Weeks",
        color: "#8b5cf6",
        topics: [
          { id: 'terraform-basics', title: "Terraform Fundamentals", content: "<p>Providers, resources, variables, state management, and workspaces.</p>" },
          { id: 'terraform-adv', title: "Advanced Terraform Patterns", content: "<p>Modules, remote state with S3 backend, and Terragrunt basics.</p>" },
          { id: 'k8s-cloud', title: "Amazon EKS & Kubernetes", content: "<p>Deploying and managing Kubernetes clusters on AWS EKS.</p>" },
          { id: 'cloud-iac', title: "CloudFormation & CDK", content: "<p>Native AWS IaC with CloudFormation templates and CDK in TypeScript.</p>" },
          { id: 'cloud-serverless', title: "Serverless with Lambda & API Gateway", content: "<p>Building event-driven functions, REST APIs with Lambda + API Gateway.</p>" },
          { id: 'cicd-cloud', title: "CI/CD with CodePipeline", content: "<p>Automated deployments using CodeBuild, CodeDeploy, and CodePipeline.</p>" },
          { id: 'cost-opt', title: "Cost Optimization & FinOps", content: "<p>Reserved instances, Savings Plans, Cost Explorer, and budget alerts.</p>" }
        ],
        assignment: "Provision a multi-region infrastructure with Terraform and deploy via EKS."
      }
    ],
    finalAssignment: {
      title: "Highly Available Web Architecture",
      description: "Design and deploy a multi-region highly available application on AWS.",
      requirements: [
        "Multi-AZ, multi-region deployment",
        "Auto-scaling and load balancers",
        "Full infrastructure via Terraform",
        "Kubernetes deployment on EKS",
        "CI/CD pipeline with CodePipeline"
      ]
    }
  },
  'devops-01': {
    id: 'devops-01',
    title: "DevOps Engineering",
    description: "Automate your infrastructure and master CI/CD pipelines from end to end.",
    duration: "5 Months",
    students: 8000,
    rating: 4.7,
    level: "Advanced",
    progress: 0,
    trainer: {
      name: "Emily Watson",
      role: "Lead DevOps Engineer",
      experience: "11+ Years",
      specialization: "Kubernetes, Jenkins, GitOps"
    },
    batch: {
      name: "Weekend Intensive",
      id: "BID-DEVOPS-2026-01",
      startDate: "Feb 15, 2026",
      timing: "Sat, Sun — 8:00 AM to 1:00 PM",
      duration: "5 Months · Online Live"
    },
    objective: "This program equips you with the end-to-end DevOps mindset and toolchain — from Linux system administration and version control, through Docker containerization and Kubernetes orchestration, to automated CI/CD pipelines and production monitoring. You will graduate as an engineer who can bridge the gap between development and operations.",
    benefits: [
      { icon: "🔧", label: "Tool Mastery", desc: "Docker, K8s, Jenkins & more" },
      { icon: "👨‍💻", label: "Production Focus", desc: "Real pipelines, real systems" },
      { icon: "♾️", label: "Lifetime Access", desc: "Labs and videos forever" },
      { icon: "🚀", label: "Job Ready", desc: "Clear interview prep path" }
    ],
    modules: [
      {
        id: 'beginner',
        label: "Beginner Module",
        subtitle: "Linux & Git",
        duration: "3 Weeks",
        color: "#10b981",
        topics: [
          { id: 'linux-basics', title: "Linux Fundamentals & CLI", content: "<p>File system navigation, permissions, process management, and shell scripting.</p>" },
          { id: 'git', title: "Git Version Control", content: "<p>Branching, merging, rebasing, and collaborative workflows with GitHub.</p>" },
          { id: 'docker', title: "Docker & Containerization", content: "<p>Dockerfiles, multi-stage builds, volumes, networks, and Docker Compose.</p>" },
          { id: 'docker-adv', title: "Advanced Docker Patterns", content: "<p>Docker registries, secrets management, and Compose for local dev.</p>" },
          { id: 'yaml-json', title: "YAML, JSON & Config Management", content: "<p>Mastering structured data formats used across all DevOps tools.</p>" },
          { id: 'networking', title: "Networking for DevOps", content: "<p>TCP/IP, DNS, HTTP, TLS/SSL certificates, and load balancing basics.</p>" },
          { id: 'linux-adv', title: "Shell Scripting & Automation", content: "<p>Writing bash scripts for automation, cron jobs, and system monitoring.</p>" }
        ],
        assignment: "Dockerize a Node.js application with Docker Compose including a MongoDB service."
      },
      {
        id: 'intermediate',
        label: "Intermediate Module",
        subtitle: "CI/CD & Kubernetes",
        duration: "6 Weeks",
        color: "#2563eb",
        topics: [
          { id: 'cicd', title: "CI/CD Concepts & Jenkins", content: "<p>Pipeline as code with Jenkinsfile, build, test, and deploy stages.</p>" },
          { id: 'github-actions', title: "GitHub Actions Workflows", content: "<p>Automated testing, Docker builds, and deployments using GitHub Actions.</p>" },
          { id: 'k8s-intro', title: "Kubernetes Core Concepts", content: "<p>Pods, Deployments, ReplicaSets, Services, and Namespaces.</p>" },
          { id: 'k8s-config', title: "K8s ConfigMaps & Secrets", content: "<p>Externalizing configuration and managing sensitive data securely.</p>" },
          { id: 'k8s-networking', title: "K8s Networking & Ingress", content: "<p>ClusterIP, NodePort, LoadBalancer services, and Ingress controllers.</p>" },
          { id: 'helm', title: "Helm — The Kubernetes Package Manager", content: "<p>Creating and deploying Helm charts for repeatable K8s application packaging.</p>" },
          { id: 'k8s-storage', title: "Persistent Volumes & Stateful Apps", content: "<p>PVs, PVCs, StatefulSets and running databases on Kubernetes.</p>" }
        ],
        assignment: "Build a full Jenkins pipeline that builds, tests, and deploys to a K8s cluster."
      },
      {
        id: 'advanced',
        label: "Advanced Module",
        subtitle: "GitOps & Observability",
        duration: "6 Weeks",
        color: "#8b5cf6",
        topics: [
          { id: 'argocd', title: "GitOps with ArgoCD", content: "<p>Continuous delivery using pull-based GitOps with ArgoCD on Kubernetes.</p>" },
          { id: 'terraform-devops', title: "Infrastructure as Code with Terraform", content: "<p>Automating cloud resource provisioning via Terraform in CI/CD pipelines.</p>" },
          { id: 'prometheus', title: "Prometheus Monitoring", content: "<p>Metrics collection, alerting rules, and PromQL queries.</p>" },
          { id: 'grafana', title: "Grafana Dashboards", content: "<p>Visualizing infrastructure and application metrics with Grafana.</p>" },
          { id: 'efk', title: "Centralized Logging with EFK Stack", content: "<p>Elasticsearch, Fluentd/Bit, and Kibana for log aggregation and search.</p>" },
          { id: 'security-devops', title: "DevSecOps & Container Security", content: "<p>Image scanning with Trivy, SAST tools, and secrets detection in pipelines.</p>" },
          { id: 'sre', title: "SLOs, SLIs & Incident Management", content: "<p>Site Reliability Engineering concepts: on-call, runbooks, and post-mortems.</p>" }
        ],
        assignment: "Deploy a microservices app via Helm with ArgoCD and Prometheus monitoring."
      }
    ],
    finalAssignment: {
      title: "End-to-End DevOps Pipeline",
      description: "A fully automated CI/CD pipeline that deploys a multi-tier app to EKS with GitOps.",
      requirements: [
        "Git-based GitOps workflow with ArgoCD",
        "Automated tests & Docker image scanning",
        "Kubernetes deployment via Helm",
        "Full Prometheus + Grafana monitoring",
        "Runbook and post-mortem documentation"
      ]
    }
  }
};
