import React from 'react';
import '../styles/About.css';

const About = ({ about, email }) => {
  return (
    <section id="about" className="about">
      <div className="container">
        <h2 className="section-title">
          Sobre <span className="highlight">mí</span>
        </h2>
        <div className="about-content">
          <p style={{ whiteSpace: 'pre-line' }}>{about}</p>
        </div>
      </div>
    </section>
  );
};

export default About;
