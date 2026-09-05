import { useEffect, useRef, useState } from 'react';
import photo from '../assets/images/photo.png';
import '../styles/About.css';

const About = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;

    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.25 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} id="about" className="about">
      <div className="container about-inner">
        <h2 className={`section-title about-title ${isVisible ? 'is-visible' : ''}`}>
          Sobre <span className="highlight">mí</span>
        </h2>
        <div className="about-content">
          <div className={`photo ${isVisible ? 'is-visible' : ''}`}>
            <img
              src={photo}
              alt="Foto de perfil"
              className="about-photo"
            />
          </div>
          <div className={`text ${isVisible ? 'is-visible' : ''}`}>
          <p>
            <strong className="accent">
              Desarrolladora Full Stack Jr. con orientación Frontend
            </strong>
            , estudiante avanzada de la Tecnicatura Universitaria en Desarrollo
            de Aplicaciones Informáticas (TUDAI - UNICEN), con el 100 % de las
            cursadas aprobadas y dos finales pendientes.
          </p>

          <p>
            Cuento con <strong className="accent">experiencia en el desarrollo de aplicaciones web y
            conocimientos en tecnologías Frontend y Backend</strong>. Me caracterizo por
            tener un < strong className="accent">pensamiento lógico, capacidad de resolución de problemas,
            organización y facilidad para el trabajo en equipo </strong>. Mi experiencia
            profesional en el ámbito educativo fortaleció además mis habilidades
            de comunicación, responsabilidad y liderazgo colaborativo.
          </p>

          <p>
            Me interesa continuar creciendo profesionalmente en el área de
            desarrollo de software, incorporando nuevas tecnologías y
            participando en proyectos donde pueda aportar tanto mis
            conocimientos técnicos como mi capacidad de aprendizaje y
            adaptación.
          </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
