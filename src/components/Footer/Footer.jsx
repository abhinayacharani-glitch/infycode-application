import React from "react";
import "./Footer.css";
import logoimage from "../../assets/infycode-final-logo4-1.png";
import logoimage1 from "../../assets/color-logo-3.png";
import { FaPhoneAlt, FaEnvelope, FaArrowUp } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Footer() {

  const { pathname } = useLocation();
  const navigate = useNavigate();

  // ── Handler: Logo → navigate to Home ──────────────────────────────────────
  const handleLogoClick = (e) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // ── Handler: Courses link → scroll to #courses section ─────────────────────
  const handleCoursesClick = (e) => {
    e.preventDefault();
    if (pathname === "/") {
      const section = document.getElementById("courses");
      if (section) section.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  // ── Handler: Instagram → internal /instagram page ──────────────────────────
  const handleInstagram = () => {
    navigate("/instagram");
    window.scrollTo(0, 0);
  };

  // ── Handler: WhatsApp → opens WhatsApp Web in new tab ──────────────────────
  const handleWhatsApp = () => {
    window.open("https://wa.me/911234567890", "_blank", "noopener,noreferrer");
  };

  // ── Handler: X (Twitter) → opens Twitter in new tab ────────────────────────
  const handleTwitter = () => {
    window.open("https://twitter.com/", "_blank", "noopener,noreferrer");
  };

  return (
    <footer className="footer">

      <div className="footer-container">

        {/* LEFT — Brand */}
        <div className="footer-col brand">

          <a href="/" className="footer-logo" onClick={handleLogoClick}>
            <img src={logoimage} alt="Infycode logo" />
            <div className="logo-text">
              <img src={logoimage1} alt="Infycode" />
            </div>
          </a>

          <p>
            There are course and event custom post types so you can easily
            create and manage course, events.
          </p>

          <div className="contact">
            <p><FaPhoneAlt /> +91 XXX XXX XXXX</p>
            <p><FaEnvelope /> info@infycode.com</p>
          </div>

        </div>

        {/* ABOUT US */}
        <div className="footer-col">
          <h3>About Us</h3>

          <Link to="/about" className="footer-link" onClick={() => window.scrollTo(0, 0)}>About</Link>
          <a href="/#courses" className="footer-link" onClick={handleCoursesClick}>Courses</a>
          <Link to="/trainings" className="footer-link" onClick={() => window.scrollTo(0, 0)}>Trainings</Link>
          <Link to="/trainings/corporate" className="footer-link" onClick={() => window.scrollTo(0, 0)}>Corporate</Link>
          <Link to="/become-trainer" className="footer-link" onClick={() => window.scrollTo(0, 0)}>Become a Trainer</Link>
          <Link to="/contact" className="footer-link" onClick={() => window.scrollTo(0, 0)}>Contact</Link>
        </div>

        {/* USEFUL LINKS */}
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

            {/* Instagram → /instagram internal page */}
            <button
              type="button"
              className="social-circle"
              onClick={handleInstagram}
              aria-label="Instagram"
              title="Instagram"
            >
              <i className="fa-brands fa-instagram"></i>
            </button>

            {/* X (Twitter) → opens twitter.com in new tab */}
            <button
              type="button"
              className="social-circle"
              onClick={handleTwitter}
              aria-label="X Twitter"
              title="X (Twitter)"
            >
              <i className="fa-brands fa-x-twitter"></i>
            </button>

            {/* WhatsApp → opens WhatsApp Web in new tab */}
            <button
              type="button"
              className="social-circle"
              onClick={handleWhatsApp}
              aria-label="WhatsApp"
              title="WhatsApp"
            >
              <i className="fa-brands fa-whatsapp"></i>
            </button>



          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;