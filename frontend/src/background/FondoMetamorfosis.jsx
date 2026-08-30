import { useEffect, useRef } from 'react';
import '../styles/FondoMetamorfosis.css';

function FondoMetamorfosis() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
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

    const easeInOutCubic = (value) => (
      value < 0.5
        ? 4 * value * value * value
        : 1 - Math.pow(-2 * value + 2, 3) / 2
    );

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

      const tileSize = Math.max(38, Math.min(68, width / 22));
      const columns = Math.ceil(width / tileSize) + 2;
      const rows = Math.ceil(height / tileSize) + 2;

      tiles = Array.from({ length: columns * rows }, (_, index) => {
        const row = Math.floor(index / columns);
        const column = index % columns;
        return {
          row,
          column,
          x: (column - 1) * tileSize + tileSize / 2,
          y: (row - 1) * tileSize + tileSize / 2,
          size: tileSize,
          seed: Math.sin(column * 71.17 + row * 19.31) * 10000 % 1,
        };
      });
    };

    const drawTile = (tile, brightness, morph, offsetX, offsetY) => {
      const half = tile.size * 0.5;
      const points = [];
      const sides = 6;
      const angleOffset = -Math.PI / 2;
      const squarePoints = [
        [-half * 0.82, -half],
        [half * 0.82, -half],
        [half, -half * 0.82],
        [half, half * 0.82],
        [half * 0.82, half],
        [-half * 0.82, half],
      ];

      for (let side = 0; side < sides; side += 1) {
        const angle = angleOffset + side * Math.PI / 3;
        const hexX = Math.cos(angle) * half;
        const hexY = Math.sin(angle) * half;
        const [squareX, squareY] = squarePoints[side];
        const irregular = 1 + Math.sin(time * 0.9 + tile.seed * 8 + side * 1.7) * 0.04 * Math.sin(morph * Math.PI);
        points.push({
          x: tile.x + offsetX + (squareX + (hexX - squareX) * morph) * irregular,
          y: tile.y + offsetY + (squareY + (hexY - squareY) * morph) * irregular,
        });
      }

      context.beginPath();
      points.forEach((point, index) => {
        if (index === 0) context.moveTo(point.x, point.y);
        else context.lineTo(point.x, point.y);
      });
      context.closePath();

      const shade = Math.round(18 + brightness * 68);
      context.fillStyle = `rgba(${shade}, ${shade}, ${shade}, 0.94)`;
      context.fill();
      context.strokeStyle = `rgba(${Math.round(92 + brightness * 130)}, ${Math.round(92 + brightness * 130)}, ${Math.round(92 + brightness * 130)}, ${0.18 + brightness * 0.55})`;
      context.lineWidth = morph > 0.78 ? 1.4 : 1;
      context.stroke();
    };

    const animate = () => {
      time += 0.012;
      pointerX += (targetPointerX - pointerX) * 0.045;
      pointerY += (targetPointerY - pointerY) * 0.045;
      const offsetX = (pointerX - 0.5) * 26;
      const offsetY = (pointerY - 0.5) * 18;
      context.clearRect(0, 0, width, height);

      const background = context.createLinearGradient(0, 0, width, height);
      background.addColorStop(0, '#050505');
      background.addColorStop(0.5, '#171819');
      background.addColorStop(1, '#070707');
      context.fillStyle = background;
      context.fillRect(0, 0, width, height);

      const bandGlow = context.createRadialGradient(width * 0.52, height * 0.5, 0, width * 0.52, height * 0.5, width * 0.58);
      bandGlow.addColorStop(0, 'rgba(255, 255, 255, 0.07)');
      bandGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
      context.fillStyle = bandGlow;
      context.fillRect(0, 0, width, height);

      tiles.forEach((tile) => {
        const progress = tile.column / Math.max(1, Math.ceil(width / tile.size));
        const flow = (Math.sin(time * 1.1 - tile.column * 0.22 + tile.row * 0.3) + 1) / 2;
        const cursorDistance = Math.hypot(tile.x - pointerX * width, tile.y - pointerY * height);
        const cursorLight = Math.max(0, 1 - cursorDistance / 260);
        const morphPhase = (Math.sin(time * 0.75 - progress * Math.PI * 2.2) + 1) / 2;
        const morph = easeInOutCubic(morphPhase);
        const brightness = Math.min(1, flow * 0.24 + cursorLight * 0.9 + morph * 0.08);
        drawTile(tile, brightness, morph, offsetX, offsetY);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handlePointerMove = (event) => {
      const bounds = container.getBoundingClientRect();
      targetPointerX = (event.clientX - bounds.left) / bounds.width;
      targetPointerY = (event.clientY - bounds.top) / bounds.height;
    };

    const handlePointerLeave = () => {
      targetPointerX = 0.5;
      targetPointerY = 0.5;
    };

    resizeCanvas();
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(container);
    window.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', handlePointerLeave);
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  return (
    <main ref={containerRef} className="fondo-metamorfosis">
      <canvas ref={canvasRef} className="fondo-metamorfosis-canvas" />
    </main>
  );
}

export default FondoMetamorfosis;
