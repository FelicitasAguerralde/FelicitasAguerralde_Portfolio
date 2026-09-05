import { useState } from 'react';
import MotionBackground from '../background/MotionBackground';
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
      <MotionBackground />

      <div className="education-inner">
        <h2>Formación</h2>

        {/* ===== Formación Académica ===== */}
        <div className="education-block">
          <h3 className="education-subtitle">Formación Académica</h3>

          <div className="academic-timeline">
            {academic.map((item, index) => (
              <article className="academic-card" key={index}>
                <div className="academic-marker" aria-hidden="true" />
                <div className="academic-card-header">
                  <span className="academic-period">
                    {item.startYear} – {item.endYear}
                  </span>
                  <span className={`academic-status ${item.endYear === 'Presente' ? 'current' : ''}`}>
                    {item.endYear === 'Presente' ? 'En curso' : item.status?.split(' – ')[0] || 'Finalizado'}
                  </span>
                </div>
                <h4>{item.title}</h4>

                <div className="institution">{item.institution}</div>
                {item.description && <p>{item.description}</p>}
                {item.status && <span className="academic-detail">{item.status}</span>}
              </article>
            ))}
          </div>
        </div>

        {/* ===== Cursos ===== */}
        <div className="education-block">
          <h3 className="education-subtitle">Cursos y Certificaciones</h3>

          {/* Filter buttons */}
          <div className="education-controls">
            <div className="education-filter-buttons">
              <button
                className={`education-filter-btn ${
                  selectedCategory === 'all' ? 'active' : ''
                }`}
                onClick={() => handleCategoryChange('all')}
              >
                Todos
              </button>
              <button
                className={`education-filter-btn ${
                  selectedCategory === 'programacion' ? 'active' : ''
                }`}
                onClick={() => handleCategoryChange('programacion')}
              >
                Programación
              </button>
              <button
                className={`education-filter-btn ${
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

          <div className="courses-grid">
            {currentCourses.map((course, index) => (
              <article className="course-card" key={index}>
                <div className="course-card-header">
                  <span className="course-year">{course.year}</span>
                  <span className="course-category">{course.category === 'programacion' ? 'Programación' : 'Educación'}</span>
                </div>
                <h4>{course.title}</h4>

                <div className="institution">{course.institution}</div>

                {course.description && <p>{course.description}</p>}

                {course.technologies && (
                  <div className="course-tags">
                    {course.technologies.map((tech, i) => (
                      <span className="course-tag" key={i}>
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
                    className="course-link"
                  >
                    Ver certificado
                  </a>
                )}
              </article>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="education-pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="education-pagination-btn"
              >
                Anterior
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`education-pagination-btn ${
                    page === currentPage ? 'active' : ''
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="education-pagination-btn"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Education;
