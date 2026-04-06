import React, { useEffect, useRef, useState } from 'react';
import './Achievements.css';

function Achievements() {

  const [counts, setCounts] = useState([0, 0, 0, 0]);
  const sectionRef = useRef(null);
  const intervalRef = useRef(null);

  const targetValues = [120, 17, 70, 50];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          startCounting();
        } else {
          // Reset when leaving viewport
          setCounts([0, 0, 0, 0]);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const startCounting = () => {
    // Clear previous interval if any
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const duration = 2000;
    const intervalTime = 20;
    const steps = duration / intervalTime;

    let currentStep = 0;

    intervalRef.current = setInterval(() => {
      currentStep++;

      const progress = currentStep / steps;

      const newCounts = targetValues.map((target) =>
        Math.floor(target * progress)
      );

      setCounts(newCounts);

      if (currentStep >= steps) {
        setCounts(targetValues);
        clearInterval(intervalRef.current);
      }
    }, intervalTime);
  };

  return (
    <div className="achievements-wrapper" ref={sectionRef}>
      <section className="counter-up section-padding">
        <div className="container">
          <div className="counter-title text-center">
            <h2>Trusted by <span>Companies</span> Achievements</h2>
          </div>

          <div className="row">

            {/* Item 1 */}
            <div className="col-xl-3 col-md-6 col-12">
              <div className="counter-item">
                <div className="cicon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <h4>
                  <span className="cnumb">{counts[0]}</span>k+
                </h4>
                <p>Our Happy Students</p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="col-xl-3 col-md-6 col-12">
              <div className="counter-item">
                <div className="cicon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                  </svg>
                </div>
                <h4>
                  <span className="cnumb">{counts[1]}</span>k+
                </h4>
                <p>Enrolled Learners</p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="col-xl-3 col-md-6 col-12">
              <div className="counter-item">
                <div className="cicon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h20"/>
                    <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/>
                    <path d="m7 21 5-5 5 5"/>
                  </svg>
                </div>
                <h4>
                  <span className="cnumb">{counts[2]}</span>k+
                </h4>
                <p>Expert Instructor</p>
              </div>
            </div>

            {/* Item 4 */}
            <div className="col-xl-3 col-md-6 col-12">
              <div className="counter-item">
                <div className="cicon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="7"/>
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
                  </svg>
                </div>
                <h4>
                  <span className="cnumb">{counts[3]}</span>k+
                </h4>
                <p>Satisfaction Rate</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

export default Achievements;