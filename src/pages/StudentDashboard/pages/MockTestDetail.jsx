import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaClock, FaArrowLeft, FaCheckCircle, FaExclamationCircle, FaTrophy } from 'react-icons/fa';
import './MockInterview.css';

const testData = {
  frontend: {
    title: "Frontend Proficiency Test",
    questions: [
      {
        id: 1,
        question: "What is the primary purpose of React Virtual DOM?",
        options: ["To directly manipulate the browser DOM", "To increase memory usage", "To optimize rendering by minimizing direct DOM manipulation", "To replace CSS"],
        answer: 2
      },
      {
        id: 2,
        question: "Which hook is used for performing side effects in functional components?",
        options: ["useState", "useEffect", "useContext", "useReducer"],
        answer: 1
      },
      {
        id: 3,
        question: "What does CSS 'flex-direction: column' do?",
        options: ["Aligns items horizontally", "Aligns items vertically", "Hides the items", "Rotates items by 90 degrees"],
        answer: 1
      },
      {
        id: 4,
        question: "Which of the following is NOT a valid JavaScript data type?",
        options: ["Undefined", "Boolean", "Float", "Symbol"],
        answer: 2
      },
      {
        id: 5,
        question: "In React, what is used to pass data from a parent component to a child component?",
        options: ["State", "Props", "Refs", "Keys"],
        answer: 1
      }
    ]
  },
  backend: {
    title: "Java Full Stack Challenge",
    questions: [
      {
        id: 1,
        question: "Which annotation is used to mark a class as a Spring Boot application?",
        options: ["@Service", "@Controller", "@SpringBootApplication", "@Repository"],
        answer: 2
      },
      {
        id: 2,
        question: "What is the default scope of a Spring Bean?",
        options: ["Prototype", "Singleton", "Request", "Session"],
        answer: 1
      },
      {
        id: 3,
        question: "Which Java keyword is used to prevent a variable from being serialized?",
        options: ["static", "volatile", "transient", "synchronized"],
        answer: 2
      },
      {
        id: 4,
        question: "In a Microservices architecture, what is the role of an API Gateway?",
        options: ["To store data", "To manage individual service logic", "To provide a single entry point for all clients", "To replace the database"],
        answer: 2
      },
      {
        id: 5,
        question: "Which HTTP method is typically used to update an existing resource?",
        options: ["GET", "POST", "PUT", "DELETE"],
        answer: 2
      }
    ]
  },
  core: {
    title: "Core Technical Aptitude",
    questions: [
      {
        id: 1,
        question: "What is the time complexity of searching an element in a balanced Binary Search Tree?",
        options: ["O(n)", "O(log n)", "O(n^2)", "O(1)"],
        answer: 1
      },
      {
        id: 2,
        question: "Which layer of the OSI model is responsible for routing?",
        options: ["Physical Layer", "Data Link Layer", "Network Layer", "Transport Layer"],
        answer: 2
      },
      {
        id: 3,
        question: "In DBMS, what does ACID stand for?",
        options: ["Atomicity, Consistency, Isolation, Durability", "Accuracy, Consistency, Integrity, Durability", "Atomicity, Complexity, Isolation, Dependency", "Array, Class, Integer, Double"],
        answer: 0
      },
      {
        id: 4,
        question: "Which of the following is a non-volatile memory?",
        options: ["RAM", "Cache", "ROM", "Registers"],
        answer: 2
      },
      {
        id: 5,
        question: "What is a 'deadlock' in Operating Systems?",
        options: ["A fast processing state", "A state where two or more processes are waiting for each other to release resources", "A system crash", "A type of memory allocation"],
        answer: 1
      }
    ]
  }
};

const MockTestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const test = testData[id];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes default

  useEffect(() => {
    if (isSubmitted) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  if (!test) return <div className="page-container"><h2>Test not found</h2></div>;

  const handleOptionSelect = (optionIndex) => {
    if (isSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: optionIndex
    });
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const calculateScore = () => {
    let score = 0;
    test.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        score++;
      }
    });
    return score;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isSubmitted) {
    const score = calculateScore();
    const percentage = (score / test.questions.length) * 100;
    return (
      <div className="page-container result-page">
        <div className="result-card premium-card">
          <FaTrophy className="trophy-icon" />
          <h2>Assessment Completed!</h2>
          <div className="score-display">
            <span className="score-num">{score}</span>
            <span className="score-total">/ {test.questions.length}</span>
          </div>
          <p className="result-text">
            {percentage >= 80 ? "Outstanding performance! You are industry-ready." : 
             percentage >= 60 ? "Good job! A few more practice sessions and you'll be perfect." : 
             "Keep practicing. Review the core concepts and try again."}
          </p>
          <button className="primary-action-btn" onClick={() => navigate('/student-dashboard/mock-interview')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container test-view-container">
      <div className="test-header-bar">
        <button className="back-btn-minimal" onClick={() => navigate(-1)}>
          <FaArrowLeft /> <span>Quit Test</span>
        </button>
        <h3>{test.title}</h3>
        <div className="timer-badge">
          <FaClock /> <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="test-content-layout">
        <div className="question-navigation">
          <h4>Questions</h4>
          <div className="q-nav-grid">
            {test.questions.map((_, idx) => (
              <button 
                key={idx}
                className={`q-nav-btn ${currentQuestion === idx ? 'active' : ''} ${selectedAnswers[idx] !== undefined ? 'answered' : ''}`}
                onClick={() => setCurrentQuestion(idx)}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="question-card-main premium-card">
          <div className="q-header">
            <span className="q-index">Question {currentQuestion + 1} of {test.questions.length}</span>
          </div>
          <div className="q-body">
            <p className="question-text">{test.questions[currentQuestion].question}</p>
            <div className="options-grid">
              {test.questions[currentQuestion].options.map((option, idx) => (
                <button 
                  key={idx}
                  className={`option-btn ${selectedAnswers[currentQuestion] === idx ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect(idx)}
                >
                  <span className="option-label">{String.fromCharCode(65 + idx)}</span>
                  <span className="option-text">{option}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="q-footer">
            <button 
              className="secondary-action-btn"
              disabled={currentQuestion === 0}
              onClick={() => setCurrentQuestion(prev => prev - 1)}
            >
              Previous
            </button>
            {currentQuestion === test.questions.length - 1 ? (
              <button className="submit-test-btn" onClick={handleSubmit}>Submit Test</button>
            ) : (
              <button 
                className="primary-action-btn"
                onClick={() => setCurrentQuestion(prev => prev + 1)}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockTestDetail;
