'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Sparkles, Calendar } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { TASKS } from '@/lib/constants';
import styles from './TaskGrid.module.css';

export default function TaskGrid({ userDetails }) {
  const router = useRouter();
  const [completed, setCompleted] = useState({});
  const [streaks, setStreaks] = useState({});
  const [lastCompleted, setLastCompleted] = useState({});
  const [hearts, setHearts] = useState(0);
  const [heartsEarnedToday, setHeartsEarnedToday] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { getStoredData, setStoredData } = useLocalStorage('taskData');

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Initialize state from localStorage only on mount
  useEffect(() => {
    const initializeData = () => {
      const savedData = getStoredData();
      if (savedData) {
        const { completed, streaks, lastCompleted, hearts, heartsEarnedToday } = savedData;
        setCompleted(completed || {});
        setStreaks(streaks || {});
        setLastCompleted(lastCompleted || {});
        setHearts(hearts || 4);
        
        // Check if heartsEarnedToday is from today
        const today = new Date().toDateString();
        const savedDate = savedData.lastHeartEarnedDate;
        
        if (savedDate === today) {
          setHeartsEarnedToday(heartsEarnedToday || 0);
        } else {
          // Reset hearts earned if it's a new day
          setHeartsEarnedToday(0);
        }
      }
    };

    initializeData();
  }, []);

  const formatDateTime = (date) => {
    const options = { 
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('en-GB', options);
  };

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

    // Calculate new hearts with daily limit
    let newHearts = hearts;
    let newHeartsEarnedToday = heartsEarnedToday;

    if (!wasCompletedToday) {
      // Only earn a heart if we haven't reached the daily limit
      if (heartsEarnedToday < 8) {
        newHearts = Math.min(hearts + 1, 10);
        newHeartsEarnedToday = heartsEarnedToday + 1;
      }
    } else {
      // When uncompleting a task
      newHearts = Math.max(0, hearts - 1);
      newHeartsEarnedToday = Math.max(0, heartsEarnedToday - 1);
    }
    
    setCompleted(updatedCompleted);
    setLastCompleted(updatedLastCompleted);
    setStreaks(updatedStreaks);
    setHearts(newHearts);
    setHeartsEarnedToday(newHeartsEarnedToday);

    setStoredData({
      completed: updatedCompleted,
      streaks: updatedStreaks,
      lastCompleted: updatedLastCompleted,
      hearts: newHearts,
      heartsEarnedToday: newHeartsEarnedToday,
      lastHeartEarnedDate: today
    });
  };

  const hasCompletedAnyTask = Object.values(completed).some(value => value);

  const handleDayComplete = () => {
    const summaryData = {
      completedTasks: Object.keys(completed).filter(key => completed[key]).length,
      lastSevenDays: getLastSevenDays(),
      mood: userDetails?.mood
    };
    
    localStorage.setItem('dailySummary', JSON.stringify(summaryData));
    router.push('/summary');
  };

  const getPlantImage = () => {
		const imagePath = hearts < 2 
			? "/images/plant-small.png" 
			: hearts <= 4 
				? "/images/plant-medium.png" 
				: "/images/plant-large.png";
		
		return imagePath;
	};

  return (
    <div className={styles.trackerContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <div className={styles.logoText}>Mindbloom</div>
        </div>

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
              <span>{hearts} ❤️</span>
              <span className={styles.heartsLimit}>
                {heartsEarnedToday}/8 today
              </span>
            </div>
            <div className={styles.dateTime}>
              <Calendar className={styles.calendarIcon} />
              <span>{formatDateTime(currentTime)}</span>
            </div>
          </div>

          <div className={styles.taskGrid}>
            {TASKS.map((task, index) => (
              <div
                key={task.id}
                className={`
                  ${styles.taskCard} 
                  ${completed[task.id] ? styles.completed : ''} 
                  ${index < 2 ? styles.aiSuggested : ''}
                `}
                onClick={() => toggleTask(task.id)}
              >
                {index < 2 && (
                  <div className={styles.aiIndicator}>
                    <Sparkles className={styles.sparklesIcon} />
                  </div>
                )}
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