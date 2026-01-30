import { Box, Stack, Typography } from '@mui/material'
import PlanGenerator from '../components/StudyPlan/PlanGenerator'
import OverdueTasks from '../components/StudyPlan/OverdueTasks'
import AIAssistant from '../components/AI/AIAssistant'
import type { Task } from '../types/plan'

const Dashboard = () => {
  const overdueTasks: Task[] = []

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Welcome back, Student</Typography>
        <Typography variant="body1" color="text.secondary">
          Here is your AI-powered study overview.
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
          gap: 3,
        }}
      >
        <PlanGenerator onGenerate={() => undefined} />
        <OverdueTasks tasks={overdueTasks} />
      </Box>
      <AIAssistant position="sidebar" />
    </Stack>
  )
}

export default Dashboard
