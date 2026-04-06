import React from "react";
import "./Loader.css";
import logo from "../../assets/infycode-final-logo3.png";
import bgImage from "../../assets/circuit-bg-final1.png";

function Loader() {
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

        <div
          className="loading-bar"
          style={{
            filter: "brightness(2.5) drop-shadow(0 0 10px #ffffff)"
          }}
        >
          <div className="loading-progress"></div>
        </div>

      </div>

    </div>
  );
}

export default Loader;
