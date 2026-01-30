import { Stack, Typography } from '@mui/material'
import DailyView from '../components/StudyPlan/DailyView'
import type { DailyPlan as DailyPlanType } from '../types/plan'

const mockPlan: DailyPlanType = {
  date: '2026-02-01',
  tasks: [
    {
      id: 'task-2',
      subject: 'Physics',
      topic: "Newton's Laws overview",
      duration_minutes: 60,
      priority: 'medium',
    },
  ],
  completed_tasks: [],
  suggested_tools: [],
}

const DailyPlanPage = () => (
  <Stack spacing={3}>
    <Typography variant="h4">Daily Plan</Typography>
    <DailyView plan={mockPlan} onTaskComplete={() => undefined} />
  </Stack>
)

export default DailyPlanPage
