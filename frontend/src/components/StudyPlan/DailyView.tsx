import { Chip, Stack, Typography } from '@mui/material'
import type { DailyPlanResponse } from '../../types/plan'
import TaskCard from './TaskCard'

interface DailyViewProps {
  plan: DailyPlanResponse
  completedTasks?: string[]
  onTaskComplete: (taskId: string) => void
}

const DailyView = ({ plan, completedTasks = [], onTaskComplete }: DailyViewProps) => (
  <Stack spacing={3}>
    <Typography variant="h4">Plan for {plan.date}</Typography>
    {plan.suggested_tools.length > 0 && (
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {plan.suggested_tools.map((tool) => (
          <Chip key={tool.tool_id} label={`${tool.tool_type} • ${tool.subject}`} variant="outlined" />
        ))}
      </Stack>
    )}
    {plan.tasks.length === 0 ? (
      <Typography variant="body2" color="text.secondary">
        No tasks scheduled for today.
      </Typography>
    ) : (
      plan.tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          completed={completedTasks.includes(task.id)}
          onComplete={() => onTaskComplete(task.id)}
        />
      ))
    )}
  </Stack>
)

export default DailyView
