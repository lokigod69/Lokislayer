// src/components/interfaces/VendingMachine/Machine.tsx

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import { projects, Project } from '../../../config/projects';

// Product type to emoji/color mapping
const productConfig: Record<string, { emoji: string; color: string }> = {
  cassette: { emoji: '📼', color: '#8B5CF6' },
  'pill-bottle': { emoji: '💊', color: '#22C55E' },
  spellbook: { emoji: '📖', color: '#3B82F6' },
  coin: { emoji: '🪙', color: '#F59E0B' },
  viewmaster: { emoji: '🔭', color: '#EC4899' },
  vhs: { emoji: '📹', color: '#6366F1' },
};

// Slot positions in the machine (2x3 grid)
const slotPositions: Record<string, [number, number, number]> = {
  A1: [-0.5, 0.6, 0.4],
  A2: [0.5, 0.6, 0.4],
  B1: [-0.5, 0, 0.4],
  B2: [0.5, 0, 0.4],
  C1: [-0.5, -0.6, 0.4],
  C2: [0.5, -0.6, 0.4],
};

interface MachineProps {
  selectedSlot: string | null;
  onSlotClick: (slot: string, project: Project) => void;
}

function ProductItem({
  project,
  position,
  isSelected,
  onClick,
}: {
  project: Project;
  position: [number, number, number];
  isSelected: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  const config = productConfig[project.mappings.vendingMachine.productType];

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle hover animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.02;
      if (isSelected) {
        meshRef.current.rotation.y = state.clock.elapsedTime;
      }
    }
    if (glowRef.current) {
      glowRef.current.intensity = isSelected ? 2 + Math.sin(state.clock.elapsedTime * 5) * 0.5 : 0.5;
    }
  });

  return (
    <group position={position}>
      {/* Product glow */}
      <pointLight
        ref={glowRef}
        color={config.color}
        intensity={0.5}
        distance={1}
      />

      {/* Product box */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <boxGeometry args={[0.6, 0.4, 0.3]} />
        <meshStandardMaterial
          color={config.color}
          emissive={config.color}
          emissiveIntensity={isSelected ? 0.5 : 0.2}
          metalness={0.3}
          roughness={0.5}
        />
      </mesh>

      {/* Slot label */}
      <Text
        position={[-0.35, 0.25, 0.2]}
        fontSize={0.1}
        color="#00ffff"
        anchorX="left"
        anchorY="middle"
      >
        {project.mappings.vendingMachine.slot}
      </Text>

      {/* Selection ring */}
      {isSelected && (
        <mesh position={[0, 0, 0.01]}>
          <ringGeometry args={[0.35, 0.4, 32]} />
          <meshBasicMaterial color="#00ff00" transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );
}

export default function Machine({ selectedSlot, onSlotClick }: MachineProps) {
  const machineRef = useRef<THREE.Group>(null);

  // Get project for each slot
  const getProjectForSlot = (slot: string): Project | undefined => {
    return projects.find((p) => p.mappings.vendingMachine.slot === slot);
  };

  return (
    <group ref={machineRef}>
      {/* Machine body */}
      <RoundedBox args={[2.5, 2.5, 1]} radius={0.05} smoothness={4} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.3} />
      </RoundedBox>

      {/* Glass front panel */}
      <mesh position={[0, 0.2, 0.45]}>
        <boxGeometry args={[2.2, 2, 0.05]} />
        <meshStandardMaterial
          color="#111"
          transparent
          opacity={0.3}
          metalness={1}
          roughness={0}
        />
      </mesh>

      {/* Neon frame */}
      <mesh position={[0, 0.2, 0.48]}>
        <boxGeometry args={[2.3, 2.1, 0.02]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.2} />
      </mesh>

      {/* Top sign */}
      <RoundedBox args={[2.2, 0.4, 0.2]} radius={0.02} smoothness={2} position={[0, 1.4, 0.3]}>
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={0.3} />
      </RoundedBox>
      <Text
        position={[0, 1.4, 0.42]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/mono.ttf"
      >
        SELECT ITEM
      </Text>

      {/* Dispense slot at bottom */}
      <mesh position={[0, -1.1, 0.45]}>
        <boxGeometry args={[1.5, 0.4, 0.3]} />
        <meshStandardMaterial color="#000" metalness={0.9} roughness={0.1} />
      </mesh>
      <Text
        position={[0, -1.1, 0.62]}
        fontSize={0.08}
        color="#00ff00"
        anchorX="center"
        anchorY="middle"
      >
        ▼ COLLECT HERE ▼
      </Text>

      {/* Products */}
      {Object.entries(slotPositions).map(([slot, position]) => {
        const project = getProjectForSlot(slot);
        if (!project) return null;

        return (
          <ProductItem
            key={slot}
            project={project}
            position={position}
            isSelected={selectedSlot === slot}
            onClick={() => onSlotClick(slot, project)}
          />
        );
      })}

      {/* Ambient lights inside machine */}
      <pointLight position={[0, 0.5, 0.3]} color="#00ffff" intensity={0.5} distance={2} />
      <pointLight position={[0, -0.5, 0.3]} color="#ff00ff" intensity={0.3} distance={2} />
    </group>
  );
}
