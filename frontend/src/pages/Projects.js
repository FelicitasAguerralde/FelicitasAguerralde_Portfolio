import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Projects.css';
const Projects = ({ projects }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage, setProjectsPerPage] = useState(6);
  const [isAnimating, setIsAnimating] = useState(false);
  const [filter, setFilter] = useState('all');
  const [revealNonce, setRevealNonce] = useState(0);

  // Categorías únicas de proyectos
  const categories = ['all', ...new Set(projects.map(project => 
    project.category || 'web'
  ))];

  // Filtrar proyectos
  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => (project.category || 'web') === filter);

  // Efecto para animación solo al cambiar filtro
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [filter]);

  // Re-disparar animación de aparición solo al cambiar filtro
  useEffect(() => {
    setRevealNonce((n) => n + 1);
  }, [filter]);

  // Resetear a página 1 cuando cambia el filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  // Calcular proyectos para la página actual
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  // Calcular número total de páginas
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  // Cambiar página
  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      // Scroll suave hacia la sección de proyectos
      const projectsSection = document.getElementById('projects');
      if (projectsSection) {
        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 70;
        const sectionPosition = projectsSection.offsetTop - navbarHeight - 20;
        window.scrollTo({
          top: sectionPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  // Manejar cambio de proyectos por página
  const handlePerPageChange = (e) => {
    const newPerPage = parseInt(e.target.value);
    setProjectsPerPage(newPerPage);
    setCurrentPage(1); // Volver a la primera página
  };

  // Generar números de página a mostrar (con elipsis para muchas páginas)
  const getPageNumbersToShow = () => {
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    const pages = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);
    
    if (currentPage <= 3) {
      end = Math.min(totalPages, maxVisiblePages);
    } else if (currentPage >= totalPages - 2) {
      start = totalPages - maxVisiblePages + 1;
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  // Si no hay proyectos
  if (projects.length === 0) {
    return (
      <section id="projects" className="projects">
        <div className="container">
          <h2 className="section-title">Mis <span className="highlight">Proyectos</span></h2>
          <div className="no-projects">
            <div className="no-projects-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <h3>No hay proyectos disponibles</h3>
            <p>Actualmente estoy trabajando en nuevos proyectos. ¡Vuelve pronto para ver mis últimos trabajos!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="projects">
      <div className="container">
        <h2 className="section-title">Mis <span className="highlight">Proyectos</span></h2>
        {/* Filtros por categoría */}
        <div className="projects-filters">
          <div className="filters-container">
            <div className="filter-buttons">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`filter-btn ${filter === category ? 'active' : ''}`}
                >
                  {category === 'all' ? 'Todos' : 
                   category === 'web' ? 'Web' :
                   category === 'mobile' ? 'Móvil' :
                   category === 'fullstack' ? 'Full Stack' :
                   category === 'frontend' ? 'Frontend' :
                   category === 'backend' ? 'Backend' : 
                   category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="projects-count">
            <span className="count-number">{filteredProjects.length}</span>
            <span className="count-label">proyectos {filter !== 'all' && `en ${filter}`}</span>
          </div>
        </div>

        {/* Grid de proyectos con animación */}
        <div className={`projects-grid ${isAnimating ? 'animating' : ''}`}>
          {currentProjects.length > 0 ? (
            currentProjects.map((project, idx) => (
              <ProjectCard 
                key={`${project.id}-${revealNonce}`} 
                project={project}
                index={idx}
              />
            ))
          ) : (
            <div className="no-filtered-projects">
              <p>No hay proyectos en esta categoría.</p>
            </div>
          )}
        </div>

        {/* Paginación - solo si hay más de una página */}
        {filteredProjects.length > projectsPerPage && (
          <div className="pagination-container">
            <div className="pagination-info">
              <span className="pagination-stats">
                Mostrando proyectos <strong>{indexOfFirstProject + 1}-{Math.min(indexOfLastProject, filteredProjects.length)}</strong> de <strong>{filteredProjects.length}</strong>
              </span>
              <span className="page-stats">
                Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
              </span>
            </div>
            
            <div className="pagination-controls">
              <div className="pagination">
                {/* Botón primera página */}
                <button 
                  onClick={() => paginate(1)} 
                  disabled={currentPage === 1}
                  className="pagination-btn first-page"
                  aria-label="Primera página"
                  title="Primera página"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="11 17 6 12 11 7"></polyline>
                    <polyline points="18 17 13 12 18 7"></polyline>
                  </svg>
                </button>
                
                {/* Botón anterior */}
                <button 
                  onClick={() => paginate(currentPage - 1)} 
                  disabled={currentPage === 1}
                  className="pagination-btn prev-page"
                  aria-label="Página anterior"
                  title="Página anterior"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                
                {/* Números de página con elipsis */}
                {(() => {
                  const pageNumbers = getPageNumbersToShow();
                  return pageNumbers.map((number, index, array) => {
                    const showEllipsis = index > 0 && number !== array[index - 1] + 1;
                    return (
                      <React.Fragment key={number}>
                        {showEllipsis && (
                          <span className="pagination-ellipsis" aria-hidden="true">...</span>
                        )}
                        <button
                          onClick={() => paginate(number)}
                          className={`pagination-btn ${currentPage === number ? 'active' : ''}`}
                          aria-label={`Ir a página ${number}`}
                          aria-current={currentPage === number ? 'page' : undefined}
                          title={`Página ${number}`}
                        >
                          {number}
                        </button>
                      </React.Fragment>
                    );
                  });
                })()}
                
                {/* Botón siguiente */}
                <button 
                  onClick={() => paginate(currentPage + 1)} 
                  disabled={currentPage === totalPages}
                  className="pagination-btn next-page"
                  aria-label="Página siguiente"
                  title="Página siguiente"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
                
                {/* Botón última página */}
                <button 
                  onClick={() => paginate(totalPages)} 
                  disabled={currentPage === totalPages}
                  className="pagination-btn last-page"
                  aria-label="Última página"
                  title="Última página"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="13 17 18 12 13 7"></polyline>
                    <polyline points="6 17 11 12 6 7"></polyline>
                  </svg>
                </button>
              </div>
              
              {/* Selector de proyectos por página */}
              <div className="per-page-selector">
                <label htmlFor="perPage" className="per-page-label">Mostrar:</label>
                <div className="select-wrapper">
                  <select 
                    id="perPage" 
                    value={projectsPerPage} 
                    onChange={handlePerPageChange}
                    className="per-page-select"
                    aria-label="Proyectos por página"
                  >
                    <option value="3">3 proyectos</option>
                    <option value="6">6 proyectos</option>
                    <option value="9">9 proyectos</option>
                    <option value="12">12 proyectos</option>
                    <option value="15">15 proyectos</option>
                  </select>
                  <svg className="select-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mostrar mensaje si no hay paginación pero sí proyectos */}
        {filteredProjects.length <= projectsPerPage && filteredProjects.length > 0 && (
          <div className="single-page-notice">
            <p>Mostrando todos los proyectos ({filteredProjects.length} de {filteredProjects.length})</p>
          </div>
        )}
      </div>
    </section>
  );
};

// Componente ProjectCard
const ProjectCard = ({ project, index = 0 }) => {
  return (
    <div
      className={`project-card project-card-reveal ${project.featured ? 'featured' : ''}`}
      style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}
    >
      {project.featured && (
        <div className="featured-badge" aria-label="Proyecto destacado">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          <span>Destacado</span>
        </div>
      )}
      
      <div className="project-image">
        <img 
          src={project.imageUrl} 
          alt={project.title} 
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
          }}
        />
        <div className="project-overlay">
          <Link 
            to={`/proyectos/${project.id}`}
            className="project-view-btn" 
            aria-label={`Ver detalles de ${project.title}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            Ver Detalles
          </Link>
        </div>
      </div>
      
      <div className="project-content">
        <div className="project-header">
          <h3 className="project-title">{project.title}</h3>
          {project.category && (
            <span className="project-category">{project.category}</span>
          )}
        </div>
        
        <p className="project-description" title={project.description}>
          {project.description}
        </p>
        
        <div className="project-tech">
          {project.technologies.slice(0, 4).map((tech, idx) => (
            <span key={idx} className="tech-tag" title={tech}>
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="tech-tag more-tech" title={`+${project.technologies.length - 4} tecnologías más`}>
              +{project.technologies.length - 4}
            </span>
          )}
        </div>
        
        <div className="project-links">
          <a 
            href={project.githubUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="project-link code-link"
            title="Ver código fuente en GitHub"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
            <span>Código</span>
          </a>
          
          {project.liveUrl && (
            <a 
              href={project.liveUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="project-link demo-link"
              title="Ver demo en vivo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              <span>Demo</span>
            </a>
          )}
          
          <Link 
            to={`/proyectos/${project.id}`}
            className="project-link info-link" 
            title="Más información sobre este proyecto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span>Detalles</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Projects;