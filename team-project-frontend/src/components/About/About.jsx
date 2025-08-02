import React from "react";
import "./About.css";
import {
  FaMagic,
  FaHeart,
  FaBrain,
  FaUsers,
  FaThLarge,
  FaBolt,
  FaCheckCircle,
} from "react-icons/fa";

export default function About() {
  return (
    <div className="about-container">
      {/* SECTION 1: HEADER */}
      <div className="about-header">
        <h1>Made with love. Built for teams.</h1>
        <p>
          Everything we build is about bringing people and AI together—fluid,
          beautiful, and powerful.
        </p>
      </div>

      {/* TITLE: OUR SERVICES */}
      <div className="services-header">
        <h2>Our Services</h2>
        <p>What we offer to boost your productivity and team flow.</p>
      </div>

      {/* FEATURE CARDS (as services) */}
      <div className="feature-grid">
        <FeatureCard
          icon={<FaMagic />}
          title="Magic Simplicity"
          text="Clean design, clear actions, no clutter. We make productivity feel like magic."
        />
        <FeatureCard
          icon={<FaHeart />}
          title="Human Touch"
          text="We care about people. Our tools feel personal, not robotic."
        />
        <FeatureCard
          icon={<FaUsers />}
          title="Real Collaboration"
          text="Built for real teams, remote or in-office. Always connected."
        />
        <FeatureCard
          icon={<FaThLarge />}
          title="Visual Everything"
          text="From task boards to roadmaps, everything is beautifully visualized."
        />
        <FeatureCard
          icon={<FaBolt />}
          title="Fast & Fluid"
          text="No lag. No drama. Just speed, elegance, and flow."
        />
      </div>

      {/* WHY CHOOSE US SECTION */}
      <div className="why-choose-us-card">
        <h2>Why Choose Us?</h2>
        <ul>
          <li>
            <FaCheckCircle className="check-icon" /> Intuitive & friendly user
            interface
          </li>
          <li>
            <FaCheckCircle className="check-icon" /> Powerful AI recommendations
          </li>
          <li>
            <FaCheckCircle className="check-icon" /> Lightning-fast performance
          </li>
          <li>
            <FaCheckCircle className="check-icon" /> Fully visual and
            collaborative tools
          </li>
          <li>
            <FaCheckCircle className="check-icon" /> Loved by teams around the
            world
          </li>
        </ul>
      </div>

      
    </div>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
