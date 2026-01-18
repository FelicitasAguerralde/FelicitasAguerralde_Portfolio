// src/services/dataService.js
import portfolioData from '../data/portfolio.json';
import projectsData from '../data/projects.json';

// Simular una API local
export const DataService = {
  // Obtener todos los proyectos
  getProjects: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: projectsData,
          total: projectsData.length
        });
      }, 300); // Simular delay de red
    });
  },

  // Obtener proyecto por ID
  getProjectById: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const project = projectsData.find(p => p.id === id);
        if (project) {
          resolve({
            success: true,
            data: project
          });
        } else {
          reject({
            success: false,
            message: 'Proyecto no encontrado'
          });
        }
      }, 200);
    });
  },

  // Obtener proyectos por categoría
  getProjectsByCategory: (category) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = category === 'all' 
          ? projectsData 
          : projectsData.filter(p => p.category === category);
        
        resolve({
          success: true,
          data: filtered,
          total: filtered.length
        });
      }, 200);
    });
  },

  // Obtener datos del portfolio
  getPortfolioData: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: portfolioData
        });
      }, 100);
    });
  },

  // Obtener proyectos destacados
  getFeaturedProjects: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const featured = projectsData.filter(p => p.featured);
        resolve({
          success: true,
          data: featured,
          total: featured.length
        });
      }, 200);
    });
  }
};

export default DataService;