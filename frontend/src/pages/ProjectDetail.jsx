import {
    FaArrowLeft,
    FaCalendarAlt,
    FaCode,
    FaExternalLinkAlt,
    FaServer,
} from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/ProjectDetail.css';

const formatProjectDate = (date) => {
  if (!date) return null;

  return new Date(`${date}T12:00:00`).toLocaleDateString('es-AR', {
    month: 'long',
    year: 'numeric',
  });
};

function ProjectDetail({ projects }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const project = projects.find(
    (p) => p.id === Number(id)
  );

  const handleBack = () => {
    navigate('/');
    setTimeout(() => {
      const projectsSection = document.getElementById('projects');
      if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  if (!project) {
    return (
      <section className="project-detail project-detail-empty">
        <h2>Proyecto no encontrado</h2>
        <button onClick={handleBack} className="back-btn">
          <FaArrowLeft /> Volver a proyectos
        </button>
      </section>
    );
  }

  return (
    <section className="project-detail">
      <div className="project-detail-shell">
        <button onClick={handleBack} className="back-btn">
          <FaArrowLeft /> Volver a proyectos
        </button>

        <header className="project-detail-header">
          <div>
            <span className="project-detail-eyebrow">PROYECTO</span>
            <h1>{project.title}</h1>
            <div className="project-detail-meta">
              {project.category && <span className="detail-category">{project.category}</span>}
              {project.status && <span className="detail-status">{project.status}</span>}
            </div>
          </div>
          {project.date && (
            <span className="detail-date">
              <FaCalendarAlt /> {formatProjectDate(project.date)}
            </span>
          )}
        </header>

        <div className="project-detail-hero">
          <img src={project.imageUrl} alt={`Vista previa de ${project.title}`} />
        </div>

        <div className="project-detail-layout">
          <main className="project-detail-main">
            <section className="detail-section">
              <span className="detail-section-label">DESCRIPCIÓN</span>
              <h2>Sobre el proyecto</h2>
              <p>{project.longDescription}</p>
            </section>

            <div className="project-detail-actions">
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="detail-action detail-action-primary">
                  <FaCode /> Código fuente
                </a>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="detail-action">
                  <FaExternalLinkAlt /> Ver demo
                </a>
              )}
            </div>
          </main>

          <aside className="project-detail-sidebar">
            <section className="detail-panel">
              <div className="detail-panel-heading">
                <FaCode />
                <h2>Tecnologías</h2>
              </div>
              <ul className="tech-list">
                {(project.technologies || []).map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
            </section>

            {project.infrastructure?.length > 0 && (
              <section className="detail-panel">
                <div className="detail-panel-heading">
                  <FaServer />
                  <h2>Infraestructura</h2>
                </div>
                <ul className="infrastructure-list">
                  {project.infrastructure.map((infra) => (
                    <li key={infra}>{infra}</li>
                  ))}
                </ul>
              </section>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}

export default ProjectDetail;
