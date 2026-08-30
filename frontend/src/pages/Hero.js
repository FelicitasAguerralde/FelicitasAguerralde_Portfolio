import React from 'react';
import '../styles/Hero.css';
import CubesBackground from '../background/CubesBackground';

const Hero = ({ name, title, location, github, linkedin, email }) => {
  return (
    <section id="hero" className="hero">
      <CubesBackground />
      <div className="hero-container">
        <div className="index-intro">
          <span className="index-intro-label">PORTFOLIO</span>
          <h1>Felicitas Aguerralde</h1>
          <p>Software Developer</p>
          <span className="index-intro-detail">
            Interfaces, ideas y código.
          </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
