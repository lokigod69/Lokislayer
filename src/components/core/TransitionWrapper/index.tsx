// src/components/core/TransitionWrapper/index.tsx

import { motion } from 'framer-motion';

const variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.05 },
};

interface TransitionWrapperProps {
  children: React.ReactNode;
}

export default function TransitionWrapper({ children }: TransitionWrapperProps) {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}
