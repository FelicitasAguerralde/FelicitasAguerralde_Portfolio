import { useEffect, useRef } from 'react';
import '../styles/FondoHexagonos.css';

function FondoHexagonos() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const context = canvas.getContext('2d');
    let animationFrameId;
    let width = 0;
    let height = 0;
    let elapsed = 0;
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

      const radius = width < 700 ? 34 : 46;
      const horizontalStep = Math.sqrt(3) * radius;
      const verticalStep = radius * 1.5;
      const columns = Math.ceil(width / horizontalStep) + 2;
      const rows = Math.ceil(height / verticalStep) + 2;
      const count = columns * rows;
      tiles = Array.from({ length: count }, (_, index) => {
        const column = index % columns;
        const row = Math.floor(index / columns);
        const targetX = (column - 1) * horizontalStep + (row % 2) * horizontalStep * 0.5;
        const targetY = (row - 1) * verticalStep;
        return {
          targetX,
          targetY,
          startX: Math.random() * width,
          startY: Math.random() * height,
          size: radius * 0.36,
        };
      });
    };

    const drawHexTile = (x, y, radius, brightness) => {
      context.beginPath();
      for (let side = 0; side < 6; side += 1) {
        const angle = -Math.PI / 2 + side * Math.PI / 3;
        const pointX = x + radius * Math.cos(angle);
        const pointY = y + radius * Math.sin(angle);
        if (side === 0) context.moveTo(pointX, pointY);
        else context.lineTo(pointX, pointY);
      }
      context.closePath();
      const shade = Math.round(16 + brightness * 22);
      context.fillStyle = `rgba(${shade}, ${shade}, ${shade}, 0.9)`;
      context.fill();
      const edge = Math.round(92 + brightness * 108);
      context.strokeStyle = `rgba(${edge}, ${edge}, ${edge}, ${0.24 + brightness * 0.4})`;
      context.lineWidth = 1;
      context.stroke();
    };

    const animate = () => {
      const delta = 0.012;
      elapsed += delta;
      pointerX += (targetPointerX - pointerX) * 0.045;
      pointerY += (targetPointerY - pointerY) * 0.045;
      context.clearRect(0, 0, width, height);

      const background = context.createLinearGradient(0, 0, width, height);
      background.addColorStop(0, '#070708');
      background.addColorStop(0.52, '#1b1c1f');
      background.addColorStop(1, '#08090a');
      context.fillStyle = background;
      context.fillRect(0, 0, width, height);

      const formation = Math.min(1, elapsed / 5);
      const easedFormation = formation * formation * (3 - 2 * formation);
      const mouseX = pointerX * width;
      const mouseY = pointerY * height;
      const gridOffsetX = (pointerX - 0.5) * 20;
      const gridOffsetY = (pointerY - 0.5) * 14;

      tiles.forEach((item) => {
        const x = item.startX + (item.targetX - item.startX) * easedFormation + gridOffsetX;
        const y = item.startY + (item.targetY - item.startY) * easedFormation + gridOffsetY;
        const distanceToMouse = Math.hypot(x - mouseX, y - mouseY);
        const brightness = Math.max(0, 1 - distanceToMouse / 260);
        drawHexTile(x, y, item.size / 0.36, brightness);
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
    <main ref={containerRef} className="fondo-hexagonos">
      <canvas ref={canvasRef} className="fondo-hexagonos-canvas" />
    </main>
  );
}

export default FondoHexagonos;
