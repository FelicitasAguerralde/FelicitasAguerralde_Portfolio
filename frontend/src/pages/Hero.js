import CubesBackground from '../background/CubesBackground';
import '../styles/Hero.css';

const Hero = ({ name, title, location, github, linkedin, email }) => {
  return (
    <section id="hero" className="hero">
      <CubesBackground />
      <div className="hero-container">
        <div className="hero-content">
          <span className="index-intro-label">PORTFOLIO</span>
          <h1 className="hero-title">
            Hola, soy <span className="hero-highlight">{name}</span>
          </h1>
          <p className="hero-subtitle">{title}</p>
          <p className="hero-description">
            Desarrolladora amante del frontend. Apasionada por crear experiencias de usuario atractivas y funcionales.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
