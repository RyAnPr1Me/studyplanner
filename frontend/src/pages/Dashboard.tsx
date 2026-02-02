import { Alert, Box, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import PlanGenerator from '../components/StudyPlan/PlanGenerator'
import OverdueTasks from '../components/StudyPlan/OverdueTasks'
import AIAssistant from '../components/AI/AIAssistant'
import type { Task } from '../types/plan'
import { fetchOverdueTasks, updateTask } from '../store/api/planApi'
import { getUserId } from '../utils/user'
import { fetchUpcomingReminders } from '../store/api/reminderApi'
import { mapOverdueTask } from '../utils/taskMapper'

const Dashboard = () => {
  const [overdueTasks, setOverdueTasks] = useState<Task[]>([])
  const [overdueError, setOverdueError] = useState<string | null>(null)
  const [reminderCount, setReminderCount] = useState(0)
  const [reminderError, setReminderError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const loadOverdue = async () => {
      try {
        const response = await fetchOverdueTasks(getUserId())
        if (active) {
          setOverdueTasks(response.overdue_tasks.map(mapOverdueTask))
        }
      } catch (err) {
        if (active) {
          setOverdueError(err instanceof Error ? err.message : 'Failed to load overdue tasks')
        }
      }
    }

    const loadReminders = async () => {
      try {
        const response = await fetchUpcomingReminders(getUserId())
        if (active) {
          setReminderCount(response.upcoming_reminders.length)
        }
      } catch (err) {
        if (active) {
          setReminderError(err instanceof Error ? err.message : 'Failed to load reminders')
        }
      }
    }

    void loadOverdue()
    void loadReminders()

    return () => {
      active = false
    }
  }, [])

  const handleComplete = async (taskId: string) => {
    await updateTask(taskId, { status: 'completed' })
    const response = await fetchOverdueTasks(getUserId())
    setOverdueTasks(response.overdue_tasks.map(mapOverdueTask))
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Welcome back, Student</Typography>
        <Typography variant="body1" color="text.secondary">
          Here is your AI-powered study overview.
        </Typography>
        {reminderError && <Alert severity="error">{reminderError}</Alert>}
        <Typography variant="body2" color="text.secondary">
          Upcoming reminders: {reminderCount}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
          gap: 3,
        }}
      >
        <PlanGenerator />
        <OverdueTasks tasks={overdueTasks} error={overdueError} onComplete={handleComplete} />
      </Box>
      <AIAssistant position="sidebar" />
    </Stack>
  )
}

export default Dashboard
