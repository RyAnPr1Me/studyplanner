import { Stack, Typography } from '@mui/material'
import type { Task } from '../../types/plan'
import TaskCard from './TaskCard'

interface OverdueTasksProps {
  tasks: Task[]
}

const OverdueTasks = ({ tasks }: OverdueTasksProps) => (
  <Stack spacing={2}>
    <Typography variant="h6">Overdue Tasks</Typography>
    {tasks.length === 0 ? (
      <Typography variant="body2" color="text.secondary">
        No overdue tasks. Great job!
      </Typography>
    ) : (
      tasks.map((task) => <TaskCard key={task.id} task={task} onComplete={() => undefined} />)
    )}
  </Stack>
)

export default OverdueTasks
