import { Link } from "react-router-dom";

function Projects({ projects }) {
  return (
    <section className="projects">
      {projects.map(project => (
        <div key={project.id} className="project-card">
          <img src={project.imageUrl} alt={project.title} />
          <h3>{project.title}</h3>
          <p>{project.description}</p>

          <Link to={`/proyectos/${project.id}`} className="btn-detalles">
            👁 Ver Detalles
          </Link>
        </div>
      ))}
    </section>
  );
}

export default Projects;
