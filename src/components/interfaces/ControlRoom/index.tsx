// src/components/interfaces/ControlRoom/index.tsx
// Compact 1970s sci-fi control console with enhanced instruments

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
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
                  {panelType === 'typewriter' && <TypewriterDisplay isActive={isActive} />}
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

// Radar display - spinning sonar with blips that appear AFTER sweep passes
function RadarDisplay({ isActive }: { isActive: boolean }) {
  const [rotation, setRotation] = useState(0);
  // Blips only appear after the sweep has passed their position
  const [blips, setBlips] = useState<{ x: number; y: number; opacity: number; id: number; spawnAngle: number }[]>([]);
  const nextIdRef = useRef(0);
  const lastSpawnRef = useRef(0);

  // Rotate the sweep
  useEffect(() => {
    const speed = isActive ? 3 : 1;
    const interval = setInterval(() => {
      setRotation((r) => (r + speed) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [isActive]);

  // Spawn blips when sweep passes their position (blip appears behind the sweep)
  useEffect(() => {
    if (!isActive) {
      setBlips([]);
      return;
    }

    // Check if we should spawn a new blip (every ~60 degrees of rotation)
    const spawnInterval = 60;
    const currentSpawnZone = Math.floor(rotation / spawnInterval);

    if (currentSpawnZone !== lastSpawnRef.current && Math.random() > 0.4) {
      lastSpawnRef.current = currentSpawnZone;

      // Blip spawns at the current sweep angle (so it appears where sweep just passed)
      const blipAngle = rotation - 10; // Slightly behind the sweep
      const distance = 15 + Math.random() * 30;
      const rad = (blipAngle * Math.PI) / 180;

      const newBlip = {
        x: 50 + Math.cos(rad) * distance,
        y: 50 + Math.sin(rad) * distance,
        opacity: 1,
        id: nextIdRef.current++,
        spawnAngle: blipAngle,
      };

      setBlips((prev) => [...prev.slice(-8), newBlip]);
    }
  }, [rotation, isActive]);

  // Fade blips over time
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setBlips((prev) =>
        prev
          .map((b) => ({ ...b, opacity: b.opacity * 0.96 }))
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
      {/* Blips - appear after sweep passes */}
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

// Oscilloscope display - animated waveform
type WaveType = 'sine' | 'saw' | 'square' | 'triangle';
const WAVE_TYPES: WaveType[] = ['sine', 'saw', 'square', 'triangle'];

function OscilloscopeDisplay({ isActive }: { isActive: boolean }) {
  const [phase, setPhase] = useState(0);
  const [waveType, setWaveType] = useState<WaveType>('sine');

  useEffect(() => {
    const speed = isActive ? 0.15 : 0.05;
    const interval = setInterval(() => {
      setPhase((p) => (p + speed) % (Math.PI * 2));
    }, 50);
    return () => clearInterval(interval);
  }, [isActive]);

  const generatePath = useMemo(() => {
    const points: string[] = [];
    const amplitude = isActive ? 35 : 20;

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

  const handleClick = useCallback((e: React.MouseEvent) => {
    // Only change wave type when panel is already active
    // Let the click bubble up to activate panel first if not active
    if (!isActive) return;
    e.stopPropagation();
    setWaveType((current) => {
      const currentIndex = WAVE_TYPES.indexOf(current);
      return WAVE_TYPES[(currentIndex + 1) % WAVE_TYPES.length];
    });
  }, [isActive]);

  return (
    <div className={styles.oscilloscope} onClick={handleClick}>
      <svg viewBox="0 0 100 100" className={styles.oscScreen}>
        <g className={styles.oscGrid}>
          {[25, 50, 75].map((y) => (
            <line key={`h${y}`} x1="0" y1={y} x2="100" y2={y} />
          ))}
          {[25, 50, 75].map((x) => (
            <line key={`v${x}`} x1={x} y1="0" x2={x} y2="100" />
          ))}
        </g>
        <path
          d={generatePath}
          className={styles.oscWave}
          style={{ opacity: isActive ? 1 : 0.7 }}
        />
      </svg>
      <div className={styles.oscLabel}>{waveType.toUpperCase()}</div>
    </div>
  );
}

// Monitor display - with dial to change pattern count
// Grid dimensions for each pattern count (cols x rows)
const GRID_LAYOUTS: Record<number, { cols: number; rows: number }> = {
  8: { cols: 4, rows: 2 },
  16: { cols: 4, rows: 4 },
  32: { cols: 8, rows: 4 },
  64: { cols: 8, rows: 8 },
  128: { cols: 16, rows: 8 },
  256: { cols: 16, rows: 16 },
  512: { cols: 32, rows: 16 },
  1024: { cols: 32, rows: 32 },
};

function MonitorDisplay({ isActive }: { isActive: boolean }) {
  const [patternCount, setPatternCount] = useState(64);
  const [pixels, setPixels] = useState<boolean[]>(Array(64).fill(false));

  useEffect(() => {
    if (!isActive) {
      setPixels(Array(patternCount).fill(false));
      return;
    }
    const interval = setInterval(() => {
      setPixels(Array(patternCount).fill(false).map(() => Math.random() > 0.6));
    }, 100);
    return () => clearInterval(interval);
  }, [isActive, patternCount]);

  const handleDialClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Cycle through pattern counts: 8 -> 16 -> 32 -> 64 -> 128 -> 256 -> 512 -> 1024 -> 8
    setPatternCount((current) => {
      if (current === 8) return 16;
      if (current === 16) return 32;
      if (current === 32) return 64;
      if (current === 64) return 128;
      if (current === 128) return 256;
      if (current === 256) return 512;
      if (current === 512) return 1024;
      return 8;
    });
  };

  const layout = GRID_LAYOUTS[patternCount] || { cols: 8, rows: 8 };

  return (
    <div className={styles.monitor}>
      <div className={styles.monitorScreen}>
        {isActive ? (
          <div
            className={styles.pixelGrid}
            style={{
              gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
              gridTemplateRows: `repeat(${layout.rows}, 1fr)`,
            }}
          >
            {pixels.map((on, i) => (
              <div key={i} className={`${styles.pixel} ${on ? styles.pixelOn : ''}`} />
            ))}
          </div>
        ) : (
          <span className={styles.monitorOff}>OFF</span>
        )}
      </div>
      <div className={styles.monitorScanlines} />
      {/* Dial control */}
      <button
        className={styles.monitorDial}
        onClick={handleDialClick}
        title="Change pattern density"
      >
        <span className={styles.dialLabel}>{patternCount}</span>
      </button>
    </div>
  );
}

// Typewriter display - rotating messages with typing animation
const TYPEWRITER_MESSAGES = [
  'BOUNTY HUNTER',
  'TASK CREATING',
  'SOFTWARE FOR',
  'FRIENDS FAMILY',
  'AND COUPLES',
  'LOKI SLAYER',
  'SYSTEMS ONLINE',
];

function TypewriterDisplay({ isActive }: { isActive: boolean }) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setDisplayText('');
      setIsTyping(false);
      return;
    }

    const currentMessage = TYPEWRITER_MESSAGES[currentMessageIndex];
    let charIndex = 0;
    setIsTyping(true);

    // Type out the current message
    const typeInterval = setInterval(() => {
      if (charIndex <= currentMessage.length) {
        setDisplayText(currentMessage.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);

        // Wait, then move to next message
        setTimeout(() => {
          setCurrentMessageIndex((i) => (i + 1) % TYPEWRITER_MESSAGES.length);
        }, 1500);
      }
    }, 80);

    return () => clearInterval(typeInterval);
  }, [isActive, currentMessageIndex]);

  return (
    <div className={styles.typewriter}>
      <div className={styles.typewriterPaper}>
        <span className={styles.typewriterText}>
          {displayText}
          {isTyping && <span className={styles.cursor}>|</span>}
        </span>
      </div>
      {/* Typewriter carriage indicator */}
      <div className={styles.typewriterCarriage}>
        <div
          className={styles.carriagePosition}
          style={{ left: `${Math.min(displayText.length * 6, 90)}%` }}
        />
      </div>
    </div>
  );
}

// Tape recorder display - with audio waveform visualization
function TapeRecorderDisplay({ isActive }: { isActive: boolean }) {
  const [rotation, setRotation] = useState(0);
  const [waveData, setWaveData] = useState<number[]>(Array(20).fill(0));

  useEffect(() => {
    if (!isActive) {
      setWaveData(Array(20).fill(0));
      return;
    }
    const interval = setInterval(() => {
      setRotation((r) => (r + 5) % 360);
      // Generate random audio waveform data
      setWaveData((prev) => {
        const newData = [...prev.slice(1)];
        newData.push(Math.random() * 100);
        return newData;
      });
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
        {/* Tape path visualization */}
        <div className={styles.tapePath}>
          {isActive && <div className={styles.tapeMoving} />}
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
      {/* Audio waveform visualization */}
      <div className={styles.tapeWaveform}>
        {waveData.map((value, i) => (
          <div
            key={i}
            className={styles.waveBar}
            style={{ height: `${Math.max(10, value)}%` }}
          />
        ))}
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

// Clipboard display - animated checklist with appearing items
const CHECKLIST_ITEMS = [
  { text: 'LOADING', delay: 0 },
  { text: 'INTERFACE', delay: 300 },
  { text: 'PICTURES', delay: 600 },
  { text: 'ART', delay: 900 },
  { text: 'EXPERIENCE', delay: 1200 },
];

function ClipboardDisplay({ isActive }: { isActive: boolean }) {
  const [visibleItems, setVisibleItems] = useState<number>(0);
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!isActive) {
      setVisibleItems(0);
      setCheckedItems(new Set());
      return;
    }

    // Show items one by one
    CHECKLIST_ITEMS.forEach((item, index) => {
      setTimeout(() => {
        setVisibleItems((v) => Math.max(v, index + 1));
      }, item.delay);

      // Check items after they appear
      setTimeout(() => {
        setCheckedItems((prev) => new Set([...prev, index]));
      }, item.delay + 400);
    });
  }, [isActive]);

  return (
    <div className={styles.clipboard}>
      <div className={styles.clipboardBoard}>
        <div className={styles.clipboardClip} />
        <div className={styles.clipboardPaper}>
          {CHECKLIST_ITEMS.map((item, index) => (
            <motion.div
              key={item.text}
              className={`${styles.checkItem} ${checkedItems.has(index) ? styles.checked : ''}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{
                opacity: index < visibleItems ? 1 : 0,
                x: index < visibleItems ? 0 : -10,
              }}
              transition={{ duration: 0.2 }}
            >
              <motion.span
                className={styles.checkbox}
                animate={{
                  scale: checkedItems.has(index) ? [1, 1.3, 1] : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                {checkedItems.has(index) ? '✓' : '○'}
              </motion.span>
              <span className={styles.checkText}>{item.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
