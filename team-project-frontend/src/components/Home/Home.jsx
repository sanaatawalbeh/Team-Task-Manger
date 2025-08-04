import React from "react";
import "./Home.css";
import teamPlanningImg from "../../Assets/08a724c2-4611-4ef0-bf3d-bc0e9cab4aeb.jpg";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi"; // ← استيراد الأيقونة

export default function Home() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/register");
  };
  return (
    <section className="hero-container">
      <div className="hero-text">
        <h1 className="hero-title">
          Where your teams and AI coordinate work together
        </h1>
        <p className="hero-subtitle">
          See how your work connects to goals while working alongside AI that
          understands your business.
        </p>
        <div className="hero-buttons">
          <button className="btn-primary-home" onClick={handleGetStarted}>
            Get started
            <span className="arrow-icon">
              <FiArrowRight />
            </span>
          </button>
          <button className="btn-secondary">See how it works</button>
        </div>
      </div>

      {/* Section for the image and text */}
      <div className="planning-section">
        <img
          src={teamPlanningImg}
          alt="Team planning"
          className="planning-img"
        />
        <div className="planning-text">
          <h2>Smart Task Planning</h2>
          <p>
            Break down your work into smart segments. With the power of
            structured planning, your team can move faster and achieve goals
            more efficiently.
          </p>
        </div>
      </div>
    </section>
  );
}
