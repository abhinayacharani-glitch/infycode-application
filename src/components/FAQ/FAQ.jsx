import React, { useState } from "react";
import { useNavigate } from "react-router-dom";   // ✅ NEW
import "./FAQ.css";

function FAQ() {

  const [openIndex, setOpenIndex] = useState(0);
  const navigate = useNavigate();   // ✅ NEW

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

        <div className="faq-image">
          <img
            src="https://reactheme.com/products/html/echooling/assets/images/Home7/qna/1.png"
            alt="student"
          />
        </div>

        <div className="faq-questions">

          <p className="faq-small-title">Learn more about INFYCODE</p>

          <h2>Frequently asked questions</h2>

          {faqData.map((item, index) => (

            <div key={index} className="faq-item">

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

          {/* ✅ UPDATED BUTTON */}
          <button 
            className="faq-btn"
            onClick={() => navigate("/courses")}
          >
            View Courses
          </button>

        </div>

      </div>

    </section>

  );
}

export default FAQ;