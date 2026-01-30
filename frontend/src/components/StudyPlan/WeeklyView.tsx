import { Box, Stack, Typography } from '@mui/material'
import type { WeeklyPlan } from '../../types/plan'
import TaskCard from './TaskCard'

interface WeeklyViewProps {
  plan: WeeklyPlan
  onTaskComplete: (taskId: string) => void
}

const WeeklyView = ({ plan, onTaskComplete }: WeeklyViewProps) => (
  <Stack spacing={3}>
    <Box>
      <Typography variant="h4">Week of {plan.week_start}</Typography>
      <Typography variant="body2" color="text.secondary">
        {plan.week_start} - {plan.week_end}
      </Typography>
    </Box>
    {plan.daily_plans.map((daily) => (
      <Box key={daily.date}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {daily.date}
        </Typography>
        <Stack spacing={2}>
          {daily.tasks.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No tasks scheduled.
            </Typography>
          ) : (
            daily.tasks.map((task) => (
              <TaskCard key={task.id} task={task} onComplete={() => onTaskComplete(task.id)} />
            ))
          )}
        </Stack>
      </Box>
    ))}
  </Stack>
)

export default WeeklyView
