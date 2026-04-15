import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { COURSE_MAP } from './data/extraCourses';
import icLogo from '../../../assets/infycode-final-logo4-1.png';
import bannerLogo from '../../../assets/color-logo-3.png';
import { 
  ChevronLeft, 
  ChevronDown, 
  ChevronRight, 
  User, 
  BookOpen, 
  Clock, 
  Target, 
  CheckCircle2,
  Calendar,
  Hash,
  ArrowRight,
  Zap,
  Layers,
  Award,
  Notebook,
  Book,
  Cloud
} from 'lucide-react';
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

        <section class="reading-section ce-examples-section">
          <h3>Practical Examples</h3>
          <div class="ce-example-box">
            <div class="ce-example-header">Check Java Installation</div>
            <pre class="ce-code-block"><code>$ java -version\njava version "17.0.1" 2021-10-19 LTS\nJava(TM) SE Runtime Environment (build 17.0.1+12-LTS-39)</code></pre>
            <div class="ce-example-header">Compile and Run HelloWorld</div>
            <pre class="ce-code-block"><code>// HelloWorld.java\npublic class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, InfyCode!");\n    }\n}\n\n$ javac HelloWorld.java\n$ java HelloWorld\nHello, InfyCode!</code></pre>
          </div>
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

        <section class="reading-section ce-examples-section">
          <h3>Practical Examples</h3>
          <div class="ce-example-box">
            <div class="ce-example-header">Declaring Variables</div>
            <pre class="ce-code-block"><code>int age = 25; // Simple integer\ndouble salary = 55000.50; // Floating point\nboolean isCloudReady = true; // Boolean logic\nchar grade = 'A'; // Single character</code></pre>
            <div class="ce-example-header">Working with Wrapper Classes</div>
            <pre class="ce-code-block"><code>Integer myInt = 100; // Autoboxing\nint val = myInt; // Unboxing\nString numStr = "500";\nint converted = Integer.parseInt(numStr); // Parsing</code></pre>
          </div>
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

        <section class="reading-section ce-examples-section">
          <h3>Practical Examples</h3>
          <div class="ce-example-box">
            <div class="ce-example-header">If-Else Example</div>
            <pre class="ce-code-block"><code>int score = 85;\nif (score >= 90) {\n    System.out.println("Grade: A+");\n} else if (score >= 80) {\n    System.out.println("Grade: A");\n} else {\n    System.out.println("Keep learning!");\n}</code></pre>
            <div class="ce-example-header">For-Loop (Iteration)</div>
            <pre class="ce-code-block"><code>for (int i = 1; i <= 5; i++) {\n    System.out.println("Processing Batch #" + i);\n}</code></pre>
          </div>
        </section>
      </div>
    `;
  }

  if (title.includes('react') || title.includes('jsx') || title.includes('hook')) {
    return `
      <div class="rich-reading-content">
        <section class="reading-section">
          <h3>Architecture of ${topic.title}</h3>
          <p>This module focuses on building dynamic user interfaces using ${topic.title}. We explore the component-based architecture and how React manages the lifecycle of your application.</p>
        </section>

        <section class="reading-section ce-examples-section">
          <h3>Practical Examples</h3>
          <div class="ce-example-box">
            <div class="ce-example-header">Functional Component with State</div>
            <pre class="ce-code-block"><code>import React, { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>Click count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>Increment</button>\n    </div>\n  );\n}</code></pre>
            <div class="ce-example-header">Mapping Data to UI</div>
            <pre class="ce-code-block"><code>const courses = ['Java', 'React', 'Python'];\n\nreturn (\n  <ul>\n    {courses.map(course => (\n      <li key={course}>{course}</li>\n    ))}\n  </ul>\n);</code></pre>
          </div>
        </section>
      </div>
    `;
  }

  if (title.includes('python') || title.includes('numpy') || title.includes('pandas')) {
    return `
      <div class="rich-reading-content">
        <section class="reading-section">
          <h3>Data Engineering with ${topic.title}</h3>
          <p>Mastering ${topic.title} is essential for modern data engineering and financial modeling. We cover efficient syntax and powerful libraries for data manipulation.</p>
        </section>

        <section class="reading-section ce-examples-section">
          <h3>Practical Examples</h3>
          <div class="ce-example-box">
            <div class="ce-example-header">Python List Comprehension</div>
            <pre class="ce-code-block"><code># Create a list of squares\nnumbers = [1, 2, 3, 4, 5]\nsquares = [n**2 for n in numbers]\nprint(squares) # Output: [1, 4, 9, 16, 25]</code></pre>
            <div class="ce-example-header">Pandas DataFrame Basics</div>
            <pre class="ce-code-block"><code>import pandas as pd\n\ndata = {'Course': ['Java', 'Python'], 'Level': ['Expert', 'Advanced']}\ndf = pd.DataFrame(data)\nprint(df.head())</code></pre>
          </div>
        </section>
      </div>
    `;
  }

  if (title.includes('ai') || title.includes('transformer') || title.includes('llm')) {
    return `
      <div class="rich-reading-content">
        <section class="reading-section">
          <h3>Generative AI: ${topic.title}</h3>
          <p>Understanding ${topic.title} allows you to build next-generation intelligent applications. We explore prompt engineering and agentic workflows.</p>
        </section>

        <section class="reading-section ce-examples-section">
          <h3>Practical Examples</h3>
          <div class="ce-example-box">
            <div class="ce-example-header">LLM Prompt Template</div>
            <pre class="ce-code-block"><code># Example of a system prompt\nsystem_prompt = """\nYou are an expert coding assistant.\nHelp the user solve their programming task efficiently.\n"""\n\nuser_input = "Write a React hook for fetching data."</code></pre>
          </div>
        </section>
      </div>
    `;
  }

  if (title.includes('aws') || title.includes('cloud') || title.includes('deployment')) {
    return `
      <div class="rich-reading-content">
        <section class="reading-section">
          <h3>Cloud Infrastructure: ${topic.title}</h3>
          <p>Deploying and scaling applications on the cloud is a critical skill. ${topic.title} covers the core services needed for resilient architecture.</p>
        </section>

        <section class="reading-section ce-examples-section">
          <h3>Practical Examples</h3>
          <div class="ce-example-box">
            <div class="ce-example-header">AWS CLI - List Bucket Contents</div>
            <pre class="ce-code-block"><code>$ aws s3 ls s3://my-infycode-assets/\n2026-04-15 10:00:00        1024 index.html\n2026-04-15 10:00:05        4096 styles.css</code></pre>
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
          <li><strong>Efficiency:</strong> How ${topic.title} impacts CPU and Memory utilization.</li>
          <li><strong>Decoupling:</strong> Applying the Single Responsibility Principle (SRP) to this logic.</li>
          <li><strong>Scalability:</strong> Ensuring the implementation can handle high-throughput scenarios.</li>
        </ul>
      </section>

      <section class="reading-section">
        <h3>Industry Implementation</h3>
        <p>${(topic.content || 'Detailed research and implementation documentation for this topic is currently being refined to meet enterprise standards.').replace(/<p>|<\/p>/g, '')}</p>
        <div class="info-callout">
          <strong>Best Practice:</strong> Always validate inputs and handle edge cases at the entry point of your ${topic.title} implementation.
        </div>
      </section>

      <section class="reading-section ce-examples-section">
        <h3>Practical Examples</h3>
        <div class="ce-example-box">
          <div class="ce-example-header">Standard Implementation for ${topic.title}</div>
          <p>Implementation examples and industry-standard boilerplate for <strong>${topic.title}</strong> are being integrated. Check the project documentation for early-access snippets.</p>
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


/* ── Sidebar Data Logic ── */
const groupTopicsInThree = (topics) => {
  if (!topics || topics.length === 0) return [];
  const chunkSize = Math.ceil(topics.length / 3);
  const titles = ["Core Fundamentals", "Logic & Advanced Patterns", "Integration & Mastery"];
  
  return [
    { title: titles[0], subtopics: topics.slice(0, chunkSize) },
    { title: titles[1], subtopics: topics.slice(chunkSize, chunkSize * 2) },
    { title: titles[2], subtopics: topics.slice(chunkSize * 2) },
  ].filter(group => group.subtopics.length > 0);
};

/* ── Main Component ── */
const CourseExplore = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve user info for the profile card with safe parsing
  let user = { fullname: "Student", email: "student@infycode.com" };
  try {
    const userString = localStorage.getItem('user');
    if (userString) user = JSON.parse(userString);
  } catch (err) {
    console.error("Dashboard: Error parsing user state", err);
  }
  const userInitial = (user.fullname || user.fullName || "S").charAt(0).toUpperCase();

  // Safe access to state with fallbacks
  const { courseId = 'cid-108', courseTitle, category } = location.state || {};
  
  const course = COURSE_MAP[courseId];
  
  // State for curriculum exploration
  const [activeSubtopic, setActiveSubtopic] = useState(null);
  const [openLevels, setOpenLevels] = useState({});
  const [openMainTopics, setOpenMainTopics] = useState({});

  // Reset exploration when course changes
  useEffect(() => {
    setActiveSubtopic(null);
    setOpenLevels({ beginner: true });
    setOpenMainTopics({});
  }, [courseId]);

  // If course not found in map, we'll show a fallback or basic info
  const displayTitle = course?.title || courseTitle || "Explore Course";
  const displayDesc = course?.description || "Curriculum details for this professional certification are being finalized.";

  const toggleLevel = (lvlId) => setOpenLevels(prev => ({ ...prev, [lvlId]: !prev[lvlId] }));
  const toggleMainTopic = (key) => setOpenMainTopics(prev => ({ ...prev, [key]: !prev[key] }));

  const handleSubtopicClick = (subtopic, levelId, mainTopicTitle) => {
    setActiveSubtopic({
      ...subtopic,
      levelId,
      mainTopicTitle
    });
  };

  const resetToOverview = () => setActiveSubtopic(null);

  // Handle empty or missing modules (Coming Soon state)
  const hasCurriculum = course?.modules && course.modules.length > 0;

  return (
    <div className="lv-root">
      {/* ─── SIDEBAR ─── */}
      <aside className="lv-sidebar">
        {/* BRAND SECTION */}
        <div className="ce-sidebar-brand">
          <div className="ce-logo-wrap">
            <img src={icLogo} alt="logo" className="ce-logo-icon" />
            <div className="ce-brand-text">
              <img src={bannerLogo} alt="InfyCode" className="ce-logo-banner" />
            </div>
          </div>
        </div>

        {/* USER PROFILE SECTION */}
        <Link to="/student-dashboard/profile" className="ce-user-profile-link">
          <div className="ce-user-profile">
            <div className="ce-avatar">{userInitial}</div>
            <div className="ce-user-info">
              <div className="ce-user-name">{user.fullname || user.fullName || "Student"}</div>
              <div className="ce-user-email">{user.email || "student@gmail.com"}</div>
            </div>
          </div>
        </Link>


        <div className="lv-curriculum-modern">
          <div className="lv-section-label">COURSE SYLLABUS</div>
          
          {hasCurriculum ? (
            course.modules.map((level) => {
              const isLvlOpen = !!openLevels[level.id];
              const mainTopicGroups = level.mainTopicGroups || groupTopicsInThree(level.topics);
              
              const levelConfig = {
                beginner: { color: '#f97316', icon: <Zap size={16} />, label: 'Beginner Level' },
                intermediate: { color: '#3b82f6', icon: <Target size={16} />, label: 'Intermediate Level' },
                advanced: { color: '#8b5cf6', icon: <Award size={16} />, label: 'Advanced Level' }
              }[level.id] || { color: '#64748b', icon: <BookOpen size={16} />, label: level.title };

              return (
                <div 
                  key={level.id} 
                  className={`ce-level-block ${isLvlOpen ? 'is-open' : ''}`}
                  style={{ '--level-accent': levelConfig.color }}
                >
                  <button 
                    className="ce-level-header" 
                    onClick={() => toggleLevel(level.id)}
                  >
                    <div className="ce-level-title-wrap">
                      <span className="ce-level-symbol" style={{ color: levelConfig.color }}>
                        {levelConfig.icon}
                      </span>
                      <div className="ce-level-text-stack">
                        <span className="ce-level-title">{levelConfig.label}</span>
                        <span className="ce-level-duration">{level.duration || "4 Weeks"}</span>
                      </div>
                    </div>
                    <ChevronDown size={18} className={`ce-lvl-chevron ${isLvlOpen ? 'rotated' : ''}`} />
                  </button>

                  {isLvlOpen && (
                    <div className="ce-level-content">
                      {mainTopicGroups.map((group, gIdx) => {
                        const groupKey = `${level.id}-${gIdx}`;
                        const isGroupOpen = !!openMainTopics[groupKey];
                        return (
                          <div key={groupKey} className="ce-topic-group">
                            <button className={`ce-topic-group-header ${isGroupOpen ? 'is-open' : ''}`} onClick={() => toggleMainTopic(groupKey)}>
                              <Book size={14} className="ce-topic-group-icon" />
                              <span className="ce-topic-group-title">{group.title}</span>
                              <ChevronRight size={14} className={`ce-topic-chevron ${isGroupOpen ? 'rotated' : ''}`} />
                            </button>

                            {isGroupOpen && (
                              <div className="ce-subtopic-list">
                                {group.subtopics.map((sub, sIdx) => {
                                  const isActive = activeSubtopic?.id === sub.id;
                                  return (
                                    <button 
                                      key={sub.id} 
                                      className={`ce-subtopic-item ${isActive ? 'active' : ''}`}
                                      onClick={() => handleSubtopicClick(sub, level.id, group.title)}
                                    >
                                      <BookOpen size={14} className="ce-subtopic-icon" />
                                      <div className="ce-subtopic-text-stack">
                                        <span className="ce-subtopic-title">{sub.title}</span>
                                        <span className="ce-subtopic-duration">{sub.duration || "15 min"}</span>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="ce-curriculum-placeholder">
              <div className="ce-placeholder-icon"><Cloud size={32} /></div>
              <h4>Curriculum Coming Soon</h4>
              <p>We are currently updating the curriculum for this course. Please check back later.</p>
            </div>
          )}
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main className="lv-main">
        {!activeSubtopic ? (
          /* COURSE OVERVIEW VIEW */
          <div className="ce-overview-container">
            <header className="ce-main-header">
              <div className="ce-header-top-row">
                <button className="ce-back-link" onClick={() => navigate('/student-dashboard/courses')}>
                  <ChevronLeft size={16} /> Back to Courses
                </button>
              </div>
              <div className="ce-category-badge">{course?.category || category || "Professional"}</div>
              <h1 className="ce-main-display-title">{displayTitle}</h1>
              <p className="ce-main-subtitle">{displayDesc}</p>
            </header>

            <div className="ce-info-cards">
              {/* TRAINER CARD (Refactored) */}
              <div className="ce-info-card ce-trainer-card-v2">
                <div className="ce-card-header">
                  <div className="ce-header-icon-box">
                    <User size={16} className="ce-header-icon" />
                  </div>
                  <span>Trainer Details</span>
                </div>
                
                <div className="ce-trainer-primary">
                  <div className="ce-trainer-avatar">
                    {(course?.trainer?.name || "I").charAt(0)}
                  </div>
                  <div className="ce-trainer-info">
                    <h4>{course?.trainer?.name || "Industry Expert"}</h4>
                    <p>{course?.trainer?.role || "Lead Instructor"}</p>
                  </div>
                </div>

                <div className="ce-trainer-stats-row">
                  <div className="ce-stat-box">
                    <label>EXPERIENCE</label>
                    <span>{course?.trainer?.experience || "10+ Years"}</span>
                  </div>
                  <div className="ce-stat-box">
                    <label>SPECIALIZATION</label>
                    <span>{course?.trainer?.specialization || "Full Stack Development"}</span>
                  </div>
                </div>
              </div>

              {/* BATCH CARD (Refactored) */}
              <div className="ce-info-card ce-batch-card-v2">
                <div className="ce-card-header">
                  <div className="ce-header-icon-box">
                    <Calendar size={16} className="ce-header-icon" />
                  </div>
                  <span>Batch Details</span>
                </div>

                <div className="ce-batch-details-grid">
                  <div className="ce-batch-grid-item">
                    <Hash size={16} className="ce-grid-icon" />
                    <div className="ce-grid-content">
                      <label>BATCH ID</label>
                      <span>{course?.batch?.id || "TBD"}</span>
                    </div>
                  </div>
                  <div className="ce-batch-grid-item">
                    <Clock size={16} className="ce-grid-icon" />
                    <div className="ce-grid-content">
                      <label>TIMING</label>
                      <span>{course?.batch?.timing || "Flexible Schedule"}</span>
                    </div>
                  </div>
                  <div className="ce-batch-grid-item">
                    <Calendar size={16} className="ce-grid-icon" />
                    <div className="ce-grid-content">
                      <label>START DATE</label>
                      <span>{course?.batch?.startDate || "TBD"}</span>
                    </div>
                  </div>
                  <div className="ce-batch-grid-item">
                    <Layers size={16} className="ce-grid-icon" />
                    <div className="ce-grid-content">
                      <label>DURATION · MODE</label>
                      <span>{course?.batch?.duration || "Self-Paced / Live"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <section className="ce-objective-section">
              <h3 className="ce-section-title">Course Objective</h3>
              <div className="ce-objective-card">
                <p>{course?.objective || "Master the foundations and advanced concepts of this specialization through hands-on labs and real-world projects."}</p>
                {course?.benefits && course.benefits.length > 0 && (
                  <div className="ce-benefits-grid">
                    {course.benefits.map((b, i) => (
                        <div key={i} className="ce-benefit-item">
                          <div className="ce-benefit-dot" />
                          <div>
                              <strong>{b.label}</strong>
                              <p>{b.desc}</p>
                          </div>
                        </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        ) : (
          /* LESSON CONTENT VIEW */
          <div className="ce-lesson-container">
            <header className="ce-lesson-header">
              <h1 className="ce-lesson-title">{activeSubtopic.title}</h1>
              <div className="ce-lesson-actions">
                 <button className="ce-back-to-info" onClick={resetToOverview}>
                    <ChevronLeft size={16} /> Back to {((activeSubtopic.levelId || "level").charAt(0).toUpperCase() + (activeSubtopic.levelId || "level").slice(1))}
                 </button>
              </div>
            </header>

            <div className="ce-lesson-body">
               <div className="ce-reading-card">
                  <div className="lv-topic-rich-content" dangerouslySetInnerHTML={{ __html: getDetailedContent(activeSubtopic) }} />
               </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CourseExplore;