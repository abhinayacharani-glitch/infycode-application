import React, { useEffect } from "react";
import "./Footer.css";
import logoimage from "../../assets/infycode-final-logo4-1.png";
import logoimage1 from "../../assets/color-logo-3.png";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

function Footer() {

  // keeps your existing logic (no removal)
  const { pathname, hash } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Extend logic for hash scrolling
  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100); // small delay to ensure page is loaded/scrolled to top first
      }
    }
  }, [hash, pathname]);

  return (
    <footer className="footer">

      <div className="footer-container">

        {/* LEFT SECTION */}
        <div className="footer-col brand">

          <Link to="/" className="footer-logo">
            <img src={logoimage} alt="Infycode logo"/>
            <div className="logo-text">
              <img src={logoimage1} alt="Infycode logo"/>
            </div>
          </Link>

          <p>
            There are course and event custom post types so you can easily
            create and manage course, events.
          </p>

          <div className="contact">
            <p><FaPhoneAlt /> +91 XXX XXX XXXX</p>
            <p><FaEnvelope /> info@infycode.com</p>
          </div>

        </div>


        {/* ABOUT */}
        <div className="footer-col">
          <h3>About Us</h3>

          <Link to="/#why-choose" className="footer-link" onClick={() => window.scrollTo(0, 0)}>About</Link>
          <Link to="/courses" className="footer-link" onClick={() => window.scrollTo(0, 0)}>Courses</Link>
          <Link to="/trainings" className="footer-link" onClick={() => window.scrollTo(0, 0)}>Trainings</Link>
          <Link to="/trainings/corporate" className="footer-link" onClick={() => window.scrollTo(0, 0)}>Corporate</Link>
          <Link to="/become-trainer" className="footer-link" onClick={() => window.scrollTo(0, 0)}>Become a Trainer</Link>
          <Link to="/contact" className="footer-link" onClick={() => window.scrollTo(0, 0)}>Contact</Link>

        </div>


        {/* LINKS */}
        <div className="footer-col">
          <h3>Useful Links</h3>

          <Link to="/resources" className="footer-link" onClick={() => window.scrollTo(0, 0)}>Resources</Link>
          <Link to="/resources/articles" className="footer-link" onClick={() => window.scrollTo(0, 0)}>Articles</Link>
          <Link to="/resources/ebooks" className="footer-link" onClick={() => window.scrollTo(0, 0)}>eBooks</Link>
          <Link to="/trainings/institutional" className="footer-link" onClick={() => window.scrollTo(0, 0)}>Institutional</Link>
          <Link to="/#faq" className="footer-link" onClick={() => window.scrollTo(0, 0)}>FAQ</Link>
          <Link to="/#testimonials" className="footer-link" onClick={() => window.scrollTo(0, 0)}>Testimonials</Link>

        </div>


        {/* NEWSLETTER */}
        <div className="footer-col">
          <h3>Newsletter</h3>

          <p className="newsletter-text">
            Get the latest Infycode news delivered to your inbox
          </p>

          <div className="newsletter-box">
            <input type="email" placeholder="Enter your email" />
            <button>→</button>
          </div>

        </div>

      </div>


      {/* BOTTOM BAR */}
      <div className="footer-bottom">

        <p>
          © 2026 <span>InfyCode</span>. Product By Charani Infotech Pvt Ltd. All Rights Reserved 
        </p>

        <div className="socials">

          <p>Follow us</p>

          <div className="icons">

            <Link to="/instagram" className="social-circle" onClick={() => window.scrollTo(0, 0)}>
              <i className="fa-brands fa-instagram"></i>
            </Link>

            <div className="social-circle">
              <i className="fa-brands fa-x-twitter"></i>
            </div>

            <div className="social-circle">
              <i className="fa-brands fa-whatsapp"></i>
            </div>

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;