// src/components/interfaces/AnatomicalMap/BodySVG.tsx
// Da Vinci Vitruvian Man style illustration - Hotspots only (no tooltips)

import { useState } from 'react';
import { motion } from 'framer-motion';
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

// Body part labels
const bodyPartLabels: Record<string, string> = {
  ear: 'Ear',
  brain: 'Brain',
  mouth: 'Mouth',
  hands: 'Hands',
  eye: 'Eye',
  heart: 'Heart',
};

interface BodySVGProps {
  selectedProject: string | null;
  onSelectProject: (projectId: string | null, bodyPart: string | null) => void;
}

export default function BodySVG({ selectedProject, onSelectProject }: BodySVGProps) {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  const getProjectForBodyPart = (bodyPart: string): Project | undefined => {
    return projects.find((p) => p.mappings.anatomicalMap.bodyPart === bodyPart);
  };

  const handleClick = (bodyPart: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const project = getProjectForBodyPart(bodyPart);
    if (project) {
      // Toggle selection - if already selected, deselect
      if (selectedProject === project.id) {
        onSelectProject(null, null);
      } else {
        onSelectProject(project.id, bodyPartLabels[bodyPart]);
      }
    }
  };

  // Hotspot positions - adjusted for larger head (SVG viewBox 0 0 400 500)
  const hotspots = [
    { id: 'brain', x: 200, y: 40, label: 'Brain' },
    { id: 'eye', x: 218, y: 80, label: 'Eye' },
    { id: 'ear', x: 158, y: 90, label: 'Ear' },
    { id: 'mouth', x: 200, y: 117, label: 'Mouth' },
    { id: 'heart', x: 180, y: 220, label: 'Heart' },
    { id: 'hands', x: 360, y: 245, label: 'Hands' },
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
          cy="270"
          r="175"
          stroke="#a08060"
          strokeWidth="1"
          fill="none"
          opacity="0.3"
        />

        {/* Vitruvian Square */}
        <rect
          x="50"
          y="95"
          width="300"
          height="375"
          stroke="#a08060"
          strokeWidth="1"
          fill="none"
          opacity="0.25"
        />

        {/* Grid lines (subtle) */}
        <line x1="200" y1="35" x2="200" y2="470" stroke="#a08060" strokeWidth="0.3" opacity="0.15" />
        <line x1="50" y1="270" x2="350" y2="270" stroke="#a08060" strokeWidth="0.3" opacity="0.15" />

        {/* === MAIN FIGURE with LARGER HEAD === */}

        {/* Head - MUCH LARGER */}
        <ellipse cx="200" cy="85" rx="40" ry="50" stroke="#c0a080" strokeWidth="1.5" fill="none" />

        {/* Face details */}
        <ellipse cx="182" cy="80" rx="7" ry="4" stroke="#c0a080" strokeWidth="0.8" fill="none" />
        <ellipse cx="218" cy="80" rx="7" ry="4" stroke="#c0a080" strokeWidth="0.8" fill="none" />
        <circle cx="182" cy="80" r="2" fill="#c0a080" opacity="0.3" />
        <circle cx="218" cy="80" r="2" fill="#c0a080" opacity="0.3" />

        {/* Eyebrows */}
        <path d="M174 73 Q182 70 190 73" stroke="#c0a080" strokeWidth="0.6" fill="none" />
        <path d="M210 73 Q218 70 226 73" stroke="#c0a080" strokeWidth="0.6" fill="none" />

        {/* Nose */}
        <path d="M200 85 L196 100 L204 100" stroke="#c0a080" strokeWidth="0.8" fill="none" />

        {/* Mouth */}
        <path d="M188 115 Q200 122 212 115" stroke="#c0a080" strokeWidth="0.8" fill="none" />

        {/* Ears */}
        <ellipse cx="158" cy="90" rx="6" ry="12" stroke="#c0a080" strokeWidth="0.8" fill="none" />
        <ellipse cx="242" cy="90" rx="6" ry="12" stroke="#c0a080" strokeWidth="0.8" fill="none" />

        {/* Hair hint */}
        <path d="M165 50 Q200 30 235 50" stroke="#c0a080" strokeWidth="0.5" fill="none" />

        {/* Neck */}
        <path d="M185 135 L185 160 M215 135 L215 160" stroke="#c0a080" strokeWidth="1.2" />

        {/* Shoulders */}
        <path d="M185 160 Q165 165 140 175" stroke="#c0a080" strokeWidth="1.2" fill="none" />
        <path d="M215 160 Q235 165 260 175" stroke="#c0a080" strokeWidth="1.2" fill="none" />

        {/* Chest */}
        <path d="M170 175 L165 235 M230 175 L235 235" stroke="#c0a080" strokeWidth="1.2" />
        <ellipse cx="200" cy="210" rx="35" ry="45" stroke="#c0a080" strokeWidth="0.5" fill="none" opacity="0.3" />

        {/* Heart area */}
        <circle cx="180" cy="220" r="12" stroke="#b06060" strokeWidth="0.8" fill="none" opacity="0.5" />

        {/* Arms */}
        <path d="M140 175 L75 215 L40 245" stroke="#c0a080" strokeWidth="1.2" fill="none" />
        <path d="M75 215 L70 217" stroke="#c0a080" strokeWidth="0.8" />
        <path d="M40 245 L33 250 M40 245 L35 255 M40 245 L40 260 M40 245 L45 255 M40 245 L47 250" stroke="#c0a080" strokeWidth="0.8" />

        <path d="M260 175 L325 215 L360 245" stroke="#c0a080" strokeWidth="1.2" fill="none" />
        <path d="M325 215 L330 217" stroke="#c0a080" strokeWidth="0.8" />
        <path d="M360 245 L367 250 M360 245 L365 255 M360 245 L360 260 M360 245 L355 255 M360 245 L353 250" stroke="#c0a080" strokeWidth="0.8" />

        {/* Waist */}
        <path d="M165 235 L160 300 M235 235 L240 300" stroke="#c0a080" strokeWidth="1.2" />
        <ellipse cx="200" cy="295" rx="40" ry="18" stroke="#c0a080" strokeWidth="0.8" fill="none" />

        {/* Navel */}
        <circle cx="200" cy="265" r="3" stroke="#c0a080" strokeWidth="0.5" fill="none" />

        {/* Legs */}
        <path d="M175 310 L165 400 L160 460" stroke="#c0a080" strokeWidth="1.2" />
        <path d="M160 460 L155 470 L170 470" stroke="#c0a080" strokeWidth="1" fill="none" />

        <path d="M225 310 L235 400 L240 460" stroke="#c0a080" strokeWidth="1.2" />
        <path d="M240 460 L245 470 L230 470" stroke="#c0a080" strokeWidth="1" fill="none" />

        <path d="M190 310 L185 400 L180 460" stroke="#c0a080" strokeWidth="0.6" opacity="0.4" />
        <path d="M210 310 L215 400 L220 460" stroke="#c0a080" strokeWidth="0.6" opacity="0.4" />

        {/* Knees */}
        <circle cx="170" cy="385" r="8" stroke="#c0a080" strokeWidth="0.5" fill="none" opacity="0.3" />
        <circle cx="230" cy="385" r="8" stroke="#c0a080" strokeWidth="0.5" fill="none" opacity="0.3" />

        {/* Overlay legs */}
        <g opacity="0.2">
          <path d="M175 310 L100 420 L85 470" stroke="#c0a080" strokeWidth="1" />
          <path d="M85 470 L75 480 L95 480" stroke="#c0a080" strokeWidth="0.8" fill="none" />
          <path d="M225 310 L300 420 L315 470" stroke="#c0a080" strokeWidth="1" />
          <path d="M315 470 L325 480 L305 480" stroke="#c0a080" strokeWidth="0.8" fill="none" />
        </g>

        {/* Overlay arms */}
        <g opacity="0.2">
          <path d="M140 175 L95 130 L65 75" stroke="#c0a080" strokeWidth="1" fill="none" />
          <path d="M65 75 L60 68 M65 75 L55 72 M65 75 L53 78" stroke="#c0a080" strokeWidth="0.6" />
          <path d="M260 175 L305 130 L335 75" stroke="#c0a080" strokeWidth="1" fill="none" />
          <path d="M335 75 L340 68 M335 75 L345 72 M335 75 L347 78" stroke="#c0a080" strokeWidth="0.6" />
        </g>

        {/* Proportion lines */}
        <g opacity="0.1">
          <line x1="140" y1="170" x2="260" y2="170" stroke="#c0a080" strokeWidth="0.5" strokeDasharray="3,3" />
          <line x1="160" y1="300" x2="240" y2="300" stroke="#c0a080" strokeWidth="0.5" strokeDasharray="3,3" />
          <line x1="200" y1="30" x2="200" y2="470" stroke="#c0a080" strokeWidth="0.3" strokeDasharray="5,5" />
        </g>
      </svg>

      {/* Interactive hotspots - NO TOOLTIPS, just the buttons */}
      {hotspots.map((spot) => {
        const project = getProjectForBodyPart(spot.id);
        if (!project) return null;

        const isSelected = selectedProject === project.id;
        const isHovered = hoveredPart === spot.id;

        return (
          <div
            key={spot.id}
            className={styles.hotspotWrapper}
            style={{
              left: `${(spot.x / 400) * 100}%`,
              top: `${(spot.y / 500) * 100}%`,
            }}
          >
            <motion.button
              className={`${styles.hotspot} ${isSelected ? styles.hotspotSelected : ''}`}
              onMouseEnter={() => setHoveredPart(spot.id)}
              onMouseLeave={() => setHoveredPart(null)}
              onClick={(e) => handleClick(spot.id, e)}
              whileTap={{ scale: 0.95 }}
              animate={{
                scale: isHovered ? 1.1 : 1,
                boxShadow: isHovered || isSelected
                  ? '0 0 25px rgba(192, 160, 128, 0.8)'
                  : '0 0 10px rgba(192, 160, 128, 0.4)',
              }}
              transition={{ duration: 0.2 }}
              aria-label={`Select ${spot.label}`}
            >
              <div className={styles.hotspotInner}>
                <span className={spot.id === 'ear' ? styles.flippedIcon : ''}>
                  {bodyPartIcons[spot.id]}
                </span>
              </div>
            </motion.button>
          </div>
        );
      })}
    </div>
  );
}
