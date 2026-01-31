import { Alert, Button, Stack, Typography } from '@mui/material'
import { useCallback, useEffect } from 'react'
import DailyView from '../components/StudyPlan/DailyView'
import { useStudyPlan } from '../hooks/useStudyPlan'
import { getUserId } from '../utils/user'

const DEFAULT_DATE = '2026-02-01'

const DailyPlanPage = () => {
  const { dailyPlan, loading, error, loadDailyPlan, regeneratePlan, updateTaskStatus } = useStudyPlan()

  useEffect(() => {
    if (!dailyPlan && !loading) {
      void loadDailyPlan(DEFAULT_DATE, getUserId())
    }
  }, [dailyPlan, loadDailyPlan, loading])

  const handleRegenerate = async () => {
    await regeneratePlan(DEFAULT_DATE, {
      user_id: getUserId(),
      adjustments: 'More focus on practical examples',
      keep_completed: true,
    })
  }

  const handleComplete = useCallback(async (taskId: string) => {
    await updateTaskStatus(taskId, { status: 'completed' })
    await loadDailyPlan(DEFAULT_DATE, getUserId())
  }, [loadDailyPlan, updateTaskStatus])

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
        <Typography variant="h4">Daily Plan</Typography>
        <Button variant="outlined" onClick={handleRegenerate} disabled={loading}>
          {loading ? 'Regenerating...' : 'Regenerate Plan'}
        </Button>
      </Stack>
      {error && <Alert severity="error">{error}</Alert>}
      {dailyPlan ? (
        <DailyView
          plan={dailyPlan}
          completedTasks={dailyPlan.completed_tasks}
          onTaskComplete={handleComplete}
        />
      ) : (
        <Typography variant="body2" color="text.secondary">
          {loading ? 'Loading daily plan...' : 'No daily plan available.'}
        </Typography>
      )}
    </Stack>
  )
}

export default DailyPlanPage
