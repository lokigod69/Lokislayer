// src/components/core/WaveGrid/index.tsx
// Animated wave grid with mouse-following illumination effect

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Vertex shader for wave distortion
const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseRadius;

  varying vec2 vUv;
  varying float vWave;
  varying float vMouseDist;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Multiple wave layers for organic movement
    float wave1 = sin(pos.x * 2.0 + uTime * 0.8) * 0.15;
    float wave2 = sin(pos.y * 1.5 + uTime * 0.6) * 0.12;
    float wave3 = sin((pos.x + pos.y) * 1.0 + uTime * 0.4) * 0.1;
    float wave4 = cos(pos.x * 3.0 - uTime * 0.5) * 0.08;
    float wave5 = cos(pos.y * 2.5 + uTime * 0.7) * 0.06;

    // Combine waves
    float totalWave = wave1 + wave2 + wave3 + wave4 + wave5;

    // Mouse interaction - create a bulge/ripple
    vec2 mousePos = uMouse * 2.0 - 1.0; // Convert to -1 to 1 range
    mousePos.x *= (1920.0 / 1080.0); // Aspect ratio adjustment
    float mouseDist = distance(pos.xy * vec2(1.0, 0.6), mousePos * vec2(5.0, 3.0));
    float mouseWave = exp(-mouseDist * 0.3) * 0.8;
    float mouseRipple = sin(mouseDist * 3.0 - uTime * 3.0) * exp(-mouseDist * 0.5) * 0.3;

    vWave = totalWave;
    vMouseDist = mouseWave;

    pos.z += totalWave + mouseWave + mouseRipple;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// Fragment shader for grid lines and illumination
const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;

  varying vec2 vUv;
  varying float vWave;
  varying float vMouseDist;

  void main() {
    // Grid parameters
    float gridSize = 40.0;
    float lineWidth = 0.03;

    // Create grid lines
    vec2 grid = fract(vUv * gridSize);
    float lineX = smoothstep(lineWidth, 0.0, grid.x) + smoothstep(1.0 - lineWidth, 1.0, grid.x);
    float lineY = smoothstep(lineWidth, 0.0, grid.y) + smoothstep(1.0 - lineWidth, 1.0, grid.y);
    float gridLine = max(lineX, lineY);

    // Base color - very subtle grid
    float baseAlpha = 0.12 + vWave * 0.05;

    // Mouse illumination - bright spot that follows cursor
    vec2 mousePos = uMouse;
    float mouseDist = distance(vUv, mousePos);
    float mouseGlow = exp(-mouseDist * 4.0) * 0.7;
    float mouseRing = exp(-abs(mouseDist - 0.15) * 20.0) * 0.3;

    // Wave brightness variation
    float waveBrightness = 0.1 + abs(vWave) * 0.3;

    // Combine all effects
    float alpha = gridLine * (baseAlpha + mouseGlow + waveBrightness);
    alpha += mouseGlow * 0.15; // Add ambient glow around mouse
    alpha += mouseRing * gridLine; // Subtle ring around mouse

    // Slight color tint based on wave height
    vec3 color = vec3(1.0);
    color = mix(color, vec3(0.9, 0.9, 1.0), vMouseDist * 0.3);

    gl_FragColor = vec4(color, alpha);
  }
`;

// Grid plane component
function WavePlane({ mousePos }: { mousePos: { x: number; y: number } }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uMouseRadius: { value: 0.3 },
      uResolution: { value: new THREE.Vector2(1920, 1080) },
    }),
    []
  );

  useFrame((state) => {
    if (!meshRef.current) return;

    const material = meshRef.current.material as THREE.ShaderMaterial;
    material.uniforms.uTime.value = state.clock.elapsedTime;

    // Smooth mouse movement
    smoothMouseRef.current.x += (mousePos.x - smoothMouseRef.current.x) * 0.08;
    smoothMouseRef.current.y += (mousePos.y - smoothMouseRef.current.y) * 0.08;

    material.uniforms.uMouse.value.set(smoothMouseRef.current.x, smoothMouseRef.current.y);
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -1, 0]}>
      <planeGeometry args={[12, 8, 100, 100]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

// Main export component
export default function WaveGrid() {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: 1 - e.clientY / window.innerHeight, // Invert Y for WebGL coordinates
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 0,
      pointerEvents: 'none',
    }}>
      <Canvas
        camera={{ position: [0, 2, 5], fov: 60 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <WavePlane mousePos={mousePos} />
      </Canvas>
    </div>
  );
}
