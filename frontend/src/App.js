// App.js
import { useEffect, useMemo, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';

// Pages
import About from './pages/About';
import Contact from './pages/Contact';
import CVButton from './pages/CVButton';
import Education from './pages/Education';
import Footer from './pages/Footer';
import Hero from './pages/Hero';
import Navbar from './pages/Navbar';
import ProjectDetail from './pages/ProjectDetail';
import Projects from './pages/Projects';
import Skills from './pages/Skills';

// Data
import portfolioData from './data/portfolio.json';
import projectsData from './data/projects.json';

// Componente para scrollear al top en cada cambio de ruta
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [projects, setProjects] = useState([]);

  // Cargar proyectos y manejar dark mode
  useEffect(() => {
    setProjects(projectsData);
    document.body.style.overflow = 'auto';
  }, []);

  // Calcular skills desde proyectos
  const skills = useMemo(() => {
    const techCount = {};

    projects.forEach((project) => {
      project.technologies.forEach((tech) => {
        techCount[tech] = (techCount[tech] || 0) + 1;
      });
    });

    const totalProjects = projects.length;
    if (totalProjects === 0) return [];

    return Object.keys(techCount)
      .map((name) => ({
        name,
        level: Math.round((techCount[name] / totalProjects) * 100),
      }))
      .sort((a, b) => b.level - a.level);
  }, [projects]);


  return (
    <div className="app">
      <ScrollToTop />
      <Navbar
      />
      <CVButton />

      <div className="app-content">
        <Routes>
          {/* HOME */}
          <Route
            path="/"
            element={
              <>
                <Hero
                  name={portfolioData.personalInfo.name}
                  title={portfolioData.personalInfo.title}
                  description={portfolioData.personalInfo.description}
                  location={portfolioData.personalInfo.location}
                  email={portfolioData.personalInfo.email}
                  github={portfolioData.social.github}
                  linkedin={portfolioData.social.linkedin}
                  avatar={portfolioData.personalInfo.avatar}
                />

                <About
                  about={portfolioData.personalInfo.about}
                  bio={portfolioData.personalInfo.bio}
                  email={portfolioData.personalInfo.email}
                  education={portfolioData.education}
                  experience={portfolioData.experience}
                />

                <Skills skills={skills} />

                <Projects projects={projects} />

                <Education />
                <Contact
                  email={portfolioData.personalInfo.email}
                  github={portfolioData.social.github}
                  linkedin={portfolioData.social.linkedin}
                  phone={portfolioData.personalInfo.phone}
                />
              </>
            }
          />

          {/* DETALLE DE PROYECTO */}
          <Route
            path="/proyectos/:id"
            element={<ProjectDetail projects={projects} />}
          />
        </Routes>
      </div>
      <Footer
        name={portfolioData.personalInfo.name}
        email={portfolioData.personalInfo.email}
        github={portfolioData.social.github}
        linkedin={portfolioData.social.linkedin}
      />
    </div>
  );
}

export default App;
