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
        label: "Module 1",
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
        label: "Module 2",
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
        label: "Module 3",
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
        label: "Module 1",
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
        label: "Module 2",
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
        label: "Module 3",
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
        label: "Module 1",
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
        label: "Module 2",
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
        label: "Module 3",
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
  }
};
