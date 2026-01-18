import React from 'react';
import '../styles/Hero.css';

const Hero = ({ name, title, location, github, linkedin, email }) => {
  return (
    <section id="hero" className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Hola, soy <span className="highlight">{name}</span>
          </h1>
          <h2 className="hero-subtitle">{title}</h2>
          <p className="hero-description">
            Desarrolladora amante del frontend. Apasionada por crear experiencias de usuario atractivas y funcionales.
          </p>
          <div className="hero-buttons">
            <a href="#projects" className="btn">Ver Proyectos</a>
            <a href='#contact' className="btn btn-secondary">Contactar</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;