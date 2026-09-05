// Skills.js con paginación
import { useEffect, useMemo, useRef, useState } from 'react';
import { FaCode, FaServer, FaWrench } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import HexagonBackground from '../background/HexagonBackground';
import '../styles/Skills.css';

const frontendSkills = new Set([
  'React', 'React Router DOM', 'React Bootstrap', 'React Icons', 'React Toastify',
  'React Helmet Async', 'React Ga4', 'Angular', 'HTML5', 'CSS3', 'JavaScript',
  'Typewriter Effect', 'Bootstrap', 'Figma (Design System)', 'Vite', 'i18next',
  'chart.js', 'Google Analytics', 'OpenWeather API',
]);

const backendSkills = new Set([
  'Node.js', 'Express.js', 'Express', 'MongoDB', 'Mongoose', 'PostgreSQL',
  'MySQL', 'Spring Boot', 'API REST', 'Express Validator', 'Nodemailer',
  'Resend', 'Jsonwebtoken', 'Jwt Simple', 'Bcryptjs', 'Multer', 'CORS',
  'Jest', 'Supertest',
]);

const getSkillCategory = (skillName) => {
  if (frontendSkills.has(skillName)) return 'frontend';
  if (backendSkills.has(skillName)) return 'backend';
  return 'tools';
};

const categoryData = {
  frontend: { label: 'Frontend', icon: FaCode },
  backend: { label: 'Backend', icon: FaServer },
  tools: { label: 'Herramientas', icon: FaWrench },
};

const Skills = ({ skills }) => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [animatedLevels, setAnimatedLevels] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const skillsPerPage = 6; // Mostrar 6 habilidades por página

  // Calcular índices
  const indexOfLastSkill = currentPage * skillsPerPage;
  const indexOfFirstSkill = indexOfLastSkill - skillsPerPage;
  const currentSkills = useMemo(
    () => skills.slice(indexOfFirstSkill, indexOfLastSkill),
    [skills, indexOfFirstSkill, indexOfLastSkill]
  );

  // Calcular número total de páginas
  const totalPages = Math.ceil(skills.length / skillsPerPage);

  // Funciones de paginación
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const openSkillProjects = (skillName) => {
    navigate(`/?skill=${encodeURIComponent(skillName)}#projects`);
  };

  useEffect(() => {
    const node = sectionRef.current;

    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.25 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) {
      setAnimatedLevels({});
      return undefined;
    }

    let rafId = null;
    let startTs = null;
    const durationMs = 2200;

    const targets = {};
    currentSkills.forEach((skill, i) => {
      const key = String(indexOfFirstSkill + i);
      const level = Number(skill?.level) || 0;
      targets[key] = Math.max(0, Math.min(100, level));
    });

    const zeros = {};
    Object.keys(targets).forEach((k) => { zeros[k] = 0; });
    setAnimatedLevels(zeros);

    const tick = (ts) => {
      if (startTs === null) startTs = ts;
      const t = Math.min(1, (ts - startTs) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic

      const next = {};
      Object.entries(targets).forEach(([k, target]) => {
        next[k] = target * eased;
      });
      setAnimatedLevels(next);

      if (t < 1) rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [currentPage, indexOfFirstSkill, currentSkills, isVisible]);

  return (
    <section ref={sectionRef} id="skills" className="skills">
      <HexagonBackground />
      <div className="container skills-inner">
        <h2 className="section-title">Mis <span className="highlight">Habilidades</span></h2>
        <div className="skills-grid">
          {currentSkills.map((skill, index) => (
            <div
              key={index}
              className="skill-item"
              role="button"
              tabIndex={0}
              onClick={() => openSkillProjects(skill.name)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  openSkillProjects(skill.name);
                }
              }}
              aria-label={`Ver proyectos con ${skill.name}`}
            >
              {(() => {
                const category = getSkillCategory(skill.name);
                const { label, icon: CategoryIcon } = categoryData[category];

                return (
                  <>
                    <div className="skill-header">
                      <div className="skill-title">
                        <span className={`skill-icon ${category}`} aria-hidden="true">
                          <CategoryIcon />
                        </span>
                        <span className="skill-name">{skill.name}</span>
                      </div>
                      <span className={`skill-category ${category}`}>{label}</span>
                    </div>
                  </>
                );
              })()}
              <div className="skill-bar">
                <div 
                  className="skill-progress" 
                  style={{ width: `${animatedLevels[String(indexOfFirstSkill + index)] ?? 0}%` }}
                ></div>
              </div>
              <div className="skill-info">
                <span className="skill-context">Presente en proyectos</span>
                <span className="skill-percent">
                  {Math.round(animatedLevels[String(indexOfFirstSkill + index)] ?? 0)}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              onClick={prevPage} 
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              ← Anterior
            </button>
            
            <div className="pagination-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`pagination-number ${currentPage === number ? 'active' : ''}`}
                >
                  {number}
                </button>
              ))}
            </div>
            
            <button 
              onClick={nextPage} 
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;