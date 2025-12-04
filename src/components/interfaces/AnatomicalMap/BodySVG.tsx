// src/components/interfaces/AnatomicalMap/BodySVG.tsx
// Da Vinci Vitruvian Man style illustration with larger head

import { useState, useEffect, useCallback } from 'react';
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

  const handleClick = (bodyPart: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const project = getProjectForBodyPart(bodyPart);
    if (project) {
      setSelectedProject(selectedProject?.id === project.id ? null : project);
    }
  };

  // Close modal when clicking outside
  const handleBackgroundClick = useCallback(() => {
    if (selectedProject) {
      setSelectedProject(null);
    }
  }, [selectedProject]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedProject) {
        setSelectedProject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject]);

  const handleVisit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedProject && selectedProject.status === 'live') {
      window.open(selectedProject.url, '_blank', 'noopener,noreferrer');
    }
  };

  // Hotspot positions - adjusted for larger head (SVG viewBox 0 0 400 500)
  // Head is now larger: ellipse at cy="85" with rx="40" ry="50" (goes from y=35 to y=135)
  const hotspots = [
    { id: 'brain', x: 200, y: 50, label: 'Brain', isHead: true },      // Top of larger head
    { id: 'eye', x: 230, y: 80, label: 'Eye', isHead: true },          // Right eye area
    { id: 'ear', x: 155, y: 90, label: 'Ear', isHead: true },          // Left ear area
    { id: 'mouth', x: 200, y: 115, label: 'Mouth', isHead: true },     // Mouth area
    { id: 'heart', x: 180, y: 230, label: 'Heart', isHead: false },    // Heart in chest
    { id: 'hands', x: 355, y: 250, label: 'Hands', isHead: false },    // Right hand
  ];

  return (
    <div className={styles.bodyContainer} onClick={handleBackgroundClick}>
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
          stroke="#8b5a2b"
          strokeWidth="1"
          fill="none"
          opacity="0.4"
        />

        {/* Vitruvian Square */}
        <rect
          x="50"
          y="95"
          width="300"
          height="375"
          stroke="#8b5a2b"
          strokeWidth="1"
          fill="none"
          opacity="0.3"
        />

        {/* Grid lines (subtle) */}
        <line x1="200" y1="35" x2="200" y2="470" stroke="#8b5a2b" strokeWidth="0.3" opacity="0.2" />
        <line x1="50" y1="270" x2="350" y2="270" stroke="#8b5a2b" strokeWidth="0.3" opacity="0.2" />

        {/* === MAIN FIGURE with LARGER HEAD === */}

        {/* Head - MUCH LARGER (proportionally bigger) */}
        <ellipse cx="200" cy="85" rx="40" ry="50" stroke="#8b5a2b" strokeWidth="1.5" fill="none" />

        {/* Face details - scaled up */}
        {/* Eyes - wider apart and larger */}
        <ellipse cx="182" cy="80" rx="7" ry="4" stroke="#8b5a2b" strokeWidth="0.8" fill="none" />
        <ellipse cx="218" cy="80" rx="7" ry="4" stroke="#8b5a2b" strokeWidth="0.8" fill="none" />
        {/* Pupils */}
        <circle cx="182" cy="80" r="2" fill="#8b5a2b" opacity="0.4" />
        <circle cx="218" cy="80" r="2" fill="#8b5a2b" opacity="0.4" />

        {/* Eyebrows */}
        <path d="M174 73 Q182 70 190 73" stroke="#8b5a2b" strokeWidth="0.6" fill="none" />
        <path d="M210 73 Q218 70 226 73" stroke="#8b5a2b" strokeWidth="0.6" fill="none" />

        {/* Nose - larger */}
        <path d="M200 85 L196 100 L204 100" stroke="#8b5a2b" strokeWidth="0.8" fill="none" />

        {/* Mouth - larger and lower */}
        <path d="M188 115 Q200 122 212 115" stroke="#8b5a2b" strokeWidth="0.8" fill="none" />

        {/* Ears - larger and on the sides */}
        <ellipse cx="158" cy="90" rx="6" ry="12" stroke="#8b5a2b" strokeWidth="0.8" fill="none" />
        <ellipse cx="242" cy="90" rx="6" ry="12" stroke="#8b5a2b" strokeWidth="0.8" fill="none" />

        {/* Hair hint - larger arc */}
        <path d="M165 50 Q200 30 235 50" stroke="#8b5a2b" strokeWidth="0.5" fill="none" />

        {/* Neck - connects larger head to body */}
        <path d="M185 135 L185 160 M215 135 L215 160" stroke="#8b5a2b" strokeWidth="1.2" />

        {/* Shoulders and upper torso */}
        <path d="M185 160 Q165 165 140 175" stroke="#8b5a2b" strokeWidth="1.2" fill="none" />
        <path d="M215 160 Q235 165 260 175" stroke="#8b5a2b" strokeWidth="1.2" fill="none" />

        {/* Chest/Ribcage */}
        <path d="M170 175 L165 235 M230 175 L235 235" stroke="#8b5a2b" strokeWidth="1.2" />
        <ellipse cx="200" cy="210" rx="35" ry="45" stroke="#8b5a2b" strokeWidth="0.5" fill="none" opacity="0.4" />

        {/* Heart area (subtle circle) */}
        <circle cx="180" cy="220" r="12" stroke="#c45c5c" strokeWidth="0.8" fill="none" opacity="0.6" />

        {/* Arms extended horizontally */}
        {/* Left arm */}
        <path d="M140 175 L75 215 L40 245" stroke="#8b5a2b" strokeWidth="1.2" fill="none" />
        {/* Left forearm detail */}
        <path d="M75 215 L70 217" stroke="#8b5a2b" strokeWidth="0.8" />
        {/* Left hand */}
        <path d="M40 245 L33 250 M40 245 L35 255 M40 245 L40 260 M40 245 L45 255 M40 245 L47 250" stroke="#8b5a2b" strokeWidth="0.8" />

        {/* Right arm */}
        <path d="M260 175 L325 215 L360 245" stroke="#8b5a2b" strokeWidth="1.2" fill="none" />
        {/* Right forearm detail */}
        <path d="M325 215 L330 217" stroke="#8b5a2b" strokeWidth="0.8" />
        {/* Right hand */}
        <path d="M360 245 L367 250 M360 245 L365 255 M360 245 L360 260 M360 245 L355 255 M360 245 L353 250" stroke="#8b5a2b" strokeWidth="0.8" />

        {/* Waist/Hips */}
        <path d="M165 235 L160 300 M235 235 L240 300" stroke="#8b5a2b" strokeWidth="1.2" />
        <ellipse cx="200" cy="295" rx="40" ry="18" stroke="#8b5a2b" strokeWidth="0.8" fill="none" />

        {/* Navel */}
        <circle cx="200" cy="265" r="3" stroke="#8b5a2b" strokeWidth="0.5" fill="none" />

        {/* Legs (together) */}
        {/* Left leg */}
        <path d="M175 310 L165 400 L160 460" stroke="#8b5a2b" strokeWidth="1.2" />
        <path d="M160 460 L155 470 L170 470" stroke="#8b5a2b" strokeWidth="1" fill="none" />

        {/* Right leg */}
        <path d="M225 310 L235 400 L240 460" stroke="#8b5a2b" strokeWidth="1.2" />
        <path d="M240 460 L245 470 L230 470" stroke="#8b5a2b" strokeWidth="1" fill="none" />

        {/* Inner leg lines */}
        <path d="M190 310 L185 400 L180 460" stroke="#8b5a2b" strokeWidth="0.6" opacity="0.5" />
        <path d="M210 310 L215 400 L220 460" stroke="#8b5a2b" strokeWidth="0.6" opacity="0.5" />

        {/* Knee details */}
        <circle cx="170" cy="385" r="8" stroke="#8b5a2b" strokeWidth="0.5" fill="none" opacity="0.4" />
        <circle cx="230" cy="385" r="8" stroke="#8b5a2b" strokeWidth="0.5" fill="none" opacity="0.4" />

        {/* === OVERLAY FIGURE (legs apart - faded) === */}
        <g opacity="0.25">
          {/* Left leg spread */}
          <path d="M175 310 L100 420 L85 470" stroke="#8b5a2b" strokeWidth="1" />
          <path d="M85 470 L75 480 L95 480" stroke="#8b5a2b" strokeWidth="0.8" fill="none" />

          {/* Right leg spread */}
          <path d="M225 310 L300 420 L315 470" stroke="#8b5a2b" strokeWidth="1" />
          <path d="M315 470 L325 480 L305 480" stroke="#8b5a2b" strokeWidth="0.8" fill="none" />
        </g>

        {/* === OVERLAY ARMS (raised - faded) === */}
        <g opacity="0.25">
          {/* Left arm raised */}
          <path d="M140 175 L95 130 L65 75" stroke="#8b5a2b" strokeWidth="1" fill="none" />
          <path d="M65 75 L60 68 M65 75 L55 72 M65 75 L53 78" stroke="#8b5a2b" strokeWidth="0.6" />

          {/* Right arm raised */}
          <path d="M260 175 L305 130 L335 75" stroke="#8b5a2b" strokeWidth="1" fill="none" />
          <path d="M335 75 L340 68 M335 75 L345 72 M335 75 L347 78" stroke="#8b5a2b" strokeWidth="0.6" />
        </g>

        {/* Anatomical proportion lines */}
        <g opacity="0.15">
          {/* Shoulder width guide */}
          <line x1="140" y1="170" x2="260" y2="170" stroke="#8b5a2b" strokeWidth="0.5" strokeDasharray="3,3" />
          {/* Hip width guide */}
          <line x1="160" y1="300" x2="240" y2="300" stroke="#8b5a2b" strokeWidth="0.5" strokeDasharray="3,3" />
          {/* Center line */}
          <line x1="200" y1="30" x2="200" y2="470" stroke="#8b5a2b" strokeWidth="0.3" strokeDasharray="5,5" />
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
            onClick={(e) => handleClick(spot.id, e)}
            // Only scale on hover for hands, not head parts
            whileHover={spot.isHead ? {} : { scale: 1.15 }}
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
