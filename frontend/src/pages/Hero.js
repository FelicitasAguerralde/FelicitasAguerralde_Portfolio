import { useEffect, useState } from 'react';
import CubesBackground from '../background/CubesBackground';
import '../styles/Hero.css';

const programmingPhrases = [
  'Amante del frontend',
  'Experiencias de usuario atractivas y funcionales',
  'Apasionada y comprometida',
  'En constante aprendizaje'
];

const Hero = ({ name, title, description}) => {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const phraseTimer = setInterval(() => {
      setPhraseIndex((currentIndex) => (
        (currentIndex + 1) % programmingPhrases.length
      ));
    }, 3500);

    return () => clearInterval(phraseTimer);
  }, []);

  return (
    <section id="hero" className="hero">
      <CubesBackground />
      <div className="hero-container">
        <div className="hero-content">
          <span className="index-intro-label">PORTFOLIO</span>
          <h1 className="hero-title">
            <span className="hero-highlight">{name}</span>
          </h1>
          <p className="hero-subtitle">{title}</p>
          <p
            key={phraseIndex}
            className="hero-rotating-text typewriter-phrase"
            style={{
              '--typewriter-characters': programmingPhrases[phraseIndex].length,
            }}
            aria-live="polite"
          >
            {programmingPhrases[phraseIndex]}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
