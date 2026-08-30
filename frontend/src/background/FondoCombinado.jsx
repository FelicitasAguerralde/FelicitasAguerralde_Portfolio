import { useEffect, useRef } from 'react';
import '../styles/FondoCombinado.css';

function FondoCombinado() {
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
    let floatingHexagons = [];
    let fallingCubes = [];
    let particles = [];

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

      floatingHexagons = Array.from({ length: 42 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 14 + Math.random() * 24,
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.012,
        drift: 0.5 + Math.random() * 1.2,
        phase: Math.random() * Math.PI * 2,
      }));

      fallingCubes = Array.from({ length: 28 }, (index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 22 + Math.random() * 26,
        speed: 0.35 + Math.random() * 0.75,
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
        phase: index * 0.7,
      }));

      particles = Array.from({ length: 72 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.5 + Math.random() * 1.6,
        speed: 0.08 + Math.random() * 0.2,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const drawHexagon = (centerX, centerY, radius, rotation, fillStyle, strokeStyle, hovered) => {
      context.save();
      context.translate(centerX, centerY);
      context.rotate(rotation);
      context.scale(1 + hovered * 0.12, 1 + hovered * 0.12);
      context.beginPath();
      for (let side = 0; side < 6; side += 1) {
        const angle = -Math.PI / 2 + side * Math.PI / 3;
        const pointX = radius * Math.cos(angle);
        const pointY = radius * Math.sin(angle);
        if (side === 0) context.moveTo(pointX, pointY);
        else context.lineTo(pointX, pointY);
      }
      context.closePath();
      context.fillStyle = fillStyle;
      context.fill();
      context.strokeStyle = strokeStyle;
      context.lineWidth = 1;
      context.stroke();
      context.restore();
    };

    const drawCube = (cube, offsetX, offsetY, hovered) => {
      const half = cube.size * (0.5 + hovered * 0.06);
      context.save();
      context.translate(cube.x + offsetX, cube.y + offsetY);
      context.rotate(cube.rotation);
      context.globalAlpha = 0.72 + hovered * 0.28;
      context.beginPath();
      context.moveTo(0, -half);
      context.lineTo(half, -half * 0.5);
      context.lineTo(0, 0);
      context.lineTo(-half, -half * 0.5);
      context.closePath();
      context.fillStyle = 'rgba(210, 214, 218, 0.16)';
      context.fill();
      context.strokeStyle = 'rgba(145, 149, 154, 0.56)';
      context.stroke();

      context.beginPath();
      context.moveTo(-half, -half * 0.5);
      context.lineTo(0, 0);
      context.lineTo(0, half);
      context.lineTo(-half, half * 0.5);
      context.closePath();
      context.fillStyle = 'rgba(112, 116, 121, 0.3)';
      context.fill();
      context.stroke();

      context.beginPath();
      context.moveTo(half, -half * 0.5);
      context.lineTo(0, 0);
      context.lineTo(0, half);
      context.lineTo(half, half * 0.5);
      context.closePath();
      context.fillStyle = 'rgba(38, 41, 45, 0.52)';
      context.fill();
      context.stroke();
      context.restore();
    };

    const drawHexGrid = () => {
      const radius = 48;
      const horizontalStep = Math.sqrt(3) * radius;
      const verticalStep = radius * 1.5;
      context.save();
      context.strokeStyle = 'rgba(150, 154, 159, 0.075)';
      context.lineWidth = 1;
      for (let row = -1; row < height / verticalStep + 2; row += 1) {
        for (let column = -1; column < width / horizontalStep + 2; column += 1) {
          const centerX = column * horizontalStep + (row % 2 ? horizontalStep / 2 : 0);
          const centerY = row * verticalStep;
          context.beginPath();
          for (let side = 0; side < 6; side += 1) {
            const angle = -Math.PI / 2 + side * Math.PI / 3;
            const pointX = centerX + radius * Math.cos(angle);
            const pointY = centerY + radius * Math.sin(angle);
            if (side === 0) context.moveTo(pointX, pointY);
            else context.lineTo(pointX, pointY);
          }
          context.closePath();
          context.stroke();
        }
      }
      context.restore();
    };

    const drawConnections = () => {
      context.save();
      context.lineWidth = 1;
      floatingHexagons.forEach((hexagon, index) => {
        const nearest = floatingHexagons
          .filter((_, candidateIndex) => candidateIndex !== index)
          .map((candidate) => ({
            candidate,
            distance: Math.hypot(hexagon.x - candidate.x, hexagon.y - candidate.y),
          }))
          .sort((first, second) => first.distance - second.distance)
          .slice(0, 2);

        nearest.forEach(({ candidate, distance }) => {
          if (distance > 190) return;
          context.strokeStyle = `rgba(148, 152, 157, ${0.1 * (1 - distance / 190)})`;
          context.beginPath();
          context.moveTo(hexagon.x, hexagon.y);
          context.lineTo(candidate.x, candidate.y);
          context.stroke();
        });
      });
      context.restore();
    };

    const drawParticles = () => {
      particles.forEach((particle) => {
        const y = (particle.y - time * particle.speed * 18) % height;
        const normalizedY = y < 0 ? y + height : y;
        const opacity = 0.12 + (Math.sin(time * 0.8 + particle.phase) + 1) * 0.08;
        context.fillStyle = `rgba(188, 192, 196, ${opacity})`;
        context.beginPath();
        context.arc(particle.x, normalizedY, particle.radius, 0, Math.PI * 2);
        context.fill();
      });
    };

    const drawMetamorphosis = (centerX, centerY, hovered) => {
      const radius = Math.min(width, height) * (0.13 + hovered * 0.012);
      const cycle = (Math.sin(time * 0.55) + 1) / 2;
      const morph = cycle * cycle * (3 - 2 * cycle);
      const points = [];
      const half = radius;
      const squarePoints = [
        [-half * 0.8, -half], [half * 0.8, -half], [half, -half * 0.8],
        [half, half * 0.8], [half * 0.8, half], [-half * 0.8, half],
      ];

      for (let side = 0; side < 6; side += 1) {
        const angle = -Math.PI / 2 + side * Math.PI / 3;
        const hexX = Math.cos(angle) * radius;
        const hexY = Math.sin(angle) * radius;
        points.push({
          x: centerX + squarePoints[side][0] * (1 - morph) + hexX * morph,
          y: centerY + squarePoints[side][1] * (1 - morph) + hexY * morph,
        });
      }

      context.beginPath();
      points.forEach((point, index) => {
        if (index === 0) context.moveTo(point.x, point.y);
        else context.lineTo(point.x, point.y);
      });
      context.closePath();
      context.fillStyle = 'rgba(232, 234, 236, 0.14)';
      context.fill();
      context.strokeStyle = 'rgba(158, 162, 167, 0.78)';
      context.lineWidth = 2;
      context.stroke();
      context.beginPath();
      context.arc(centerX, centerY, radius * 1.35, 0, Math.PI * 2);
      context.strokeStyle = `rgba(178, 182, 187, ${0.22 + hovered * 0.28})`;
      context.stroke();
    };

    const animate = () => {
      time += 0.012;
      pointerX += (targetPointerX - pointerX) * 0.045;
      pointerY += (targetPointerY - pointerY) * 0.045;
      const pointerOffsetX = (pointerX - 0.5) * 28;
      const pointerOffsetY = (pointerY - 0.5) * 20;
      context.clearRect(0, 0, width, height);

      const background = context.createRadialGradient(width * 0.5, height * 0.5, 0, width * 0.5, height * 0.5, width * 0.8);
      background.addColorStop(0, '#222427');
      background.addColorStop(0.65, '#08090a');
      background.addColorStop(1, '#020202');
      context.fillStyle = background;
      context.fillRect(0, 0, width, height);
      drawHexGrid();
      drawParticles();
      drawConnections();

      floatingHexagons.forEach((hexagon) => {
        hexagon.rotation += hexagon.rotationSpeed;
        const floatY = Math.sin(time * hexagon.drift + hexagon.phase) * 16;
        const distance = Math.hypot(hexagon.x - pointerX * width, hexagon.y - pointerY * height);
        const glow = Math.max(0, 1 - distance / 280);
        const hovered = distance < hexagon.radius * 1.35 ? 1 : 0;
        drawHexagon(
          hexagon.x + pointerOffsetX,
          hexagon.y + floatY + pointerOffsetY,
          hexagon.radius,
          hexagon.rotation,
          `rgba(126, 130, 135, ${0.04 + glow * 0.1})`,
          `rgba(145, 149, 154, ${0.22 + glow * 0.42})`,
          hovered,
        );
      });

      fallingCubes.forEach((cube) => {
        cube.y += cube.speed;
        cube.rotation += cube.rotationSpeed;
        if (cube.y - cube.size > height) cube.y = -cube.size;
        const cubeDistance = Math.hypot(
          cube.x + pointerOffsetX * 0.65 - pointerX * width,
          cube.y + pointerOffsetY * 0.65 - pointerY * height,
        );
        const cubeHovered = cubeDistance < cube.size * 0.85 ? 1 : 0;
        drawCube(cube, pointerOffsetX * 0.65, pointerOffsetY * 0.65, cubeHovered);
      });

      const centerDistance = Math.hypot(
        width * 0.5 + pointerOffsetX - pointerX * width,
        height * 0.5 + pointerOffsetY - pointerY * height,
      );
      const centerHovered = centerDistance < Math.min(width, height) * 0.15 ? 1 : 0;
      const halo = context.createRadialGradient(
        width * 0.5 + pointerOffsetX,
        height * 0.5 + pointerOffsetY,
        0,
        width * 0.5 + pointerOffsetX,
        height * 0.5 + pointerOffsetY,
        Math.min(width, height) * 0.3,
      );
      halo.addColorStop(0, 'rgba(190, 194, 198, 0.12)');
      halo.addColorStop(0.42, 'rgba(130, 134, 139, 0.045)');
      halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
      context.fillStyle = halo;
      context.beginPath();
      context.arc(
        width * 0.5 + pointerOffsetX,
        height * 0.5 + pointerOffsetY,
        Math.min(width, height) * 0.3,
        0,
        Math.PI * 2,
      );
      context.fill();
      drawMetamorphosis(width * 0.5 + pointerOffsetX, height * 0.5 + pointerOffsetY, centerHovered);
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
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', resetPointer);
    };
  }, []);

  return (
    <main ref={containerRef} className="fondo-combinado">
      <canvas ref={canvasRef} className="fondo-combinado-canvas" />
    </main>
  );
}

export default FondoCombinado;
