# 🤖 AGENT_INSTRUCTIONS.md
## How to Work on This Project

---

## Quick Start

1. Read: PROJECT_VISION.md → ARCHITECTURE.md → IMPLEMENTATION_PHASES.md
2. Create: PROGRESS.md (your personal checklist)
3. Build: Follow phases in order
4. Update: Check off tasks as you complete them

---

## File Reference

| Need to know... | Read this file |
|-----------------|----------------|
| What are we building? | PROJECT_VISION.md |
| What's the tech stack? | ARCHITECTURE.md |
| Where do files go? | ARCHITECTURE.md (folder structure) |
| How do I add a project? | ARCHITECTURE.md (projects.ts section) |
| What do I build next? | IMPLEMENTATION_PHASES.md + PROGRESS.md |
| What's already done? | PROGRESS.md |

---

## The 6 Interfaces (Build Order)

1. **Neural Map** (Default) — Canvas/SVG, nodes, connections
2. **Retro OS** — Windows 95 desktop, draggable windows
3. **Pirate Broadcast** — Radio dial, frequency tuning
4. **Control Room** — Toggle switches, VU meters, panels
5. **Anatomical Map** — Da Vinci body SVG, hover reveals
6. **Vending Machine** — 3D R3F scene, product physics

---

## Critical Files to Create

### Config (Create in Phase 0)
- `src/config/projects.ts` — Copy from ARCHITECTURE.md
- `src/config/interfaces.ts` — Copy from ARCHITECTURE.md
- `src/store/useStore.ts` — Copy from ARCHITECTURE.md
- `src/types/index.ts` — Copy from ARCHITECTURE.md

### Core Components (Create in Phase 1)
- `src/components/core/EntryLobby/index.tsx`
- `src/components/core/Loader/index.tsx`
- `src/components/core/TransitionWrapper/index.tsx`
- `src/components/core/BackButton/index.tsx`
- `src/components/core/AudioToggle/index.tsx`

### Each Interface (Create in Phases 2-4)
- `src/components/interfaces/[Name]/index.tsx`
- `src/components/interfaces/[Name]/styles.module.css`
- Additional components as needed per interface

---

## Commands
```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Dependencies to Install
```bash
# All at once
npm install zustand framer-motion gsap three @react-three/fiber @react-three/drei @react-three/rapier howler

# Dev dependencies
npm install -D tailwindcss postcss autoprefixer @types/three
```

---

## Testing Checklist (Run After Each Phase)

- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Works in Chrome
- [ ] Works on mobile (dev tools responsive mode)
- [ ] All links open correctly
- [ ] Animations smooth (60fps)

---

## Common Patterns

### Adding a new project
1. Add to `src/config/projects.ts`
2. Fill in all `mappings` for each interface
3. Done — all interfaces auto-include it

### Adding a new interface
1. Create folder in `src/components/interfaces/`
2. Create `index.tsx` with default export
3. Add to `src/config/interfaces.ts`
4. Update dice sides if needed

### Lazy loading an interface
```typescript
const MyInterface = lazy(() => import('./components/interfaces/MyInterface'));
```

### Using project data in an interface
```typescript
import { projects } from '../../config/projects';

function MyInterface() {
  return (
    <>
      {projects.map(project => (
        <ProjectNode key={project.id} project={project} />
      ))}
    </>
  );
}
```

### Opening a project link
```typescript
const handleClick = (project: Project) => {
  if (project.status === 'live') {
    window.open(project.url, '_blank');
  }
};
```

---

## When You're Done

1. All checkboxes in PROGRESS.md should be checked
2. Run `npm run build` — should succeed
3. Deploy to Vercel
4. Test production URL on multiple devices
5. Celebrate 🎉

---

Good luck, agent. Build something insane. 🎲