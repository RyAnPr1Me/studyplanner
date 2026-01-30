import { Box, Chip, Stack, Typography } from '@mui/material'
import { differenceInCalendarDays, parseISO } from 'date-fns'
import Card from '../Common/Card'
import Button from '../Common/Button'
import type { Task } from '../../types/plan'

interface TaskCardProps {
  task: Task
  onComplete: () => void
}

const priorityColor: Record<string, 'default' | 'warning' | 'error' | 'success'> = {
  low: 'success',
  medium: 'warning',
  high: 'error',
}

const TaskCard = ({ task, onComplete }: TaskCardProps) => {
  const priority = task.priority ?? 'medium'
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

  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={1.5}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{task.subject}</Typography>
          <Chip label={priority} color={priorityColor[priority]} size="small" />
        </Box>
        <Typography variant="body1" color="text.secondary">
          {task.topic}
        </Typography>
        <Stack direction="row" spacing={2}>
          <Typography variant="body2">{task.duration_minutes} min</Typography>
          {dueLabel && <Chip label={dueLabel} color={dueColor} size="small" />}
        </Stack>
        {task.ai_notes && (
          <Typography variant="body2" color="text.secondary">
            {task.ai_notes}
          </Typography>
        )}
        <Box>
          <Button variant="contained" onClick={onComplete}>
            Mark Complete
          </Button>
        </Box>
      </Stack>
    </Card>
  )
}

export default TaskCard
