import React, { useState, useEffect } from "react";  // 🔥 added useEffect
import { useNavigate } from "react-router-dom";
import AOS from "aos";                                // 🔥 NEW
import "aos/dist/aos.css";                            // 🔥 NEW
import "./FAQ.css";

function FAQ() {

  const [openIndex, setOpenIndex] = useState(0);
  const navigate = useNavigate();

  // 🔥 INIT AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "When are admissions open at InfyCode?",
      answer:
        "Admissions at InfyCode are open throughout the year, allowing learners to enroll anytime and start their learning journey immediately."
    },
    {
      question: "How can I access courses and attend sessions?",
      answer:
        "All InfyCode courses are available online. You can access them anytime through your dashboard, including recorded sessions, live classes, and project-based learning modules."
    },
    {
      question: "Are InfyCode courses industry-relevant?",
      answer:
        "Yes, all courses at InfyCode are designed based on current industry standards, focusing on real-world projects, modern technologies, and job-ready skills."
    },
    {
      question: "Do I get certification after course completion?",
      answer:
        "Yes, InfyCode provides a professional certificate upon successful completion of each course, which can be used to enhance your resume and career opportunities."
    },
  ];

  return (

    <section id="faq" className="faq">

      <div className="faq-container">

        {/* 🔥 IMAGE ANIMATION */}
        <div className="faq-image" data-aos="fade-up">
          <img
            src="https://reactheme.com/products/html/echooling/assets/images/Home7/qna/1.png"
            alt="student"
          />
        </div>

        {/* 🔥 QUESTIONS ANIMATION */}
        <div className="faq-questions" data-aos="fade-up">

          <p className="faq-small-title" data-aos="fade-up">
            Learn more about INFYCODE
          </p>

          <h2 data-aos="fade-up" data-aos-delay="100">
            Frequently asked questions
          </h2>

          {faqData.map((item, index) => (

            <div 
              key={index} 
              className="faq-item"
              data-aos="fade-up"
              data-aos-delay={index * 100}   // 🔥 stagger effect
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

          ))}

          {/* 🔥 BUTTON ANIMATION */}
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