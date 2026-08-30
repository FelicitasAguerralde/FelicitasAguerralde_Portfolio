import { useEffect, useRef } from 'react';
import '../styles/FondoEsferaHexagonal.css';

const PALETTE = ['#17191c', '#25282c', '#363a3f', '#4b5056', '#686e75', '#8b9197'];

function FondoEsferaHexagonal() {
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
    let pointerX = 0.5;
    let pointerY = 0.5;
    let targetX = 0.5;
    let targetY = 0.5;
    let pointerActive = false;

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

      const radius = Math.max(16, Math.min(42, width / 22));
      const horizontalStep = Math.sqrt(3) * radius;
      const verticalStep = radius * 1.5;
      const columns = Math.ceil(width / horizontalStep) + 4;
      const rows = Math.ceil(height / verticalStep) + 4;
      const presentationRadius = Math.min(width, height) * 0.5;
      const presentationCenterX = width * 0.5;
      const presentationCenterY = height * 0.5;

      tiles = Array.from({ length: rows * columns }, (_, index) => {
        const row = Math.floor(index / columns) - 2;
        const column = (index % columns) - 2;
        const x = column * horizontalStep + (row % 2 === 0 ? 0 : horizontalStep / 2);
        const y = row * verticalStep;
        const radialDistance = Math.hypot(x - presentationCenterX, y - presentationCenterY) / presentationRadius;
        const outwardDistance = Math.max(0, radialDistance - 0.82);
        return {
          x,
          y,
          row,
          column,
          delay: outwardDistance * 1.9 + Math.random() * 0.05,
          initialRotation: (Math.random() - 0.5) * 0.38,
          color: PALETTE[Math.abs(row * 3 + column) % PALETTE.length],
        };
      });
    };

    const drawHexagon = (x, y, radius, fill, stroke, lineWidth, rotation = 0, horizontalScale = 1) => {
      context.beginPath();
      for (let side = 0; side < 6; side += 1) {
        const angle = rotation - Math.PI / 2 + side * Math.PI / 3;
        const pointX = x + radius * horizontalScale * Math.cos(angle);
        const pointY = y + radius * Math.sin(angle);
        if (side === 0) context.moveTo(pointX, pointY);
        else context.lineTo(pointX, pointY);
      }
      context.closePath();
      context.fillStyle = fill;
      context.fill();
      context.strokeStyle = stroke;
      context.lineWidth = lineWidth;
      context.stroke();
    };

    const animate = () => {
      time += 0.016;
      pointerX += (targetX - pointerX) * 0.045;
      pointerY += (targetY - pointerY) * 0.045;
      context.clearRect(0, 0, width, height);

      const background = context.createRadialGradient(width * 0.5, height * 0.48, 0, width * 0.5, height * 0.5, Math.max(width, height) * 0.75);
      background.addColorStop(0, '#44484d');
      background.addColorStop(0.55, '#17191c');
      background.addColorStop(1, '#050505');
      context.fillStyle = background;
      context.fillRect(0, 0, width, height);

      const sphereRadius = Math.min(width, height) * 0.5;
      const centerX = width * (0.5 + (pointerX - 0.5) * 0.45);
      const centerY = height * (0.5 + (pointerY - 0.5) * 0.45);
      const baseRadius = Math.max(16, Math.min(42, width / 22));
      const sphereAmount = 0.9 + Math.sin(time * 0.42) * 0.1;

      tiles.forEach((tile) => {
        const normalizedX = (tile.x - centerX) / sphereRadius;
        const normalizedY = (tile.y - centerY) / sphereRadius;
        const distance = Math.hypot(normalizedX, normalizedY);
        const depth = Math.sqrt(Math.max(0, 1 - Math.min(1, distance * distance)));
        const circleAmount = Math.max(0, 1 - distance * distance);
        const projectedX = tile.x;
        const projectedY = tile.y;
        const cursorDistance = Math.hypot(projectedX - pointerX * width, projectedY - pointerY * height);
        const cursorLight = pointerActive ? Math.max(0, 1 - cursorDistance / (width * 0.42)) : 0;
        const ripple = pointerActive
          ? Math.max(0, 1 - Math.abs(cursorDistance - width * 0.1) / (width * 0.075))
          : 0;
        const scale = 0.76 + sphereAmount * circleAmount * 0.15 + ripple * 0.035;
        const presentationProgress = Math.min(1, Math.max(0, (time - tile.delay) / 0.72));
        const presentationEase = 1 - Math.pow(1 - presentationProgress, 3);
        const presentationScale = 0.2 + presentationEase * 0.8;
        const presentationRotation = tile.initialRotation * (1 - presentationEase);
        const red = Number.parseInt(tile.color.slice(1, 3), 16);
        const green = Number.parseInt(tile.color.slice(3, 5), 16);
        const blue = Number.parseInt(tile.color.slice(5, 7), 16);
        const light = Math.min(1.32, 0.78 + depth * 0.2 + cursorLight * 0.34);
        const fill = `rgb(${Math.min(255, red * light)}, ${Math.min(255, green * light)}, ${Math.min(255, blue * light)})`;
        const tileRadius = baseRadius * scale * presentationScale;
        context.globalAlpha = presentationEase;
        drawHexagon(projectedX, projectedY, tileRadius, fill, 'rgba(0, 0, 0, 0.88)', 2, presentationRotation);
      });
      context.globalAlpha = 1;

      const sheen = context.createRadialGradient(centerX - sphereRadius * 0.2, centerY - sphereRadius * 0.25, 0, centerX, centerY, sphereRadius);
      sheen.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
      sheen.addColorStop(0.5, 'rgba(255, 255, 255, 0.025)');
      sheen.addColorStop(1, 'rgba(0, 0, 0, 0.24)');
      context.fillStyle = sheen;
      context.beginPath();
      context.arc(centerX, centerY, sphereRadius, 0, Math.PI * 2);
      context.fill();

      animationFrameId = requestAnimationFrame(animate);
    };

    const handlePointerMove = (event) => {
      const bounds = containerRef.current.getBoundingClientRect();
      targetX = (event.clientX - bounds.left) / bounds.width;
      targetY = (event.clientY - bounds.top) / bounds.height;
      pointerActive = true;
    };

    const resetPointer = () => {
      targetX = 0.5;
      targetY = 0.5;
      pointerActive = false;
    };

    resizeCanvas();
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(containerRef.current);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseleave', resetPointer);
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseleave', resetPointer);
    };
  }, []);

  return (
    <div ref={containerRef} className="fondo-esfera-container">
      <canvas ref={canvasRef} className="fondo-esfera-canvas" />
    </div>
  );
}

export default FondoEsferaHexagonal;