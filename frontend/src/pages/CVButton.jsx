import { FaFileDownload } from 'react-icons/fa';
import '../styles/CvButton.css';

const CVButton = () => {
  return (
    <a
      href="/doc/CV_Felicitas_Aguerralde.pdf"
      download
      className="cv-button"
      aria-label="Descargar currículum en PDF"
    >
      <FaFileDownload aria-hidden="true" />
      <span>Descargar CV</span>
    </a>
  );
};

export default CVButton;