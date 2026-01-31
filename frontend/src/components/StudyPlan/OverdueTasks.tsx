import { Alert, Stack, Typography } from '@mui/material'
import type { Task } from '../../types/plan'
import TaskCard from './TaskCard'

interface OverdueTasksProps {
  tasks: Task[]
  error?: string | null
  onComplete: (taskId: string) => void
}

const OverdueTasks = ({ tasks, error, onComplete }: OverdueTasksProps) => (
  <Stack spacing={2}>
    <Typography variant="h6">Overdue Tasks</Typography>
    {error && <Alert severity="error">{error}</Alert>}
    {tasks.length === 0 ? (
      <Typography variant="body2" color="text.secondary">
        No overdue tasks. Great job!
      </Typography>
    ) : (
      tasks.map((task) => <TaskCard key={task.id} task={task} onComplete={() => onComplete(task.id)} />)
    )}
  </Stack>
)

export default OverdueTasks
