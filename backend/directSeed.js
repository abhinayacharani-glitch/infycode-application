/**
 * directSeed.js — Writes courses & syllabuses directly to Firebase, bypassing HTTP auth.
 * Usage: node directSeed.js
 */
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';

// Load .env manually with multi-line quoted value support
const __dirname = dirname(fileURLToPath(import.meta.url));
const raw = readFileSync(resolve(__dirname, '.env'), 'utf-8');
const envRegex = /^([A-Z_][A-Z0-9_]*)=("[\s\S]*?(?<!\\)"|[^\n]*)/gm;
let m;
while ((m = envRegex.exec(raw)) !== null) {
  let val = m[2];
  if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
  process.env[m[1]] = val.replace(/\\n/g, '\n');
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = admin.database();
const coursesRef = db.ref('courses');
const syllabusesRef = db.ref('syllabuses');

const COURSES = [
  {
    title: "Java Full Stack Development",
    description: "Master the complete Java ecosystem from core fundamentals to enterprise Spring Boot and React integration.",
    instructor: "Charani", category: "Java", duration: "6 Months", level: "Intermediate",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-UQ1ZxmHn79QekyobNr31jn-eqAppZGX1uQ&s",
    curriculum: "[Java Basics]\nIntroduction to Java & JVM\nVariables & Data Types\nControl Flow & Loops\nArrays & Strings\nMethods & Recursion\nException Handling\n\n[OOP & Interfaces]\nClasses & Objects\nInheritance & Polymorphism\nAbstraction & Encapsulation\nInterfaces & Functional Interfaces\n\n[Collections & Streams]\nArrayList & LinkedList\nHashMap & HashSet\nLambda Expressions\nJava 8 Streams API\n\n[Spring Boot & REST]\nSpring Core & DI\nSpring Boot Setup\nREST API Design\nSpring Data JPA\nSpring Security & JWT\n\n[React & Deployment]\nReact Fundamentals\nHooks & State Management\nDocker & Kubernetes\nCI/CD with GitHub Actions"
  },
  {
    title: "Data Science & AI",
    description: "Comprehensive data science program covering Python, ML, Deep Learning, NLP, and production deployment.",
    instructor: "Gayathri", category: "AI & Data", duration: "5 Months", level: "Advanced",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfUFmKmFDvY4rg76EzhS6nH0r_B7Uk_oxluw&s",
    curriculum: "[Python for Data Science]\nNumPy Basics\nPandas DataFrames\nMatplotlib & Seaborn\nData Cleaning\nExploratory Data Analysis\n\n[Machine Learning]\nSupervised Learning\nUnsupervised Learning\nModel Evaluation\nScikit-Learn Pipelines\n\n[Deep Learning]\nNeural Networks\nCNNs\nRNNs & LSTM\nTensorFlow & Keras\n\n[NLP & Computer Vision]\nText Preprocessing\nSentiment Analysis\nObject Detection\nTransformers & BERT\n\n[ML Deployment]\nFlask/FastAPI Model Serving\nMLflow Tracking\nCloud Deployment"
  },
  {
    title: "Machine Learning Deep Dive",
    description: "Deep dive into ML algorithms, ensemble methods, deep learning, and MLOps for production-grade systems.",
    instructor: "Abhinaya", category: "AI & Data", duration: "4 Months", level: "Advanced",
    imageUrl: "https://images.unsplash.com/photo-1677442135136-760c813028c0?q=80&w=800",
    curriculum: "[ML Foundations]\nStatistics for ML\nLinear & Logistic Regression\nDecision Trees\nBias-Variance Tradeoff\nFeature Engineering\n\n[Ensemble Methods]\nRandom Forests\nGradient Boosting\nXGBoost & LightGBM\nHyperparameter Tuning\n\n[Deep Learning Advanced]\nAdvanced CNNs\nAttention Mechanisms\nGANs\nDiffusion Models\n\n[Reinforcement Learning]\nMarkov Decision Processes\nQ-Learning\nPPO & Actor-Critic\n\n[MLOps & Production]\nData Versioning (DVC)\nModel Registry\nA/B Testing\nMonitoring & Drift Detection"
  },
  {
    title: "React JS Full Stack Development",
    description: "Build modern full-stack web applications using React, Redux Toolkit, Node.js, Express, and MongoDB.",
    instructor: "Mohan", category: "Web Dev", duration: "3 Months", level: "Intermediate",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_X2qpzOAIrmc5A0-Hf6IxpapkhunI8vauKg&s",
    curriculum: "[React Fundamentals]\nJSX & Components\nProps & State\nEvent Handling\nConditional Rendering\nLists & Keys\n\n[Advanced React]\nuseState & useEffect\nCustom Hooks\nReact Router v6\nCode Splitting & Lazy Loading\n\n[State Management]\nRedux Toolkit\nRTK Query\nZustand\nReact Query\n\n[Backend with Node.js]\nExpress.js Setup\nREST API Design\nMongoDB & Mongoose\nJWT Authentication\n\n[Testing & Deployment]\nJest & React Testing Library\nCypress E2E Testing\nDocker & CI/CD"
  },
  {
    title: "Python Programming Masterclass",
    description: "Learn Python from scratch to advanced levels, including OOP, Django, Flask, FastAPI, and data processing.",
    instructor: "Nagaharsha", category: "Python", duration: "5 Months", level: "Beginner",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTyjgXu6v0rqvaMPcMFFE8brUD50uqVoE3jA&s",
    curriculum: "[Python Fundamentals]\nPython Setup & Syntax\nData Types & Variables\nControl Flow\nFunctions & Modules\nList Comprehensions\n\n[OOP in Python]\nClasses & Objects\nInheritance\nPolymorphism\nMagic/Dunder Methods\n\n[Advanced Python]\nDecorators & Generators\nContext Managers\nConcurrency (asyncio)\nDesign Patterns\n\n[Web Development]\nDjango MVT Architecture\nDjango ORM\nREST Framework (DRF)\nFlask Microservices\nFastAPI & Pydantic\n\n[Data & Automation]\nPandas & NumPy\nWeb Scraping\nSelenium Automation"
  },
  {
    title: "AWS Cloud Practitioner",
    description: "Master AWS cloud services, infrastructure, security, DevOps automation, and prepare for AWS certification.",
    instructor: "Rohan", category: "Cloud", duration: "3 Months", level: "Beginner",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsGmDSGbTH-i5CQrYChKGpjJw6qslkwx17WA&s",
    curriculum: "[Cloud Fundamentals]\nCloud Computing Concepts\nAWS Global Infrastructure\nIAM & Security\nAWS CLI & SDK\n\n[Compute Services]\nEC2 Instances & AMIs\nAuto Scaling & Load Balancing\nAWS Lambda (Serverless)\nElastic Beanstalk\n\n[Storage & Databases]\nS3 Buckets & Policies\nRDS (MySQL, PostgreSQL)\nDynamoDB (NoSQL)\nElastiCache (Redis)\n\n[DevOps & Monitoring]\nCloudWatch Monitoring\nCloudTrail Audit Logs\nCodePipeline CI/CD\nTerraform on AWS"
  },
  {
    title: "Next.js 14 Masterclass",
    description: "Master Next.js 14 App Router, Server Components, Server Actions, authentication, and performance optimization.",
    instructor: "Gayathri", category: "Web Dev", duration: "2 Months", level: "Advanced",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQPswpztQ7IcYpegK2-BrPNRkrkyqddXEqZQ&s",
    curriculum: "[Next.js Foundations]\nApp Router Architecture\nServer vs Client Components\nFile-based Routing\nLayouts & Templates\n\n[Data Fetching]\nServer Actions\nfetch() with Caching\nStatic & Dynamic Rendering\nIncremental Static Regeneration\nStreaming with Suspense\n\n[Advanced Features]\nMiddleware & Edge Runtime\nRoute Handlers (API Routes)\nImage & Font Optimization\nInternationalization (i18n)\n\n[Authentication & Database]\nNextAuth.js v5\nJWT & Session Management\nPrisma ORM\nSupabase Integration\n\n[Performance & Deployment]\nBundle Analysis\nVercel Deployment\nWeb Vitals & Lighthouse"
  },
  {
    title: "MERN Stack Development",
    description: "Build full-stack web applications using MongoDB, Express, React, and Node.js with real-world projects.",
    instructor: "Abhinaya", category: "Web Dev", duration: "5 Months", level: "Intermediate",
    imageUrl: "https://www.rlogical.com/wp-content/uploads/2020/12/MERN.webp",
    curriculum: "[MongoDB & Mongoose]\nMongoDB CRUD\nSchema Design\nAggregation Pipeline\nIndexing & Performance\n\n[Express.js Backend]\nExpress Setup & Routing\nMiddleware Architecture\nError Handling\nJWT Authentication\n\n[React Frontend]\nReact Hooks\nRedux Toolkit\nReact Router\nAxios & API Integration\n\n[Node.js Advanced]\nEvent Loop & Async\nSocket.io Real-time\nRate Limiting & Security\n\n[Deployment & DevOps]\nDocker & Docker Compose\nMongoDB Atlas\nNginx Reverse Proxy\nCI/CD with GitHub Actions"
  },
  {
    title: "Angular Enterprise Development",
    description: "Build enterprise-grade Angular applications with NgRx, RxJS, testing, micro-frontends, and CI/CD.",
    instructor: "Karthisha", category: "Web Dev", duration: "4 Months", level: "Advanced",
    imageUrl: "https://miro.medium.com/1*jAwFJjRn0DYRA3fnxrR9PQ.jpeg",
    curriculum: "[Angular Fundamentals]\nTypeScript Essentials\nComponents & Templates\nDirectives (Structural & Attribute)\nPipes & Filters\nAngular CLI\n\n[Component Architecture]\nInput & Output Decorators\nChange Detection Strategy\nDynamic Components\nAngular Material UI\n\n[State & Services]\nDependency Injection\nRxJS Observables\nNgRx State Management\nHTTP Client & Interceptors\nGuards & Resolvers\n\n[Enterprise Patterns]\nLazy Loading Modules\nMicro Frontend Architecture\nUnit Testing with Jasmine\nE2E Testing with Cypress\n\n[Performance & Deployment]\nAngular Universal (SSR)\nPWA with Service Workers\nDocker Deployment"
  },
  {
    title: "Flutter Mobile Apps",
    description: "Build beautiful cross-platform mobile apps for iOS and Android using Flutter, Dart, and Firebase.",
    instructor: "Mohan", category: "Mobile Dev", duration: "3 Months", level: "Intermediate",
    imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800",
    curriculum: "[Dart & Flutter Basics]\nDart Language Fundamentals\nFlutter Widget Tree\nStateless vs Stateful Widgets\nLayout Widgets\nNavigation & Routing\n\n[UI Development]\nMaterial Design 3\nCustom Animations\nResponsive Layouts\nThemes & Dark Mode\n\n[State Management]\nProvider Pattern\nRiverpod\nBLoC Pattern\nGetX Framework\n\n[Backend Integration]\nREST API Integration\nFirebase (Auth, Firestore)\nHive & SQLite (Local DB)\nPush Notifications (FCM)\n\n[Publishing & DevOps]\nGoogle Play Deployment\nApple App Store\nCI/CD with Codemagic"
  },
  {
    title: "Full Stack Python Pro",
    description: "Advanced Python for enterprise applications — Django Channels, FastAPI microservices, Kafka, Airflow, and cloud DevOps.",
    instructor: "Nagaharsha", category: "Python", duration: "6 Months", level: "Advanced",
    imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=800",
    curriculum: "[Advanced Python Patterns]\nMetaclasses & Descriptors\nAsync/Await Mastery\nMemory Management\nDesign Patterns\n\n[Django Advanced]\nCustom User Model\nDjango Channels (WebSockets)\nCelery Task Queue\nMulti-tenant Architecture\n\n[FastAPI & Microservices]\nFastAPI Deep Dive\nPydantic V2\nDependency Injection\ngRPC with Python\n\n[Data Engineering]\nApache Kafka with Python\nApache Airflow\nETL Pipeline Design\n\n[Cloud & DevOps]\nDocker Multi-stage Builds\nKubernetes with Python\nTerraform IaC\nAWS CDK (Python)"
  }
];

const SYLLABUSES = [
  { title: "Java Full Stack Development", modules: [
    { name: "Java Basics", topics: ["Introduction to Java & JVM","Variables & Data Types","Control Flow & Loops","Arrays & Strings","Methods & Recursion","Exception Handling"] },
    { name: "OOP & Interfaces", topics: ["Classes & Objects","Inheritance & Polymorphism","Abstraction & Encapsulation","Interfaces & Functional Interfaces","Generics & Type Safety"] },
    { name: "Collections & Streams", topics: ["ArrayList & LinkedList","HashMap & HashSet","Lambda Expressions","Java 8 Streams API","Comparator & Iterator"] },
    { name: "Spring Boot & REST", topics: ["Spring Core & DI","Spring Boot Setup","REST API Design","Spring Data JPA","Spring Security & JWT"] },
    { name: "React & Deployment", topics: ["React Fundamentals","Hooks & State Management","Consuming REST APIs","Docker & Kubernetes","CI/CD with GitHub Actions"] }
  ]},
  { title: "Data Science & AI", modules: [
    { name: "Python for Data Science", topics: ["NumPy Basics","Pandas DataFrames","Matplotlib & Seaborn","Data Cleaning","Exploratory Data Analysis"] },
    { name: "Machine Learning", topics: ["Supervised Learning","Unsupervised Learning","Model Evaluation","Cross-Validation","Scikit-Learn Pipelines"] },
    { name: "Deep Learning", topics: ["Neural Networks","CNNs","RNNs & LSTM","Transfer Learning","TensorFlow & Keras"] },
    { name: "NLP & Computer Vision", topics: ["Text Preprocessing","Sentiment Analysis","Object Detection","Face Recognition","Transformers & BERT"] },
    { name: "ML Deployment", topics: ["Flask/FastAPI Model Serving","MLflow Tracking","Docker for ML","Cloud Deployment (AWS/GCP)"] }
  ]},
  { title: "Machine Learning Deep Dive", modules: [
    { name: "ML Foundations", topics: ["Statistics for ML","Linear & Logistic Regression","Decision Trees","Bias-Variance Tradeoff","Feature Engineering"] },
    { name: "Ensemble Methods", topics: ["Random Forests","Gradient Boosting","XGBoost & LightGBM","Stacking & Blending","Hyperparameter Tuning"] },
    { name: "Deep Learning Advanced", topics: ["Advanced CNNs","Attention Mechanisms","GANs","Autoencoders","Diffusion Models"] },
    { name: "Reinforcement Learning", topics: ["Markov Decision Processes","Q-Learning","Policy Gradient","PPO & Actor-Critic","OpenAI Gym"] },
    { name: "MLOps & Production", topics: ["Data Versioning (DVC)","Model Registry","A/B Testing","Monitoring & Drift Detection","Kubeflow Pipelines"] }
  ]},
  { title: "React JS Full Stack Development", modules: [
    { name: "React Fundamentals", topics: ["JSX & Components","Props & State","Event Handling","Conditional Rendering","Lists & Keys"] },
    { name: "Advanced React", topics: ["useState & useEffect","useContext & useRef","Custom Hooks","React Router v6","Code Splitting & Lazy Loading"] },
    { name: "State Management", topics: ["Redux Toolkit","RTK Query","Zustand","React Query","Context API Patterns"] },
    { name: "Backend with Node.js", topics: ["Express.js Setup","REST API Design","MongoDB & Mongoose","JWT Authentication","File Uploads (Multer)"] },
    { name: "Testing & Deployment", topics: ["Jest & React Testing Library","Cypress E2E Testing","Docker Containerization","CI/CD Pipeline","Vercel & AWS Deployment"] }
  ]},
  { title: "Python Programming Masterclass", modules: [
    { name: "Python Fundamentals", topics: ["Python Setup & Syntax","Data Types & Variables","Control Flow","Functions & Modules","List Comprehensions"] },
    { name: "OOP in Python", topics: ["Classes & Objects","Inheritance","Polymorphism","Encapsulation","Magic/Dunder Methods"] },
    { name: "Advanced Python", topics: ["Decorators & Generators","Context Managers","Metaclasses","Concurrency (asyncio)","Design Patterns"] },
    { name: "Web Development", topics: ["Django MVT Architecture","Django ORM","REST Framework (DRF)","Flask Microservices","FastAPI & Pydantic"] },
    { name: "Data & Automation", topics: ["Pandas & NumPy","Web Scraping (BeautifulSoup, Scrapy)","Selenium Automation","File Handling & OS","Database (SQLAlchemy)"] }
  ]},
  { title: "AWS Cloud Practitioner", modules: [
    { name: "Cloud Fundamentals", topics: ["Cloud Computing Concepts","AWS Global Infrastructure","IAM & Security","AWS CLI & SDK","Billing & Cost Management"] },
    { name: "Compute Services", topics: ["EC2 Instances & AMIs","Auto Scaling & Load Balancing","AWS Lambda (Serverless)","Elastic Beanstalk","ECS & EKS (Containers)"] },
    { name: "Storage & Databases", topics: ["S3 Buckets & Policies","RDS (MySQL, PostgreSQL)","DynamoDB (NoSQL)","Elastic File System (EFS)","ElastiCache (Redis)"] },
    { name: "Networking & Security", topics: ["VPC Design","Route 53 (DNS)","CloudFront (CDN)","AWS WAF & Shield","Secrets Manager"] },
    { name: "DevOps & Monitoring", topics: ["CloudWatch Monitoring","CloudTrail Audit Logs","CodePipeline CI/CD","CodeBuild & CodeDeploy","Terraform on AWS"] }
  ]},
  { title: "Next.js 14 Masterclass", modules: [
    { name: "Next.js Foundations", topics: ["App Router Architecture","Server vs Client Components","File-based Routing","Layouts & Templates","Loading & Error UI"] },
    { name: "Data Fetching", topics: ["Server Actions","fetch() with Caching","Static & Dynamic Rendering","Incremental Static Regeneration","Streaming with Suspense"] },
    { name: "Advanced Features", topics: ["Middleware & Edge Runtime","Route Handlers (API Routes)","Parallel & Intercepting Routes","Image & Font Optimization","Internationalization (i18n)"] },
    { name: "Authentication & Database", topics: ["NextAuth.js v5","JWT & Session Management","Prisma ORM","Supabase Integration","Vercel Postgres"] },
    { name: "Performance & Deployment", topics: ["Bundle Analysis","React Server Components Optimization","Vercel Deployment","Docker & Custom Server","Web Vitals & Lighthouse"] }
  ]},
  { title: "MERN Stack Development", modules: [
    { name: "MongoDB & Mongoose", topics: ["MongoDB CRUD","Schema Design","Aggregation Pipeline","Indexing & Performance","Mongoose Virtuals & Middleware"] },
    { name: "Express.js Backend", topics: ["Express Setup & Routing","Middleware Architecture","Error Handling","JWT Authentication","File Uploads & Email"] },
    { name: "React Frontend", topics: ["React Hooks","Redux Toolkit","React Router","Axios & API Integration","Form Handling (React Hook Form)"] },
    { name: "Node.js Advanced", topics: ["Event Loop & Async","Streams & Buffers","Worker Threads","Socket.io Real-time","Rate Limiting & Security"] },
    { name: "Deployment & DevOps", topics: ["Docker & Docker Compose","MongoDB Atlas","Nginx Reverse Proxy","CI/CD with GitHub Actions","AWS/Render/Heroku Deployment"] }
  ]},
  { title: "Angular Enterprise Development", modules: [
    { name: "Angular Fundamentals", topics: ["TypeScript Essentials","Components & Templates","Directives (Structural & Attribute)","Pipes & Filters","Angular CLI"] },
    { name: "Component Architecture", topics: ["Input & Output Decorators","ViewChild & ContentChild","Change Detection Strategy","Dynamic Components","Angular Material UI"] },
    { name: "State & Services", topics: ["Dependency Injection","RxJS Observables","NgRx State Management","HTTP Client & Interceptors","Guards & Resolvers"] },
    { name: "Enterprise Patterns", topics: ["Lazy Loading Modules","Standalone Components","Micro Frontend Architecture","Unit Testing with Jasmine","E2E Testing with Cypress"] },
    { name: "Performance & Deployment", topics: ["Angular Universal (SSR)","PWA with Service Workers","Bundle Optimization","Docker Deployment","Azure DevOps CI/CD"] }
  ]},
  { title: "Flutter Mobile Apps", modules: [
    { name: "Dart & Flutter Basics", topics: ["Dart Language Fundamentals","Flutter Widget Tree","Stateless vs Stateful Widgets","Layout Widgets","Navigation & Routing"] },
    { name: "UI Development", topics: ["Material Design 3","Custom Animations","Responsive Layouts","Themes & Dark Mode","Custom Painters"] },
    { name: "State Management", topics: ["setState & InheritedWidget","Provider Pattern","Riverpod","BLoC Pattern","GetX Framework"] },
    { name: "Backend Integration", topics: ["REST API Integration","Firebase (Auth, Firestore)","Hive & SQLite (Local DB)","Push Notifications (FCM)","Payment Integration"] },
    { name: "Publishing & DevOps", topics: ["App Signing & Keystore","Google Play Deployment","Apple App Store","CI/CD with Codemagic","Performance Profiling"] }
  ]},
  { title: "Full Stack Python Pro", modules: [
    { name: "Advanced Python Patterns", topics: ["Metaclasses & Descriptors","Protocol & ABCs","Async/Await Mastery","Memory Management","C Extensions with Cython"] },
    { name: "Django Advanced", topics: ["Custom User Model","Django Channels (WebSockets)","Celery Task Queue","Django Admin Customization","Multi-tenant Architecture"] },
    { name: "FastAPI & Microservices", topics: ["FastAPI Deep Dive","Pydantic V2","Dependency Injection","gRPC with Python","Service Mesh Basics"] },
    { name: "Data Engineering", topics: ["Apache Kafka with Python","Apache Airflow","PySpark Basics","ETL Pipeline Design","Snowflake & BigQuery"] },
    { name: "Cloud & DevOps", topics: ["Docker Multi-stage Builds","Kubernetes with Python","Terraform IaC","AWS CDK (Python)","Observability & Tracing"] }
  ]},
];

async function run() {
  const now = new Date().toISOString();

  // ── Clear existing data ──
  console.log('Clearing existing courses and syllabuses...');
  await coursesRef.remove();
  await syllabusesRef.remove();
  console.log('Cleared.\n');

  // ── Seed syllabuses ──
  console.log('====== SEEDING SYLLABUSES ======');
  for (const s of SYLLABUSES) {
    await syllabusesRef.push({ ...s, createdAt: now });
    console.log(`✅ Syllabus: ${s.title}`);
  }

  // ── Seed courses ──
  console.log('\n====== SEEDING COURSES ======');
  for (const c of COURSES) {
    await coursesRef.push({ ...c, likes: 0, isLiked: false, createdAt: now });
    console.log(`✅ Course: ${c.title}`);
  }

  console.log('\n====== ALL DONE ======');
  process.exit(0);
}

run().catch(err => { console.error('SEED ERROR:', err); process.exit(1); });
