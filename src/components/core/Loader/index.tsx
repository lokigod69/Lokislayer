// src/components/core/Loader/index.tsx

import styles from './styles.module.css';

export default function Loader() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black">
      <div className={styles.spinner} />
      <div className="text-white text-xl mt-4 animate-pulse">Loading...</div>
    </div>
  );
}
