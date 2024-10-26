// TaskTracker.js
'use client'
import { useState, useEffect } from 'react'
import styles from './styles.module.css'


const tasks = [
  {
    id: 'stairs',
    label: 'Stair Run',
    icon: '🏃',
    duration: '10 mins',
    description: 'Take a quick stair run to get your heart pumping and energy flowing. Even small bursts of movement make a big difference!',
    impact: 'Boosts energy, mood, and cardiovascular health'
  },
  {
    id: 'call',
    label: 'Ring Family/Friend',
    icon: '📞',
    duration: '10 mins',
    description: 'Take a moment to connect with someone you care about. A quick chat can brighten both your days!',
    impact: 'Strengthens relationships and emotional wellbeing'
  }
]

export default function Tasks() {
  const [completed, setCompleted] = useState({})
  const [hearts, setHearts] = useState(0)
  const [dayStreak, setDayStreak] = useState(0)
  const [selectedTask, setSelectedTask] = useState(null)
  const [showCongrats, setShowCongrats] = useState(false)
  const [lastActiveDate, setLastActiveDate] = useState(null)

  // Load saved data
  useEffect(() => {
    const savedData = localStorage.getItem('focusedTaskData')
    if (savedData) {
      const { completed, hearts, dayStreak, lastActiveDate } = JSON.parse(savedData)
      setCompleted(completed)
      setHearts(hearts)
      setDayStreak(dayStreak)
      setLastActiveDate(lastActiveDate)
    }
  }, [])

  // Check streak
  useEffect(() => {
    const today = new Date().toDateString()
    if (lastActiveDate) {
      const lastDate = new Date(lastActiveDate)
      const dayDifference = Math.floor((new Date(today) - lastDate) / (1000 * 60 * 60 * 24))
      
      if (dayDifference > 1) {
        // Reset streak if more than a day has passed
        setDayStreak(0)
      } else if (dayDifference === 1) {
        // Increment streak for a new day
        setDayStreak(prev => prev + 1)
      }
    }
    setLastActiveDate(today)
  }, [completed])

  const completeTask = (taskId) => {
    if (!completed[taskId]) {
      const newCompleted = { ...completed, [taskId]: true }
      setCompleted(newCompleted)
      setHearts(prev => prev + 1)
      setShowCongrats(true)

      // Save to localStorage
      const updatedData = {
        completed: newCompleted,
        hearts: hearts + 1,
        dayStreak,
        lastActiveDate: new Date().toDateString()
      }
      localStorage.setItem('focusedTaskData', JSON.stringify(updatedData))
    }
  }

  return (
    <div className={styles.trackerContainer}>
      {/* Header */}
      <div className={styles.trackerHeader}>
        <div className={styles.hearts}>
          {hearts} ❤️
        </div>
        <div class={styles.streak}>
          {dayStreak} 🔥
        </div>
      </div>

      {/* Task Grid */}
      <div className={styles.taskGrid}>
        {tasks.map(task => (
          <div
            key={task.id}
            className={`${styles.taskCard} ${completed[task.id] ? styles.completed : ''}`}
            onClick={() => !completed[task.id] && setSelectedTask(task)}
          >
            <div className={styles.taskIcon}>{task.icon}</div>
            <h3>{task.label}</h3>
            <div className={styles.taskDuration}>{task.duration}</div>
          </div>
        ))}
      </div>

      {/* Task Detail Overlay */}
      {selectedTask && (
        <div className={styles.taskOverlay}>
          <div className={styles.overlayContent}>
            {!showCongrats ? (
              <>
                <h2>{selectedTask.icon} {selectedTask.label}</h2>
                <p className={styles.duration}>{selectedTask.duration}</p>
                <p className={styles.description}>{selectedTask.description}</p>
                <p className={styles.impact}>{selectedTask.impact}</p>
                <button 
                  className={styles.completeButton}
                  onClick={() => completeTask(selectedTask.id)}
                >
                  Complete Task
                </button>
              </>
            ) : (
              <div className={styles.congrats}>
                <h2>🎉 Amazing Job! 🎉</h2>
                <p>You're making great progress!</p>
                <p className={styles.heartsGained}>+1 ❤️</p>
              </div>
            )}
            <button 
              className={styles.backButton}
              onClick={() => {
                setSelectedTask(null)
                setShowCongrats(false)
              }}
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  )
}