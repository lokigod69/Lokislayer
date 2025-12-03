// src/components/interfaces/AnatomicalMap/BodySVG.tsx
// Da Vinci Vitruvian Man style illustration

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects, Project } from '../../../config/projects';
import styles from './styles.module.css';

// Body part icons
const bodyPartIcons: Record<string, string> = {
  ear: '👂',
  brain: '🧠',
  mouth: '👄',
  hands: '🤲',
  eye: '👁️',
  heart: '❤️',
};

interface BodySVGProps {
  onSelectProject: (project: Project) => void;
}

export default function BodySVG(_props: BodySVGProps) {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const getProjectForBodyPart = (bodyPart: string): Project | undefined => {
    return projects.find((p) => p.mappings.anatomicalMap.bodyPart === bodyPart);
  };

  const handleClick = (bodyPart: string) => {
    const project = getProjectForBodyPart(bodyPart);
    if (project) {
      setSelectedProject(selectedProject?.id === project.id ? null : project);
    }
  };

  const handleVisit = () => {
    if (selectedProject && selectedProject.status === 'live') {
      window.open(selectedProject.url, '_blank', 'noopener,noreferrer');
    }
  };

  // Hotspot positions (relative to SVG viewBox 0 0 400 500)
  const hotspots = [
    { id: 'brain', x: 200, y: 55, label: 'Brain' },
    { id: 'eye', x: 225, y: 75, label: 'Eye' },
    { id: 'ear', x: 165, y: 80, label: 'Ear' },
    { id: 'mouth', x: 200, y: 105, label: 'Mouth' },
    { id: 'heart', x: 185, y: 195, label: 'Heart' },
    { id: 'hands', x: 355, y: 220, label: 'Hands' },
  ];

  return (
    <div className={styles.bodyContainer}>
      <svg
        className={styles.bodySvg}
        viewBox="0 0 400 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Vitruvian Circle */}
        <circle
          cx="200"
          cy="250"
          r="175"
          stroke="#8b5a2b"
          strokeWidth="1"
          fill="none"
          opacity="0.4"
        />

        {/* Vitruvian Square */}
        <rect
          x="50"
          y="75"
          width="300"
          height="375"
          stroke="#8b5a2b"
          strokeWidth="1"
          fill="none"
          opacity="0.3"
        />

        {/* Grid lines (subtle) */}
        <line x1="200" y1="75" x2="200" y2="450" stroke="#8b5a2b" strokeWidth="0.3" opacity="0.2" />
        <line x1="50" y1="250" x2="350" y2="250" stroke="#8b5a2b" strokeWidth="0.3" opacity="0.2" />

        {/* === MAIN FIGURE (arms out, legs together) === */}

        {/* Head */}
        <ellipse cx="200" cy="70" rx="28" ry="35" stroke="#8b5a2b" strokeWidth="1.5" fill="none" />

        {/* Face details */}
        {/* Eyes */}
        <ellipse cx="188" cy="68" rx="5" ry="3" stroke="#8b5a2b" strokeWidth="0.8" fill="none" />
        <ellipse cx="212" cy="68" rx="5" ry="3" stroke="#8b5a2b" strokeWidth="0.8" fill="none" />
        {/* Nose */}
        <path d="M200 72 L197 82 L203 82" stroke="#8b5a2b" strokeWidth="0.8" fill="none" />
        {/* Mouth */}
        <path d="M192 92 Q200 98 208 92" stroke="#8b5a2b" strokeWidth="0.8" fill="none" />
        {/* Ears */}
        <ellipse cx="170" cy="72" rx="4" ry="8" stroke="#8b5a2b" strokeWidth="0.8" fill="none" />
        <ellipse cx="230" cy="72" rx="4" ry="8" stroke="#8b5a2b" strokeWidth="0.8" fill="none" />
        {/* Hair hint */}
        <path d="M175 45 Q200 30 225 45" stroke="#8b5a2b" strokeWidth="0.5" fill="none" />

        {/* Neck */}
        <path d="M188 105 L188 125 M212 105 L212 125" stroke="#8b5a2b" strokeWidth="1.2" />

        {/* Shoulders and upper torso */}
        <path d="M188 125 Q170 130 145 140" stroke="#8b5a2b" strokeWidth="1.2" fill="none" />
        <path d="M212 125 Q230 130 255 140" stroke="#8b5a2b" strokeWidth="1.2" fill="none" />

        {/* Chest/Ribcage */}
        <path d="M175 140 L170 200 M225 140 L230 200" stroke="#8b5a2b" strokeWidth="1.2" />
        <ellipse cx="200" cy="175" rx="35" ry="45" stroke="#8b5a2b" strokeWidth="0.5" fill="none" opacity="0.4" />

        {/* Heart area (subtle circle) */}
        <circle cx="185" cy="185" r="12" stroke="#c45c5c" strokeWidth="0.8" fill="none" opacity="0.6" />

        {/* Arms extended horizontally */}
        {/* Left arm */}
        <path d="M145 140 L80 180 L45 210" stroke="#8b5a2b" strokeWidth="1.2" fill="none" />
        {/* Left forearm detail */}
        <path d="M80 180 L75 182" stroke="#8b5a2b" strokeWidth="0.8" />
        {/* Left hand */}
        <path d="M45 210 L38 215 M45 210 L40 220 M45 210 L45 225 M45 210 L50 220 M45 210 L52 215" stroke="#8b5a2b" strokeWidth="0.8" />

        {/* Right arm */}
        <path d="M255 140 L320 180 L355 210" stroke="#8b5a2b" strokeWidth="1.2" fill="none" />
        {/* Right forearm detail */}
        <path d="M320 180 L325 182" stroke="#8b5a2b" strokeWidth="0.8" />
        {/* Right hand */}
        <path d="M355 210 L362 215 M355 210 L360 220 M355 210 L355 225 M355 210 L350 220 M355 210 L348 215" stroke="#8b5a2b" strokeWidth="0.8" />

        {/* Waist/Hips */}
        <path d="M170 200 L165 270 M230 200 L235 270" stroke="#8b5a2b" strokeWidth="1.2" />
        <ellipse cx="200" cy="265" rx="40" ry="18" stroke="#8b5a2b" strokeWidth="0.8" fill="none" />

        {/* Navel */}
        <circle cx="200" cy="235" r="3" stroke="#8b5a2b" strokeWidth="0.5" fill="none" />

        {/* Legs (together) */}
        {/* Left leg */}
        <path d="M175 280 L165 380 L160 440" stroke="#8b5a2b" strokeWidth="1.2" />
        <path d="M160 440 L155 450 L170 450" stroke="#8b5a2b" strokeWidth="1" fill="none" />

        {/* Right leg */}
        <path d="M225 280 L235 380 L240 440" stroke="#8b5a2b" strokeWidth="1.2" />
        <path d="M240 440 L245 450 L230 450" stroke="#8b5a2b" strokeWidth="1" fill="none" />

        {/* Inner leg lines */}
        <path d="M190 280 L185 380 L180 440" stroke="#8b5a2b" strokeWidth="0.6" opacity="0.5" />
        <path d="M210 280 L215 380 L220 440" stroke="#8b5a2b" strokeWidth="0.6" opacity="0.5" />

        {/* Knee details */}
        <circle cx="170" cy="360" r="8" stroke="#8b5a2b" strokeWidth="0.5" fill="none" opacity="0.4" />
        <circle cx="230" cy="360" r="8" stroke="#8b5a2b" strokeWidth="0.5" fill="none" opacity="0.4" />

        {/* === OVERLAY FIGURE (legs apart - faded) === */}
        <g opacity="0.25">
          {/* Left leg spread */}
          <path d="M175 280 L100 400 L85 450" stroke="#8b5a2b" strokeWidth="1" />
          <path d="M85 450 L75 460 L95 460" stroke="#8b5a2b" strokeWidth="0.8" fill="none" />

          {/* Right leg spread */}
          <path d="M225 280 L300 400 L315 450" stroke="#8b5a2b" strokeWidth="1" />
          <path d="M315 450 L325 460 L305 460" stroke="#8b5a2b" strokeWidth="0.8" fill="none" />
        </g>

        {/* === OVERLAY ARMS (raised - faded) === */}
        <g opacity="0.25">
          {/* Left arm raised */}
          <path d="M145 140 L100 100 L70 55" stroke="#8b5a2b" strokeWidth="1" fill="none" />
          <path d="M70 55 L65 48 M70 55 L60 52 M70 55 L58 58" stroke="#8b5a2b" strokeWidth="0.6" />

          {/* Right arm raised */}
          <path d="M255 140 L300 100 L330 55" stroke="#8b5a2b" strokeWidth="1" fill="none" />
          <path d="M330 55 L335 48 M330 55 L340 52 M330 55 L342 58" stroke="#8b5a2b" strokeWidth="0.6" />
        </g>

        {/* Anatomical proportion lines */}
        <g opacity="0.15">
          {/* Shoulder width guide */}
          <line x1="145" y1="135" x2="255" y2="135" stroke="#8b5a2b" strokeWidth="0.5" strokeDasharray="3,3" />
          {/* Hip width guide */}
          <line x1="165" y1="270" x2="235" y2="270" stroke="#8b5a2b" strokeWidth="0.5" strokeDasharray="3,3" />
          {/* Center line */}
          <line x1="200" y1="35" x2="200" y2="450" stroke="#8b5a2b" strokeWidth="0.3" strokeDasharray="5,5" />
        </g>
      </svg>

      {/* Interactive hotspots */}
      {hotspots.map((spot) => {
        const project = getProjectForBodyPart(spot.id);
        if (!project) return null;

        const isSelected = selectedProject?.id === project.id;
        const isHovered = hoveredPart === spot.id;

        return (
          <motion.div
            key={spot.id}
            className={`${styles.hotspot} ${isSelected ? styles.hotspotSelected : ''}`}
            style={{
              left: `${(spot.x / 400) * 100}%`,
              top: `${(spot.y / 500) * 100}%`,
            }}
            onMouseEnter={() => setHoveredPart(spot.id)}
            onMouseLeave={() => setHoveredPart(null)}
            onClick={() => handleClick(spot.id)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: isHovered || isSelected
                ? '0 0 20px rgba(139, 90, 43, 0.6)'
                : '0 0 10px rgba(139, 90, 43, 0.3)',
            }}
          >
            <div className={styles.hotspotInner}>
              <span>{bodyPartIcons[spot.id]}</span>
            </div>

            {/* Label on hover */}
            <AnimatePresence>
              {isHovered && !isSelected && (
                <motion.div
                  className={styles.hotspotLabel}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                >
                  {spot.label}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tooltip */}
            <AnimatePresence>
              {isSelected && (
                <motion.div
                  className={styles.tooltip}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className={styles.tooltipBodyPart}>
                    {spot.label}
                  </div>
                  <div className={styles.tooltipTitle}>{project.name}</div>
                  <div className={styles.tooltipDescription}>
                    {project.description}
                  </div>
                  <button
                    className={styles.tooltipButton}
                    onClick={handleVisit}
                    disabled={project.status !== 'live'}
                  >
                    {project.status === 'live' ? 'Enter Portal' : 'Coming Soon'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
