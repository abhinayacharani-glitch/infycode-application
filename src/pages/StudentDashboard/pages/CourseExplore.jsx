import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { COURSE_MAP } from './data/extraCourses';
import './CourseExplore.css';

/* ── Topic key-points generator ── */
const getKeyPoints = (topic) => {
  if (topic.points) return topic.points;
  const title = topic.title.toLowerCase();
  if (title.includes('java') || title.includes('jvm')) return ['Understand the JVM (Java Virtual Machine) architecture and how it executes bytecode','Set up JDK 17+ and configure IntelliJ IDEA for Java development','Write, compile, and run your first Java program from the command line','Learn how Java achieves platform independence through "Write Once, Run Anywhere"'];
  if (title.includes('variable') || title.includes('data type')) return ['Distinguish between primitive types (int, char, boolean, double) and reference types','Understand how Java stores variables on the stack vs heap memory','Apply type casting (implicit and explicit) safely in Java programs','Use wrapper classes (Integer, Boolean, etc.) and understand autoboxing'];
  if (title.includes('control') || title.includes('loop')) return ['Write conditional logic using if-else and nested conditions','Implement for, while, and do-while loops for iteration','Use break and continue to control loop execution','Apply switch statements for multi-branch decision making'];
  if (title.includes('array') || title.includes('string')) return ['Declare and initialise single and multi-dimensional arrays','Traverse arrays using enhanced for-each loops','Apply common String methods: length(), substring(), indexOf(), equals()','Use StringBuilder for efficient mutable string operations'];
  if (title.includes('method') || title.includes('recursion')) return ['Define methods with parameters, return types, and proper naming conventions','Understand method overloading and when to apply it','Implement recursive methods and identify base cases','Analyse the call stack and avoid StackOverflow errors'];
  if (title.includes('exception')) return ['Distinguish between checked and unchecked exceptions','Use try-catch-finally blocks to handle runtime errors gracefully','Create custom exception classes by extending Exception','Apply best practices: do not swallow exceptions, use specific catch blocks'];
  if (title.includes('file') || title.includes('scanner') || title.includes('i/o')) return ['Read data from files using FileReader and BufferedReader','Write to files using FileWriter and BufferedWriter','Handle IOException with proper try-with-resources syntax','Accept user input at runtime using the Scanner class'];
  if (title.includes('package') || title.includes('access')) return ['Organise classes into meaningful package hierarchies','Apply access modifiers: public, private, protected, and package-private','Understand why encapsulation is a core OOP principle','Use static imports and wildcard imports appropriately'];
  if (title.includes('oop') || title.includes('class') || title.includes('object')) return ['Define classes with fields, constructors, and methods','Create and instantiate objects with the new keyword','Understand the four pillars of OOP: Encapsulation, Inheritance, Polymorphism, Abstraction','Differentiate between class (static) and instance members'];
  if (title.includes('encapsulation') || title.includes('inheritance')) return ['Protect class fields using private access and expose them via getters/setters','Use the extends keyword to create a class hierarchy','Understand method hiding vs method overriding','Call superclass constructors and methods using super keyword'];
  if (title.includes('polymorphism') || title.includes('abstraction')) return ['Override methods in subclasses to change runtime behaviour','Declare abstract classes and abstract methods','Implement interfaces to define behavioural contracts','Understand upcasting, downcasting, and the instanceof operator'];
  if (title.includes('collection')) return ['Choose the right collection: ArrayList, LinkedList, HashMap, HashSet, TreeMap','Iterate over collections using Iterator and enhanced for-each','Sort collections using Comparable and Comparator interfaces','Understand Big-O complexity for common collection operations'];
  if (title.includes('spring boot')) return ['Bootstrap a Spring Boot project using Spring Initializr','Create REST controllers with @RestController and @RequestMapping','Define service layers and inject dependencies with @Service and @Autowired','Configure application properties and understand auto-configuration'];
  if (title.includes('react') || title.includes('frontend')) return ['Set up a React project with Vite and connect to a Spring Boot backend','Create functional components and manage local state with useState','Fetch data from REST APIs using Axios or fetch()','Handle CORS configuration on the Spring Boot server'];
  if (title.includes('python') || title.includes('setup') || title.includes('install')) return ['Install Python 3.x and configure a virtual environment','Understand Python\'s indentation-based syntax and dynamic typing','Write and execute your first Python script from the terminal','Use pip to install and manage third-party packages'];
  if (title.includes('react') && title.includes('fundamental')) return ['Understand the Virtual DOM and how React efficiently updates the UI','Create functional components and pass data using props','Manage local state with the useState hook','Compose complex UIs by nesting simpler components'];
  if (title.includes('node') || title.includes('express')) return ['Understand the Node.js event-driven, non-blocking architecture','Create an Express.js server and define route handlers','Use middleware for logging, parsing, and error handling','Connect to MongoDB using Mongoose from an Express application'];
  if (title.includes('mongodb') || title.includes('mongoose')) return ['Design MongoDB schemas using Mongoose models','Perform CRUD operations with Mongoose (find, save, updateOne, deleteOne)','Set up indexes to optimise query performance','Understand document embedding vs referencing for relationships'];
  if (title.includes('docker') || title.includes('container')) return ['Write a Dockerfile with a multi-stage build for smaller images','Build, tag, and push Docker images to a container registry','Run containers with environment variables and volume mounts','Define multi-service stacks using Docker Compose'];
  if (title.includes('kubernetes') || title.includes('k8s')) return ['Understand Kubernetes architecture: nodes, pods, and control plane','Deploy applications using Deployment manifests and manage replicas','Expose applications internally and externally with Services','Configure applications using ConfigMaps and Secrets'];
  if (title.includes('ci/cd') || title.includes('jenkins') || title.includes('github action')) return ['Define pipeline stages: Build, Test, Deploy in a Jenkinsfile/workflow','Trigger pipelines automatically on Git push events','Run automated tests and publish test reports in CI','Deploy to a target environment on successful pipeline run'];
  if (title.includes('terraform')) return ['Write Terraform configuration files to provision cloud resources','Use variables, outputs, and modules for reusable infrastructure','Manage remote state with a Terraform backend (S3/Azure Blob)','Plan and apply infrastructure changes safely using terraform plan'];
  if (title.includes('aws') || title.includes('ec2') || title.includes('cloud')) return ['Understand the AWS Shared Responsibility Model for security','Launch and configure EC2 instances with appropriate instance types','Create IAM roles and policies following least-privilege principles','Monitor resources with CloudWatch metrics, logs, and alarms'];
  return [
    `Understand the core concepts and motivation behind ${topic.title}`,
    `Apply the key techniques covered in this topic to real-world scenarios`,
    `Identify common pitfalls and how to avoid them`,
    `Complete the hands-on exercises to reinforce your understanding`,
  ];
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
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          Interactive Practice Lab
        </div>
        {solved && <span className="practice-solved-badge">Solved</span>}
      </div>
      <p className="practice-question">Write a Java program that checks if the number 42 is <strong>even or odd</strong> and prints the result to the console.</p>
      <div className="code-editor-shell">
        <div className="editor-topbar">
          <div className="editor-dots"><span style={{ background: '#ff5f56' }}/><span style={{ background: '#ffbd2e' }}/><span style={{ background: '#27c93f' }}/></div>
          <span className="editor-filename">EvenOdd.java</span>
        </div>
        <textarea className="code-textarea" value={showSolution ? solution : code} onChange={e => { if (!showSolution) setCode(e.target.value); }} rows={9} spellCheck={false}/>
      </div>
      <div className="practice-actions">
        <button className="lv-btn lv-btn-primary lv-btn-sm" onClick={handleRun}>Run Code</button>
        <button className="lv-btn lv-btn-outline lv-btn-sm" onClick={() => setShowSolution(!showSolution)}>{showSolution ? 'Hide Solution' : 'View Solution'}</button>
      </div>
      {output && <div className={`output-terminal ${solved ? 'success' : 'warning'}`}><pre>{output}</pre></div>}
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

  const [openModules, setOpenModules] = useState({ [course.modules[0].id]: true });
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

  const [completedSet, setCompletedSet] = useState(new Set());

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
  const activeTopic  = activeModule?.topics?.find(t => t.id === activeContent.topicId);
  const isFinal = activeContent.type === 'final';

  const isFirstTopicGlobally = (mi, ti) => mi === 0 && ti === 0;
  const contentKey = (type, modId, topicId) => `${type}::${modId}::${topicId}`;

  const navList = [];
  course.modules.forEach((m, mIdx) => {
    m.topics.forEach((t, tIdx) => {
      navList.push({ type: 'topic_content',    moduleId: m.id, topicId: t.id, moduleIndex: mIdx, topicIndex: tIdx });
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
      setOpenModules(prev => ({ ...prev, [n.moduleId]: true }));
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
    if (currentNavIdx < navList.length - 1) goTo(navList[currentNavIdx + 1]);
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
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
             Back to Courses
           </button>

           <div className="lv-sidebar-tabs">
             <button className="lv-tab active">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
               Curriculum
             </button>
           </div>
        </div>

        <div className="lv-curriculum">
          <div className="lv-section-label">COURSE CONTENT</div>

          {course.modules.map((m, mIdx) => {
            const isModOpen = !!openModules[m.id];
            return (
              <div key={m.id} className="lv-module-block">
                <button className={`lv-module-row ${isModOpen ? 'is-expanded' : ''}`} onClick={() => toggleModule(m.id)}>
                  <div className="lv-module-info">
                    <span className="lv-module-name">{m.label} — {m.subtitle}</span>
                    <span className="lv-module-dur">{m.duration || '4 Weeks'}</span>
                  </div>
                  <svg className={`lv-chevron ${isModOpen ? 'open' : ''}`} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="9 18 15 12 9 6"/></svg>
                </button>

                {isModOpen && (
                  <div className="lv-topics-list">
                    {m.topics.map((t, tIdx) => {
                      const isTopicActive = activeContent.topicId === t.id && activeContent.type === 'topic_content';
                      const isPracticeActive = activeContent.topicId === t.id && activeContent.type === 'topic_practice';
                      const isAssignmentActive = activeContent.topicId === t.id && activeContent.type === 'topic_assignment';
                      const showPractice = isFirstTopicGlobally(mIdx, tIdx);

                      return (
                        <div key={t.id} className="lv-topic-group">
                          {/* Reading Topic */}
                          <button 
                            className={`lv-topic-row-new ${isTopicActive ? 'active' : ''}`} 
                            onClick={() => handleSetActive('topic_content', m.id, t.id, mIdx, tIdx)}
                          >
                            <div className="lv-topic-icon-col">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                            </div>
                            <div className="lv-topic-text-col">
                              <div className="lv-topic-title-new">{tIdx + 1}. {t.title}</div>
                              <div className="lv-topic-subtitle">{t.time || '45 min'}</div>
                            </div>
                          </button>

                          {/* Practice Lab if exists */}
                          {showPractice && (
                            <button
                                className={`lv-topic-row-new ${isPracticeActive ? 'active' : ''}`}
                                onClick={() => handleSetActive('topic_practice', m.id, t.id, mIdx, tIdx)}
                            >
                                <div className="lv-topic-icon-col">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                </div>
                                <div className="lv-topic-text-col">
                                  <div className="lv-topic-title-new">Practice Test: {t.title}</div>
                                  <div className="lv-topic-subtitle">30 min</div>
                                </div>
                            </button>
                          )}

                          {/* Assignment */}
                          <button
                            className={`lv-topic-row-new ${isAssignmentActive ? 'active' : ''}`}
                            onClick={() => handleSetActive('topic_assignment', m.id, t.id, mIdx, tIdx)}
                          >
                            <div className="lv-topic-icon-col">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                            </div>
                            <div className="lv-topic-text-col">
                              <div className="lv-topic-title-new">Assessment: {t.title}</div>
                              <div className="lv-topic-subtitle">{t.time || '20 min'}</div>
                            </div>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Final Assignment */}
          <div className="lv-module-block final-block">
            <button className={`lv-module-row ${finalOpen ? 'is-expanded' : ''}`} onClick={() => setFinalOpen(p => !p)}>
              <div className="lv-module-info">
                <span className="lv-module-name">Final Assignment</span>
                <span className="lv-module-dur">Final Evaluation • 1 Week</span>
              </div>
              <svg className={`lv-chevron ${finalOpen ? 'open' : ''}`} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
            {finalOpen && (
              <div className="lv-topics-list">
                <button 
                  className={`lv-topic-row-new ${activeContent.type === 'final' ? 'active' : ''}`} 
                  onClick={() => setActiveContent({ type: 'final', moduleId: 'final', topicId: 'final' })}
                >
                  <div className="lv-topic-icon-col">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  </div>
                  <div className="lv-topic-text-col">
                    <div className="lv-topic-title-new">Complete Final Assignment</div>
                    <div className="lv-topic-subtitle">Certification evaluation</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main className="lv-main">
        <div className="lv-main-header">
          {!isFinal && activeModule && (
            <div className="lv-mod-badge" style={{ color: activeModule.color, background: `${activeModule.color}18` }}>{activeModule.label}</div>
          )}
          {isFinal && <div className="lv-mod-badge" style={{ color: '#f59e0b', background: '#fffbeb' }}>Final Assessment</div>}
          <h1 className="lv-main-title">
            {isFinal ? (course.finalAssignment.title || "Final Project Assessment") : activeTopic?.title || 'Select a topic'}
          </h1>
          {!isFinal && (
            <span className="lv-view-label">
              {activeContent.type === 'topic_content' && 'Reading Material'}
              {activeContent.type === 'topic_practice' && 'Practice Lab'}
              {activeContent.type === 'topic_assignment' && 'Assignment'}
            </span>
          )}
          
          <div className="lv-main-header-actions" style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
          </div>
        </div>

        <div className="lv-main-body">
          {/* Topic Content */}
          {activeContent.type === 'topic_content' && activeTopic && (
            <div className="lv-reading-card">
              <div className="lv-reading-material">
                <p>
                  This session covers the core essentials of <strong>{activeTopic.title}</strong>, providing you with a deep understanding of its architecture and practical implementation.
                  We will explore how these concepts integrate into the broader ecosystem and look at best practices followed in the industry.
                </p>
                <div dangerouslySetInnerHTML={{ __html: activeTopic.content }} />
                
                <div className="lv-topic-overview">
                  <h3 className="lv-overview-title">Key Learning Outcomes</h3>
                  <ul className="lv-overview-list">
                    {getKeyPoints(activeTopic).map((pt, i) => (
                      <li key={i}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>

                <p style={{ marginTop: '24px' }}>
                  By the end of this topic, you should be able to confidently apply these principles in your projects and troubleshoot common issues. 
                  Make sure to attempt the assignment once you have reviewed the material in detail.
                </p>
              </div>
            </div>
          )}

          {activeContent.type === 'topic_practice' && <PracticeWidget />}

          {activeContent.type === 'topic_assignment' && activeTopic && (
            <div className="lv-assignment-card">
              <div className="lv-ac-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <h4>Assignment Task: {activeTopic.title}</h4>
              </div>
              <div className="lv-ac-body">
                <div className="lv-ac-module-note">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                   This assignment accounts for 15% of your module score. Please ensure your solution follows the course coding standards and best practices.
                </div>
                
                <div className="lv-assignment-code-section">
                   <div className="practice-widget">
                     <div className="practice-widget-header">
                       <div className="practice-widget-left">
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                         <span>Interactive IDE — Solution Implementation</span>
                       </div>
                     </div>
                     
                     <p className="practice-question">
                       <strong>Specification:</strong> Implement the solution requirements for "{activeTopic.title}". Use the editor below to draft your implementation. You can test your solution as you go.
                     </p>

                     <div className="code-editor-shell">
                       <div className="editor-topbar">
                         <div className="editor-dots">
                           <span style={{ background: '#ff5f56' }}></span>
                           <span style={{ background: '#ffbd2e' }}></span>
                           <span style={{ background: '#27c93f' }}></span>
                         </div>
                         <div className="editor-filename">Solution.java</div>
                       </div>
                       <textarea 
                         className="code-textarea" 
                         defaultValue={'// Write your solution here...\n\npublic class Solution {\n    public static void main(String[] args) {\n        \n    }\n}'}
                         spellCheck="false"
                       />
                     </div>

                     <div className="practice-actions">
                       <button className="lv-btn lv-btn-outline lv-btn-sm">Run Tests</button>
                       <button className="lv-btn lv-btn-primary lv-btn-sm" onClick={() => alert('Solution submitted successfully!')}>Submit Solution</button>
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
                <h2>{course.finalAssignment.title}</h2>
                <p>{course.finalAssignment.description}</p>
              </div>
              <div className="lv-final-body">
                <div className="lv-final-reqs">
                  <h3>Project Requirements</h3>
                  <ul>
                    {course.finalAssignment.requirements.map((req, i) => (
                      <li key={i}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="lv-final-action-area">
                  <h3>Ready to attempt?</h3>
                  <p>This assessment tests your complete understanding of the course. Ensure you have completed all modules before starting.</p>
                  <button className="lv-take-assessment-btn" onClick={() => alert('Assessment environment will open here.')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                    Take Assessment
                  </button>
                  <div className="lv-upload-zone" style={{ marginTop: 20 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    <strong>Or Submit Project Files</strong>
                    <span>Upload .zip or link your GitHub repository</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <footer className="lv-action-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <button className="lv-btn lv-btn-outline" onClick={handlePrev} disabled={currentNavIdx === 0}>
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
             Previous
          </button>
          
          <button 
            className={`lv-btn ${currentIsDone ? 'lv-btn-done' : 'lv-btn-primary'}`} 
            onClick={handleMarkComplete}
          >
            {currentIsDone ? (
              <><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Completed</>
            ) : (
              'Mark as Complete'
            )}
          </button>
        </footer>
      </main>
    </div>
  );
};

export default CourseExplore;
