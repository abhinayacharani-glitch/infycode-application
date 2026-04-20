import React, { useState, useEffect } from "react";
import "./Loader.css";
import logo from "../../assets/infycode-final-logo3.png";
import bgImage from "../../assets/circuit-bg-final1.png";

function Loader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2800; // Reach 100% in 2.8s to fit App.jsx's 3s timer
    const interval = 30;
    const step = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return Math.min(prev + step, 100);
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Navigate only after reaching 100% and if we are on the landing page
    if (progress === 100) {
      const navTimer = setTimeout(() => {
        if (window.location.pathname === "/") {
          window.location.assign("/admin-dashboard/dashboard");
        }
      }, 200); // Small delay for visual completion
      return () => clearTimeout(navTimer);
    }
  }, [progress]);

  return (
    <div
      className="loader-container"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative"
      }}
    >

      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.55)",
          zIndex: 1
        }}
      ></div>

      {/* Firework / circles background */}
      <div
        className="fireworks"
        style={{
          filter: "brightness(2.5) drop-shadow(0 0 15px #ffffff) drop-shadow(0 0 30px #00ffff)",
          zIndex: 2
        }}
      ></div>

      <div
        className="loader-content"
        style={{
          position: "relative",
          zIndex: 3
        }}
      >

        {/* Bright glowing logo */}
        <img
          src={logo}
          alt="Infycode Logo"
          className="loader-logo"
          style={{
            filter:
              "brightness(1.5) contrast(1.3) drop-shadow(0 0 25px #ffffff) drop-shadow(0 0 50px #00eaff)",
          }}
        />

        <h1 className="brand-name">INFYCODE</h1>
        <p className="loader-tagline">Infinite Learning Solutions</p>

        <div
          className="loading-bar"
          style={{
            filter: "brightness(2.5) drop-shadow(0 0 10px #ffffff)"
          }}
        >
          <div 
            className="loading-progress" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="percentage-text">
          {Math.round(progress)}%
        </div>

      </div>

    </div>
  );
}

export default Loader;
