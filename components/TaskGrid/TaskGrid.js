// components/TaskGrid/TaskGrid.js
'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { TASKS } from '@/lib/constants';
import Image from 'next/image';
import styles from './TaskGrid.module.css';

export default function TaskGrid({ userDetails }) {
  const router = useRouter();
  const [completed, setCompleted] = useState({});
  const [streaks, setStreaks] = useState({});
  const [lastCompleted, setLastCompleted] = useState({});
  const [hearts, setHearts] = useState(4);
  const [dayStreak, setDayStreak] = useState(0);
  const { getStoredData, setStoredData } = useLocalStorage('taskData');

  useEffect(() => {
    const savedData = getStoredData();
    if (savedData) {
      const { completed, streaks, lastCompleted, hearts, dayStreak } = savedData;
      setCompleted(completed || {});
      setStreaks(streaks || {});
      setLastCompleted(lastCompleted || {});
      setHearts(hearts || 4);
      setDayStreak(dayStreak || 0);
    }
  }, []);

  useEffect(() => {
    const today = new Date().toDateString();
    Object.entries(lastCompleted).forEach(([taskId, date]) => {
      if (date !== today && completed[taskId]) {
        setCompleted(prev => ({ ...prev, [taskId]: false }));
      }
    });
  }, [lastCompleted, completed]);

  const getLastSevenDays = () => {
    const today = new Date();
    const days = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toDateString();
      // Check if there was any task completed on this day
      days[6-i] = Object.values(lastCompleted).some(completedDate => 
        completedDate === dateString
      );
    }
    
    return days;
  };

  const toggleTask = (taskId) => {
    const today = new Date().toDateString();
    const wasCompletedToday = lastCompleted[taskId] === today;

    const updatedCompleted = { ...completed, [taskId]: !wasCompletedToday };
    const updatedLastCompleted = { 
      ...lastCompleted, 
      [taskId]: !wasCompletedToday ? today : null 
    };
    const updatedStreaks = { 
      ...streaks, 
      [taskId]: !wasCompletedToday 
        ? (streaks[taskId] || 0) + 1 
        : Math.max(0, (streaks[taskId] || 0) - 1) 
    };

    const newHearts = !wasCompletedToday ? hearts + 1 : Math.max(0, hearts - 1);

    setCompleted(updatedCompleted);
    setLastCompleted(updatedLastCompleted);
    setStreaks(updatedStreaks);
    setHearts(newHearts);

    setStoredData({
      completed: updatedCompleted,
      streaks: updatedStreaks,
      lastCompleted: updatedLastCompleted,
      hearts: newHearts,
      dayStreak
    });
  };

  const hasCompletedAnyTask = Object.values(completed).some(value => value);

  const handleDayComplete = () => {
    const summaryData = {
      streakCount: dayStreak,
      mood: userDetails?.mood,
      completedTasks: Object.keys(completed).filter(key => completed[key]).length,
      lastSevenDays: getLastSevenDays()
    };
    
    localStorage.setItem('dailySummary', JSON.stringify(summaryData));
    router.push('/summary');
  };

  return (
    <div className={styles.trackerContainer}>
      <div className={styles.backgroundImage}>
        <Image
          src={hearts < 5 ? "/src/small.png" : "/src/big.png"}
          width={450}
          height={500}
          alt="Plant"
        />
      </div>
      
      <div className={styles.trackerHeader}>
        <div className={styles.hearts}>
          {hearts} ❤️
        </div>
        <div className={styles.streak}>
          {dayStreak} 🔥
        </div>
      </div>

      <div className={styles.taskGrid}>
        {TASKS.map(task => (
          <div
            key={task.id}
            className={`${styles.taskCard} ${completed[task.id] ? styles.completed : ''}`}
            onClick={() => toggleTask(task.id)}
          >
            <div className={styles.taskIcon}>{task.icon}</div>
            <h3 className={styles.taskLabel}>{task.label}</h3>
            <div className={styles.streakCount}>
              {streaks[task.id] ? `${streaks[task.id]} day streak` : 'Start streak'}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.infoContainer}>
        <p className={styles.infoItem}>
          <span className={styles.label}>Mood:</span> {userDetails?.mood || 'Lazy'}
        </p>
        <p className={styles.infoItem}>
          <span className={styles.label}>Duration:</span> {userDetails?.duration || 10} minutes
        </p>
        <p className={styles.infoItem}>
          <span className={styles.label}>Location:</span> Highgate, London
        </p>
        <p className={styles.infoItem}>
          <span className={styles.label}>Weather:</span> Light rain, cloudy
        </p>
      </div>

      {hasCompletedAnyTask && (
        <button 
          onClick={handleDayComplete}
          className={styles.completeDay}
        >
          Time to Rest & Reflect 🌙
        </button>
      )}
    </div>
  );
}