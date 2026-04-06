import React, { useState, useEffect } from "react";
import "./Navbar.css";
import logoimage from "../../assets/infycode-final-logo4-1.png";
import logoimage1 from "../../assets/color-logo-3.png";
import { Link, NavLink, useLocation } from "react-router-dom";
import { 
  Home, 
  BookOpen, 
  Video, 
  GraduationCap, 
  Library, 
  Mail, 
  Flame, 
  TrendingUp, 
  Layers, 
  Building2, 
  School, 
  Newspaper, 
  BookOpenText, 
  Presentation, 
  User,
  Compass,
  Info,
  Image
} from "lucide-react";

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
                <i><Home size={18} /></i>
                <span>Home</span>
              </NavLink>
            </li>

            <li className="dropdown">
              <NavLink 
                to="/courses"
                className={location.pathname.startsWith("/courses") ? "nav-link active-link" : "nav-link"}
              >
                <i><BookOpen size={18} /></i>
                <span>Courses ▾</span>
              </NavLink>
              <ul className="dropdown-menu">
                <li><NavLink to="/courses/popular" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}><i><Flame size={18} /></i> Popular</NavLink></li>
                <li><NavLink to="/courses/trending" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}><i><TrendingUp size={18} /></i> Trending</NavLink></li>
                <li><NavLink to="/courses" end className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}><i><Layers size={18} /></i> All Courses</NavLink></li>
              </ul>
            </li>

            <li>
              <NavLink 
                to="/video-courses" 
                className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}
              >
                <i><Video size={18} /></i>
                <span>Video Courses</span>
              </NavLink>
            </li>

            <li className="dropdown">
              <NavLink 
                to="/trainings"
                className={location.pathname.startsWith("/trainings") ? "nav-link active-link" : "nav-link"}
              >
                <i><GraduationCap size={18} /></i>
                <span>Trainings ▾</span>
              </NavLink>
              <ul className="dropdown-menu">
                <li><NavLink to="/trainings/corporate" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}><i><Building2 size={18} /></i> Corporate</NavLink></li>
                <li><NavLink to="/trainings/institutional" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}><i><School size={18} /></i> Institutional</NavLink></li>
              </ul>
            </li>

            <li className="dropdown">
              <NavLink 
                to="/resources"
                className={location.pathname.startsWith("/resources") ? "nav-link active-link" : "nav-link"}
              >
                <i><Library size={18} /></i>
                <span>Resources ▾</span>
              </NavLink>
              <ul className="dropdown-menu">
                <li><NavLink to="/resources/articles" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}><i><Newspaper size={18} /></i> Articles</NavLink></li>
                <li><NavLink to="/resources/ebooks" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}><i><BookOpenText size={18} /></i> eBooks</NavLink></li>
              </ul>
            </li>

            <li className="dropdown">
              <NavLink 
                to="/contact"
                className={location.pathname === "/contact" || location.pathname === "/about" || location.pathname === "/gallery" ? "nav-link active-link" : "nav-link"}
              >
                <i><Compass size={18} /></i>
                <span>Discover ▾</span>
              </NavLink>
              <ul className="dropdown-menu">
                <li><NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}><i><Mail size={18} /></i> Contact Us</NavLink></li>
                <li><NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}><i><Info size={18} /></i> About Us</NavLink></li>
                <li><NavLink to="/gallery" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}><i><Image size={18} /></i> Gallery</NavLink></li>
              </ul>
            </li>
          </div>

          <li className="nav-right">
            <div className="right-group">
              <NavLink 
                to="/become-trainer" 
                className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}
              >
                <i><Presentation size={18} /></i>
                <span>Become a Trainer</span>
              </NavLink>

              <NavLink 
                to="/login" 
                className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}
              >
                <i><User size={18} /></i>
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