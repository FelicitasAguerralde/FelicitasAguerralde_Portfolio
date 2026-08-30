// Navbar.js con menú hamburguesa funcional
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = ({ name, darkMode, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false); // Cierra el menú al hacer clic
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cierra el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        !event.target.closest('.navbar-menu') &&
        !event.target.closest('.navbar-hamburger')
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => scrollToSection('hero')}>
          {name}
        </div>

        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="navbar-item">
            <button
              onClick={() => scrollToSection('about')}
              className="navbar-link"
            >
              Sobre mí
            </button>
          </li>
          <li className="navbar-item">
            <button
              onClick={() => scrollToSection('skills')}
              className="navbar-link"
            >
              Habilidades
            </button>
          </li>
          <li className="navbar-item">
            <button
              onClick={() => scrollToSection('projects')}
              className="navbar-link"
            >
              Proyectos
            </button>
          </li>
          <li className="navbar-item">
            <button
              onClick={() => scrollToSection('education')}
              className="navbar-link"
            >
              Formación
            </button>
          </li>
        </ul>

        <div className="navbar-actions">
        
          <a
            href="#contact"
            className="btn"
            onClick={() => setIsMenuOpen(false)}
          >
            Contactame
          </a>

          <button
            className={`navbar-hamburger ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
