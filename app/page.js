'use client'
import { useState } from 'react';
import MindbloomSplash from '@/components/MindbloomSplash/MindbloomSplash';
import TaskGrid from '@/components/TaskGrid/TaskGrid';
import styles from './page.module.css';

export default function Home() {
  const [showTasks, setShowTasks] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  const handleSplashComplete = (details) => {
    setUserDetails(details);
    setShowTasks(true);
  };

  return (
    <main className={styles.main}>
      {!showTasks ? (
        <MindbloomSplash onComplete={handleSplashComplete} />
      ) : (
        <TaskGrid userDetails={userDetails} />
      )}
    </main>
  );
}