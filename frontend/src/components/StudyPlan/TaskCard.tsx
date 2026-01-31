import { Box, Chip, Stack, Typography } from '@mui/material'
import { differenceInCalendarDays, parseISO } from 'date-fns'
import Card from '../Common/Card'
import Button from '../Common/Button'
import type { Priority, Task } from '../../types/plan'

interface TaskCardProps {
  task: Task
  onComplete: () => void
  completed?: boolean
}

const priorityColor: Record<Priority, 'warning' | 'error' | 'success'> = {
  low: 'success',
  medium: 'warning',
  high: 'error',
}

const normalizePriority = (value: string): Priority => {
  if (value === 'low' || value === 'medium' || value === 'high') {
    return value
  }
  return 'medium'
}

const TaskCard = ({ task, onComplete, completed = false }: TaskCardProps) => {
  const priority = normalizePriority(task.priority)
  const dueDate = task.due_date ? parseISO(task.due_date) : null
  const daysUntilDue = dueDate ? differenceInCalendarDays(dueDate, new Date()) : null
  const dueLabel = daysUntilDue === null
    ? null
    : daysUntilDue < 0
      ? `Overdue by ${Math.abs(daysUntilDue)} day${Math.abs(daysUntilDue) === 1 ? '' : 's'}`
      : daysUntilDue === 0
        ? 'Due today'
        : `Due in ${daysUntilDue} day${daysUntilDue === 1 ? '' : 's'}`
  const dueColor = daysUntilDue === null ? undefined : daysUntilDue < 0 ? 'error' : daysUntilDue <= 3 ? 'warning' : 'success'
  const safeResources = task.resources ?? []

  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={1.5}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{task.subject}</Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            {completed && <Chip label="Completed" color="success" size="small" />}
            <Chip label={priority} color={priorityColor[priority]} size="small" />
          </Stack>
        </Box>
        <Typography variant="body1" color="text.secondary">
          {task.topic}
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body2">{task.duration_minutes} min</Typography>
          {task.start_time && <Typography variant="body2">Start {task.start_time}</Typography>}
          {dueLabel && <Chip label={dueLabel} color={dueColor} size="small" />}
        </Stack>
        {safeResources.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            Resources: {safeResources.join(', ')}
          </Typography>
        )}
        {task.ai_notes && (
          <Typography variant="body2" color="text.secondary">
            {task.ai_notes}
          </Typography>
        )}
        <Box>
          <Button variant="contained" onClick={onComplete} disabled={completed}>
            {completed ? 'Completed' : 'Mark Complete'}
          </Button>
        </Box>
      </Stack>
    </Card>
  )
}

export default TaskCard
