// components/TaskGrid/TaskGrid.js
'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { TASKS } from '@/lib/constants';
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

  const getLastSevenDays = () => {
    const today = new Date();
    const days = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toDateString();
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

    // Update hearts when completing or uncompleting tasks
    const newHearts = !wasCompletedToday 
      ? Math.min(hearts + 1, 10) // Cap hearts at 10
      : Math.max(0, hearts - 1); // Prevent negative hearts
    
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

  // Determine which plant image to show based on hearts
  const getPlantImage = () => {
    const imagePath = hearts <= 3 
      ? "/images/plant-small.png" 
      : hearts <= 6 
        ? "/images/plant-medium.png" 
        : "/images/plant-large.png";
    
    console.log('Current hearts:', hearts);
    console.log('Selected image path:', imagePath);
    return imagePath;
  };

  return (
    <div className={styles.trackerContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.backgroundImage}>
          <Image
            src={getPlantImage()}
            width={450}
            height={500}
            alt={`Plant growth stage ${hearts}/10`}
            priority
            onError={(e) => {
              console.error('Error loading image:', e);
              console.log('Attempted image path:', getPlantImage());
            }}
          />
        </div>
        
        <div className={styles.content}>
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
              <span className={styles.label}>Location:</span> {userDetails?.location || 'Highgate, London'}
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
      </div>
    </div>
  );
}