// src/components/effects/GravitationalLens.tsx
// Creates a space-time curvature effect around the mouse cursor

import { useState, useEffect, useCallback, useRef } from 'react';
import styles from './GravitationalLens.module.css';

interface GravitationalLensProps {
  intensity?: number; // 0-1, how strong the distortion is
  size?: number; // Size of the distortion area in pixels
}

export default function GravitationalLens({
  intensity = 0.6,
  size = 200,
}: GravitationalLensProps) {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isActive, setIsActive] = useState(false);
  const rafRef = useRef<number>();
  const targetRef = useRef({ x: -1000, y: -1000 });
  const currentRef = useRef({ x: -1000, y: -1000 });

  // Smooth interpolation for mouse movement
  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  };

  // Animation loop for smooth cursor following
  const animate = useCallback(() => {
    currentRef.current.x = lerp(currentRef.current.x, targetRef.current.x, 0.15);
    currentRef.current.y = lerp(currentRef.current.y, targetRef.current.y, 0.15);

    setMousePos({
      x: currentRef.current.x,
      y: currentRef.current.y,
    });

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      if (!isActive) setIsActive(true);
    };

    const handleMouseLeave = () => {
      setIsActive(false);
      targetRef.current = { x: -1000, y: -1000 };
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Start animation loop
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animate, isActive]);

  const distortionScale = 20 * intensity;

  return (
    <div className={styles.container}>
      {/* SVG Filters for displacement effect */}
      <svg className={styles.svgFilters} aria-hidden="true">
        <defs>
          {/* Radial gradient for the lens shape */}
          <radialGradient id="lensGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="40%" stopColor="gray" stopOpacity="0.5" />
            <stop offset="100%" stopColor="black" stopOpacity="0" />
          </radialGradient>

          {/* Displacement map filter */}
          <filter id="gravitationalDistortion" x="-50%" y="-50%" width="200%" height="200%">
            <feImage
              href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cdefs%3E%3CradialGradient id='g' cx='50%25' cy='50%25' r='50%25'%3E%3Cstop offset='0%25' stop-color='%23808080'/%3E%3Cstop offset='30%25' stop-color='%23666666'/%3E%3Cstop offset='60%25' stop-color='%23808080'/%3E%3Cstop offset='100%25' stop-color='%23808080'/%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle cx='100' cy='100' r='100' fill='url(%23g)'/%3E%3C/svg%3E"
              result="dispMap"
              x="0"
              y="0"
              width="200"
              height="200"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="dispMap"
              scale={distortionScale}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* The gravitational lens visual */}
      <div
        className={`${styles.lens} ${isActive ? styles.active : ''}`}
        style={{
          left: mousePos.x,
          top: mousePos.y,
          width: size,
          height: size,
          '--intensity': intensity,
        } as React.CSSProperties}
      >
        {/* Outer distortion ring */}
        <div className={styles.outerRing} />

        {/* Inner gravitational well */}
        <div className={styles.innerWell} />

        {/* Space-time grid lines that bend */}
        <svg className={styles.gridLines} viewBox="0 0 200 200">
          {/* Horizontal curved lines */}
          {[-60, -40, -20, 0, 20, 40, 60].map((offset, i) => (
            <path
              key={`h${i}`}
              d={`M 0 ${100 + offset} Q 100 ${100 + offset * 0.3} 200 ${100 + offset}`}
              className={styles.gridLine}
            />
          ))}
          {/* Vertical curved lines */}
          {[-60, -40, -20, 0, 20, 40, 60].map((offset, i) => (
            <path
              key={`v${i}`}
              d={`M ${100 + offset} 0 Q ${100 + offset * 0.3} 100 ${100 + offset} 200`}
              className={styles.gridLine}
            />
          ))}
          {/* Concentric circles showing the "well" */}
          {[20, 40, 60, 80].map((r, i) => (
            <circle
              key={`c${i}`}
              cx="100"
              cy="100"
              r={r}
              className={styles.concentricCircle}
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </svg>

        {/* Central singularity point */}
        <div className={styles.singularity} />
      </div>

      {/* Subtle trailing particles */}
      <div
        className={styles.particles}
        style={{
          left: mousePos.x,
          top: mousePos.y,
        }}
      >
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={styles.particle}
            style={{
              '--delay': `${i * 0.05}s`,
              '--angle': `${i * 60}deg`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}
