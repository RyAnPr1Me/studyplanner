import { Alert, Button, Stack, Typography } from '@mui/material'
import { useCallback, useEffect } from 'react'
import WeeklyView from '../components/StudyPlan/WeeklyView'
import { useStudyPlan } from '../hooks/useStudyPlan'
import { getUserId } from '../utils/user'

const WeeklyPlanPage = () => {
  const { weeklyPlan, dailyPlan, loading, error, generatePlan, updateTaskStatus, loadDailyPlan } = useStudyPlan()

  useEffect(() => {
    if (!weeklyPlan && !loading) {
      void generatePlan({
        user_id: getUserId(),
        subjects: ['Mathematics', 'Physics'],
        goals: 'Prepare for final exams',
        study_hours_per_day: 4,
        difficulty_level: 'intermediate',
        start_date: '2026-02-01',
      })
    }
  }, [generatePlan, loading, weeklyPlan])

  useEffect(() => {
    if (weeklyPlan?.weekly_plan.daily_plans[0]) {
      void loadDailyPlan(weeklyPlan.weekly_plan.daily_plans[0].date, getUserId())
    }
  }, [loadDailyPlan, weeklyPlan])

  const handleComplete = useCallback(async (taskId: string) => {
    await updateTaskStatus(taskId, { status: 'completed' })
    if (weeklyPlan?.weekly_plan.daily_plans[0]) {
      await loadDailyPlan(weeklyPlan.weekly_plan.daily_plans[0].date, getUserId())
    }
  }, [loadDailyPlan, updateTaskStatus, weeklyPlan])

  const handleRefresh = async () => {
    await generatePlan({
      user_id: getUserId(),
      subjects: ['Mathematics', 'Physics'],
      goals: 'Prepare for final exams',
      study_hours_per_day: 4,
      difficulty_level: 'intermediate',
      start_date: '2026-02-01',
    })
  }

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
        <Typography variant="h4">Weekly Plan</Typography>
        <Button variant="outlined" onClick={handleRefresh} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh Plan'}
        </Button>
      </Stack>
      {error && <Alert severity="error">{error}</Alert>}
      {weeklyPlan ? (
        <WeeklyView
          plan={weeklyPlan.weekly_plan}
          completedTasks={dailyPlan?.completed_tasks ?? []}
          onTaskComplete={handleComplete}
        />
      ) : (
        <Typography variant="body2" color="text.secondary">
          {loading ? 'Loading plan...' : 'No plan generated yet.'}
        </Typography>
      )}
    </Stack>
  )
}

export default WeeklyPlanPage
