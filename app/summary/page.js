// app/summary/page.js
'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './summary.module.css';

export default function Summary() {
  const [summaryData, setSummaryData] = useState(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const data = JSON.parse(localStorage.getItem('dailySummary') || '{}');
      setSummaryData(data);
    }
  }, []);
  
  if (!summaryData) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading your achievements...</p>
      </div>
    );
  }

  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date().getDay();
  const adjustedToday = today === 0 ? 6 : today - 1; // Convert to Mon-Sun format

  return (
    <div className={styles.summaryContainer}>
      <div className={styles.content}>
        <h1 className={styles.title}>Well Done! 🌟</h1>
        
        <div className={styles.messageCard}>
          <p className={styles.message}>
            I know you felt {summaryData.mood?.toLowerCase() || 'lazy'} today, but you've taken time 
            for self-care and completed {summaryData.completedTasks} task
            {summaryData.completedTasks !== 1 ? 's' : ''}. That's worth celebrating!
          </p>
          <p className={styles.submessage}>
            Let's keep building this positive momentum.
          </p>
        </div>

        <div className={styles.weekProgress}>
          <h2 className={styles.weekTitle}>Your Weekly Journey</h2>
          <div className={styles.weekDays}>
            {weekdays.map((day, index) => (
              <div 
                key={day} 
                className={`${styles.day} ${
                  index === adjustedToday ? styles.today : ''
                } ${summaryData.lastSevenDays && summaryData.lastSevenDays[index] 
                    ? styles.completed 
                    : styles.missed
                }`}
              >
                <div className={styles.dayLabel}>{day}</div>
                <div className={styles.dayIndicator}></div>
              </div>
            ))}
          </div>
          <p className={styles.streakCount}>
            {summaryData.streakCount > 0 ? (
              <>
                🔥 {summaryData.streakCount} Day Streak! Keep it up! 🔥
              </>
            ) : (
              "Start your streak tomorrow! 💪"
            )}
          </p>
        </div>

        <Link href="/" className={styles.homeButton}>
          See You Tomorrow 🌅
        </Link>

        <p className={styles.quote}>
          "Every small step counts on the path to well-being."
        </p>
      </div>
    </div>
  );
}