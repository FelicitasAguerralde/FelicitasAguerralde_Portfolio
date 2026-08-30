import { useEffect, useRef } from 'react';
import '../styles/CubesBackground.css';

function CubesBackground({ children }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let animationFrameId;
    let width = 0;
    let height = 0;
    let time = 0;
    let pointerX = 0.5;
    let pointerY = 0.5;
    let targetPointerX = 0.5;
    let targetPointerY = 0.5;
    let tiles = [];

    const resizeCanvas = () => {
      const bounds = container.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const radius = width < 700 ? 34 : 48;
      const horizontalStep = Math.sqrt(3) * radius;
      const verticalStep = radius * 1.5;
      const columns = Math.ceil(width / horizontalStep) + 3;
      const rows = Math.ceil(height / verticalStep) + 3;
      tiles = Array.from({ length: columns * rows }, (_, index) => {
        const column = index % columns;
        const row = Math.floor(index / columns);
        return {
          column,
          row,
          radius,
          x: (column - 1) * horizontalStep + (row % 2) * horizontalStep * 0.5,
          y: (row - 1) * verticalStep,
          startX: Math.random() * width,
          startY: Math.random() * height,
        };
      });
    };

    const drawHexagon = (tile, brightness) => {
      const colors = [
        `rgb(${Math.round(88 + brightness * 30)}, ${Math.round(90 + brightness * 30)}, ${Math.round(94 + brightness * 30)})`,
        `rgb(${Math.round(48 + brightness * 22)}, ${Math.round(50 + brightness * 22)}, ${Math.round(54 + brightness * 22)})`,
        `rgb(${Math.round(18 + brightness * 14)}, ${Math.round(20 + brightness * 14)}, ${Math.round(23 + brightness * 14)})`,
      ];
      const vertices = [];

      context.save();
      context.translate(tile.x, tile.y);
      context.globalAlpha = 0.88 + brightness * 0.12;

      for (let side = 0; side < 6; side += 1) {
        const firstAngle = -Math.PI / 2 + side * Math.PI / 3;
        vertices.push({
          x: tile.radius * Math.cos(firstAngle),
          y: tile.radius * Math.sin(firstAngle),
        });
      }

      const faces = [
        [0, 1, 2],
        [2, 3, 4],
        [4, 5, 0],
      ];
      faces.forEach((face, faceIndex) => {
        context.beginPath();
        context.moveTo(0, 0);
        face.forEach((vertexIndex) => {
          context.lineTo(vertices[vertexIndex].x, vertices[vertexIndex].y);
        });
        context.closePath();
        context.fillStyle = colors[faceIndex];
        context.fill();
      });

      context.beginPath();
      context.moveTo(vertices[0].x, vertices[0].y);
      for (let side = 1; side < vertices.length; side += 1) {
        context.lineTo(vertices[side].x, vertices[side].y);
      }
      context.closePath();
      context.strokeStyle = `rgba(150, 153, 158, ${0.18 + brightness * 0.2})`;
      context.lineWidth = 0.8;
      context.stroke();

      context.beginPath();
      context.moveTo(vertices[0].x, vertices[0].y);
      context.lineTo(0, 0);
      context.lineTo(vertices[3].x, vertices[3].y);
      context.strokeStyle = `rgba(18, 19, 21, ${0.34 + brightness * 0.2})`;
      context.stroke();

      context.beginPath();
      context.arc(0, 0, tile.radius * 0.035, 0, Math.PI * 2);
      context.fillStyle = '#26282b';
      context.fill();
      context.restore();
    };

    const animate = () => {
      time += 0.012;
      pointerX += (targetPointerX - pointerX) * 0.045;
      pointerY += (targetPointerY - pointerY) * 0.045;
      context.clearRect(0, 0, width, height);
      context.fillStyle = '#090909';
      context.fillRect(0, 0, width, height);

      const formation = Math.min(1, time / 5);
      const easedFormation = formation * formation * (3 - 2 * formation);
      const driftX = Math.sin(time * 0.32) * 16 + (pointerX - 0.5) * 22;
      const driftY = Math.cos(time * 0.27) * 10 + (pointerY - 0.5) * 16;
      const mouseX = pointerX * width;
      const mouseY = pointerY * height;

      tiles.forEach((tile) => {
        const x = tile.startX + (tile.x - tile.startX) * easedFormation + driftX;
        const y = tile.startY + (tile.y - tile.startY) * easedFormation + driftY;
        const distance = Math.hypot(x - mouseX, y - mouseY);
        const brightness = Math.max(0, 1 - distance / 300);
        drawHexagon({
          ...tile,
          x,
          y,
          variant: (tile.column + tile.row) % 3,
          orientation: ((tile.column + tile.row) % 3) * (Math.PI * 2 / 3),
        }, brightness);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handlePointerMove = (event) => {
      const bounds = container.getBoundingClientRect();
      targetPointerX = (event.clientX - bounds.left) / bounds.width;
      targetPointerY = (event.clientY - bounds.top) / bounds.height;
    };

    const resetPointer = () => {
      targetPointerX = 0.5;
      targetPointerY = 0.5;
    };

    resizeCanvas();
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(container);
    window.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', resetPointer);
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', resetPointer);
    };
  }, []);

  return (
    <main ref={containerRef} className="fondo-cubos">
      <canvas ref={canvasRef} className="fondo-cubos-canvas" />
      <div className="fondo-cubos-content">{children}</div>
    </main>
  );
}

export default CubesBackground;
