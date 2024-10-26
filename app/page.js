'use client'
import { useState, useEffect } from 'react'
import "./page.css";

const tasks = [
  { id: 'exercise', label: 'Exercise', icon: '🏃‍♂️' },
  { id: 'hydrate', label: 'Hydrate', icon: '💧' },
  { id: 'connect', label: 'Connect', icon: '👥' },
  { id: 'meditate', label: 'Meditate', icon: '🧘‍♀️' },
  { id: 'sleep', label: 'Sleep Well', icon: '😴' },
  { id: 'nature', label: 'Nature Time', icon: '🌳' },
  { id: 'gratitude', label: 'Gratitude', icon: '🙏' },
  { id: 'creative', label: 'Create', icon: '🎨' },
]

export default function Home() {
  const [completed, setCompleted] = useState({})
  const [streaks, setStreaks] = useState({})
  const [lastCompleted, setLastCompleted] = useState({})

  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem('taskData')
    if (savedData) {
      const { completed, streaks, lastCompleted } = JSON.parse(savedData)
      setCompleted(completed)
      setStreaks(streaks)
      setLastCompleted(lastCompleted)
    }
  }, [])

  // Check if it's a new day and reset completed tasks
  useEffect(() => {
    const today = new Date().toDateString()
    Object.entries(lastCompleted).forEach(([taskId, date]) => {
      if (date !== today) {
        if (completed[taskId]) {
          setCompleted(prev => ({ ...prev, [taskId]: false }))
        }
      }
    })
  }, [lastCompleted])

//   Toggle TASK
  const toggleTask = (taskId) => {
    const today = new Date().toDateString()
    const wasCompletedToday = lastCompleted[taskId] === today

	// COMPLETE Task
    if (!wasCompletedToday) {
      // Complete the task
      setCompleted(prev => ({ ...prev, [taskId]: true }))
      setLastCompleted(prev => ({ ...prev, [taskId]: today }))
      setStreaks(prev => ({ ...prev, [taskId]: (prev[taskId] || 0) + 1 }))
    } else {
      // Uncomplete the task
      setCompleted(prev => ({ ...prev, [taskId]: false }))
      setLastCompleted(prev => ({ ...prev, [taskId]: null }))
      setStreaks(prev => ({ ...prev, [taskId]: Math.max(0, (prev[taskId] || 0) - 1) }))
    }

    // Save to localStorage
    const updatedData = {
      completed: { ...completed, [taskId]: !wasCompletedToday },
      streaks,
      lastCompleted: { ...lastCompleted, [taskId]: !wasCompletedToday ? today : null }
    }
    localStorage.setItem('taskData', JSON.stringify(updatedData))
  }

  return (
    <div className="task-grid">
      {tasks.map(task => (
        <div
          key={task.id}
          className={`task-card ${completed[task.id] ? 'completed' : ''}`}
          onClick={() => toggleTask(task.id)}
        >
          <div className="task-icon">{task.icon}</div>
          <h3>{task.label}</h3>
          <div className="streak-count">
            {streaks[task.id] ? `${streaks[task.id]} day streak` : 'Start streak'}
          </div>
        </div>
      ))}
    </div>
  )
}