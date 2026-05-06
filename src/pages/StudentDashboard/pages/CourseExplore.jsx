import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCourseContext } from '../../../context/CourseContext';
import { parseCurriculum } from '../../../utils/courseUtils';
import './CourseExplore.css';

/* ── Topic key-points generator ── */
const getKeyPoints = (topic) => {
  if (topic.points) return topic.points;
  const title = topic.title.toLowerCase();
  
  // Java & Backend
  if (title.includes('java') || title.includes('jvm')) return ['Understand the JVM (Java Virtual Machine) architecture and how it executes bytecode', 'Set up JDK 17+ and configure IntelliJ IDEA for Java development', 'Write, compile, and run your first Java program from the command line', 'Learn how Java achieves platform independence through "Write Once, Run Anywhere"'];
  if (title.includes('spring') || title.includes('boot')) return ['Bootstrap a Spring Boot project using Spring Initializr', 'Create REST controllers with @RestController and @RequestMapping', 'Define service layers and inject dependencies with @Service and @Autowired', 'Configure application properties and understand auto-configuration'];
  
  // React & Next.js
  if (title.includes('react') && title.includes('fundamental')) return ['Understand the Virtual DOM and how React efficiently updates the UI', 'Create functional components and pass data using props', 'Manage local state with the useState hook', 'Compose complex UIs by nesting simpler components'];
  if (title.includes('next.js') || title.includes('nextjs')) return ['Master Server Components vs Client Components for optimal performance', 'Implement dynamic routing and nested layouts in the App Router', 'Optimise data fetching using fetch() with server-side caching', 'Deploy high-performance web apps to Vercel or custom servers'];
  
  // Angular
  if (title.includes('angular')) return ['Understand the Component-based architecture and Dependency Injection', 'Master Reactive Forms for complex data entry validation', 'Implement state management using NgRx or simple services', 'Build modular applications with feature modules and lazy loading'];

  // Mobile Dev (Flutter)
  if (title.includes('flutter') || title.includes('dart')) return ['Learn Dart programming language fundamentals for Flutter development', 'Master Widget-based UI construction: Stateless vs Stateful widgets', 'Implement cross-platform navigation and state management (Provider/Riverpod)', 'Build and deploy apps for both iOS and Android from a single codebase'];

  // Node & MERN
  if (title.includes('node') || title.includes('express')) return ['Understand the Node.js event-driven, non-blocking architecture', 'Create an Express.js server and define route handlers', 'Use middleware for logging, parsing, and error handling', 'Connect to MongoDB using Mongoose from an Express application'];
  if (title.includes('mongodb') || title.includes('mongoose')) return ['Design MongoDB schemas using Mongoose models', 'Perform CRUD operations with Mongoose (find, save, updateOne, deleteOne)', 'Set up indexes to optimise query performance', 'Understand document embedding vs referencing for relationships'];

  // Cloud & DevOps
  if (title.includes('aws') || title.includes('ec2') || title.includes('cloud')) return ['Understand the AWS Shared Responsibility Model for security', 'Launch and configure EC2 instances with appropriate instance types', 'Create IAM roles and policies following least-privilege principles', 'Monitor resources with CloudWatch metrics, logs, and alarms'];
  if (title.includes('docker') || title.includes('container')) return ['Write a Dockerfile with a multi-stage build for smaller images', 'Build, tag, and push Docker images to a container registry', 'Run containers with environment variables and volume mounts', 'Define multi-service stacks using Docker Compose'];
  
  // AI, Data Science & ML
  if (title.includes('ai') || title.includes('artificial') || title.includes('machine learning') || title.includes('deep learning')) return ['Understand the mathematical foundations and core principles of Artificial Intelligence', 'Differentiate between Supervised, Unsupervised, and Reinforcement Learning', 'Learn how Neural Networks mimic human brain functions to process complex data', 'Explore real-world applications and the ethical implications of AI development'];
  if (title.includes('nlp') || title.includes('language')) return ['Master text preprocessing techniques like tokenization, stemming, and lemmatization', 'Implement sentiment analysis models to determine emotional tone in text', 'Understand the architecture of modern Large Language Models (LLMs)', 'Build conversational agents and chatbots using advanced NLP libraries'];
  if (title.includes('vision') || title.includes('image')) return ['Understand digital image representation and basic processing techniques', 'Implement image classification models to identify objects in visual data', 'Learn about Object Detection and its applications in autonomous systems', 'Explore Face Recognition and biometric security architectures'];
  
  // Aptitude
  if (title.includes('aptitude') || title.includes('number system') || title.includes('percentage') || title.includes('ratio')) return ['Master speed math techniques and mental calculation shortcuts', 'Understand the underlying patterns and logical steps for each problem type', 'Practice with diverse difficulty levels to improve accuracy and speed', 'Learn to eliminate incorrect options quickly using estimation and unit digits'];
  
  return [
    `Understand the core concepts and motivation behind ${topic.title}`,
    `Apply the key techniques covered in this topic to real-world scenarios`,
    `Identify common pitfalls and how to avoid them`,
    `Complete the hands-on exercises to reinforce your understanding`,
  ];
};


/* ── Sidebar Data Generator ── */
const getSidebarData = (topic) => {
  const title = topic.title.toLowerCase();

  if (title.includes('java') || title.includes('spring')) {
    return {
      takeaways: ["Java uses platform-independent Bytecode", "JVM provides automatic memory management", "Spring Boot simplifies production-ready apps", "Dependency Injection is core to Spring Framework"],
      reference: "java -version, mvn spring-boot:run",
      context: "Powers massive enterprise backends for 90% of Fortune 500 companies."
    };
  }

  if (title.includes('react') || title.includes('next')) {
    return {
      takeaways: ["React components use a declarative approach", "Next.js App Router optimizes SEO and performance", "Server Components reduce client-side JS bundles", "State management with Hooks vs external stores"],
      reference: "npx create-next-app@latest",
      context: "Industry standard for high-performance, SEO-friendly web frontends."
    };
  }

  if (title.includes('flutter')) {
    return {
      takeaways: ["Flutter uses Dart for high-performance rendering", "The Skia engine ensures consistent UI across OS", "Hot Reload significantly accelerates development", "Everything in Flutter is a Widget"],
      reference: "flutter doctor, flutter run",
      context: "Primary choice for building native-feel cross-platform mobile apps."
    };
  }

  if (title.includes('ai') || title.includes('ml') || title.includes('deep learning')) {
    return {
      takeaways: ["AI mimics human cognition with statistics", "Neural networks learn patterns from raw data", "Deep Learning requires high compute power (GPUs)", "Data ethics are as critical as accuracy"],
      reference: "import tensorflow as tf; import torch",
      context: "The fastest growing technology field, transforming every modern industry."
    };
  }

  if (title.includes('cloud') || title.includes('aws')) {
    return {
      takeaways: ["Cloud offers on-demand scalability", "Infrastructure as Code (IaC) is industry standard", "Serverless computing reduces operational overhead", "Security is a shared responsibility model"],
      reference: "aws s3 ls, terraform apply",
      context: "Critical for modern scalable software architecture and DevOps pipelines."
    };
  }

  if (title.includes('aptitude')) {
    return {
      takeaways: ["Time management is the key to exam success", "Shortcuts reduce 2-min problems to 10 seconds", "Logic patterns recur across different domains", "Daily practice builds mental agility"],
      reference: "Ratio, Proportion, Digital Roots",
      context: "Foundational skill for all placements and competitive engineering exams."
    };
  }

  return {
    takeaways: [
      `Master the core syntax of ${topic.title}`,
      "Understand the underlying memory model",
      "Apply industry best practices for naming",
      "Implement error handling from the start"
    ],
    reference: `// Documentation for ${topic.title} implementation`,
    context: "Critical building block for building scalable, maintainable enterprise applications."
  };
};

/* ── Detailed Topic Content Generator ── */
const getDetailedContent = (topic) => {
  const title = topic.title.toLowerCase();

  // 1. AI & Machine Learning (Comprehensive)
  if (title.includes('ai') || title.includes('artificial intelligence') || title.includes('deep learning')) {
    return `
      <div class="rich-reading-content">
        <section class="reading-section">
          <h3>1. The Core Philosophy of Artificial Intelligence</h3>
          <p>Artificial Intelligence is the science of building systems that can <strong>reason, learn, and act</strong> autonomously. It seeks to automate cognitive tasks like perception, reasoning, and planning.</p>
          <div class="info-callout">
            <strong>Key Insight:</strong> AI has evolved from rule-based systems to data-driven learning models that discover patterns without explicit programming.
          </div>
        </section>
        <section class="reading-section">
          <h3>2. The Hierarchy: AI vs ML vs DL</h3>
          <ul>
            <li><strong>AI:</strong> The broad umbrella of mimicking human intelligence.</li>
            <li><strong>Machine Learning:</strong> A subset using statistical learning to improve from experience.</li>
            <li><strong>Deep Learning:</strong> Uses multi-layered Artificial Neural Networks (ANNs).</li>
          </ul>
        </section>
        <section class="reading-section">
          <h3>3. Real-World Applications & Ethics</h3>
          <p>AI powers autonomous driving, medical diagnosis, and generative models like LLMs. However, it raises critical ethical concerns regarding <strong>bias, transparency, and accountability</strong>.</p>
        </section>
      </div>
    `;
  }

  // 2. Next.js & React
  if (title.includes('next.js') || title.includes('react')) {
    return `
      <div class="rich-reading-content">
        <section class="reading-section">
          <h3>1. Modern Web Architecture with Next.js</h3>
          <p>Next.js simplifies React development by providing built-in routing, SSR (Server Side Rendering), and SSG (Static Site Generation). The <strong>App Router</strong> is the modern standard for structuring performant web apps.</p>
          <div class="info-callout">
            <strong>Performance Tip:</strong> Use Server Components by default to reduce the JavaScript sent to the client, improving page load speeds significantly.
          </div>
        </section>
        <section class="reading-section">
          <h3>2. Data Fetching Patterns</h3>
          <p>Next.js extends the standard <code>fetch</code> API to include automatic caching and revalidation, allowing you to build dynamic sites that feel as fast as static ones.</p>
        </section>
      </div>
    `;
  }

  // 3. Flutter & Mobile Dev
  if (title.includes('flutter') || title.includes('mobile')) {
    return `
      <div class="rich-reading-content">
        <section class="reading-section">
          <h3>1. Cross-Platform Excellence with Flutter</h3>
          <p>Flutter allows developers to build natively compiled applications for mobile, web, and desktop from a single codebase. It uses the <strong>Dart</strong> language and a unique rendering engine called <strong>Skia</strong>.</p>
          <div class="info-callout">
            <strong>The "Widget" Concept:</strong> In Flutter, everything is a widget—from the layout to the smallest icon. This composition-based UI makes it incredibly flexible.
          </div>
        </section>
        <section class="reading-section">
          <h3>2. State Management Strategies</h3>
          <p>Effective state management (using Provider, Riverpod, or Bloc) is crucial for building responsive mobile apps that handle user interactions and data updates smoothly.</p>
        </section>
      </div>
    `;
  }

  // 4. MERN & Node.js
  if (title.includes('mern') || title.includes('node') || title.includes('express')) {
    return `
      <div class="rich-reading-content">
        <section class="reading-section">
          <h3>1. The MERN Stack: Unified JavaScript Development</h3>
          <p>MERN (MongoDB, Express, React, Node) allows for full-stack development using a single language: JavaScript. This unification accelerates development and simplifies the tech stack.</p>
          <div class="info-callout">
            <strong>Non-Blocking I/O:</strong> Node.js uses an event loop to handle thousands of concurrent connections efficiently, making it ideal for data-intensive real-time applications.
          </div>
        </section>
      </div>
    `;
  }

  // 5. Aptitude & Reasoning
  if (title.includes('aptitude') || title.includes('logic')) {
    return `
      <div class="rich-reading-content">
        <section class="reading-section">
          <h3>1. Analytical Problem Solving</h3>
          <p>Aptitude testing measures your ability to solve complex problems using logic and math. It is a critical gateway for technical and management careers.</p>
          <div class="info-callout">
            <strong>Pro Strategy:</strong> Master "Digital Roots" and "Unit Digits" to verify mathematical answers in seconds without full calculation.
          </div>
        </section>
      </div>
    `;
  }

  // Generic deep fallback
  return `
    <div class="rich-reading-content">
      <section class="reading-section">
        <h3>Architecture of ${topic.title}</h3>
        <p>This module provides a comprehensive deep-dive into <strong>${topic.title}</strong>, focusing on the architectural patterns and implementation strategies used in large-scale enterprise environments.</p>
      </section>
      <section class="reading-section">
        <h3>Key Technical Pillars</h3>
        <ul>
          <li><strong>Efficiency:</strong> Optimized resource utilization.</li>
          <li><strong>Decoupling:</strong> Applying modular design principles.</li>
          <li><strong>Scalability:</strong> Built for high-throughput scenarios.</li>
        </ul>
      </section>
    </div>
  `;
};

/* ── Practice Lab Widget ── */
const PracticeWidget = () => {
  const starterCode = `public class EvenOdd {\n    public static void main(String[] args) {\n        int number = 42;\n        // Write your if-else logic here\n\n    }\n}`;
  const solution = `public class EvenOdd {\n    public static void main(String[] args) {\n        int number = 42;\n        if (number % 2 == 0) {\n            System.out.println(number + " is Even");\n        } else {\n            System.out.println(number + " is Odd");\n        }\n    }\n}`;
  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [solved, setSolved] = useState(false);
  const handleRun = () => {
    if (code.includes('%')) { setOutput('Output: 42 is Even\nCode executed successfully.'); setSolved(true); }
    else setOutput('Hint: Use the modulo operator (%) to check even or odd.');
  };
  return (
    <div className="practice-widget">
      <div className="practice-widget-header">
        <div className="practice-widget-left">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
          Professional Practice IDE
        </div>
        {solved && <span className="practice-solved-badge"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg> Solved</span>}
      </div>
      <div style={{ padding: '24px' }}>
        <p className="practice-question" style={{ padding: 0, marginBottom: '20px' }}>
          <strong>Task:</strong> Write a Java program that checks if the number 42 is <strong>even or odd</strong> and prints the result to the console.
        </p>
        <div className="code-editor-shell" style={{ margin: 0 }}>
          <div className="editor-topbar">
            <div className="editor-dots"><span style={{ background: '#ff5f56' }} /><span style={{ background: '#ffbd2e' }} /><span style={{ background: '#27c93f' }} /></div>
            <span className="editor-filename">EvenOdd.java</span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
              <button className="lv-btn lv-btn-sm" style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none' }} onClick={() => setShowSolution(!showSolution)}>{showSolution ? 'Hide Solution' : 'View Solution'}</button>
            </div>
          </div>
          <textarea className="code-textarea" value={showSolution ? solution : code} onChange={e => { if (!showSolution) setCode(e.target.value); }} rows={10} spellCheck={false} />
        </div>
        <div className="practice-actions" style={{ padding: '16px 0 0' }}>
          <button className="lv-btn lv-btn-primary lv-btn-sm" style={{ background: '#2563eb', color: 'white', borderColor: '#2563eb' }} onClick={handleRun}>Run Code</button>
          <button className="lv-btn lv-btn-outline lv-btn-sm" onClick={() => setCode(starterCode)}>Reset Editor</button>
        </div>
        {output && <div className={`output-terminal ${solved ? 'success' : 'warning'}`} style={{ margin: '16px 0 0' }}><pre>{output}</pre></div>}
      </div>
    </div>
  );
};

/* ── Main Component ── */
const CourseExplore = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { publishedCourses } = useCourseContext();
  const state = location.state;
  const courseId = (typeof state === 'string' ? state : state?.courseId);
  
  // 1. Find the course from publishedCourses
  const activeCourse = useMemo(() => {
    if (!publishedCourses || !courseId) return null;
    return publishedCourses.find(c => c.id === courseId || c.courseId === courseId);
  }, [publishedCourses, courseId]);

  // 2. Resolve final course object (prefer dynamic data, then fallback)
  const course = useMemo(() => {
    if (!activeCourse) return null;

    // If it has modules already (from static map), use them
    if (activeCourse.modules) return activeCourse;

    // Otherwise parse curriculum string
    return {
      ...activeCourse,
      modules: parseCurriculum(activeCourse.curriculum)
    };
  }, [activeCourse]);

  const [openModules, setOpenModules] = useState({});
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    if (state?.topicId && course?.modules) {
      const targetModule = course.modules.find(m => 
        m.topics.some(t => t.id === state.topicId)
      );
      if (targetModule) {
        setOpenModules(prev => ({ ...prev, [targetModule.id]: true }));
        // Delay scroll to allow accordion to open
        setTimeout(() => {
          const element = document.getElementById(`topic-${state.topicId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('highlight-topic');
          }
        }, 500);
      }
    }
  }, [state, course]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleModule = (id) =>
    setOpenModules(prev => ({ ...prev, [id]: !prev[id] }));

  const totalTopics = course?.modules?.reduce((sum, m) => sum + m.topics.length, 0) || 0;
  const totalModules = course?.modules?.length || 0;

  if (!course) {
    return (
      <div className="curr-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div className="ap-success-loader" />
      </div>
    );
  }

  return (
    <div className="curr-page">

      {/* ── TOP NAV & HERO ── */}
      <div className="curr-hero">
        <div className="curr-hero-inner">
          <div className="curr-hero-top-action">
            <button className="curr-back-action" onClick={() => navigate('/student-dashboard/courses')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              <span>Back to Courses</span>
            </button>
          </div>
          
          <div className="curr-hero-badge">
             <span className="pulse-dot"></span>
             Advanced Curriculum
          </div>
          
          <h1 className="curr-hero-title">
            <span style={{ color: '#2563eb' }}>{course.title || 'Course Overview'}</span>
          </h1>
          <p className="curr-hero-sub">{course.description || 'Master every concept through structured modules designed by industry experts.'}</p>
          
          <div className="curr-hero-stats">
            <div className="curr-stat">
              <div className="curr-stat-icon blue">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
              </div>
              <div>
                <div className="curr-stat-val">{totalModules}</div>
                <div className="curr-stat-label">Modules</div>
              </div>
            </div>
            <div className="curr-stat">
              <div className="curr-stat-icon green">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
              </div>
              <div>
                <div className="curr-stat-val">{totalTopics}</div>
                <div className="curr-stat-label">Topics</div>
              </div>
            </div>
            <div className="curr-stat">
              <div className="curr-stat-icon purple">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <div>
                <div className="curr-stat-val">Self-paced</div>
                <div className="curr-stat-label">Learning</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MODULE ACCORDION ── */}
      <div className="curr-body">
        <div className="curr-container">
          <div className="curr-section-label">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Complete Syllabus
          </div>

          <div className="curr-accordion">
            {course.modules.map((m, mIdx) => {
              const isOpen = !!openModules[m.id];
              const topics = m.topics || [];

              return (
                <div key={m.id} className={`curr-module ${isOpen ? 'open' : ''}`}>
                  <button className="curr-module-header" onClick={() => toggleModule(m.id)}>
                    <div className="curr-module-left">
                      <div className="curr-module-number">
                        {mIdx + 1}
                      </div>
                      <div className="curr-module-info">
                        <span className="curr-module-label" style={{ color: m.color || '#374151' }}>{m.label}</span>
                        <h2 className="curr-module-title">{m.subtitle}</h2>
                        <span className="curr-module-meta">{m.duration} • {m.topics.length} Topics</span>
                      </div>
                    </div>
                    <div className={`curr-chevron ${isOpen ? 'open' : ''}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                  </button>
                  <div className={`curr-module-body-wrapper ${isOpen ? 'open' : ''}`}>
                    <div className="curr-module-body">
                      <div className="curr-topics-header">
                        Learning Content
                      </div>
                      <div className="curr-topics-list">
                        {m.topics.map((t) => (
                          <div 
                            key={t.id} 
                            id={`topic-${t.id}`}
                            className={`curr-topic-item ${state?.topicId === t.id ? 'highlight-topic' : ''}`}
                          >
                            <div className="curr-topic-header">
                              <div className="curr-topic-bullet"></div>
                              <h3 className="curr-topic-title">{t.title}</h3>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Module Assignment removed per request */}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Scroll Top Button */}
      {showScrollTop && (
        <button className="curr-scroll-top" onClick={scrollToTop} title="Scroll to top">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
        </button>
      )}

    </div>
  );
};

export default CourseExplore;