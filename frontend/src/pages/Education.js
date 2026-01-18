import { useState } from 'react';
import educationData from '../data/education.json';
import '../styles/Education.css';

const Education = () => {
  const { academic, courses } = educationData;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const itemsPerPage = 6; // Adjust as needed

  // Filter courses by category
  const filteredCourses =
    selectedCategory === 'all'
      ? courses
      : courses.filter((course) => course.category === selectedCategory);

  // Calculate pagination for filtered courses
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCourses = filteredCourses.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when changing category
  };

  return (
    <section className="education-section" id="education">
      <h2>Formación</h2>

      {/* ===== Formación Académica ===== */}
      <div className="education-block">
        <h3 className="education-subtitle">Formación Académica</h3>

        <div className="education-grid">
          {academic.map((item, index) => (
            <div className="education-card" key={index}>
              <h3>{item.title}</h3>

              <div className="institution">{item.institution}</div>

              <div className="date">
                {item.startYear} – {item.endYear}
              </div>

              {item.status && <p>{item.status}</p>}
              {item.description && <p>{item.description}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* ===== Cursos ===== */}
      <div className="education-block">
        <h3 className="education-subtitle">Cursos y Certificaciones</h3>

        {/* Filter buttons */}
        <div className="projects-filters">
          <div className="filter-buttons filters-container">
            <button
              className={`filter-btn ${
                selectedCategory === 'all' ? 'active' : ''
              }`}
              onClick={() => handleCategoryChange('all')}
            >
              Todos
            </button>
            <button
              className={`filter-btn ${
                selectedCategory === 'programacion' ? 'active' : ''
              }`}
              onClick={() => handleCategoryChange('programacion')}
            >
              Programación
            </button>
            <button
              className={`filter-btn ${
                selectedCategory === 'educacion' ? 'active' : ''
              }`}
              onClick={() => handleCategoryChange('educacion')}
            >
              Educación
            </button>
          </div>
          <div className="education-count">
            <span className="count-number">{filteredCourses.length}</span>
            <span className="count-label">
              cursos {selectedCategory !== 'all' && `en ${selectedCategory}`}
            </span>
          </div>
        </div>

        <div className="education-grid">
          {currentCourses.map((course, index) => (
            <div className="education-card" key={index}>
              <h3>{course.title}</h3>

              <div className="institution">{course.institution}</div>

              <div className="date">{course.year}</div>

              {course.description && <p>{course.description}</p>}

              {course.technologies && (
                <div className="education-tags">
                  {course.technologies.map((tech, i) => (
                    <span className="education-tag" key={i}>
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              {course.certificateUrl && (
                <a
                  href={course.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="education-link"
                >
                  Ver certificado
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`pagination-btn ${
                  page === currentPage ? 'active' : ''
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Education;
