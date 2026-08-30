import { useEffect, useRef } from 'react';
import '../styles/FondoTeselasLluvia.css';

function FondoTeselasLluvia() {
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

      const radius = 40;
      const horizontalStep = Math.sqrt(3) * radius;
      const verticalStep = radius * 1.5;
      const columns = Math.ceil(width / horizontalStep) + 2;
      const rows = Math.ceil(height / verticalStep) + 2;

      tiles = Array.from({ length: rows * columns }, (_, index) => {
        const row = Math.floor(index / columns) - 1;
        const column = (index % columns) - 1;
        return {
          row,
          column,
          x: column * horizontalStep + (row % 2 === 0 ? 0 : horizontalStep / 2),
          y: row * verticalStep,
          phase: Math.random() * Math.PI * 2,
        };
      });
    };

    const drawTile = (tile, radius, brightness, offsetX, offsetY) => {
      context.beginPath();
      for (let side = 0; side < 6; side += 1) {
        const angle = -Math.PI / 2 + side * Math.PI / 3;
        const x = tile.x + offsetX + radius * Math.cos(angle);
        const y = tile.y + offsetY + radius * Math.sin(angle);
        if (side === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.closePath();
      const tileLightness = 15 + brightness * 25;
      context.fillStyle = `rgba(${tileLightness}, ${tileLightness}, ${tileLightness}, 0.82)`;
      context.fill();
      const edgeLightness = 105 + brightness * 105;
      context.strokeStyle = `rgba(${edgeLightness}, ${edgeLightness}, ${edgeLightness}, ${0.16 + brightness * 0.3})`;
      context.lineWidth = 1;
      context.stroke();
    };

    const animate = () => {
      time += 0.012;
      const radius = 40;
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
        drawTile(tile, radius, brightness, 0, 0);
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

export default FondoTeselasLluvia;