import { Stack, Typography } from '@mui/material'
import type { DailyPlan } from '../../types/plan'
import TaskCard from './TaskCard'

interface DailyViewProps {
  plan: DailyPlan
  onTaskComplete: (taskId: string) => void
}

const DailyView = ({ plan, onTaskComplete }: DailyViewProps) => (
  <Stack spacing={3}>
    <Typography variant="h4">Plan for {plan.date}</Typography>
    {plan.tasks.length === 0 ? (
      <Typography variant="body2" color="text.secondary">
        No tasks scheduled for today.
      </Typography>
    ) : (
      plan.tasks.map((task) => (
        <TaskCard key={task.id} task={task} onComplete={() => onTaskComplete(task.id)} />
      ))
    )}
  </Stack>
)

export default DailyView
