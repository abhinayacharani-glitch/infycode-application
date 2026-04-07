import React, { useState } from 'react';
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

  // Handle state being either a string (courseId) or an object ({ courseId, topicId })
  const state = location.state;
  const courseId = (typeof state === 'string' ? state : state?.courseId) || 'java-fs-01';
  const course = COURSE_MAP[courseId] || COURSE_MAP['java-fs-01'];

  const [openModules, setOpenModules] = useState({ [course.modules[0].topics[0].id]: true });
  const [finalOpen, setFinalOpen] = useState(false);


  const [activeContent, setActiveContent] = useState(() => {
    const passedTopicId = typeof state === 'object' ? state?.topicId : null;
    if (passedTopicId) {
      for (let mIdx = 0; mIdx < course.modules.length; mIdx++) {
        const topicIdx = course.modules[mIdx].topics.findIndex(t => t.id === passedTopicId);
        if (topicIdx !== -1) {
          return {
            type: 'topic_content',
            moduleId: course.modules[mIdx].id,
            topicId: passedTopicId,
            topicIndex: topicIdx,
            moduleIndex: mIdx,
          };
        }
      }
    }
    return {
      type: 'topic_content',
      moduleId: course.modules[0].id,
      topicId: course.modules[0].topics[0].id,
      topicIndex: 0,
      moduleIndex: 0,
    };
  });

  const [completedSet, setCompletedSet] = useState(() => {
    const saved = localStorage.getItem(`course_progress_${courseId}`);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  /* Sync progress back to localStorage whenever completedSet changes */
  React.useEffect(() => {
    localStorage.setItem(`course_progress_${courseId}`, JSON.stringify(Array.from(completedSet)));
  }, [completedSet, courseId]);

  /* Deep linking effect */
  React.useEffect(() => {
    const tid = typeof state === 'object' ? state?.topicId : null;
    if (tid) {
      course.modules.forEach((m, mIdx) => {
        const tIdx = m.topics.findIndex(t => t.id === tid);
        if (tIdx !== -1) {
          goTo({ type: 'topic_content', moduleId: m.id, topicId: tid, moduleIndex: mIdx, topicIndex: tIdx });
        }
      });
    }
  }, [location.state?.topicId]);

  const toggleModule = (modId) => setOpenModules(prev => ({ ...prev, [modId]: !prev[modId] }));

  const activeModule = course.modules.find(m => m.id === activeContent.moduleId);
  const activeTopic = activeModule?.topics?.find(t => t.id === activeContent.topicId);
  const isFinal = activeContent.type === 'final';

  const isFirstTopicGlobally = (mi, ti) => mi === 0 && ti === 0;
  const contentKey = (type, modId, topicId) => `${type}::${modId}::${topicId}`;

  const navList = [];
  course.modules.forEach((m, mIdx) => {
    m.topics.forEach((t, tIdx) => {
      navList.push({ type: 'topic_content', moduleId: m.id, topicId: t.id, moduleIndex: mIdx, topicIndex: tIdx });
      if (isFirstTopicGlobally(mIdx, tIdx))
        navList.push({ type: 'topic_practice', moduleId: m.id, topicId: t.id, moduleIndex: mIdx, topicIndex: tIdx });
      navList.push({ type: 'topic_assignment', moduleId: m.id, topicId: t.id, moduleIndex: mIdx, topicIndex: tIdx });
    });
  });
  navList.push({ type: 'final', moduleId: 'final', topicId: 'final', moduleIndex: -1, topicIndex: -1 });

  const currentNavIdx = navList.findIndex(
    n => n.type === activeContent.type && n.moduleId === activeContent.moduleId && n.topicId === activeContent.topicId
  );

  const goTo = (n) => {
    setActiveContent(n);
    if (n.type !== 'final') {
      setOpenModules(prev => ({ ...prev, [n.topicId]: true }));
    }
  };
  const handlePrev = () => { if (currentNavIdx > 0) goTo(navList[currentNavIdx - 1]); };
  const handleNext = () => { if (currentNavIdx < navList.length - 1) goTo(navList[currentNavIdx + 1]); };

  const handleSetActive = (type, moduleId, topicId, mIdx, tIdx) => {
    goTo({ type, moduleId, topicId, moduleIndex: mIdx, topicIndex: tIdx });
  };

  /* Mark complete AND auto-navigate to next */
  const handleMarkComplete = () => {
    const key = isFinal ? 'final::final::final' : contentKey(activeContent.type, activeContent.moduleId, activeContent.topicId);
    setCompletedSet(prev => new Set([...prev, key]));

    // If not already done, show green state for a moment before navigating
    if (!currentIsDone && currentNavIdx < navList.length - 1) {
      setTimeout(() => {
        goTo(navList[currentNavIdx + 1]);
      }, 600);
    } else if (currentNavIdx < navList.length - 1) {
      // If already done, navigate immediately
      goTo(navList[currentNavIdx + 1]);
    }
  };


  const isDone = (type, modId, topicId) => {
    if (isFinal) return completedSet.has('final::final::final');
    return completedSet.has(contentKey(type, modId, topicId));
  };
  const currentIsDone = isFinal
    ? completedSet.has('final::final::final')
    : completedSet.has(contentKey(activeContent.type, activeContent.moduleId, activeContent.topicId));

  const progress = Math.round((completedSet.size / navList.length) * 100);

  return (
    <div className="lv-root">
      {/* ─── OUTPUTS MODAL ─── */}


      {/* ─── SIDEBAR ─── */}
      <aside className="lv-sidebar">
        <div className="lv-sidebar-header">
          <button className="lv-back-btn" onClick={() => navigate('/student-dashboard/courses')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
            Back to Courses
          </button>

          <div className="lv-sidebar-tabs">
            <button className="lv-tab active">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
              Curriculum
            </button>
          </div>

          <div className="lv-progress-container">
            <div className="lv-progress-info">
              <span className="lv-progress-label">Course Progress</span>
              <span className="lv-progress-percentage">{progress}%</span>
            </div>
            <div className="lv-progress-track">
              <div className="lv-progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>

        <div className="lv-curriculum">
          <div className="lv-section-label">COURSE CONTENT</div>

          {(() => {
            let globalModIndex = 1;
            return course.modules.flatMap((m) =>
              m.topics.map((t, tIdx) => {
                const currentModId = t.id;
                const isModOpen = !!openModules[currentModId];
                const isTopicActive = activeContent.topicId === t.id && activeContent.type === 'topic_content';
                const learningPoints = getKeyPoints(t);

                return (
                  <div key={t.id} className={`lv-module-block-wrapper ${isModOpen ? 'is-expanded' : ''} ${isTopicActive ? 'is-active-module' : ''}`}>
                    <button className={`lv-module-header ${isModOpen ? 'is-open' : ''}`} onClick={() => toggleModule(currentModId)}>
                      <div className="lv-module-header-text">
                        <span className="lv-module-title">Module {globalModIndex++}: {t.title}</span>
                      </div>
                      <svg className={`lv-module-chevron ${isModOpen ? 'rotated' : ''}`} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                    </button>

                    {isModOpen && (
                      <div className="lv-module-dropdown-content">
                        {/* Auto-load theory if module is clicked (optional but helpful) */}
                        <ul className="lv-topic-list">
                          {learningPoints.map((point, pIdx) => (
                            <li key={pIdx} className="lv-topic-li">
                              <button
                                className="lv-topic-link"
                                onClick={() => handleSetActive('topic_content', m.id, t.id, course.modules.indexOf(m), tIdx)}
                              >
                                <span className="lv-bullet" style={{ minWidth: '18px' }}>{pIdx + 1}.</span>
                                <span className="lv-topic-name">{point}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })
            );
          })()}

          {/* Final Assignment */}
          <div className="lv-module-block-wrapper final-project-wrapper">
            <button className={`lv-module-header ${finalOpen ? 'is-open' : ''}`} onClick={() => setFinalOpen(!finalOpen)}>
              <div className="lv-module-header-text">
                <span className="lv-module-title">Final Assignment</span>
              </div>
              <svg className={`lv-module-chevron ${finalOpen ? 'rotated' : ''}`} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
            </button>
            {finalOpen && (
              <div className="lv-module-dropdown-content">
                <ul className="lv-topic-list">
                  <li className="lv-topic-li">
                    <button
                      className={`lv-topic-link ${activeContent.type === 'final' ? 'is-active' : ''}`}
                      onClick={() => setActiveContent({ type: 'final', moduleId: 'final', topicId: 'final' })}
                    >
                      <span className="lv-bullet">•</span>
                      <span className="lv-topic-name">Take Assignment</span>
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main className="lv-main">
        <div className="lv-main-header">
          {(() => {
            if (isFinal) return <div className="lv-mod-badge" style={{ color: '#f59e0b', background: '#fffbeb' }}>Final Assessment</div>;

            // Find global index of active topic
            let gIdx = 0;
            let currentModFound = false;
            for (const m of course.modules) {
              for (const t of m.topics) {
                gIdx++;
                if (t.id === activeContent.topicId) {
                  currentModFound = true;
                  break;
                }
              }
              if (currentModFound) break;
            }

            return (
              <div className="lv-mod-badge" style={{ color: activeModule?.color || '#2563eb', background: `${activeModule?.color || '#2563eb'}18` }}>
                Module {gIdx}: {activeTopic?.title}
              </div>
            );
          })()}

          <h1 className="lv-main-title">
            {isFinal ? (course.finalAssignment.title || "Final Project Capstone") : activeTopic?.title || 'Select a topic'}
          </h1>
          {!isFinal && (
            <span className="lv-view-label">
              {activeContent.type === 'topic_content' && 'Reading Material'}
              {activeContent.type === 'topic_practice' && 'Practice Lab'}
              {activeContent.type === 'topic_assignment' && 'Assignment'}
            </span>
          )}

          <div className="lv-main-header-actions" style={{ marginLeft: 'auto', display: 'flex', gap: '10px', alignItems: 'center' }}>
          </div>
        </div>

        <div className="lv-main-body">
          {/* Topic Content */}
          {activeContent.type === 'topic_content' && activeTopic && (
            <div className="lv-reading-grid">
              <div className="lv-reading-main">
                <div className="lv-reading-card">
                  <div className="lv-reading-material">
                    <div className="lv-depth-section">
                      <h3 className="lv-depth-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                        Reading Material
                      </h3>
                      <p className="lv-topic-intro">
                        This session covers the core essentials of <strong>{activeTopic.title}</strong>, providing you with a deep understanding of its architecture and practical implementation.
                      </p>
                      <div className="lv-topic-rich-content" dangerouslySetInnerHTML={{ __html: getDetailedContent(activeTopic) }} />
                    </div>

                    <p className="lv-content-footer">
                      Professional Course Material · Last Updated March 2026
                    </p>
                  </div>
                </div>
              </div>

              {/* Clear Learn Sidebar */}
              <div className="lv-reading-sidebar">
                {(() => {
                  const sidebar = getSidebarData(activeTopic);
                  return (
                    <div className="lv-sidebar-block">
                      <div className="lv-sb-section">
                        <h4 className="lv-sb-title">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                          Key Takeaways
                        </h4>
                        <ul className="lv-sb-list">
                          {sidebar.takeaways.map((t, i) => <li key={i}>{t}</li>)}
                        </ul>
                      </div>

                      <div className="lv-sb-divider" />

                      <div className="lv-sb-section">
                        <h4 className="lv-sb-title">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></svg>
                          Quick Reference
                        </h4>
                        <div className="lv-sb-code">
                          <code>{sidebar.reference}</code>
                        </div>
                      </div>

                      <div className="lv-sb-divider" />

                      <div className="lv-sb-section">
                        <h4 className="lv-sb-title">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                          Industry Context
                        </h4>
                        <p className="lv-sb-text">{sidebar.context}</p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {activeContent.type === 'topic_practice' && <PracticeWidget />}

          {activeContent.type === 'topic_assignment' && activeTopic && (
            <div className="lv-assignment-card">
              <div className="lv-ac-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                <h4>Assignment Task: {activeTopic.title}</h4>
              </div>
              <div className="lv-ac-body">
                <div className="lv-ac-module-note">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                  This assignment accounts for 15% of your module score. Please ensure your solution follows the course coding standards and best practices.
                </div>

                <div className="lv-assignment-code-section">
                  <div className="practice-widget">
                    <div className="practice-widget-header">
                      <div className="practice-widget-left">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
                        <span>Professional Assignment IDE</span>
                      </div>
                    </div>

                    <div style={{ padding: '24px' }}>
                      <p className="practice-question" style={{ padding: 0, marginBottom: '20px' }}>
                        <strong>Assignment Specification:</strong> Implement the solution requirements for "{activeTopic.title}". Your solution will be evaluated based on efficiency, readability, and adherence to requirements.
                      </p>

                      <div className="code-editor-shell" style={{ margin: 0 }}>
                        <div className="editor-topbar">
                          <div className="editor-dots"><span style={{ background: '#ff5f56' }} /><span style={{ background: '#ffbd2e' }} /><span style={{ background: '#27c93f' }} /></div>
                          <span className="editor-filename">Solution.java</span>
                        </div>
                        <textarea
                          className="code-textarea"
                          defaultValue={'// Write your professional solution here...\n\npublic class Solution {\n    public static void main(String[] args) {\n        \n    }\n}'}
                          spellCheck="false"
                          rows={12}
                        />
                      </div>

                      <div className="practice-actions" style={{ padding: '16px 0 0' }}>
                        <button className="lv-btn lv-btn-primary lv-btn-sm" style={{ background: '#2563eb', color: 'white', borderColor: '#2563eb' }} onClick={() => alert('Running tests...')}>Run Tests</button>
                        <button className="lv-btn lv-btn-success lv-btn-sm" onClick={() => alert('Solution submitted successfully!')}>Submit Solution</button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Final Assessment */}
          {isFinal && (
            <div className="lv-final-view">
              <div className="lv-final-hero">
                <div className="lv-final-badge">FINAL ASSESSMENT</div>
                <h2>{course.finalAssignment.title || "Capstone Project Implementation"}</h2>
                <p>{course.finalAssignment.description}</p>
              </div>
              <div className="lv-final-body" style={{ display: 'block' }}>
                <div className="lv-final-action-area" style={{ padding: '48px', textAlign: 'center', alignItems: 'center' }}>
                  <div style={{ background: '#f0f9ff', padding: '24px', borderRadius: '50%', marginBottom: '24px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0369a1" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M9 15l2 2 4-4" /></svg>
                  </div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Final Course Assignment</h3>
                  <p style={{ maxWidth: '480px', margin: '0 auto 32px', fontSize: '1rem' }}>
                    This final assessment evaluates your proficiency across all modules. You will be required to implement a full-stack solution based on the course requirements.
                  </p>

                  <button className="lv-take-assessment-btn" style={{ maxWidth: '320px' }} onClick={() => alert('Assessment environment will open here.')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
                    Take Assignment
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <footer className="lv-action-bar">
          <button className="lv-btn lv-btn-outline" onClick={handlePrev} disabled={currentNavIdx === 0}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
            Previous
          </button>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              className={`lv-btn ${currentIsDone ? 'lv-btn-done' : 'lv-btn-primary'}`}
              onClick={handleMarkComplete}
            >
              {currentIsDone ? (
                <><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg> Completed & Next</>
              ) : (
                'Mark as Complete & Next'
              )}
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default CourseExplore;
