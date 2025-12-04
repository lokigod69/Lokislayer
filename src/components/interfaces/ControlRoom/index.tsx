// src/components/interfaces/ControlRoom/index.tsx
// Redesigned as compact 1970s sci-fi control console with distinct instruments

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '../../../config/projects';
import styles from './styles.module.css';

// Define panel types and their instruments
type PanelType = 'radar' | 'oscilloscope' | 'monitor' | 'typewriter' | 'tape-recorder' | 'clipboard';

const panelTypes: PanelType[] = ['radar', 'oscilloscope', 'monitor', 'typewriter', 'tape-recorder', 'clipboard'];

export default function ControlRoom() {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePanelClick = useCallback((projectId: string) => {
    setActivePanel(activePanel === projectId ? null : projectId);
  }, [activePanel]);

  const handleLaunch = useCallback((project: typeof projects[0]) => {
    if (project.status === 'live') {
      window.open(project.url, '_blank', 'noopener,noreferrer');
    }
  }, []);

  return (
    <div className={styles.container}>
      {/* Ambient glow */}
      <div className={styles.ambientGlow} />

      {/* Title */}
      <motion.h1
        className={styles.title}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        CONTROL ROOM
      </motion.h1>

      {/* Main console */}
      <motion.div
        className={styles.console}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Panel grid - 3x2 */}
        <div className={styles.panelGrid}>
          {projects.map((project, index) => {
            const panelType = panelTypes[index % panelTypes.length];
            const isActive = activePanel === project.id;

            return (
              <motion.div
                key={project.id}
                className={`${styles.panel} ${isActive ? styles.panelActive : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handlePanelClick(project.id)}
              >
                {/* Panel header */}
                <div className={styles.panelHeader}>
                  <span className={styles.panelLabel}>{panelType.replace('-', ' ')}</span>
                  <div className={`${styles.led} ${isActive ? styles.ledOn : ''}`} />
                </div>

                {/* Instrument display */}
                <div className={styles.instrumentArea}>
                  {panelType === 'radar' && <RadarDisplay isActive={isActive} />}
                  {panelType === 'oscilloscope' && <OscilloscopeDisplay isActive={isActive} />}
                  {panelType === 'monitor' && <MonitorDisplay isActive={isActive} />}
                  {panelType === 'typewriter' && <TypewriterDisplay isActive={isActive} project={project} />}
                  {panelType === 'tape-recorder' && <TapeRecorderDisplay isActive={isActive} />}
                  {panelType === 'clipboard' && <ClipboardDisplay isActive={isActive} />}
                </div>

                {/* Project info (shows when active) */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      className={styles.projectInfo}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className={styles.projectName}>{project.name}</div>
                      <button
                        className={styles.launchBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLaunch(project);
                        }}
                        disabled={project.status !== 'live'}
                      >
                        {project.status === 'live' ? 'LAUNCH' : 'STANDBY'}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Status bar */}
        <div className={styles.statusBar}>
          <div className={styles.statusItem}>
            <div className={styles.statusLed} />
            <span>SYS NOMINAL</span>
          </div>
          <span className={styles.version}>POLY-INTERFACE v1.0</span>
          <span className={styles.clock}>UTC {currentTime}</span>
        </div>
      </motion.div>

      {/* Instructions */}
      <motion.div
        className={styles.instructions}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Click a panel to activate • Launch to enter project
      </motion.div>
    </div>
  );
}

// Radar display - spinning sonar with blips that appear when sweep passes
function RadarDisplay({ isActive }: { isActive: boolean }) {
  const [rotation, setRotation] = useState(0);
  // Hidden targets - angle and distance, not yet revealed
  const [targets, setTargets] = useState<{ angle: number; distance: number; id: number }[]>([]);
  // Visible blips - revealed when sweep passes
  const [blips, setBlips] = useState<{ x: number; y: number; opacity: number; id: number }[]>([]);
  const [nextId, setNextId] = useState(0);

  // Rotate the sweep - always animate, faster when active
  useEffect(() => {
    const speed = isActive ? 3 : 1;
    const interval = setInterval(() => {
      setRotation((r) => (r + speed) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [isActive]);

  // Spawn new hidden targets periodically
  useEffect(() => {
    if (!isActive) {
      setTargets([]);
      setBlips([]);
      return;
    }
    const interval = setInterval(() => {
      // Add a new hidden target at random angle
      const angle = Math.random() * 360;
      const distance = 15 + Math.random() * 30;
      setTargets((prev) => {
        // Keep max 6 targets
        const updated = [...prev.slice(-5), { angle, distance, id: nextId }];
        return updated;
      });
      setNextId((id) => id + 1);
    }, 1500);
    return () => clearInterval(interval);
  }, [isActive, nextId]);

  // Check if sweep passes any hidden targets - reveal them as blips
  useEffect(() => {
    if (!isActive || targets.length === 0) return;

    const toReveal: typeof targets = [];
    const remaining: typeof targets = [];

    targets.forEach((target) => {
      // Check if sweep angle is close to target angle (within 10 degrees)
      const sweepAngle = rotation;
      let diff = Math.abs(sweepAngle - target.angle);
      if (diff > 180) diff = 360 - diff;

      if (diff < 10) {
        toReveal.push(target);
      } else {
        remaining.push(target);
      }
    });

    if (toReveal.length > 0) {
      // Convert revealed targets to visible blips
      const newBlips = toReveal.map((t) => {
        const rad = (t.angle * Math.PI) / 180;
        return {
          x: 50 + Math.cos(rad) * t.distance,
          y: 50 + Math.sin(rad) * t.distance,
          opacity: 1,
          id: t.id,
        };
      });
      setBlips((prev) => [...prev, ...newBlips]);
      setTargets(remaining);
    }
  }, [rotation, targets, isActive]);

  // Fade blips over time
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setBlips((prev) =>
        prev
          .map((b) => ({ ...b, opacity: b.opacity * 0.97 }))
          .filter((b) => b.opacity > 0.05)
      );
    }, 100);
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className={styles.radar}>
      {/* Grid circles */}
      <div className={styles.radarGrid}>
        <div className={styles.radarCircle} style={{ width: '30%', height: '30%' }} />
        <div className={styles.radarCircle} style={{ width: '60%', height: '60%' }} />
        <div className={styles.radarCircle} style={{ width: '90%', height: '90%' }} />
        <div className={styles.radarCrosshair} />
      </div>
      {/* Sweep line with trailing glow */}
      <div
        className={styles.radarSweep}
        style={{ transform: `rotate(${rotation}deg)` }}
      />
      {/* Blips - only visible after sweep discovers them */}
      {blips.map((blip) => (
        <div
          key={blip.id}
          className={styles.radarBlip}
          style={{
            left: `${blip.x}%`,
            top: `${blip.y}%`,
            opacity: blip.opacity,
          }}
        />
      ))}
      {/* Center dot */}
      <div className={styles.radarCenter} />
    </div>
  );
}

// Oscilloscope display - animated waveform, click to cycle wave types
type WaveType = 'sine' | 'saw' | 'square' | 'triangle';
const WAVE_TYPES: WaveType[] = ['sine', 'saw', 'square', 'triangle'];

function OscilloscopeDisplay({ isActive }: { isActive: boolean }) {
  const [phase, setPhase] = useState(0);
  const [waveType, setWaveType] = useState<WaveType>('sine');

  // Always animate - faster when active
  useEffect(() => {
    const speed = isActive ? 0.15 : 0.05;
    const interval = setInterval(() => {
      setPhase((p) => (p + speed) % (Math.PI * 2));
    }, 50);
    return () => clearInterval(interval);
  }, [isActive]);

  const generatePath = useMemo(() => {
    const points: string[] = [];
    const amplitude = isActive ? 35 : 20; // Always visible, stronger when active

    for (let i = 0; i <= 100; i++) {
      const x = i;
      let y: number;

      switch (waveType) {
        case 'sine':
          y = 50 + Math.sin((i / 15) + phase) * amplitude;
          break;
        case 'saw':
          const sawPos = ((i / 25) + phase / 2) % 1;
          y = 50 + (sawPos * 2 - 1) * amplitude;
          break;
        case 'square':
          const squareVal = Math.sin((i / 15) + phase) >= 0 ? 1 : -1;
          y = 50 + squareVal * amplitude;
          break;
        case 'triangle':
          const triPos = ((i / 25) + phase / 2) % 1;
          const triVal = triPos < 0.5 ? (triPos * 4 - 1) : (3 - triPos * 4);
          y = 50 + triVal * amplitude;
          break;
        default:
          y = 50;
      }
      points.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
    }
    return points.join(' ');
  }, [phase, waveType, isActive]);

  // Click anywhere on oscilloscope to cycle wave type
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setWaveType((current) => {
      const currentIndex = WAVE_TYPES.indexOf(current);
      return WAVE_TYPES[(currentIndex + 1) % WAVE_TYPES.length];
    });
  }, []);

  return (
    <div className={styles.oscilloscope} onClick={handleClick}>
      <svg viewBox="0 0 100 100" className={styles.oscScreen}>
        {/* Grid */}
        <g className={styles.oscGrid}>
          {[25, 50, 75].map((y) => (
            <line key={`h${y}`} x1="0" y1={y} x2="100" y2={y} />
          ))}
          {[25, 50, 75].map((x) => (
            <line key={`v${x}`} x1={x} y1="0" x2={x} y2="100" />
          ))}
        </g>
        {/* Waveform */}
        <path
          d={generatePath}
          className={styles.oscWave}
          style={{ opacity: isActive ? 1 : 0.7 }}
        />
      </svg>
      {/* Wave type label */}
      <div className={styles.oscLabel}>{waveType.toUpperCase()}</div>
    </div>
  );
}

// Monitor display - static/pixels
function MonitorDisplay({ isActive }: { isActive: boolean }) {
  const [pixels, setPixels] = useState<boolean[]>(Array(64).fill(false));

  useEffect(() => {
    if (!isActive) {
      setPixels(Array(64).fill(false));
      return;
    }
    const interval = setInterval(() => {
      setPixels(Array(64).fill(false).map(() => Math.random() > 0.7));
    }, 100);
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className={styles.monitor}>
      <div className={styles.monitorScreen}>
        {isActive ? (
          <div className={styles.pixelGrid}>
            {pixels.map((on, i) => (
              <div key={i} className={`${styles.pixel} ${on ? styles.pixelOn : ''}`} />
            ))}
          </div>
        ) : (
          <span className={styles.monitorOff}>OFF</span>
        )}
      </div>
      <div className={styles.monitorScanlines} />
    </div>
  );
}

// Typewriter display - text appearing
function TypewriterDisplay({ isActive, project }: { isActive: boolean; project: typeof projects[0] }) {
  const [text, setText] = useState('');
  const fullText = project.name.toUpperCase();

  useEffect(() => {
    if (!isActive) {
      setText('');
      return;
    }
    let i = 0;
    const interval = setInterval(() => {
      if (i <= fullText.length) {
        setText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isActive, fullText]);

  return (
    <div className={styles.typewriter}>
      <div className={styles.typewriterPaper}>
        <span className={styles.typewriterText}>
          {text}
          {isActive && text.length < fullText.length && <span className={styles.cursor}>|</span>}
        </span>
      </div>
    </div>
  );
}

// Tape recorder display - spinning reels
function TapeRecorderDisplay({ isActive }: { isActive: boolean }) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setRotation((r) => (r + 5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className={styles.tapeRecorder}>
      {/* Reels container */}
      <div className={styles.reelsContainer}>
        {/* Left reel */}
        <div
          className={styles.reel}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <div className={styles.reelCenter} />
          <div className={styles.reelSpoke} />
          <div className={styles.reelSpoke} style={{ transform: 'rotate(120deg)' }} />
          <div className={styles.reelSpoke} style={{ transform: 'rotate(240deg)' }} />
        </div>
        {/* Right reel */}
        <div
          className={styles.reel}
          style={{ transform: `rotate(${-rotation}deg)` }}
        >
          <div className={styles.reelCenter} />
          <div className={styles.reelSpoke} />
          <div className={styles.reelSpoke} style={{ transform: 'rotate(120deg)' }} />
          <div className={styles.reelSpoke} style={{ transform: 'rotate(240deg)' }} />
        </div>
      </div>
      {/* VU meter */}
      <div className={styles.tapeVu}>
        <div
          className={styles.tapeVuFill}
          style={{ width: isActive ? `${50 + Math.random() * 40}%` : '10%' }}
        />
      </div>
    </div>
  );
}

// Clipboard display - checklist
function ClipboardDisplay({ isActive }: { isActive: boolean }) {
  return (
    <div className={styles.clipboard}>
      <div>
        <div className={styles.clipboardClip} />
        <div className={styles.clipboardPaper}>
          <div className={`${styles.checkItem} ${isActive ? styles.checked : ''}`}>
            <span className={styles.checkbox}>{isActive ? '✓' : '○'}</span>
            <span>INIT</span>
          </div>
          <div className={`${styles.checkItem} ${isActive ? styles.checked : ''}`}>
            <span className={styles.checkbox}>{isActive ? '✓' : '○'}</span>
            <span>LOAD</span>
          </div>
          <div className={`${styles.checkItem} ${isActive ? styles.checked : ''}`}>
            <span className={styles.checkbox}>{isActive ? '✓' : '○'}</span>
            <span>READY</span>
          </div>
        </div>
      </div>
    </div>
  );
}
