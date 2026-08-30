import { useEffect, useRef } from 'react';
import '../styles/HexagonBackground.css';

function HexagonBackground() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let animationFrameId;
    let tiles = [];
    let width = 0;
    let height = 0;
    let time = 0;
    let mouseX = 0;
    let mouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let mouseActive = false;

    const resizeCanvas = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const bounds = containerRef.current.getBoundingClientRect();
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

      tiles = Array.from({ length: rows * columns }, (_, index) => {
        const row = Math.floor(index / columns) - 1;
        const column = (index % columns) - 1;
        return {
          row,
          column,
          x: column * horizontalStep + (row % 2 === 0 ? 0 : horizontalStep / 2),
          y: row * verticalStep,
          radius,
          phase: Math.random() * Math.PI * 2,
        };
      });
    };

    const drawTile = (tile, brightness) => {
      const colors = [
        `rgb(${Math.round(88 + brightness * 30)}, ${Math.round(90 + brightness * 30)}, ${Math.round(94 + brightness * 30)})`,
        `rgb(${Math.round(48 + brightness * 22)}, ${Math.round(50 + brightness * 22)}, ${Math.round(54 + brightness * 22)})`,
        `rgb(${Math.round(18 + brightness * 14)}, ${Math.round(20 + brightness * 14)}, ${Math.round(23 + brightness * 14)})`,
      ];
      const vertices = [];

      context.save();
      context.translate(tile.x, tile.y);
      context.globalAlpha = 0.9 + brightness * 0.1;

      for (let side = 0; side < 6; side += 1) {
        const angle = -Math.PI / 2 + side * Math.PI / 3;
        vertices.push({
          x: tile.radius * Math.cos(angle),
          y: tile.radius * Math.sin(angle),
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
      currentMouseX += (mouseX - currentMouseX) * 0.045;
      currentMouseY += (mouseY - currentMouseY) * 0.045;
      context.clearRect(0, 0, width, height);

      const background = context.createLinearGradient(0, 0, width, height);
      background.addColorStop(0, 'rgba(8, 9, 10, 0.04)');
      background.addColorStop(0.3, 'rgba(15, 16, 18, 0.18)');
      background.addColorStop(0.7, 'rgba(24, 26, 29, 0.34)');
      background.addColorStop(1, 'rgba(14, 16, 19, 0.48)');
      context.fillStyle = background;
      context.fillRect(0, 0, width, height);

      tiles.forEach((tile) => {
        const wave = (Math.sin(time * 1.4 - tile.row * 0.34 + tile.column * 0.18 + tile.phase) + 1) / 2;
        const tileX = tile.x;
        const tileY = tile.y;
        const distanceToMouse = Math.hypot(
          tileX - (currentMouseX + 0.5) * width,
          tileY - (currentMouseY + 0.5) * height,
        );
        const waveRadius = Math.max(0, 1 - distanceToMouse / 360);
        const cursorWave = mouseActive
          ? waveRadius * (0.5 + 0.5 * Math.sin(distanceToMouse * 0.045 - time * 3.2))
          : 0;
        const brightness = Math.min(1, wave * 0.38 + Math.max(0, cursorWave) * 0.9);
        drawTile(tile, brightness);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (event) => {
      const bounds = containerRef.current.getBoundingClientRect();
      mouseX = (event.clientX - bounds.left) / bounds.width - 0.5;
      mouseY = (event.clientY - bounds.top) / bounds.height - 0.5;
      mouseActive = true;
    };

    const resetMousePosition = () => {
      mouseX = 0;
      mouseY = 0;
      mouseActive = false;
    };

    resizeCanvas();
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(containerRef.current);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', resetMousePosition);
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', resetMousePosition);
    };
  }, []);

  return (
    <div ref={containerRef} className="fondo-lluvia-container">
      <canvas ref={canvasRef} className="fondo-lluvia-canvas" />
    </div>
  );
}

export default HexagonBackground;