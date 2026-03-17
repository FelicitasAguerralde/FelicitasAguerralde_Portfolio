import { SiSitepoint } from "react-icons/si";
import { useParams } from "react-router-dom";
import '../styles/ProjectDetail.css';
import { useNavigate } from "react-router-dom";

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
    return <h2>Proyecto no encontrado</h2>;
  }

  return (
    <section className="project-detail">
      <button onClick={handleBack} className="back-btn">← Volver</button>

      <h1>{project.title}</h1>
      <p className="category">{project.category}</p>

      <img src={project.imageUrl} alt={project.title} />

      <p>{project.longDescription}</p>

      <h3>Tecnologías</h3>
      <ul>
        {(project.technologies || []).map((tech) => (
          <li key={tech}><SiSitepoint />  {tech}</li>
        ))}
      </ul>

      {project.infrastructure && project.infrastructure.length > 0 && (
        <>
          <h3>Infraestructura</h3>
          <ul>
            {(project.infrastructure || []).map((infra) => (
              <li key={infra}><SiSitepoint />  {infra}</li>
            ))}
          </ul>
        </>
      )}

      {project.status && (
        <p><strong>Estado:</strong> {project.status}</p>
      )}
      {project.date && (
        <p><strong>Fecha:</strong> {project.date}</p>
      )}

      <div className="links">
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">Código</a>
        )}
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">Demo</a>
        )}
      </div>
    </section>
  );
}

export default ProjectDetail;
