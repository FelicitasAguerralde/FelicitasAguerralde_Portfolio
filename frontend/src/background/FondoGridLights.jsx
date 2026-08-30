import { Grid } from 'react-grid-lights';
import '../styles/FondoGridLights.css';
import FondoTeselasLluvia from './FondoTeselasLluvia';

function FondoGridLights({ children }) {
  return (
    <div className="fondo-grid-container">
      {/* Fondo con Grid Lights */}
      <Grid
        shape={6}
        cellSize={80}
        animated={true}
        lightColor="#b8bec5"
        lineColor="transparent"
        lightSpeed={3}
        minTravel={20}
        maxTravel={40}
        spawnRate={450}
        trailFadeSpeed={0.003}
        bidirectional={true}
        trailLength={28}
        className="fondo-grid-canvas"
      />
      <FondoTeselasLluvia />
      
      {/* Contenido encima del fondo */}
      <div className="fondo-grid-content">
        {children}
      </div>
    </div>
  );
}

export default FondoGridLights;