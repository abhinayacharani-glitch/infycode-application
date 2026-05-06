import http from 'http';

const BASE_HOST = 'localhost';
const BASE_PORT = 5000;

const post = (path, body) => new Promise((resolve, reject) => {
  const payload = JSON.stringify(body);
  const options = {
    hostname: BASE_HOST,
    port: BASE_PORT,
    path,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) },
  };
  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        if (res.statusCode >= 400) return reject(new Error(parsed.error || data));
        resolve(parsed);
      } catch { reject(new Error(data)); }
    });
  });
  req.on('error', reject);
  req.write(payload);
  req.end();
});

const SYLLABUSES = [
  {
    title: 'Java Full Stack Development',
    modules: [
      { name: 'Java Basics', topics: ['Introduction to Java & JVM', 'Variables & Data Types', 'Control Flow & Loops', 'Arrays & Strings', 'Methods & Recursion', 'Exception Handling'] },
      { name: 'OOP & Interfaces', topics: ['Classes & Objects', 'Inheritance & Polymorphism', 'Abstraction & Encapsulation', 'Interfaces & Functional Interfaces', 'Generics & Type Safety'] },
      { name: 'Collections & Streams', topics: ['ArrayList & LinkedList', 'HashMap & HashSet', 'Lambda Expressions', 'Java 8 Streams API', 'Comparator & Iterator'] },
      { name: 'Spring Boot & REST', topics: ['Spring Core & DI', 'Spring Boot Setup', 'REST API Design', 'Spring Data JPA', 'Spring Security & JWT'] },
      { name: 'React & Deployment', topics: ['React Fundamentals', 'Hooks & State Management', 'Consuming REST APIs', 'Docker & Kubernetes', 'CI/CD with GitHub Actions'] },
    ],
  },
  {
    title: 'Data Science & AI',
    modules: [
      { name: 'Python for Data Science', topics: ['NumPy Basics', 'Pandas DataFrames', 'Matplotlib & Seaborn', 'Data Cleaning', 'Exploratory Data Analysis'] },
      { name: 'Machine Learning', topics: ['Supervised Learning', 'Unsupervised Learning', 'Model Evaluation', 'Cross-Validation', 'Scikit-Learn Pipelines'] },
      { name: 'Deep Learning', topics: ['Neural Networks', 'CNNs', 'RNNs & LSTM', 'Transfer Learning', 'TensorFlow & Keras'] },
      { name: 'NLP & Computer Vision', topics: ['Text Preprocessing', 'Sentiment Analysis', 'Object Detection', 'Face Recognition', 'Transformers & BERT'] },
      { name: 'ML Deployment', topics: ['Flask/FastAPI Model Serving', 'MLflow Tracking', 'Docker for ML', 'Cloud Deployment (AWS/GCP)'] },
    ],
  },
  {
    title: 'Machine Learning Deep Dive',
    modules: [
      { name: 'ML Foundations', topics: ['Statistics for ML', 'Linear & Logistic Regression', 'Decision Trees', 'Bias-Variance Tradeoff', 'Feature Engineering'] },
      { name: 'Ensemble Methods', topics: ['Random Forests', 'Gradient Boosting', 'XGBoost & LightGBM', 'Stacking & Blending', 'Hyperparameter Tuning'] },
      { name: 'Deep Learning Advanced', topics: ['Advanced CNNs', 'Attention Mechanisms', 'GANs', 'Autoencoders', 'Diffusion Models'] },
      { name: 'Reinforcement Learning', topics: ['Markov Decision Processes', 'Q-Learning', 'Policy Gradient', 'PPO & Actor-Critic', 'OpenAI Gym'] },
      { name: 'MLOps & Production', topics: ['Data Versioning (DVC)', 'Model Registry', 'A/B Testing', 'Monitoring & Drift Detection', 'Kubeflow Pipelines'] },
    ],
  },
  {
    title: 'React JS Full Stack Development',
    modules: [
      { name: 'React Fundamentals', topics: ['JSX & Components', 'Props & State', 'Event Handling', 'Conditional Rendering', 'Lists & Keys'] },
      { name: 'Advanced React', topics: ['useState & useEffect', 'useContext & useRef', 'Custom Hooks', 'React Router v6', 'Code Splitting & Lazy Loading'] },
      { name: 'State Management', topics: ['Redux Toolkit', 'RTK Query', 'Zustand', 'React Query', 'Context API Patterns'] },
      { name: 'Backend with Node.js', topics: ['Express.js Setup', 'REST API Design', 'MongoDB & Mongoose', 'JWT Authentication', 'File Uploads (Multer)'] },
      { name: 'Testing & Deployment', topics: ['Jest & React Testing Library', 'Cypress E2E Testing', 'Docker Containerization', 'CI/CD Pipeline', 'Vercel & AWS Deployment'] },
    ],
  },
  {
    title: 'Python Programming Masterclass',
    modules: [
      { name: 'Python Fundamentals', topics: ['Python Setup & Syntax', 'Data Types & Variables', 'Control Flow', 'Functions & Modules', 'List Comprehensions'] },
      { name: 'OOP in Python', topics: ['Classes & Objects', 'Inheritance', 'Polymorphism', 'Encapsulation', 'Magic/Dunder Methods'] },
      { name: 'Advanced Python', topics: ['Decorators & Generators', 'Context Managers', 'Metaclasses', 'Concurrency (asyncio)', 'Design Patterns'] },
      { name: 'Web Development', topics: ['Django MVT Architecture', 'Django ORM', 'REST Framework (DRF)', 'Flask Microservices', 'FastAPI & Pydantic'] },
      { name: 'Data & Automation', topics: ['Pandas & NumPy', 'Web Scraping (BeautifulSoup, Scrapy)', 'Selenium Automation', 'File Handling & OS', 'Database (SQLAlchemy)'] },
    ],
  },
  {
    title: 'AWS Cloud Practitioner',
    modules: [
      { name: 'Cloud Fundamentals', topics: ['Cloud Computing Concepts', 'AWS Global Infrastructure', 'IAM & Security', 'AWS CLI & SDK', 'Billing & Cost Management'] },
      { name: 'Compute Services', topics: ['EC2 Instances & AMIs', 'Auto Scaling & Load Balancing', 'AWS Lambda (Serverless)', 'Elastic Beanstalk', 'ECS & EKS (Containers)'] },
      { name: 'Storage & Databases', topics: ['S3 Buckets & Policies', 'RDS (MySQL, PostgreSQL)', 'DynamoDB (NoSQL)', 'Elastic File System (EFS)', 'ElastiCache (Redis)'] },
      { name: 'Networking & Security', topics: ['VPC Design', 'Route 53 (DNS)', 'CloudFront (CDN)', 'AWS WAF & Shield', 'Secrets Manager'] },
      { name: 'DevOps & Monitoring', topics: ['CloudWatch Monitoring', 'CloudTrail Audit Logs', 'CodePipeline CI/CD', 'CodeBuild & CodeDeploy', 'Terraform on AWS'] },
    ],
  },
  {
    title: 'Next.js 14 Masterclass',
    modules: [
      { name: 'Next.js Foundations', topics: ['App Router Architecture', 'Server vs Client Components', 'File-based Routing', 'Layouts & Templates', 'Loading & Error UI'] },
      { name: 'Data Fetching', topics: ['Server Actions', 'fetch() with Caching', 'Static & Dynamic Rendering', 'Incremental Static Regeneration', 'Streaming with Suspense'] },
      { name: 'Advanced Features', topics: ['Middleware & Edge Runtime', 'Route Handlers (API Routes)', 'Parallel & Intercepting Routes', 'Image & Font Optimization', 'Internationalization (i18n)'] },
      { name: 'Authentication & Database', topics: ['NextAuth.js v5', 'JWT & Session Management', 'Prisma ORM', 'Supabase Integration', 'Vercel Postgres'] },
      { name: 'Performance & Deployment', topics: ['Bundle Analysis', 'React Server Components Optimization', 'Vercel Deployment', 'Docker & Custom Server', 'Web Vitals & Lighthouse'] },
    ],
  },
  {
    title: 'MERN Stack Development',
    modules: [
      { name: 'MongoDB & Mongoose', topics: ['MongoDB CRUD', 'Schema Design', 'Aggregation Pipeline', 'Indexing & Performance', 'Mongoose Virtuals & Middleware'] },
      { name: 'Express.js Backend', topics: ['Express Setup & Routing', 'Middleware Architecture', 'Error Handling', 'JWT Authentication', 'File Uploads & Email'] },
      { name: 'React Frontend', topics: ['React Hooks', 'Redux Toolkit', 'React Router', 'Axios & API Integration', 'Form Handling (React Hook Form)'] },
      { name: 'Node.js Advanced', topics: ['Event Loop & Async', 'Streams & Buffers', 'Worker Threads', 'Socket.io Real-time', 'Rate Limiting & Security'] },
      { name: 'Deployment & DevOps', topics: ['Docker & Docker Compose', 'MongoDB Atlas', 'Nginx Reverse Proxy', 'CI/CD with GitHub Actions', 'AWS/Render/Heroku Deployment'] },
    ],
  },
  {
    title: 'Angular Enterprise Development',
    modules: [
      { name: 'Angular Fundamentals', topics: ['TypeScript Essentials', 'Components & Templates', 'Directives (Structural & Attribute)', 'Pipes & Filters', 'Angular CLI'] },
      { name: 'Component Architecture', topics: ['Input & Output Decorators', 'ViewChild & ContentChild', 'Change Detection Strategy', 'Dynamic Components', 'Angular Material UI'] },
      { name: 'State & Services', topics: ['Dependency Injection', 'RxJS Observables', 'NgRx State Management', 'HTTP Client & Interceptors', 'Guards & Resolvers'] },
      { name: 'Enterprise Patterns', topics: ['Lazy Loading Modules', 'Standalone Components', 'Micro Frontend Architecture', 'Unit Testing with Jasmine', 'E2E Testing with Cypress'] },
      { name: 'Performance & Deployment', topics: ['Angular Universal (SSR)', 'PWA with Service Workers', 'Bundle Optimization', 'Docker Deployment', 'Azure DevOps CI/CD'] },
    ],
  },
  {
    title: 'Flutter Mobile Apps',
    modules: [
      { name: 'Dart & Flutter Basics', topics: ['Dart Language Fundamentals', 'Flutter Widget Tree', 'Stateless vs Stateful Widgets', 'Layout Widgets', 'Navigation & Routing'] },
      { name: 'UI Development', topics: ['Material Design 3', 'Custom Animations', 'Responsive Layouts', 'Themes & Dark Mode', 'Custom Painters'] },
      { name: 'State Management', topics: ['setState & InheritedWidget', 'Provider Pattern', 'Riverpod', 'BLoC Pattern', 'GetX Framework'] },
      { name: 'Backend Integration', topics: ['REST API Integration', 'Firebase (Auth, Firestore)', 'Hive & SQLite (Local DB)', 'Push Notifications (FCM)', 'Payment Integration'] },
      { name: 'Publishing & DevOps', topics: ['App Signing & Keystore', 'Google Play Deployment', 'Apple App Store', 'CI/CD with Codemagic', 'Performance Profiling'] },
    ],
  },
  {
    title: 'Full Stack Python Pro',
    modules: [
      { name: 'Advanced Python Patterns', topics: ['Metaclasses & Descriptors', 'Protocol & ABCs', 'Async/Await Mastery', 'Memory Management', 'C Extensions with Cython'] },
      { name: 'Django Advanced', topics: ['Custom User Model', 'Django Channels (WebSockets)', 'Celery Task Queue', 'Django Admin Customization', 'Multi-tenant Architecture'] },
      { name: 'FastAPI & Microservices', topics: ['FastAPI Deep Dive', 'Pydantic V2', 'Dependency Injection', 'gRPC with Python', 'Service Mesh Basics'] },
      { name: 'Data Engineering', topics: ['Apache Kafka with Python', 'Apache Airflow', 'PySpark Basics', 'ETL Pipeline Design', 'Snowflake & BigQuery'] },
      { name: 'Cloud & DevOps', topics: ['Docker Multi-stage Builds', 'Kubernetes with Python', 'Terraform IaC', 'AWS CDK (Python)', 'Observability & Tracing'] },
    ],
  },
];

const COURSES = [
  {
    title: 'Java Full Stack Development',
    description: 'Master the complete Java ecosystem from core fundamentals to enterprise Spring Boot and React integration.',
    instructor: 'Charani',
    category: 'Java',
    duration: '6 Months',
    level: 'Intermediate',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-UQ1ZxmHn79QekyobNr31jn-eqAppZGX1uQ&s',
    curriculum: '[Java Basics]\nIntroduction to Java & JVM\nVariables & Data Types\nControl Flow & Loops\nArrays & Strings\n\n[Spring Boot & REST]\nREST API Design\nSpring Security & JWT\nSpring Data JPA',
  },
  {
    title: 'Data Science & AI',
    description: 'Comprehensive data science program covering Python, ML, Deep Learning, NLP, and production deployment.',
    instructor: 'Gayathri',
    category: 'AI & Data',
    duration: '5 Months',
    level: 'Advanced',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfUFmKmFDvY4rg76EzhS6nH0r_B7Uk_oxluw&s',
    curriculum: '[Python for Data Science]\nNumPy Basics\nPandas DataFrames\nData Cleaning\n\n[Machine Learning]\nSupervised Learning\nModel Evaluation\nScikit-Learn Pipelines',
  },
  {
    title: 'Machine Learning Deep Dive',
    description: 'Deep dive into ML algorithms, ensemble methods, deep learning, and MLOps for production-grade systems.',
    instructor: 'Abhinaya',
    category: 'AI & Data',
    duration: '4 Months',
    level: 'Advanced',
    imageUrl: 'https://images.unsplash.com/photo-1677442135136-760c813028c0?q=80&w=800',
    curriculum: '[ML Foundations]\nLinear & Logistic Regression\nDecision Trees\nBias-Variance Tradeoff\n\n[Ensemble Methods]\nRandom Forests\nXGBoost & LightGBM\nHyperparameter Tuning',
  },
  {
    title: 'React JS Full Stack Development',
    description: 'Build modern full-stack web applications using React, Redux Toolkit, Node.js, Express, and MongoDB.',
    instructor: 'Mohan',
    category: 'Web Dev',
    duration: '3 Months',
    level: 'Intermediate',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_X2qpzOAIrmc5A0-Hf6IxpapkhunI8vauKg&s',
    curriculum: '[React Fundamentals]\nJSX & Components\nProps & State\nEvent Handling\n\n[State Management]\nRedux Toolkit\nRTK Query\nReact Query',
  },
  {
    title: 'Python Programming Masterclass',
    description: 'Learn Python from scratch to advanced levels, including OOP, Django, Flask, FastAPI, and data processing.',
    instructor: 'Nagaharsha',
    category: 'Python',
    duration: '5 Months',
    level: 'Beginner',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTyjgXu6v0rqvaMPcMFFE8brUD50uqVoE3jA&s',
    curriculum: '[Python Fundamentals]\nPython Setup & Syntax\nData Types & Variables\nFunctions & Modules\n\n[Web Development]\nDjango MVT Architecture\nREST Framework (DRF)\nFastAPI & Pydantic',
  },
  {
    title: 'AWS Cloud Practitioner',
    description: 'Master AWS cloud services, infrastructure, security, DevOps automation, and prepare for AWS certification.',
    instructor: 'Rohan',
    category: 'Cloud',
    duration: '3 Months',
    level: 'Beginner',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsGmDSGbTH-i5CQrYChKGpjJw6qslkwx17WA&s',
    curriculum: '[Cloud Fundamentals]\nCloud Computing Concepts\nIAM & Security\nAWS CLI & SDK\n\n[Compute Services]\nEC2 Instances & AMIs\nAWS Lambda (Serverless)\nElastic Beanstalk',
  },
  {
    title: 'Next.js 14 Masterclass',
    description: 'Master Next.js 14 App Router, Server Components, Server Actions, authentication, and performance optimization.',
    instructor: 'Gayathri',
    category: 'Web Dev',
    duration: '2 Months',
    level: 'Advanced',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQPswpztQ7IcYpegK2-BrPNRkrkyqddXEqZQ&s',
    curriculum: '[Next.js Foundations]\nApp Router Architecture\nServer vs Client Components\nFile-based Routing\n\n[Data Fetching]\nServer Actions\nStatic & Dynamic Rendering\nStreaming with Suspense',
  },
  {
    title: 'MERN Stack Development',
    description: 'Build full-stack web applications using MongoDB, Express, React, and Node.js with real-world projects.',
    instructor: 'Abhinaya',
    category: 'Web Dev',
    duration: '5 Months',
    level: 'Intermediate',
    imageUrl: 'https://www.rlogical.com/wp-content/uploads/2020/12/MERN.webp',
    curriculum: '[MongoDB & Mongoose]\nMongoDB CRUD\nSchema Design\nAggregation Pipeline\n\n[React Frontend]\nReact Hooks\nRedux Toolkit\nAxios & API Integration',
  },
  {
    title: 'Angular Enterprise Development',
    description: 'Build enterprise-grade Angular applications with NgRx, RxJS, testing, micro-frontends, and CI/CD.',
    instructor: 'Karthisha',
    category: 'Web Dev',
    duration: '4 Months',
    level: 'Advanced',
    imageUrl: 'https://miro.medium.com/1*jAwFJjRn0DYRA3fnxrR9PQ.jpeg',
    curriculum: '[Angular Fundamentals]\nTypeScript Essentials\nComponents & Templates\nDirectives & Pipes\n\n[State & Services]\nRxJS Observables\nNgRx State Management\nHTTP Client & Interceptors',
  },
  {
    title: 'Flutter Mobile Apps',
    description: 'Build beautiful cross-platform mobile apps for iOS and Android using Flutter, Dart, and Firebase.',
    instructor: 'Mohan',
    category: 'Mobile Dev',
    duration: '3 Months',
    level: 'Intermediate',
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800',
    curriculum: '[Dart & Flutter Basics]\nDart Language Fundamentals\nFlutter Widget Tree\nStateless vs Stateful Widgets\n\n[State Management]\nProvider Pattern\nRiverpod\nBLoC Pattern',
  },
  {
    title: 'Full Stack Python Pro',
    description: 'Advanced Python for enterprise applications — Django Channels, FastAPI microservices, Kafka, Airflow, and cloud DevOps.',
    instructor: 'Nagaharsha',
    category: 'Python',
    duration: '6 Months',
    level: 'Advanced',
    imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=800',
    curriculum: '[Advanced Python Patterns]\nMetaclasses & Descriptors\nAsync/Await Mastery\nMemory Management\n\n[FastAPI & Microservices]\nFastAPI Deep Dive\nPydantic V2\ngRPC with Python',
  },
];

async function seed() {
  console.log('\n====== SEEDING SYLLABUSES ======\n');
  for (const syl of SYLLABUSES) {
    try {
      const result = await post('/api/syllabuses', syl);
      console.log(`✅ Syllabus created: ${syl.title}`);
    } catch (err) {
      console.error(`❌ Failed syllabus [${syl.title}]:`, err.message);
    }
  }

  console.log('\n====== SEEDING COURSES ======\n');
  for (const course of COURSES) {
    try {
      const result = await post('/api/courses', course);
      console.log(`✅ Course created: ${course.title}`);
    } catch (err) {
      console.error(`❌ Failed course [${course.title}]:`, err.message);
    }
  }

  console.log('\n====== SEEDING COMPLETE ======\n');
}

seed();
