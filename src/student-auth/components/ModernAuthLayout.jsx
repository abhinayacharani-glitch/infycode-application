import { useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoIcon from "../../assets/infycode-final-logo4-1.png";
import "../styles/ModernAuth.css";

const InfinityBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const symbols = [];
    const dots = [];
    const symbolCount = 70; 
    const dotCount = 300;

    class InfinitySymbol {
      constructor() {
        this.reset();
        this.y = Math.random() * height; // Full screen initialization
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height + 40;
        this.size = 22; // Fixed professional size
        this.speed = Math.random() * 0.6 + 0.4; // Medium speed
        this.opacity = 0;
        this.maxOpacity = Math.random() * 0.3 + 0.1;
        this.phase = Math.random() * Math.PI * 2;
        this.amplitude = Math.random() * 0.4 + 0.2;
        this.layer = Math.floor(Math.random() * 3);
      }

      update() {
        // Strictly upward linear movement
        this.y -= this.speed * (this.layer + 0.8);
        
        // Subtle horizontal wave drift (no rotation/tilt)
        this.x += Math.sin(this.y * 0.01 + this.phase) * this.amplitude;

        // Smooth fade-in/out at boundaries
        if (this.y > height - 80) {
          this.opacity = Math.min(this.maxOpacity, (height - this.y) / 80 * this.maxOpacity);
        } else if (this.y < 80) {
          this.opacity = Math.max(0, this.y / 80 * this.maxOpacity);
        } else {
          this.opacity = this.maxOpacity;
        }

        if (this.y < -40) this.reset();
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        
        // strictly horizontal - no rotation or translation needed
        const blurAmount = (2 - this.layer) * 1.5;
        if (blurAmount > 0) ctx.filter = `blur(${blurAmount}px)`;

        const gradient = ctx.createLinearGradient(this.x - this.size, 0, this.x + this.size, 0);
        gradient.addColorStop(0, '#0ea5e9');
        gradient.addColorStop(1, '#3b82f6');
        
        ctx.fillStyle = gradient;
        ctx.font = `bold ${this.size}px Urbanist, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Draw ∞ always straight (0° rotation)
        ctx.fillText('∞', this.x, this.y);
        
        ctx.restore();
      }
    }

    class Dot {
      constructor() {
        this.reset();
        this.y = Math.random() * height;
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height + 10;
        this.size = Math.random() * 1.5 + 0.5;
        this.speed = Math.random() * 1.5 + 1.0; // Faster than symbols
        this.opacity = Math.random() * 0.5 + 0.1;
        this.layer = Math.floor(Math.random() * 3);
        this.twinkleDir = Math.random() > 0.5 ? 1 : -1;
      }

      update() {
        this.y -= this.speed * (this.layer + 1);
        
        // Continuous twinkling
        this.opacity += 0.01 * this.twinkleDir;
        if (this.opacity >= 0.7 || this.opacity <= 0.1) this.twinkleDir *= -1;

        if (this.y < -10) this.reset();
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
        
        if (this.layer > 0) {
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#0ea5e9';
        }
      }
    }

    for (let i = 0; i < symbolCount; i++) symbols.push(new InfinitySymbol());
    for (let i = 0; i < dotCount; i++) dots.push(new Dot());

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // 3-layer linear rising stream
      [0, 1, 2].forEach(layer => {
        symbols.forEach(s => {
          if (s.layer === layer) {
            s.update();
            s.draw();
          }
        });
        
        dots.forEach(d => {
          if (d.layer === layer) {
            d.update();
            d.draw();
          }
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};

const ModernAuthLayout = ({ children, title, subtitle, showBranding = true }) => {
  return (
    <div className="modern-auth-root">
      <InfinityBackground />

      <div className="auth-layout">
        {/* LEFT: Branding */}
        <div className="branding-section">
          <div className="branding-card">
            <div className="branding-logo-container">
              <img src={logoIcon} alt="InfyCode Logo" className="branding-logo" />
            </div>
            <h2 className="brand-name">INFYCODE</h2>
            <p className="brand-tagline">Infinite Learning Solutions</p>
          </div>
        </div>

        {/* RIGHT: Form */}
        <div className="form-section">
          <div className="auth-form-card">
            <div className="form-header">
              <h1>{title}</h1>
              <p>{subtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernAuthLayout;
