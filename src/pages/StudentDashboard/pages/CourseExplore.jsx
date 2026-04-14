import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { COURSE_MAP } from './data/extraCourses';
import './CourseExplore.css';

/* ── Topic key-points generator ── */
const getKeyPoints = (topic) => {
  if (topic.points) return topic.points;
  const title = topic.title.toLowerCase();
  if (title.includes('java') || title.includes('jvm')) return ['Understand the JVM (Java Virtual Machine) architecture and how it executes bytecode', 'Set up JDK 17+ and configure IntelliJ IDEA for Java development', 'Write, compile, and run your first Java program from the command line', 'Learn how Java achieves platform independence through "Write Once, Run Anywhere"'];
  if (title.includes('variable') || title.includes('data type')) return ['Distinguish between primitive types (int, char, boolean, double) and reference types', 'Understand how Java stores variables on the stack vs heap memory', 'Apply type casting (implicit and explicit) safely in Java programs', 'Use wrapper classes (Integer, Boolean, etc.) and understand autoboxing'];
  if (title.includes('control') || title.includes('loop')) return ['Write conditional logic using if-else and nested conditions', 'Implement for, while, and do-while loops for iteration', 'Use break and continue to control loop execution', 'Apply switch statements for multi-branch decision making'];
  if (title.includes('array') || title.includes('string')) return ['Declare and initialise single and multi-dimensional arrays', 'Traverse arrays using enhanced for-each loops', 'Apply common String methods: length(), substring(), indexOf(), equals()', 'Use StringBuilder for efficient mutable string operations'];
  if (title.includes('method') || title.includes('recursion')) return ['Define methods with parameters, return types, and proper naming conventions', 'Understand method overloading and when to apply it', 'Implement recursive methods and identify base cases', 'Analyse the call stack and avoid StackOverflow errors'];
  if (title.includes('exception')) return ['Distinguish between checked and unchecked exceptions', 'Use try-catch-finally blocks to handle runtime errors gracefully', 'Create custom exception classes by extending Exception', 'Apply best practices: do not swallow exceptions, use specific catch blocks'];
  if (title.includes('file') || title.includes('scanner') || title.includes('i/o')) return ['Read data from files using FileReader and BufferedReader', 'Write to files using FileWriter and BufferedWriter', 'Handle IOException with proper try-with-resources syntax', 'Accept user input at runtime using the Scanner class'];
  if (title.includes('package') || title.includes('access')) return ['Organise classes into meaningful package hierarchies', 'Apply access modifiers: public, private, protected, and package-private', 'Understand why encapsulation is a core OOP principle', 'Use static imports and wildcard imports appropriately'];
  if (title.includes('oop') || title.includes('class') || title.includes('object')) return ['Define classes with fields, constructors, and methods', 'Create and instantiate objects with the new keyword', 'Understand the four pillars of OOP: Encapsulation, Inheritance, Polymorphism, Abstraction', 'Differentiate between class (static) and instance members'];
  if (title.includes('encapsulation') || title.includes('inheritance')) return ['Protect class fields using private access and expose them via getters/setters', 'Use the extends keyword to create a class hierarchy', 'Understand method hiding vs method overriding', 'Call superclass constructors and methods using super keyword'];
  if (title.includes('polymorphism') || title.includes('abstraction')) return ['Override methods in subclasses to change runtime behaviour', 'Declare abstract classes and abstract methods', 'Implement interfaces to define behavioural contracts', 'Understand upcasting, downcasting, and the instanceof operator'];
  if (title.includes('collection')) return ['Choose the right collection: ArrayList, LinkedList, HashMap, HashSet, TreeMap', 'Iterate over collections using Iterator and enhanced for-each', 'Sort collections using Comparable and Comparator interfaces', 'Understand Big-O complexity for common collection operations'];
  if (title.includes('spring boot')) return ['Bootstrap a Spring Boot project using Spring Initializr', 'Create REST controllers with @RestController and @RequestMapping', 'Define service layers and inject dependencies with @Service and @Autowired', 'Configure application properties and understand auto-configuration'];
  if (title.includes('react') || title.includes('frontend')) return ['Set up a React project with Vite and connect to a Spring Boot backend', 'Create functional components and manage local state with useState', 'Fetch data from REST APIs using Axios or fetch()', 'Handle CORS configuration on the Spring Boot server'];
  if (title.includes('python') || title.includes('setup') || title.includes('install')) return ['Install Python 3.x and configure a virtual environment', 'Understand Python\'s indentation-based syntax and dynamic typing', 'Write and execute your first Python script from the terminal', 'Use pip to install and manage third-party packages'];
  if (title.includes('react') && title.includes('fundamental')) return ['Understand the Virtual DOM and how React efficiently updates the UI', 'Create functional components and pass data using props', 'Manage local state with the useState hook', 'Compose complex UIs by nesting simpler components'];
  if (title.includes('node') || title.includes('express')) return ['Understand the Node.js event-driven, non-blocking architecture', 'Create an Express.js server and define route handlers', 'Use middleware for logging, parsing, and error handling', 'Connect to MongoDB using Mongoose from an Express application'];
  if (title.includes('mongodb') || title.includes('mongoose')) return ['Design MongoDB schemas using Mongoose models', 'Perform CRUD operations with Mongoose (find, save, updateOne, deleteOne)', 'Set up indexes to optimise query performance', 'Understand document embedding vs referencing for relationships'];
  if (title.includes('docker') || title.includes('container')) return ['Write a Dockerfile with a multi-stage build for smaller images', 'Build, tag, and push Docker images to a container registry', 'Run containers with environment variables and volume mounts', 'Define multi-service stacks using Docker Compose'];
  if (title.includes('kubernetes') || title.includes('k8s')) return ['Understand Kubernetes architecture: nodes, pods, and control plane', 'Deploy applications using Deployment manifests and manage replicas', 'Expose applications internally and externally with Services', 'Configure applications using ConfigMaps and Secrets'];
  if (title.includes('ci/cd') || title.includes('jenkins') || title.includes('github action')) return ['Define pipeline stages: Build, Test, Deploy in a Jenkinsfile/workflow', 'Trigger pipelines automatically on Git push events', 'Run automated tests and publish test reports in CI', 'Deploy to a target environment on successful pipeline run'];
  if (title.includes('terraform')) return ['Write Terraform configuration files to provision cloud resources', 'Use variables, outputs, and modules for reusable infrastructure', 'Manage remote state with a Terraform backend (S3/Azure Blob)', 'Plan and apply infrastructure changes safely using terraform plan'];
  if (title.includes('aws') || title.includes('ec2') || title.includes('cloud')) return ['Understand the AWS Shared Responsibility Model for security', 'Launch and configure EC2 instances with appropriate instance types', 'Create IAM roles and policies following least-privilege principles', 'Monitor resources with CloudWatch metrics, logs, and alarms'];
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

  if (title.includes('java') && title.includes('intro')) {
    return {
      takeaways: [
        "Java code is compiled to Bytecode, not machine code",
        "The JVM provides platform independence (WORA)",
        "JRockit and HotSpot are common JVM implementations",
        "JDK includes JRE and development tools like javac"
      ],
      reference: "java -version, javac HelloWorld.java",
      context: "Used in 90% of Fortune 500 companies for backend systems due to its reliability and massive ecosystem."
    };
  }

  if (title.includes('variable')) {
    return {
      takeaways: [
        "Primitives: byte, short, int, long, float, double, char, boolean",
        "Stack memory for primitives, Heap for objects",
        "Strings are reference types but behave uniquely",
        "Final variables cannot be reassigned"
      ],
      reference: "int x = 10; float f = 10.5f; char c = 'A';",
      context: "Memory management in Java is handled by the Garbage Collector, making variable scope critical for performance."
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

  if (title.includes('java') && title.includes('intro')) {
    return `
      <div class="rich-reading-content">
        <section class="reading-section">
          <h3>1. The Evolution of Java & The JVM Ecosystem</h3>
          <p>Java's journey from a "Green Project" for consumer electronics to the backbone of enterprise software is legendary. Its primary innovation was the <strong>Java Virtual Machine (JVM)</strong>. Unlike C++, where programs are compiled directly into OS-specific machine code, Java compiles into platform-independent <strong>Bytecode</strong>.</p>
          <div class="info-callout">
            <strong>Key Insight:</strong> The JVM acts as a translation layer. As long as a device has a JVM installed, it can run any Java .class file, regardless of the underlying hardware.
          </div>
        </section>
        
        <section class="reading-section">
          <h3>2. Deep Dive: The Compilation Lifecycle</h3>
          <p>Understanding the path from a <code>.java</code> file to execution is crucial for debugging and optimization:</p>
          <ol>
            <li><strong>Development:</strong> You write source code in <code>.java</code> files.</li>
            <li><strong>Compilation:</strong> The <code>javac</code> compiler checks for syntax errors and generates <code>.class</code> files (Bytecode).</li>
            <li><strong>Loading:</strong> The <strong>ClassLoader</strong> loads the bytecode into the JVM memory.</li>
            <li><strong>Verification:</strong> The Bytecode Verifier ensures the code doesn't violate security constraints.</li>
            <li><strong>Execution:</strong> The <strong>Interpreter</strong> reads bytecode. For performance, the <strong>JIT (Just-In-Time) Compiler</strong> identifies "hot spots" and compiles them into native machine code.</li>
          </ol>
        </section>

        <section class="reading-section">
          <h3>3. Memory Management: Stack vs. Heap</h3>
          <p>Java manages memory automatically, but developers must understand where data lives:</p>
          <ul>
            <li><strong>Stack Memory:</strong> Stores local variables and method call frames. It is fast and follows LIFO (Last-In-First-Out).</li>
            <li><strong>Heap Memory:</strong> Stores all objects and instance variables. This is where the <strong>Garbage Collector (GC)</strong> operates, reclaiming memory from unused objects.</li>
          </ul>
        </section>
      </div>
    `;
  }

  if (title.includes('variable')) {
    return `
      <div class="rich-reading-content">
        <section class="reading-section">
          <h3>1. Data Types: Primitives & Memory Allocation</h3>
          <p>Java is a strictly typed language, meaning every piece of data has a predefined size and behavior. This prevents common errors like buffer overflows.</p>
          <table class="data-type-table">
            <thead>
              <tr><th>Type</th><th>Size</th><th>Range</th></tr>
            </thead>
            <tbody>
              <tr><td>byte</td><td>1 byte</td><td>-128 to 127</td></tr>
              <tr><td>int</td><td>4 bytes</td><td>-2^31 to 2^31-1</td></tr>
              <tr><td>double</td><td>8 bytes</td><td>Floating point numbers</td></tr>
            </tbody>
          </table>
        </section>
        
        <section class="reading-section">
          <h3>2. Reference Types vs. Primitives</h3>
          <p>When you create an object, the variable doesn't hold the object itself — it holds a <strong>reference</strong> (memory address) to where the object lives in the Heap. Primitives, however, store the actual numeric or boolean value directly on the Stack.</p>
          <div class="warning-callout">
            <strong>Danger Zone:</strong> Comparing reference types (like Strings) with <code>==</code> compares their memory addresses, not their content. Always use <code>.equals()</code> for content comparison.
          </div>
        </section>

        <section class="reading-section">
          <h3>3. Scope and Lifecycle</h3>
          <p>Variable scope determines visibility and lifetime. Variables declared inside a method (local) are destroyed when the method finishes. Instance variables (fields) live as long as their containing object exists.</p>
        </section>
      </div>
    `;
  }

  if (title.includes('control') || title.includes('loop')) {
    return `
      <div class="rich-reading-content">
        <section class="reading-section">
          <h3>1. Structural Logic: Branching & Selection</h3>
          <p>Decision making is the core of any algorithm. In Java, <code>if-else</code> blocks are best for range-based logic (e.g., <code>score > 90</code>), while <code>switch</code> expressions are optimized for equality checks against discrete constants.</p>
        </section>
        
        <section class="reading-section">
          <h3>2. Iteration Engineering: Selecting the Right Loop</h3>
          <p>Choosing the wrong loop can lead to performance bottlenecks or infinite recursion:</p>
          <ul>
            <li><strong>Deterministic (for):</strong> Use when the number of iterations is known (e.g., iterating over an array of 10 items).</li>
            <li><strong>Non-Deterministic (while):</strong> Use when the stop condition depends on external factors (e.g., reading lines from a file until EOF).</li>
          </ul>
        </section>

        <section class="reading-section">
          <h3>3. Optimization: Break and Continue</h3>
          <p>These jump statements provide granular control. <code>break</code> terminates the innermost loop, whereas <code>continue</code> skips to the next check. Overuse can make code harder to follow—always prefer clear exit conditions over frequent breaks.</p>
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
          <li><strong>Efficiency:</strong> How ${topic.title} impacts CPU and Memory utilization.</li>
          <li><strong>Decoupling:</strong> Applying the Single Responsibility Principle (SRP) to this logic.</li>
          <li><strong>Scalability:</strong> Ensuring the implementation can handle high-throughput scenarios.</li>
        </ul>
      </section>

      <section class="reading-section">
        <h3>Industry Implementation</h3>
        <p>${topic.content.replace(/<p>|<\/p>/g, '')}</p>
        <div class="info-callout">
          <strong>Best Practice:</strong> Always validate inputs and handle edge cases at the entry point of your ${topic.title} implementation.
        </div>
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

  const state = location.state;
  const courseId = (typeof state === 'string' ? state : state?.courseId) || 'java-fs-01';
  const course = COURSE_MAP[courseId] || COURSE_MAP['java-fs-01'];

  const [openModules, setOpenModules] = useState({});
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  const totalTopics = course.modules.reduce((sum, m) => sum + m.topics.length, 0);
  const totalModules = course.modules.length;

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
                          <div key={t.id} className="curr-topic-item">
                            <div className="curr-topic-header">
                              <div className="curr-topic-bullet"></div>
                              <h3 className="curr-topic-title">{t.title}</h3>
                            </div>
                          </div>
                        ))}
                      </div>

                      {m.assignment && (
                        <div className="curr-assignment-box">
                          <div className="curr-assignment-header">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                            Module Assignment
                          </div>
                          <p className="curr-assignment-desc">{m.assignment}</p>
                          <button className="curr-submit-btn">Mark as Completed</button>
                        </div>
                      )}
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