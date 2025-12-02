// src/components/interfaces/NeuralMap/Connections.tsx

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { projects, Project } from '../../../config/projects';
import styles from './styles.module.css';

interface Connection {
  from: Project;
  to: Project;
  fromPos: { x: number; y: number };
  toPos: { x: number; y: number };
}

export default function Connections() {
  const connections = useMemo(() => {
    const result: Connection[] = [];
    const seen = new Set<string>();

    projects.forEach((project) => {
      const fromPos = project.mappings.neuralMap.position;

      project.mappings.neuralMap.connections.forEach((targetId) => {
        // Avoid duplicate connections
        const key = [project.id, targetId].sort().join('-');
        if (seen.has(key)) return;
        seen.add(key);

        const target = projects.find((p) => p.id === targetId);
        if (!target) return;

        const toPos = target.mappings.neuralMap.position;
        result.push({
          from: project,
          to: target,
          fromPos,
          toPos,
        });
      });
    });

    return result;
  }, []);

  return (
    <svg className={styles.connections}>
      <defs>
        {/* Gradient definitions for each connection */}
        {connections.map((conn, i) => (
          <linearGradient
            key={`gradient-${i}`}
            id={`connection-gradient-${i}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor={conn.from.theme.primaryColor} stopOpacity="0.6" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.2" />
            <stop offset="100%" stopColor={conn.to.theme.primaryColor} stopOpacity="0.6" />
          </linearGradient>
        ))}

        {/* Glow filter */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {connections.map((conn, i) => {
        // Calculate curve control point for organic feel
        const midX = (conn.fromPos.x + conn.toPos.x) / 2;
        const midY = (conn.fromPos.y + conn.toPos.y) / 2;

        // Add perpendicular offset for curve
        const dx = conn.toPos.x - conn.fromPos.x;
        const dy = conn.toPos.y - conn.fromPos.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const offset = len * 0.2; // 20% curve

        const ctrlX = midX + (dy / len) * offset;
        const ctrlY = midY - (dx / len) * offset;

        const pathD = `
          M ${50 + conn.fromPos.x / 4}% ${50 + conn.fromPos.y / 4}%
          Q ${50 + ctrlX / 4}% ${50 + ctrlY / 4}%
            ${50 + conn.toPos.x / 4}% ${50 + conn.toPos.y / 4}%
        `;

        return (
          <g key={`connection-${i}`}>
            {/* Background glow */}
            <motion.path
              d={pathD}
              stroke={`url(#connection-gradient-${i})`}
              strokeWidth="4"
              fill="none"
              filter="url(#glow)"
              opacity="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5 + i * 0.2, duration: 1 }}
            />

            {/* Main line */}
            <motion.path
              d={pathD}
              stroke={`url(#connection-gradient-${i})`}
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5 + i * 0.2, duration: 1 }}
            />

            {/* Animated flow particles */}
            <motion.path
              d={pathD}
              stroke="white"
              strokeWidth="2"
              fill="none"
              strokeDasharray="4, 16"
              opacity="0.4"
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: -20 }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: 'linear',
              }}
            />
          </g>
        );
      })}
    </svg>
  );
}
