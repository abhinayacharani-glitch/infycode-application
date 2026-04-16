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
      name: "Charani",
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
      },
      {
        id: 'advanced-jpa',
        label: "Module 4",
        subtitle: "Advanced Hibernate & JPA",
        duration: "3 Weeks",
        color: "#ec4899",
        topics: [
          { id: 'jpa-relations', title: "Entity Relationships", content: "<p>Deep dive into @OneToMany, @ManyToMany, bidirectional vs unidirectional mapping.</p>" },
          { id: 'jpa-cache', title: "Caching Strategies", content: "<p>First-level and Second-level (L2) caching with Ehcache and Redis.</p>" },
          { id: 'jpa-query', title: "Criteria API & Querydsl", content: "<p>Writing dynamic, typesafe queries for advanced search functionality.</p>" },
          { id: 'jpa-tx', title: "Transaction Management", content: "<p>Understanding @Transactional propagation logic, isolation levels, and rollback rules.</p>" }
        ],
        assignment: "Build an optimized multi-table querying service handling 1M+ records safely."
      },
      {
        id: 'microservices-deep',
        label: "Module 5",
        subtitle: "Microservices & Distributed Systems",
        duration: "4 Weeks",
        color: "#f59e0b",
        topics: [
          { id: 'ms-patterns', title: "Design Patterns in MS", content: "<p>Saga, CQRS, API Gateway, and Strangler Fig patterns.</p>" },
          { id: 'spring-cloud', title: "Spring Cloud Essentials", content: "<p>Eureka for service discovery, Config Server, and Ribbon client-side load balancing.</p>" },
          { id: 'resilience', title: "Resilience4j & Circuit Breaker", content: "<p>Handling cascading failures with circuit breakers, retries, and fallbacks.</p>" },
          { id: 'feign', title: "Feign Clients & API Comms", content: "<p>Declarative REST clients for seamless inter-service communication.</p>" }
        ],
        assignment: "Refactor a monolithic e-commerce app into 4 distinct communicating microservices."
      },
      {
        id: 'kafka',
        label: "Module 6",
        subtitle: "Event-Driven Architecture",
        duration: "3 Weeks",
        color: "#14b8a6",
        topics: [
          { id: 'kafka-intro', title: "Apache Kafka Basics", content: "<p>Topics, partitions, brokers, producers, and consumer groups.</p>" },
          { id: 'spring-kafka', title: "Spring Boot + Kafka", content: "<p>Publishing and subscribing to events asynchronously using Spring Kafka templates.</p>" },
          { id: 'rabbitmq', title: "RabbitMQ vs Kafka", content: "<p>When to use message queues versus event streams.</p>" },
          { id: 'event-sourcing', title: "Event Sourcing Concept", content: "<p>Persisting state changes as a sequence of events rather than modifying DB state in-place.</p>" }
        ],
        assignment: "Implement an asynchronous notification system driven entirely by Kafka events."
      },
      {
        id: 'advanced-sec',
        label: "Module 7",
        subtitle: "Advanced Security & OAuth2",
        duration: "3 Weeks",
        color: "#ef4444",
        topics: [
          { id: 'oauth2', title: "OAuth2 & OpenID Connect", content: "<p>Understanding grant types, authorization servers, and resource servers.</p>" },
          { id: 'sso', title: "Keycloak & Single Sign-On", content: "<p>Integrating Spring Boot with Identity Providers like Keycloak for centralized auth.</p>" },
          { id: 'method-sec', title: "Method Level Security", content: "<p>Using @PreAuthorize and @PostFilter for granular RBAC access.</p>" },
          { id: 'cors-csrf', title: "CORS & CSRF Defense", content: "<p>Hardening backend security against common cross-site attacks.</p>" }
        ],
        assignment: "Secure all existing microservices using a centralized external OAuth2 identity provider."
      },
      {
        id: 'react-state',
        label: "Module 8",
        subtitle: "React State & Redux Toolkit",
        duration: "3 Weeks",
        color: "#3b82f6",
        topics: [
          { id: 'redux-intro', title: "Redux Architecture", content: "<p>Understanding the store, reducers, actions, and the unidirectional data flow.</p>" },
          { id: 'rtk', title: "Redux Toolkit (RTK)", content: "<p>Creating slices, configuring the store, and handling immutability implicitly.</p>" },
          { id: 'rtk-query', title: "RTK Query", content: "<p>Advanced data fetching, caching strategies, and optimistic updates.</p>" },
          { id: 'react-perf', title: "React Memo & Callback", content: "<p>Preventing unnecessary re-renders in large, complex applications.</p>" }
        ],
        assignment: "Migrate the e-commerce app's messy local state into a centralized Redux store."
      },
      {
        id: 'frontend-adv',
        label: "Module 9",
        subtitle: "Modern Frontend Mastery",
        duration: "3 Weeks",
        color: "#6366f1",
        topics: [
          { id: 'tailwind', title: "Tailwind CSS Styling", content: "<p>Building responsive, utility-first UI components rapidly.</p>" },
          { id: 'react-hook-form', title: "Complex Form Handling", content: "<p>Managing multi-step forms using React Hook Form and Zod validation.</p>" },
          { id: 'framer', title: "Framer Motion", content: "<p>Adding professional micro-interactions and route transition animations.</p>" },
          { id: 'zustand', title: "Zustand vs Redux", content: "<p>Exploring lightweight global state alternatives for smaller apps.</p>" }
        ],
        assignment: "Redesign the frontend UI with Tailwind and add smooth page transitions."
      },
      {
        id: 'docker-k8s',
        label: "Module 10",
        subtitle: "Docker & Kubernetes Pro",
        duration: "4 Weeks",
        color: "#0ea5e9",
        topics: [
          { id: 'docker-adv', title: "Multi-stage Builds", content: "<p>Optimizing Dockerfile sizes for ultra-lightweight Java runtimes.</p>" },
          { id: 'k8s-pod', title: "K8s Architecture & Pods", content: "<p>Understanding Nodes, Clusters, Pods, Deployments and Services.</p>" },
          { id: 'helm', title: "Helm Charts", content: "<p>Templating Kubernetes manifest files for easier version control.</p>" },
          { id: 'k8s-secret', title: "ConfigMaps & Secrets", content: "<p>Managing environment configurations safely in orchestrated environments.</p>" }
        ],
        assignment: "Deploy the entire 4-service microservice stack onto a local Minikube cluster."
      },
      {
        id: 'cicd',
        label: "Module 11",
        subtitle: "CI/CD & DevOps Automation",
        duration: "3 Weeks",
        color: "#8b5cf6",
        topics: [
          { id: 'git-actions', title: "GitHub Actions", content: "<p>Creating workflows to build, test, and lint code on every push.</p>" },
          { id: 'jenkins', title: "Jenkins Pipelines", content: "<p>Writing Groovy Jenkinsfiles for declarative build pipelines.</p>" },
          { id: 'sonar', title: "SonarQube Integration", content: "<p>Automated code quality and security vulnerability scanning.</p>" },
          { id: 'argocd', title: "GitOps with ArgoCD", content: "<p>Continuous delivery mechanism synchronizing Git repos directly to Kubernetes.</p>" }
        ],
        assignment: "Build a pipeline that automatically tests and containerizes code upon PR merge."
      },
      {
        id: 'aws-cloud',
        label: "Module 12",
        subtitle: "AWS Cloud Fundamentals",
        duration: "3 Weeks",
        color: "#f97316",
        topics: [
          { id: 'aws-ec2', title: "EC2 & BeanStalk", content: "<p>Deploying Spring Boot applications directly to VMs or PaaS.</p>" },
          { id: 'aws-s3', title: "S3 & CloudFront", content: "<p>Hosting compiled React static builds globally via CDNs.</p>" },
          { id: 'aws-rds', title: "Managed RDS", content: "<p>Provisioning production MySQL databases with automated backups.</p>" },
          { id: 'aws-iam', title: "IAM & Security Groups", content: "<p>Securing AWS infrastructure with strict networking and access rules.</p>" }
        ],
        assignment: "Move the e-commerce app domain to a fully cloud-hosted AWS infrastructure."
      },
      {
        id: 'system-design',
        label: "Module 13",
        subtitle: "System Design for Interviews",
        duration: "2 Weeks",
        color: "#64748b",
        topics: [
          { id: 'sd-cap', title: "CAP Theorem", content: "<p>Understanding consistency, availability, and partition tolerance tradeoffs.</p>" },
          { id: 'sd-db', title: "Database Sharding & Replication", content: "<p>Strategies for handling massive data loads across multiple instances.</p>" },
          { id: 'sd-cache', title: "Caching Architectures", content: "<p>Write-through vs Write-back caches, and when to invalidate.</p>" },
          { id: 'sd-api', title: "Rate Limiting & Load Balancing", content: "<p>Protecting APIs from abuse via Token Bucket algorithms and proxies.</p>" }
        ],
        assignment: "Draw and defend an architectural design for a system identical to Netflix."
      },
      {
        id: 'testing-qa',
        label: "Module 14",
        subtitle: "Testing & QA Engineering",
        duration: "2 Weeks",
        color: "#a855f7",
        topics: [
          { id: 'junit5', title: "JUnit 5 & Mockito", content: "<p>Writing comprehensive unit tests mocking external repository/service dependencies.</p>" },
          { id: 'testcontainers', title: "TestContainers", content: "<p>Spinning up disposable Docker databases for robust integration testing.</p>" },
          { id: 'cypress', title: "Cypress E2E Testing", content: "<p>Writing frontend automated tests simulating actual user interactions.</p>" },
          { id: 'jmeter', title: "Load Testing with JMeter", content: "<p>Hitting backend endpoints with simulated 10k users to find performance bottlenecks.</p>" }
        ],
        assignment: "Achieve 80% test coverage across backend and write 5 core flow E2E tests."
      },
      {
        id: 'capstone',
        label: "Module 15",
        subtitle: "Final Capstone Project Building",
        duration: "4 Weeks",
        color: "#1e293b",
        topics: [
          { id: 'cap-req', title: "Requirement Gathering", content: "<p>Translating business objectives into technical JIRA stories and Epics.</p>" },
          { id: 'cap-arch', title: "Architecture HLD/LLD", content: "<p>Creating ER diagrams, API Swagger documentation, and cloud architecture maps.</p>" },
          { id: 'cap-sprint', title: "Agile Sprints", content: "<p>Executing the build across two-week iterations featuring Daily Standups.</p>" },
          { id: 'cap-demo', title: "Deployment & Demo", content: "<p>Pushing to a live domain and presenting the final application to industry leads.</p>" }
        ],
        assignment: "Launch your production-ready SaaS application for public access."
      },
      {
        id: 'bonus-prep',
        label: "Bonus Module",
        subtitle: "DSA & Interview Prep",
        duration: "2 Weeks",
        color: "#22c55e",
        topics: [
          { id: 'algo-array', title: "Arrays & Two Pointers", content: "<p>Cracking top interview questions focusing on memory manipulation and subsets.</p>" },
          { id: 'algo-tree', title: "Binary Trees & Graphs", content: "<p>Mastering BFS, DFS, and topological sort algorithms.</p>" },
          { id: 'algo-dp', title: "Dynamic Programming", content: "<p>Breaking down complex recursive problems using memoization.</p>" },
          { id: 'mock-iv', title: "Mock Technical Interviews", content: "<p>Simulated 1:1 behavioral and technical coding interviews with mentors.</p>" }
        ],
        assignment: "Solve 50 curated LeetCode top interview questions utilizing optimal O(n) solutions."
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
      name: "Charani",
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
        subtitle: "Python Basics & Fundamentals",
        duration: "3 Weeks",
        color: "#10b981",
        topics: [
          { id: 'py-intro', title: "Python Installation & Setup", content: "<p>Environment configuration, VS Code setup, and writing your first script.</p>" },
          { id: 'py-syntax', title: "Syntax & Dynamic Typing", content: "<p>Deep dive into indentation, basic types, and Python's memory model.</p>" },
          { id: 'py-data', title: "Standard Data Structures", content: "<p>Lists, Dictionaries, Sets, and Tuples manipulation.</p>" },
          { id: 'py-control', title: "Advanced Control Flow", content: "<p>Loops, list comprehensions, and conditional logic patterns.</p>" }
        ],
        assignment: "Build a script to analyze and categorize large text-based datasets."
      },
      {
        id: 'intermediate',
        label: "Module 2",
        subtitle: "OOP & Django Core",
        duration: "5 Weeks",
        color: "#2563eb",
        topics: [
          { id: 'py-oop', title: "Object Oriented Python", content: "<p>Mastering classes, inheritance, dunder methods, and decorators.</p>" },
          { id: 'py-django', title: "Django MVT Architecture", content: "<p>Project structure, URL routing, and basic view logic.</p>" },
          { id: 'py-models', title: "Django ORM & Migrations", content: "<p>Defining schemas and interacting with databases via objects.</p>" },
          { id: 'py-auth', title: "Django Authentication", content: "<p>Building secure login, signup, and session management flows.</p>" }
        ],
        assignment: "Create a fully functional Multi-User Blog platform using Django."
      },
      {
        id: 'advanced',
        label: "Module 3",
        subtitle: "DRF & React Integration",
        duration: "6 Weeks",
        color: "#8b5cf6",
        topics: [
          { id: 'py-drf', title: "Django REST Framework", content: "<p>Serializers, ViewSets, and API design principles.</p>" },
          { id: 'py-react', title: "React Frontend Wiring", content: "<p>Consuming DRF APIs, state management, and component architecture.</p>" },
          { id: 'py-jwt', title: "JWT & Token Auth", content: "<p>Securing cross-origin communication between React and Django.</p>" },
          { id: 'py-axios', title: "Axios & Interceptors", content: "<p>Handling global API requests and error handling in React.</p>" }
        ],
        assignment: "Build an E-commerce API with a corresponding React frontend dashboard."
      },
      {
        id: 'python-adv-patterns',
        label: "Module 4",
        subtitle: "Advanced Python Design Patterns",
        duration: "3 Weeks",
        color: "#f59e0b",
        topics: [
          { id: 'py-metaclasses', title: "Metaclasses & Reflection", content: "<p>Understanding how classes are created and how to modify them at runtime.</p>" },
          { id: 'py-context', title: "Context Managers & Decorators", content: "<p>Writing robust, reusable resource management and wrapper logic.</p>" },
          { id: 'py-abstract', title: "ABCs & Protocol", content: "<p>Defining strict interfaces and structural typing in large projects.</p>" },
          { id: 'py-patterns', title: "Singleton & Factory Patterns", content: "<p>Implementing classic GOF patterns in a Pythonic way.</p>" }
        ],
        assignment: "Develop a custom framework plugin system using decorators and metaclasses."
      },
      {
        id: 'data-analysis',
        label: "Module 5",
        subtitle: "Data Analysis with Pandas",
        duration: "3 Weeks",
        color: "#ec4899",
        topics: [
          { id: 'numpy-core', title: "NumPy & Modern Arrays", content: "<p>Efficient numerical computation and multi-dimensional broadcasting.</p>" },
          { id: 'pandas-df', title: "DataFrames & Series", content: "<p>Manipulating tabular data, filtering, and complex Joins/Merges.</p>" },
          { id: 'data-cleaning', title: "Data Cleaning Strategies", content: "<p>Handling missing values, outlier detection, and type conversion at scale.</p>" },
          { id: 'pandas-timeseries', title: "Time-Series Analysis", content: "<p>Working with temporal data for financial and log analysis.</p>" }
        ],
        assignment: "Analyze a 1GB dataset of stock historical data and generate insights."
      },
      {
        id: 'web-scraping',
        label: "Module 6",
        subtitle: "Web Scraping & Automation",
        duration: "3 Weeks",
        color: "#06b6d4",
        topics: [
          { id: 'bs4', title: "BeautifulSoup4 & Parsing", content: "<p>Extracting data from structured HTML/XML documents.</p>" },
          { id: 'selenium-adv', title: "Selenium & Headless Browsers", content: "<p>Automating interactions with dynamic, JavaScript-heavy websites.</p>" },
          { id: 'scrapy-framework', title: "Scrapy Framework", content: "<p>Building industrial-strength asynchronous web spiders.</p>" },
          { id: 'scraping-sec', title: "Anti-Scraping Defenses", content: "<p>Handling CAPTCHAs, rate limiting, and proxy rotations.</p>" }
        ],
        assignment: "Build a real-time price aggregator that scrapes 5 different retail websites."
      },
      {
        id: 'flask-micro',
        label: "Module 7",
        subtitle: "Flask Microservices",
        duration: "3 Weeks",
        color: "#fbbf24",
        topics: [
          { id: 'flask-basics', title: "Minimalist Flask APIs", content: "<p>Building lightweight, modular web services with Flask-RESTful.</p>" },
          { id: 'sqlalchemy-adv', title: "SQLAlchemy & Flask-Migrate", content: "<p>Mastering the SQL toolkit for flexible database interactions.</p>" },
          { id: 'flask-celery', title: "Flask + Celery Workers", content: "<p>Offloading long-running tasks to background workers.</p>" },
          { id: 'micro-comm', title: "Service Discovery in Flask", content: "<p>Architecting communication between multiple Flask microservices.</p>" }
        ],
        assignment: "Refactor a part of the Django e-commerce app into a Flask-based Microservice."
      },
      {
        id: 'fastapi-async',
        label: "Module 8",
        subtitle: "High-Performance FastAPI",
        duration: "3 Weeks",
        color: "#14b8a6",
        topics: [
          { id: 'fastapi-intro', title: "Modern Async Programming", content: "<p>Using async/await and Type Hints for ultra-fast API development.</p>" },
          { id: 'pydantic', title: "Pydantic Models & Validation", content: "<p>Strongly typed data validation and serialization.</p>" },
          { id: 'dependency-injection', title: "Dependency Injection", content: "<p>Reusable logic for database sessions, auth, and more.</p>" },
          { id: 'fastapi-sec', title: "OAuth2 with FastAPI", content: "<p>Implementing modern security flows with built-in utilities.</p>" }
        ],
        assignment: "Benchmark and deploy a FastAPI service capable of handling 10k requests/second."
      },
      {
        id: 'python-realtime',
        label: "Module 9",
        subtitle: "Real-time Apps & Channels",
        duration: "3 Weeks",
        color: "#d946ef",
        topics: [
          { id: 'socketio', title: "Socket.io with Python", content: "<p>Bidirectional, event-based communication for real-time dashboards.</p>" },
          { id: 'django-channels', title: "Django Channels", content: "<p>Extending Django with WebSockets and consumer architectures.</p>" },
          { id: 'redis-pubsub', title: "Redis Pub/Sub", content: "<p>Broadcasting messages across different server instances.</p>" },
          { id: 'realtime-scaling', title: "Scaling WebSockets", content: "<p>Handling thousands of concurrent persistent connections.</p>" }
        ],
        assignment: "Build a real-time collaborative code editor using WebSockets and Django."
      },
      {
        id: 'advanced-databases',
        label: "Module 10",
        subtitle: "NoSQL & Vector Databases",
        duration: "3 Weeks",
        color: "#6366f1",
        topics: [
          { id: 'mongodb-py', title: "MongoDB with PyMongo", content: "<p>Working with document-oriented data and complex aggregations.</p>" },
          { id: 'redis-state', title: "Redis for State Management", content: "<p>Using Redis for session storage, rate limiting, and temporary state.</p>" },
          { id: 'pinecone', title: "Vector DBs & Pinecone", content: "<p>Storing and querying high-dimensional embeddings for AI search.</p>" },
          { id: 'dynamodb', title: "AWS DynamoDB for Python", content: "<p>Mastering single-table design and serverless database patterns.</p>" }
        ],
        assignment: "Implement a hybrid search system using both PostgreSQL and a Vector database."
      },
      {
        id: 'graphql-python',
        label: "Module 11",
        subtitle: "GraphQL & Graphene",
        duration: "2 Weeks",
        color: "#fb7185",
        topics: [
          { id: 'gql-intro', title: "GraphQL Schema Design", content: "<p>Understanding Queries, Mutations, and the GQL type system.</p>" },
          { id: 'graphene-django', title: "Graphene-Django", content: "<p>Exposing Django models via a powerful GraphQL entry point.</p>" },
          { id: 'gql-react', title: "Apollo Client in React", content: "<p>Fetching and caching GraphQL data in the frontend efficiently.</p>" },
          { id: 'gql-auth', title: "GraphQL Security", content: "<p>Handling authentication and depth-limiting in GQL APIs.</p>" }
        ],
        assignment: "Build a social feed API using GraphQL and Django."
      },
      {
        id: 'python-ml-ops',
        label: "Module 12",
        subtitle: "Machine Learning Integration",
        duration: "4 Weeks",
        color: "#22c55e",
        topics: [
          { id: 'scikit-learn', title: "Scikit-Learn Pipelines", content: "<p>Building reproducible ML training and inference pipelines.</p>" },
          { id: 'model-deployment', title: "Model Serving APIs", content: "<p>Deploying ML models as scalable APIs using Flask or FastAPI.</p>" },
          { id: 'mlflow', title: "MLflow & Experiment Tracking", content: "<p>Version controlling models and tracking training metrics.</p>" },
          { id: 'feature-engineering', title: "Feature Engineering at Scale", content: "<p>Processing raw data into model-ready features automatically.</p>" }
        ],
        assignment: "Train a sentiment analysis model and deploy it as a production API."
      },
      {
        id: 'computer-vision',
        label: "Module 13",
        subtitle: "Computer Vision with OpenCV",
        duration: "3 Weeks",
        color: "#38bdf8",
        topics: [
          { id: 'opencv-basics', title: "Image Processing Core", content: "<p>Manipulation, filtering, and edge detection using OpenCV.</p>" },
          { id: 'face-detection', title: "Face & Object Detection", content: "<p>Implementing Haar Cascades and HOG detectors for real-time vision.</p>" },
          { id: 'video-analysis', title: "Video Stream Processing", content: "<p>Handling live camera feeds and frame-by-frame analysis.</p>" },
          { id: 'yolo', title: "Deep Learning Vision (YOLO)", content: "<p>Integrating pre-trained neural networks for object recognition.</p>" }
        ],
        assignment: "Create a security camera script that detects movement and identifies people."
      },
      {
        id: 'nlp-expert',
        label: "Module 14",
        subtitle: "NLP & Language Models",
        duration: "3 Weeks",
        color: "#f43f5e",
        topics: [
          { id: 'spacy', title: "SpaCy & Advanced Text Mining", content: "<p>Entity recognition, dependency parsing, and text classification.</p>" },
          { id: 'llm-intro', title: "LLM Orchestration (LangChain)", content: "<p>Building applications on top of OpenAI/Llama using LangChain.</p>" },
          { id: 'rag', title: "RAG Architectures", content: "<p>Retrieval Augmented Generation for private data questioning.</p>" },
          { id: 'bert', title: "Transformers & BERT", content: "<p>Fine-tuning state-of-the-art language models for specific domains.</p>" }
        ],
        assignment: "Build an AI chatbot that can answer questions based on a set of PDF documents."
      },
      {
        id: 'python-testing-adv',
        label: "Module 15",
        subtitle: "Advanced Testing & QA",
        duration: "2 Weeks",
        color: "#6b7280",
        topics: [
          { id: 'pytest-pro', title: "PyTest Plugins & Fixtures", content: "<p>Mastering the standard for Python testing with complex setups.</p>" },
          { id: 'hypothesis', title: "Property-Based Testing", content: "<p>Generating thousands of edge cases automatically with Hypothesis.</p>" },
          { id: 'mocking-adv', title: "Advanced Mocking Techniques", content: "<p>Mocking external APIs, databases, and side effects flawlessly.</p>" },
          { id: 'coverage', title: "Mutation Testing", content: "<p>Ensuring your tests actually catch bugs, not just cover lines.</p>" }
        ],
        assignment: "Achieve 95% test coverage on a complex financial transaction service."
      },
      {
        id: 'security-python',
        label: "Module 16",
        subtitle: "Cybersecurity for Python",
        duration: "3 Weeks",
        color: "#0f172a",
        topics: [
          { id: 'owasp-py', title: "OWASP Top 10 for Django", content: "<p>Preventing SQLi, XSS, and Broken Auth in Python frameworks.</p>" },
          { id: 'encryption-py', title: "Cryptography Library", content: "<p>Implementing AES, RSA, and secure hashing in Python apps.</p>" },
          { id: 'sec-audit', title: "Automated Security Auditing", content: "<p>Using Bandit and Safety to find vulnerabilities in dependencies.</p>" },
          { id: 'auth-flows', title: "Advanced OAuth2/MFA", content: "<p>Implementing Multi-Factor Authentication and custom Auth providers.</p>" }
        ],
        assignment: "Perform a security audit and harden a vulnerable 'legacy' Python application."
      },
      {
        id: 'python-devops',
        label: "Module 17",
        subtitle: "Python Cloud & DevOps",
        duration: "3 Weeks",
        color: "#3b82f6",
        topics: [
          { id: 'docker-py', title: "Dockerizing Fullstack Python", content: "<p>Multi-stage builds and Gunicorn/Uvicorn production tuning.</p>" },
          { id: 'k8s-py', title: "Kubernetes for Pythonistas", content: "<p>Deploying Python apps with Helm, ConfigMaps, and Secrets.</p>" },
          { id: 'terraform-py', title: "Terraform for Cloud Apps", content: "<p>Defining cloud infrastructure as code for Python environments.</p>" },
          { id: 'monitoring-py', title: "Prometheus & Sentry", content: "<p>Live error tracking and performance monitoring for production apps.</p>" }
        ],
        assignment: "Automate the entire infrastructure and deployment of a Python microservice stack."
      },
      {
        id: 'serverless-python',
        label: "Module 18",
        subtitle: "Serverless Architectures",
        duration: "2 Weeks",
        color: "#8b5cf6",
        topics: [
          { id: 'aws-lambda-py', title: "AWS Lambda & Python", content: "<p>Writing event-driven functions and using the Serverless Framework.</p>" },
          { id: 'google-functions', title: "Google Cloud Functions", content: "<p>Deploying lightweight Python snippets triggered by Firestore or Pub/Sub.</p>" },
          { id: 'azure-functions', title: "Azure Functions Core", content: "<p>Integrating Python with Azure's serverless ecosystem.</p>" },
          { id: 'cold-starts', title: "Optimizing Cold Starts", content: "<p>Architecture patterns to keep serverless functions fast and cheap.</p>" }
        ],
        assignment: "Build a serverless image processing pipeline that triggers on S3 uploads."
      },
      {
        id: 'performance-tuning',
        label: "Module 19",
        subtitle: "Performance & Profiling",
        duration: "2 Weeks",
        color: "#1e293b",
        topics: [
          { id: 'profiling-py', title: "CProfile & Py-Spy", content: "<p>Identifying bottlenecks in CPU-bound Python code.</p>" },
          { id: 'concurrency-deep', title: "Threading vs Multiprocessing", content: "<p>Understanding the GIL and when to use parallel execution.</p>" },
          { id: 'cython-rust', title: "Cython & Rust Integration", content: "<p>Boosting Python performance by 100x using compiled extensions.</p>" },
          { id: 'async-loops', title: "Optimizing Async Loops", content: "<p>Managing event loop latency in high-traffic applications.</p>" }
        ],
        assignment: "Optimize a slow data processing script to run 5x faster using profiling data."
      },
      {
        id: 'python-capstone',
        label: "Module 20",
        subtitle: "Final Capstone: AI SaaS",
        duration: "5 Weeks",
        color: "#2563eb",
        topics: [
          { id: 'cap-spec', title: "Full Product Specification", content: "<p>Defining features, database schemas, and architectural diagrams.</p>" },
          { id: 'cap-build-1', title: "Phase 1: Core API & Auth", content: "<p>Building a robust Django/FastAPI foundation with security.</p>" },
          { id: 'cap-build-2', title: "Phase 2: React UI & ML", content: "<p>Integrating the AI engine and building a premium frontend.</p>" },
          { id: 'cap-deploy', title: "Production Launch", content: "<p>Deploying to AWS/Vercel with full CI/CD and monitoring.</p>" }
        ],
        assignment: "Submit your final production application for industry review and certification."
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
      name: "Charani",
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
        id: 'cloud-intro-mod',
        label: "Module 1",
        subtitle: "Cloud Fundamentals & Core Services",
        duration: "3 Weeks",
        color: "#10b981",
        topics: [
          { id: 'aws-iam-core', title: "IAM & Resource Security", content: "<p>Managing users, groups, and policies with the Principle of Least Privilege.</p>" },
          { id: 'aws-compute-core', title: "Compute: EC2 & Lambda", content: "<p>Spinning up virtual servers and serverless functions for different workloads.</p>" },
          { id: 'aws-storage-core', title: "Storage: S3 & EBS", content: "<p>Object vs block storage — scalability, durability, and performance tradeoffs.</p>" },
          { id: 'aws-net-core', title: "Networking: VPC Basics", content: "<p>Isolating resources with private/public subnets and security groups.</p>" }
        ],
        assignment: "Deploy a secure, multi-AZ web server with a redundant storage backend."
      },
      {
        id: 'infra-sec-mod',
        label: "Module 2",
        subtitle: "Infrastructure & Security",
        duration: "5 Weeks",
        color: "#2563eb",
        topics: [
          { id: 'aws-adv-net', title: "Advanced VPC Networking", content: "<p>Peering, Transit Gateways, and Hybrid Connectivity with VPN/Direct Connect.</p>" },
          { id: 'aws-scaling', title: "ELB & Auto Scaling", content: "<p>Building highly available systems that scale automatically with traffic spikes.</p>" },
          { id: 'aws-db-mod', title: "Managed Databases: RDS & Aurora", content: "<p>Global database clusters, read replicas, and automated failover config.</p>" },
          { id: 'cloud-sec-mod', title: "Cloud Security Best Practices", content: "<p>Implementing GuardDuty, Shield, and WAF to protect against attacks.</p>" }
        ],
        assignment: "Architect and deploy a fault-tolerant multi-tier application across AWS regions."
      },
      {
        id: 'iac-k8s-mod',
        label: "Module 3",
        subtitle: "IaC & Kubernetes Mastery",
        duration: "6 Weeks",
        color: "#8b5cf6",
        topics: [
          { id: 'terraform-core', title: "Terraform Fundamentals", content: "<p>Provisionsing multi-cloud infrastructure using HCL and state management.</p>" },
          { id: 'aws-eks-mod', title: "Amazon EKS & Containers", content: "<p>Managing production-grade Kubernetes clusters at scale.</p>" },
          { id: 'helm-charts-mod', title: "Helm for Package Management", content: "<p>Standardizing Kubernetes deployments with reusable templates.</p>" },
          { id: 'k8s-net-mod', title: "Kubernetes Networking & Ingress", content: "<p>Routing traffic to pods using ALB Ingress Controllers and Services.</p>" }
        ],
        assignment: "Automate the provisioning and deployment of a microservice cluster using Terraform."
      },
      {
        id: 'azure-core',
        label: "Module 4",
        subtitle: "Azure Solutions Foundation",
        duration: "3 Weeks",
        color: "#0284c7",
        topics: [
          { id: 'azure-portal', title: "Azure Portal & Resource Groups", content: "<p>Managing lifecycle and billing of resources within Azure's hierarchical structure.</p>" },
          { id: 'azure-compute', title: "Azure App Service & VM Scale Sets", content: "<p>Deploying web apps and containers without managing infrastructure.</p>" },
          { id: 'azure-sql', title: "Azure SQL & CosmosDB", content: "<p>Mastering globally distributed multi-model databases.</p>" },
          { id: 'azure-ad', title: "Azure Active Directory (Entra ID)", content: "<p>Identity management and SSO for enterprise-grade cloud environments.</p>" }
        ],
        assignment: "Migrate an existing web application to Azure App Service with CosmosDB."
      },
      {
        id: 'gcp-expert',
        label: "Module 5",
        subtitle: "Google Cloud Engineering",
        duration: "3 Weeks",
        color: "#ea4335",
        topics: [
          { id: 'gcp-compute', title: "Google Compute & App Engine", content: "<p>Harnessing Google's global fiber network for compute workloads.</p>" },
          { id: 'gcp-gke', title: "Google Kubernetes Engine (GKE)", content: "<p>The industry gold standard for managed Kubernetes orchestration.</p>" },
          { id: 'gcp-bq', title: "BigQuery & Analytical Storage", content: "<p>Querying petabytes of data in seconds with serverless analytics.</p>" },
          { id: 'gcp-pubsub', title: "GCP Pub/Sub & Dataflow", content: "<p>Building event-driven architectures with Google's messaging middleware.</p>" }
        ],
        assignment: "Build a real-time data ingestion pipeline using GKE and BigQuery."
      },
      {
        id: 'multicloud-strat',
        label: "Module 6",
        subtitle: "Multi-Cloud strategy",
        duration: "2 Weeks",
        color: "#475569",
        topics: [
          { id: 'mc-arch', title: "Multi-Cloud Orchestration", content: "<p>Strategies for avoiding vendor lock-in and distributing workloads.</p>" },
          { id: 'mc-hashicorp', title: "HashiCorp Vault & Consul", content: "<p>Centralized secrets and service discovery across disparate clouds.</p>" },
          { id: 'mc-anthos', title: "Google Anthos & Azure Arc", content: "<p>Managing multi-cloud and on-prem clusters from a single pane of glass.</p>" },
          { id: 'mc-cost', title: "Cross-Cloud Cost Management", content: "<p>Tracking and optimizing spend across AWS, Azure, and GCP simultaneously.</p>" }
        ],
        assignment: "Design a disaster recovery plan that shifts traffic between AWS and Azure automatically."
      },
      {
        id: 'serverless-deep',
        label: "Module 7",
        subtitle: "Serverless & Event-Driven",
        duration: "3 Weeks",
        color: "#f59e0b",
        topics: [
          { id: 'lambda-patterns', title: "Advanced Lambda Patterns", content: "<p>Mastering Step Functions, Dead Letter Queues, and Idempotency.</p>" },
          { id: 'eventbridge', title: "Amazon EventBridge", content: "<p>Building a serverless event bus to decouple microservices.</p>" },
          { id: 'api-gw-adv', title: "API Gateway Deep Dive", content: "<p>Throttling, Caching, and Canary deployments for serverless APIs.</p>" },
          { id: 'serverless-db', title: "DynamoDB Advanced Modeling", content: "<p>Single-table design and GSIs for high-performance NoSQL access.</p>" }
        ],
        assignment: "Build a fully serverless image-to-text processing engine with Step Functions."
      },
      {
        id: 'mc-service-mesh',
        label: "Module 8",
        subtitle: "Microservices & Service Mesh",
        duration: "3 Weeks",
        color: "#6366f1",
        topics: [
          { id: 'istio-core', title: "Istio Service Mesh", content: "<p>Managing traffic, security, and observability across Kubernetes services.</p>" },
          { id: 'envoy-proxy', title: "Envoy & Sidecar Patterns", content: "<p>Understanding how proxies handle service-to-service communication.</p>" },
          { id: 'mesh-sec', title: "mTLS & Zero Trust", content: "<p>Encrypting internal cloud traffic automatically with service meshes.</p>" },
          { id: 'mesh-obs', title: "Kiali & Jaeger", content: "<p>Visualizing microservice dependencies and tracing requests.</p>" }
        ],
        assignment: "Implement a zero-trust network policy in a 10-service Kubernetes cluster using Istio."
      },
      {
        id: 'sre-principles',
        label: "Module 9",
        subtitle: "SRE & Performance Engineering",
        duration: "3 Weeks",
        color: "#14b8a6",
        topics: [
          { id: 'sli-slo', title: "SLIs, SLOs, and SLAs", content: "<p>Defining and measuring service health from a reliability perspective.</p>" },
          { id: 'error-budgets', title: "Error Budgets", content: "<p>Balancing feature development speed with system stability.</p>" },
          { id: 'chaos-eng', title: "Chaos Engineering (AWS FIS)", content: "<p>Injecting failures into production to build resilient systems.</p>" },
          { id: 'on-call', title: "On-call & Incident Response", content: "<p>Professional post-mortems and automated alerting strategies.</p>" }
        ],
        assignment: "Perform a 'Game Day' of chaos testing and improve recovery time (RTO) by 50%."
      },
      {
        id: 'cloud-net-global',
        label: "Module 10",
        subtitle: "Global Networking",
        duration: "3 Weeks",
        color: "#3b82f6",
        topics: [
          { id: 'global-accel', title: "AWS Global Accelerator", content: "<p>Optimizing user latency using the AWS global network backbone.</p>" },
          { id: 'cdn-adv', title: "CloudFront & Edge Functions", content: "<p>Running logic at the edge (Lambda@Edge) to reduce origin load.</p>" },
          { id: 'route53-adv', title: "Route 53 Traffic Flow", content: "<p>Geoproximity and Latency-based routing globally.</p>" },
          { id: 'net-sec-adv', title: "PrivateLink & Service Endpoints", content: "<p>Keeping traffic off the public internet for maximum security.</p>" }
        ],
        assignment: "Set up a globally distributed static site with dynamic edge personalization."
      },
      {
        id: 'data-eng-cloud',
        label: "Module 11",
        subtitle: "Cloud Data Engineering",
        duration: "4 Weeks",
        color: "#ec4899",
        topics: [
          { id: 'etl-glue', title: "AWS Glue & ETL", content: "<p>Discovering, preparing, and combining data for analytics.</p>" },
          { id: 'redshift-adv', title: "Redshift Data Warehousing", content: "<p>Optimizing distribution keys and sort keys for petabyte-scale SQL queries.</p>" },
          { id: 'snowflake', title: "Snowflake on Cloud", content: "<p>Exploring multi-cloud data warehousing and sharing.</p>" },
          { id: 'data-lake', title: "Lake Formation", content: "<p>Governing and securing data lakes on S3 effortlessly.</p>" }
        ],
        assignment: "Build a serverless data lake that ingestion and processes 10M records daily."
      },
      {
        id: 'db-nosql-pros',
        label: "Module 12",
        subtitle: "NoSQL Database mastery",
        duration: "3 Weeks",
        color: "#fbbf24",
        topics: [
          { id: 'cassandra-cloud', title: "Managed Cassandra (Keyspaces)", content: "<p>High-throughput, distributed NoSQL for write-heavy workloads.</p>" },
          { id: 'neptune-graph', title: "Graph DBs: Amazon Neptune", content: "<p>Mapping complex relationships for social and fraud detection apps.</p>" },
          { id: 'elasticache', title: "ElastiCache (Redis & Memcached)", content: "<p>Accelerating applications with ultra-low latency in-memory data.</p>" },
          { id: 'qldb', title: "Ledger Databases (QLDB)", content: "<p>Building immutable, cryptographically verifiable transaction logs.</p>" }
        ],
        assignment: "Design a recommendation engine backend using a Graph database."
      },
      {
        id: 'cloud-gov-sec',
        label: "Module 13",
        subtitle: "Governance & Compliance",
        duration: "3 Weeks",
        color: "#0f172a",
        topics: [
          { id: 'aws-orgs', title: "AWS Organizations & SCPs", content: "<p>Managing multi-account structures with strict guardrails.</p>" },
          { id: 'control-tower', title: "AWS Control Tower", content: "<p>Setting up landing zones and automated compliance monitoring.</p>" },
          { id: 'audit-manager', title: "Audit Manager & Config", content: "<p>Automating assessment of SOC2, PCI-DSS, and HIPAA compliance.</p>" },
          { id: 'kms-hsm', title: "Key Management (KMS/HSM)", content: "<p>Centralized encryption key lifecycle management.</p>" }
        ],
        assignment: "Automate the provisioning of a compliant Landing Zone for a Fintech startup."
      },
      {
        id: 'devops-aws-mod',
        label: "Module 14",
        subtitle: "DevOps on AWS",
        duration: "3 Weeks",
        color: "#f43f5e",
        topics: [
          { id: 'codepipeline-adv', title: "AWS CodePipeline", content: "<p>Orchestrating multi-stage CI/CD workflows natively.</p>" },
          { id: 'codebuild', title: "CodeBuild & CodeDeploy", content: "<p>Custom build environments and Blue/Green deployment strategies.</p>" },
          { id: 'infrastructure-cdk', title: "Cloud Development Kit (CDK)", content: "<p>Writing infrastructure using TypeScript, Python, or Java.</p>" },
          { id: 'xray', title: "AWS X-Ray Traceability", content: "<p>Identifying performance bottlenecks across microservice hops.</p>" }
        ],
        assignment: "Build a zero-downtime Blue/Green pipeline for a Kubernetes app."
      },
      {
        id: 'azure-devops-mod',
        label: "Module 15",
        subtitle: "Azure DevOps & GitOps",
        duration: "2 Weeks",
        color: "#2563eb",
        topics: [
          { id: 'azure-pipelines', title: "Azure Pipelines (YAML)", content: "<p>Enterprise CI/CD for cross-cloud and cross-platform apps.</p>" },
          { id: 'gitops-flux', title: "GitOps with Flux/ArgoCD", content: "<p>Declarative continuous delivery for Kubernetes.</p>" },
          { id: 'arm-bicep', title: "Azure Bicep", content: "<p>Simplified IaC for Azure resources.</p>" },
          { id: 'github-adv-sec', title: "GitHub Advanced Security", content: "<p>Scanning dependencies and code for secrets and vulnerabilities.</p>" }
        ],
        assignment: "Synchronize a production cluster state with Git using ArgoCD."
      },
      {
        id: 'ai-ml-cloud',
        label: "Module 16",
        subtitle: "AI/ML Services",
        duration: "3 Weeks",
        color: "#8b5cf6",
        topics: [
          { id: 'sagemaker-intro', title: "Amazon SageMaker", content: "<p>Building, training, and deploying ML models in minutes.</p>" },
          { id: 'rekognition', title: "Vision APIs (Rekognition)", content: "<p>Scaling image and video analysis without ML expertise.</p>" },
          { id: 'textract-comprehend', title: "Language APIs", content: "<p>Extracting insights from text and documents at scale.</p>" },
          { id: 'lex-poly', title: "Conversational AI", content: "<p>Building sophisticated chatbots and voice apps with Lex.</p>" }
        ],
        assignment: "Deploy an automated document processing pipeline using AI/ML services."
      },
      {
        id: 'iot-edge-cloud',
        label: "Module 17",
        subtitle: "IoT & Edge Computing",
        duration: "2 Weeks",
        color: "#fb923c",
        topics: [
          { id: 'aws-iot-core', title: "AWS IoT Core", content: "<p>Connecting and managing billions of devices securely.</p>" },
          { id: 'greengrass', title: "AWS IoT Greengrass", content: "<p>Bringing local compute, messaging, and data caching to devices.</p>" },
          { id: 'lambda-edge', title: "Edge Processing", content: "<p>Handling data at the source to reduce cloud latency and cost.</p>" },
          { id: 'device-shadow', title: "Device Shadows", content: "<p>Managing device state even when disconnected from the cloud.</p>" }
        ],
        assignment: "Simulate an IoT sensor network and process data at the Edge before cloud persistence."
      },
      {
        id: 'cloud-mig-strat',
        label: "Module 18",
        subtitle: "Cloud Migration",
        duration: "3 Weeks",
        color: "#64748b",
        topics: [
          { id: 'mig-prep', title: "Assessment & Discovery", content: "<p>Inventorying legacy assets and calculating TCO/ROI.</p>" },
          { id: 'mig-patterns', title: "The 7 Rs of Migration", content: "<p>Retire, Retain, Rehost, Replatform, Refactor, Relocate, Repurchase.</p>" },
          { id: 'dms', title: "AWS DMS & Snowball", content: "<p>Migrating terabytes of data with minimal downtime.</p>" },
          { id: 'app-mod', title: "Legacy App Modernization", content: "<p>Breaking the monolith during the migration phase.</p>" }
        ],
        assignment: "Plan and execute a 'Replatform' migration of a local lamp stack to AWS."
      },
      {
        id: 'finops-optimization',
        label: "Module 19",
        subtitle: "FinOps & Cost control",
        duration: "2 Weeks",
        color: "#22c55e",
        topics: [
          { id: 'finops-core', title: "FinOps Principles", content: "<p>Inform, Optimize, and Operate — bringing financial accountability to cloud.</p>" },
          { id: 'ri-savings', title: "Savings Plans & RIs", content: "<p>Committing to compute for massive price discounts.</p>" },
          { id: 'rightsizing', title: "Automated Rightsizing", content: "<p>Using Compute Optimizer to scale down over-provisioned resources.</p>" },
          { id: 'spot-inst', title: "Spot Instances", content: "<p>Leveraging excess cloud capacity for up to 90% savings.</p>" }
        ],
        assignment: "Reduce a simulated $50k monthly cloud bill by 30% using FinOps tactics."
      },
      {
        id: 'cloud-capstone-mod',
        label: "Module 20",
        subtitle: "Multi-Cloud Capstone",
        duration: "5 Weeks",
        color: "#1e293b",
        topics: [
          { id: 'cap-spec-cloud', title: "Enterprise Architecture Review", content: "<p>Designing a high-availability, multi-region, multi-cloud system.</p>" },
          { id: 'cap-iac-cloud', title: "Phase 1: Full IaC Deployment", content: "<p>Building the entire infrastructure with Terraform and Helm.</p>" },
          { id: 'cap-ci-cloud', title: "Phase 2: Global CI/CD", content: "<p>Implementing GitOps workflows for all microservices.</p>" },
          { id: 'cap-final-cloud', title: "Audit & Scale Test", content: "<p>Security audit, cost review, and performance load testing.</p>" }
        ],
        assignment: "Present your fully automated, secure, and cost-optimized enterprise cloud architecture."
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