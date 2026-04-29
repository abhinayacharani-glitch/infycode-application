import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, Cpu, Brain, Database, Cloud, Globe, 
  Terminal, Settings, Braces, Binary
} from 'lucide-react';
import './LoginBackground.css';

const LoginBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let particles = [];
    const particleCount = 80;
    const connectionDistance = 140;

    const resize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.5 + 0.5;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fill();
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 - (distance / connectionDistance) * 0.3})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const techStack = [
    { icon: <Binary />, label: 'PYTHON', top: '35%', left: '15%', color: '#fff' },
    { icon: <Code />, label: 'JAVA', top: '35%', left: '75%', color: '#fff' },
    { icon: <Brain />, label: 'AI', top: '15%', left: '25%', color: '#fff' },
    { icon: <Cpu />, label: 'ML', top: '15%', left: '70%', color: '#fff' },
    { icon: <Database />, label: 'DATA', top: '65%', left: '18%', color: '#fff' },
    { icon: <Globe />, label: 'API', top: '65%', left: '80%', color: '#fff' },
    { icon: <Cloud />, label: 'CLOUD', top: '80%', left: '88%', color: '#fff' },
    { icon: <Settings />, label: '', top: '25%', left: '85%', color: 'rgba(255,255,255,0.4)' },
    { icon: <Braces />, label: '', top: '10%', left: '60%', color: 'rgba(255,255,255,0.4)' },
    { icon: <Terminal />, label: '', top: '45%', left: '5%', color: 'rgba(255,255,255,0.4)' },
  ];

  const codeSnippets = [
    { text: "import pandas as pd\nimport numpy as np\nfrom sklearn.model_selection\nimport train_test_split", top: '5%', left: '5%' },
    { text: "# Initialize system\nsystem = AI_System()\nsystem.activate()\n\nfor node in network.nodes:\n  node.connect()", top: '5%', right: '5%' },
    { text: "def enhance_learning():\n  skills = ['AI', 'ML', 'DS']\n  for s in skills:\n    mastery(s)", top: '30%', right: '8%' },
    { text: "10101111101010101101\n0100100000200110011\n10101000101000101101\n01001000100110110101", top: '50%', right: '5%', size: '10px', opacity: 0.3 },
  ];

  const learningPath = [
    { label: 'Beginner', color: '#10b981', pos: '15%' },
    { label: 'Foundations', color: '#34d399', pos: '30%' },
    { label: 'Data Science', color: '#0ea5e9', pos: '50%' },
    { label: 'Web Dev', color: '#8b5cf6', pos: '70%' },
    { label: 'AI Mastery', color: '#ec4899', pos: '85%' },
    { label: 'Cloud', color: '#f59e0b', pos: '95%' },
  ];

  return (
    <div className="login-bg-container dynamic-vibrant">
      <div className="perspective-grid-container">
        <div className="grid-plane" />
      </div>

      <canvas ref={canvasRef} className="node-canvas-vibrant" />

      <div className="code-snippets-layer">
        {codeSnippets.map((snippet, i) => (
          <div 
            key={i} 
            className="code-snippet" 
            style={{ 
              top: snippet.top, 
              left: snippet.left, 
              right: snippet.right,
              fontSize: snippet.size || '12px',
              opacity: snippet.opacity || 0.6
            }}
          >
            {snippet.text.split('\n').map((line, j) => <div key={j}>{line}</div>)}
          </div>
        ))}
      </div>

      <div className="learning-path-layer">
        <svg className="path-svg" viewBox="0 0 1000 200" preserveAspectRatio="none">
          <motion.path
            d="M0,150 Q250,50 500,150 T1000,50"
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth="4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
        
        {learningPath.map((point, i) => (
          <motion.div 
            key={i}
            className="path-node"
            style={{ left: point.pos, '--node-color': point.color }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.2 + 1 }}
          >
            <div className="node-glow" />
            <span className="node-label">{point.label}</span>
          </motion.div>
        ))}
      </div>

      <div className="tech-icons-layer">
        {techStack.map((item, idx) => (
          <motion.div
            key={idx}
            className="tech-icon-box"
            style={{ top: item.top, left: item.left, color: item.color }}
            animate={{
              y: [0, -15, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: idx * 0.4
            }}
          >
            <div className="icon-wrapper">
              {item.icon}
            </div>
            {item.label && <span className="icon-label-text">{item.label}</span>}
          </motion.div>
        ))}
      </div>

      <div className="vibrant-overlay" />
    </div>
  );
};

export default LoginBackground;
