import db from "../config/firebase.js";

const coursesRef = db.ref("courses");

const DEFAULT_COURSES = [
  {
    title: "Java Full Stack Development",
    description: "Master the complete Java ecosystem from core fundamentals to enterprise Spring Boot and React integration.",
    instructor: "Charani",
    category: "Java",
    duration: "6 Months",
    level: "Intermediate",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-UQ1ZxmHn79QekyobNr31jn-eqAppZGX1uQ&s",
    curriculum: "[Java Basics]\nIntroduction to Java & JVM\nVariables & Data Types\nControl Flow & Loops\nArrays & Strings\nMethods & Recursion\nException Handling\n\n[OOP & Interfaces]\nClasses & Objects\nInheritance & Polymorphism\nAbstraction & Encapsulation\nInterfaces & Functional Interfaces\n\n[Collections & Streams]\nArrayList & LinkedList\nHashMap & HashSet\nLambda Expressions\nJava 8 Streams API\n\n[Spring Boot & REST]\nSpring Core & DI\nSpring Boot Setup\nREST API Design\nSpring Data JPA\nSpring Security & JWT\n\n[React & Deployment]\nReact Fundamentals\nHooks & State Management\nDocker & Kubernetes\nCI/CD with GitHub Actions"
  },
  {
    title: "Data Science & AI",
    description: "Comprehensive data science program covering Python, ML, Deep Learning, NLP, and production deployment.",
    instructor: "Gayathri",
    category: "AI & Data",
    duration: "5 Months",
    level: "Advanced",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfUFmKmFDvY4rg76EzhS6nH0r_B7Uk_oxluw&s",
    curriculum: "[Python for Data Science]\nNumPy Basics\nPandas DataFrames\nMatplotlib & Seaborn\nData Cleaning\nExploratory Data Analysis\n\n[Machine Learning]\nSupervised Learning\nUnsupervised Learning\nModel Evaluation\nScikit-Learn Pipelines\n\n[Deep Learning]\nNeural Networks\nCNNs\nRNNs & LSTM\nTensorFlow & Keras\n\n[NLP & Computer Vision]\nText Preprocessing\nSentiment Analysis\nObject Detection\nTransformers & BERT\n\n[ML Deployment]\nFlask/FastAPI Model Serving\nMLflow Tracking\nCloud Deployment"
  },
  {
    title: "Machine Learning Deep Dive",
    description: "Deep dive into ML algorithms, ensemble methods, deep learning, and MLOps for production-grade systems.",
    instructor: "Abhinaya",
    category: "AI & Data",
    duration: "4 Months",
    level: "Advanced",
    imageUrl: "https://images.unsplash.com/photo-1677442135136-760c813028c0?q=80&w=800",
    curriculum: "[ML Foundations]\nStatistics for ML\nLinear & Logistic Regression\nDecision Trees\nBias-Variance Tradeoff\nFeature Engineering\n\n[Ensemble Methods]\nRandom Forests\nGradient Boosting\nXGBoost & LightGBM\nHyperparameter Tuning\n\n[Deep Learning Advanced]\nAdvanced CNNs\nAttention Mechanisms\nGANs\nDiffusion Models\n\n[Reinforcement Learning]\nMarkov Decision Processes\nQ-Learning\nPPO & Actor-Critic\n\n[MLOps & Production]\nData Versioning (DVC)\nModel Registry\nA/B Testing\nMonitoring & Drift Detection"
  },
  {
    title: "React JS Full Stack Development",
    description: "Build modern full-stack web applications using React, Redux Toolkit, Node.js, Express, and MongoDB.",
    instructor: "Mohan",
    category: "Web Dev",
    duration: "3 Months",
    level: "Intermediate",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_X2qpzOAIrmc5A0-Hf6IxpapkhunI8vauKg&s",
    curriculum: "[React Fundamentals]\nJSX & Components\nProps & State\nEvent Handling\nConditional Rendering\nLists & Keys\n\n[Advanced React]\nuseState & useEffect\nCustom Hooks\nReact Router v6\nCode Splitting & Lazy Loading\n\n[State Management]\nRedux Toolkit\nRTK Query\nZustand\nReact Query\n\n[Backend with Node.js]\nExpress.js Setup\nREST API Design\nMongoDB & Mongoose\nJWT Authentication\n\n[Testing & Deployment]\nJest & React Testing Library\nCypress E2E Testing\nDocker & CI/CD"
  },
  {
    title: "Python Programming Masterclass",
    description: "Learn Python from scratch to advanced levels, including OOP, Django, Flask, FastAPI, and data processing.",
    instructor: "Nagaharsha",
    category: "Python",
    duration: "5 Months",
    level: "Beginner",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTyjgXu6v0rqvaMPcMFFE8brUD50uqVoE3jA&s",
    curriculum: "[Python Fundamentals]\nPython Setup & Syntax\nData Types & Variables\nControl Flow\nFunctions & Modules\nList Comprehensions\n\n[OOP in Python]\nClasses & Objects\nInheritance\nPolymorphism\nMagic/Dunder Methods\n\n[Advanced Python]\nDecorators & Generators\nContext Managers\nConcurrency (asyncio)\nDesign Patterns\n\n[Web Development]\nDjango MVT Architecture\nDjango ORM\nREST Framework (DRF)\nFlask Microservices\nFastAPI & Pydantic\n\n[Data & Automation]\nPandas & NumPy\nWeb Scraping\nSelenium Automation"
  },
  {
    title: "AWS Cloud Practitioner",
    description: "Master AWS cloud services, infrastructure, security, DevOps automation, and prepare for AWS certification.",
    instructor: "Rohan",
    category: "Cloud",
    duration: "3 Months",
    level: "Beginner",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsGmDSGbTH-i5CQrYChKGpjJw6qslkwx17WA&s",
    curriculum: "[Cloud Fundamentals]\nCloud Computing Concepts\nAWS Global Infrastructure\nIAM & Security\nAWS CLI & SDK\n\n[Compute Services]\nEC2 Instances & AMIs\nAuto Scaling & Load Balancing\nAWS Lambda (Serverless)\nElastic Beanstalk\n\n[Storage & Databases]\nS3 Buckets & Policies\nRDS (MySQL, PostgreSQL)\nDynamoDB (NoSQL)\nElastiCache (Redis)\n\n[DevOps & Monitoring]\nCloudWatch Monitoring\nCloudTrail Audit Logs\nCodePipeline CI/CD\nTerraform on AWS"
  },
  {
    title: "Next.js 14 Masterclass",
    description: "Master Next.js 14 App Router, Server Components, Server Actions, authentication, and performance optimization.",
    instructor: "Gayathri",
    category: "Web Dev",
    duration: "2 Months",
    level: "Advanced",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQPswpztQ7IcYpegK2-BrPNRkrkyqddXEqZQ&s",
    curriculum: "[Next.js Foundations]\nApp Router Architecture\nServer vs Client Components\nFile-based Routing\nLayouts & Templates\n\n[Data Fetching]\nServer Actions\nfetch() with Caching\nStatic & Dynamic Rendering\nIncremental Static Regeneration\nStreaming with Suspense\n\n[Advanced Features]\nMiddleware & Edge Runtime\nRoute Handlers (API Routes)\nImage & Font Optimization\nInternationalization (i18n)\n\n[Authentication & Database]\nNextAuth.js v5\nJWT & Session Management\nPrisma ORM\nSupabase Integration\n\n[Performance & Deployment]\nBundle Analysis\nVercel Deployment\nWeb Vitals & Lighthouse"
  },
  {
    title: "MERN Stack Development",
    description: "Build full-stack web applications using MongoDB, Express, React, and Node.js with real-world projects.",
    instructor: "Abhinaya",
    category: "Web Dev",
    duration: "5 Months",
    level: "Intermediate",
    imageUrl: "https://www.rlogical.com/wp-content/uploads/2020/12/MERN.webp",
    curriculum: "[MongoDB & Mongoose]\nMongoDB CRUD\nSchema Design\nAggregation Pipeline\nIndexing & Performance\n\n[Express.js Backend]\nExpress Setup & Routing\nMiddleware Architecture\nError Handling\nJWT Authentication\n\n[React Frontend]\nReact Hooks\nRedux Toolkit\nReact Router\nAxios & API Integration\n\n[Node.js Advanced]\nEvent Loop & Async\nSocket.io Real-time\nRate Limiting & Security\n\n[Deployment & DevOps]\nDocker & Docker Compose\nMongoDB Atlas\nNginx Reverse Proxy\nCI/CD with GitHub Actions"
  },
  {
    title: "Angular Enterprise Development",
    description: "Build enterprise-grade Angular applications with NgRx, RxJS, testing, micro-frontends, and CI/CD.",
    instructor: "Karthisha",
    category: "Web Dev",
    duration: "4 Months",
    level: "Advanced",
    imageUrl: "https://miro.medium.com/1*jAwFJjRn0DYRA3fnxrR9PQ.jpeg",
    curriculum: "[Angular Fundamentals]\nTypeScript Essentials\nComponents & Templates\nDirectives (Structural & Attribute)\nPipes & Filters\nAngular CLI\n\n[Component Architecture]\nInput & Output Decorators\nChange Detection Strategy\nDynamic Components\nAngular Material UI\n\n[State & Services]\nDependency Injection\nRxJS Observables\nNgRx State Management\nHTTP Client & Interceptors\nGuards & Resolvers\n\n[Enterprise Patterns]\nLazy Loading Modules\nMicro Frontend Architecture\nUnit Testing with Jasmine\nE2E Testing with Cypress\n\n[Performance & Deployment]\nAngular Universal (SSR)\nPWA with Service Workers\nDocker Deployment"
  },
  {
    title: "Flutter Mobile Apps",
    description: "Build beautiful cross-platform mobile apps for iOS and Android using Flutter, Dart, and Firebase.",
    instructor: "Mohan",
    category: "Mobile Dev",
    duration: "3 Months",
    level: "Intermediate",
    imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800",
    curriculum: "[Dart & Flutter Basics]\nDart Language Fundamentals\nFlutter Widget Tree\nStateless vs Stateful Widgets\nLayout Widgets\nNavigation & Routing\n\n[UI Development]\nMaterial Design 3\nCustom Animations\nResponsive Layouts\nThemes & Dark Mode\n\n[State Management]\nProvider Pattern\nRiverpod\nBLoC Pattern\nGetX Framework\n\n[Backend Integration]\nREST API Integration\nFirebase (Auth, Firestore)\nHive & SQLite (Local DB)\nPush Notifications (FCM)\n\n[Publishing & DevOps]\nGoogle Play Deployment\nApple App Store\nCI/CD with Codemagic"
  },
  {
    title: "Full Stack Python Pro",
    description: "Advanced Python for enterprise applications — Django Channels, FastAPI microservices, Kafka, Airflow, and cloud DevOps.",
    instructor: "Nagaharsha",
    category: "Python",
    duration: "6 Months",
    level: "Advanced",
    imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=800",
    curriculum: "[Advanced Python Patterns]\nMetaclasses & Descriptors\nAsync/Await Mastery\nMemory Management\nDesign Patterns\n\n[Django Advanced]\nCustom User Model\nDjango Channels (WebSockets)\nCelery Task Queue\nMulti-tenant Architecture\n\n[FastAPI & Microservices]\nFastAPI Deep Dive\nPydantic V2\nDependency Injection\ngRPC with Python\n\n[Data Engineering]\nApache Kafka with Python\nApache Airflow\nETL Pipeline Design\n\n[Cloud & DevOps]\nDocker Multi-stage Builds\nKubernetes with Python\nTerraform IaC\nAWS CDK (Python)"
  }
];

/**
 * @desc Get all courses
 * @route GET /api/courses
 */
export const getCourses = async (req, res) => {
  try {
    const snapshot = await coursesRef.once("value");
    let data = snapshot.val() || {};

    // Seed if empty
    if (Object.keys(data).length === 0) {
      console.log("[Course Controller] Seeding default courses...");
      for (const course of DEFAULT_COURSES) {
        await coursesRef.push({ 
          ...course, 
          likes: 0, 
          isLiked: false, 
          createdAt: new Date().toISOString() 
        });
      }
      const newSnapshot = await coursesRef.once("value");
      data = newSnapshot.val() || {};
    }

    const courses = Object.entries(data)
      .map(([id, course]) => ({ id, ...course }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.status(200).json({ courses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

/**
 * @desc Create a new course
 * @route POST /api/courses
 */
export const createCourse = async (req, res) => {
  try {
    const courseData = req.body;
    if (!courseData.title || !courseData.description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    const newCourseRef = coursesRef.push();
    const newCourse = {
      ...courseData,
      likes: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
    };

    await newCourseRef.set(newCourse);
    const course = { id: newCourseRef.key, ...newCourse };
    res.status(201).json({ message: "Course created successfully", course });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ error: "Failed to create course" });
  }
};

/**
 * @desc Update a course
 * @route PUT /api/courses/:id
 */
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const courseData = req.body;
    await coursesRef.child(id).update(courseData);

    const snapshot = await coursesRef.child(id).once("value");
    const course = { id, ...snapshot.val() };
    res.status(200).json({ message: "Course updated successfully", course });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ error: "Failed to update course" });
  }
};

/**
 * @desc Delete a course
 * @route DELETE /api/courses/:id
 */
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    await coursesRef.child(id).remove();
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: "Failed to delete course" });
  }
};

/**
 * @desc Toggle course like
 * @route PUT /api/courses/:id/like
 */
export const toggleCourseLike = async (req, res) => {
  try {
    const { id } = req.params;
    const snapshot = await coursesRef.child(id).once("value");
    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Course not found" });
    }

    const course = snapshot.val();
    const currentlyLiked = course.isLiked || false;
    const newIsLiked = !currentlyLiked;
    const newLikes = newIsLiked
      ? (course.likes || 0) + 1
      : Math.max(0, (course.likes || 0) - 1);

    await coursesRef.child(id).update({ likes: newLikes, isLiked: newIsLiked });
    res.status(200).json({ isLiked: newIsLiked, likes: newLikes });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ error: "Failed to toggle like" });
  }
};
