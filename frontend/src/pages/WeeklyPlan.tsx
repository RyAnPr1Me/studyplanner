import { Stack, Typography } from '@mui/material'
import WeeklyView from '../components/StudyPlan/WeeklyView'
import type { WeeklyPlan as WeeklyPlanType } from '../types/plan'

const mockPlan: WeeklyPlanType = {
  week_start: '2026-02-01',
  week_end: '2026-02-07',
  subjects: ['Mathematics', 'Physics'],
  daily_plans: [
    {
      date: '2026-02-01',
      tasks: [
        {
          id: 'task-1',
          subject: 'Mathematics',
          topic: 'Calculus - Derivatives',
          duration_minutes: 90,
          priority: 'high',
          due_date: '2026-02-03',
          ai_notes: 'Focus on chain rule and product rule',
        },
      ],
      completed_tasks: [],
      suggested_tools: [],
    },
  ],
}

const WeeklyPlanPage = () => (
  <Stack spacing={3}>
    <Typography variant="h4">Weekly Plan</Typography>
    <WeeklyView plan={mockPlan} onTaskComplete={() => undefined} />
  </Stack>
)

export default WeeklyPlanPage
