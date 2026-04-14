import React, { useState, useEffect } from "react";
import "./Navbar.css";
import logoimage from "../../assets/infycode-final-logo4-1.png";
import logoimage1 from "../../assets/color-logo-3.jpeg";
import { Link, NavLink, useLocation } from "react-router-dom";

function Navbar() {
  const [sticky, setSticky] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={sticky ? "header sticky" : "header"}>
      <nav className="navbar">
        {/* CLICKABLE LOGO */}
        <Link to="/" className="logo">   
          <img src={logoimage} alt="Infycode logo"/>
          <div className="logo-text">
            <img src={logoimage1} alt="Infycode logo"/>
          </div>
        </Link>

        <ul className="nav-links">
          <div className="nav-center">
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}
              >
                <span>Home</span>
              </NavLink>
            </li>

            <li className="dropdown">
              <span 
                className={location.pathname.startsWith("/courses") ? "nav-link active-link" : "nav-link"}
                style={{ cursor: "pointer" }}
              >
                <span>Courses ▾</span>
              </span>
              <ul className="dropdown-menu">
                <li><NavLink to="/courses/popular" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}> Popular</NavLink></li>
                <li><NavLink to="/courses/trending" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}> Trending</NavLink></li>
                <li><NavLink to="/courses" end className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}> All Courses</NavLink></li>
              </ul>
            </li>

            <li>
              <NavLink 
                to="/video-courses" 
                className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}
              >
                <span>Video Courses</span>
              </NavLink>
            </li>

            <li className="dropdown">
              <span 
                className={location.pathname.startsWith("/trainings") ? "nav-link active-link" : "nav-link"}
                style={{ cursor: "pointer" }}
              >
                <span>Trainings ▾</span>
              </span>
              <ul className="dropdown-menu">
                <li><NavLink to="/trainings/corporate" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}> Corporate</NavLink></li>
                <li><NavLink to="/trainings/institutional" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}> Institutional</NavLink></li>
              </ul>
            </li>

            <li className="dropdown">
              <span 
                className={location.pathname.startsWith("/resources") ? "nav-link active-link" : "nav-link"}
                style={{ cursor: "pointer" }}
              >
                <span>Resources ▾</span>
              </span>
              <ul className="dropdown-menu">
                <li><NavLink to="/resources/articles" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}> Articles</NavLink></li>
                <li><NavLink to="/resources/ebooks" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}> eBooks</NavLink></li>
              </ul>
            </li>

            <li className="dropdown">
              <span 
                className={location.pathname === "/contact" || location.pathname === "/about" || location.pathname === "/gallery" ? "nav-link active-link" : "nav-link"}
                style={{ cursor: "pointer" }}
              >
                <span>Discover ▾</span>
              </span>
              <ul className="dropdown-menu">
                <li><NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}> Contact Us</NavLink></li>
                <li><NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}> About Us</NavLink></li>
                <li><NavLink to="/gallery" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}> Gallery</NavLink></li>
              </ul>
            </li>
          </div>

          <li className="nav-right">
            <div className="right-group">
              <NavLink 
                to="/become-trainer" 
                className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}
              >
                <span>Become a Trainer</span>
              </NavLink>

              <NavLink 
                to="/login" 
                className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}
              >
                <span>Login</span>
              </NavLink>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;