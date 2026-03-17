// Skills.js con paginación
import { useEffect, useMemo, useState } from 'react';
import '../styles/Skills.css';

const Skills = ({ skills }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [animatedLevels, setAnimatedLevels] = useState({});
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

  useEffect(() => {
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
  }, [currentPage, indexOfFirstSkill, currentSkills]);

  return (
    <section id="skills" className="skills">
      <div className="container">
        <h2 className="section-title">Mis <span className="highlight">Habilidades</span></h2>
        <div className="skills-grid">
          {currentSkills.map((skill, index) => (
            <div key={index} className="skill-item">
              <span className="skill-name">{skill.name}</span>
              <div className="skill-bar">
                <div 
                  className="skill-progress" 
                  style={{ width: `${animatedLevels[String(indexOfFirstSkill + index)] ?? 0}%` }}
                ></div>
              </div>
              <span className="skill-percent">
                {Math.round(animatedLevels[String(indexOfFirstSkill + index)] ?? 0)}%
              </span>
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