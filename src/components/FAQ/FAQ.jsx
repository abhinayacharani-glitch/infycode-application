import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "./FAQ.css";
import { getNewPublishedFAQs } from "../../services/api";

function FAQ() {

  const [openIndex, setOpenIndex] = useState(0);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // INIT AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
  }, []);

  // Fetch real FAQs
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const data = await getNewPublishedFAQs();
        if (data && data.faqs && data.faqs.length > 0) {
          setFaqs(data.faqs);
          // Refresh AOS so it detects the new dynamic elements
          setTimeout(() => {
            AOS.refresh();
          }, 100);
        } else {
          setFaqs([]);
        }
      } catch (err) {
        console.error("Failed to fetch FAQs:", err);
        setFaqs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (

    <section id="faq" className="faq">

      <div className="faq-container">

        {/* IMAGE ANIMATION */}
        <div className="faq-image" data-aos="fade-up">
          <img
            src="https://reactheme.com/products/html/echooling/assets/images/Home7/qna/1.png"
            alt="student"
          />
        </div>

        {/* QUESTIONS ANIMATION */}
        <div className="faq-questions" data-aos="fade-up">

          <p className="faq-small-title" data-aos="fade-up">
            Learn more about INFYCODE
          </p>

          <h2 data-aos="fade-up" data-aos-delay="100">
            Frequently asked questions
          </h2>

          {loading ? (
            <p>Loading FAQs...</p>
          ) : faqs.length === 0 ? (
            <p>No published FAQs at the moment.</p>
          ) : (
            faqs.map((item, index) => (

              <div 
                key={item.id || index} 
                className="faq-item"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >

                <div
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
                >

                  <span className={`icon ${openIndex === index ? "active" : ""}`}>

                    <span className={`symbol ${openIndex === index ? "minus" : "plus"}`}>
                      {openIndex === index ? "−" : "+"}
                    </span>

                  </span>

                  <h4>{item.question}</h4>

                </div>

                {openIndex === index && (
                  <p className="faq-answer">{item.answer}</p>
                )}

              </div>

            ))
          )}

          {/* BUTTON ANIMATION */}
          <button 
            className="faq-btn"
            onClick={() => navigate("/faq")}
            data-aos="zoom-in"
            data-aos-delay="300"
          >
            FAQs
          </button>

        </div>

      </div>

    </section>

  );
}

export default FAQ;