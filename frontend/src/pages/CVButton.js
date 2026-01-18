
import "../styles/CvButton.css";
import { FaFileDownload } from "react-icons/fa";
const CVButton = () => {
  return (
    <a href="/doc/CV_Aguerralde_Felicitas.pdf" download className="cv-button">
      <FaFileDownload /> Descargar CV
    </a>
  );
};

export default CVButton;