import { Alert, Button, Stack, TextField, Typography } from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import WeeklyView from '../components/StudyPlan/WeeklyView'
import { useStudyPlan } from '../hooks/useStudyPlan'
import { getUserId } from '../utils/user'
import PlanGenerator from '../components/StudyPlan/PlanGenerator'
import type { PlanGenerateRequest } from '../types/plan'

const WeeklyPlanPage = () => {
  const { weeklyPlan, dailyPlan, loading, error, generatePlan, updateTaskStatus, loadDailyPlan } = useStudyPlan()
  const [selectedDate, setSelectedDate] = useState('')

  useEffect(() => {
    if (weeklyPlan?.weekly_plan.daily_plans[0]) {
      const firstDate = weeklyPlan.weekly_plan.daily_plans[0].date
      setSelectedDate((prev) => prev || firstDate)
    }
  }, [weeklyPlan])

  useEffect(() => {
    if (selectedDate) {
      void loadDailyPlan(selectedDate, getUserId())
    }
  }, [loadDailyPlan, selectedDate])

  const handleComplete = useCallback(async (taskId: string) => {
    await updateTaskStatus(taskId, { status: 'completed' })
    if (selectedDate) {
      await loadDailyPlan(selectedDate, getUserId())
    }
  }, [loadDailyPlan, selectedDate, updateTaskStatus])

  const handleRefresh = async () => {
    if (!weeklyPlan) {
      return
    }
    await generatePlan({
      user_id: getUserId(),
      subjects: weeklyPlan.weekly_plan.subjects,
      goals: weeklyPlan.ai_rationale,
      study_hours_per_day: 2,
      difficulty_level: 'intermediate',
      start_date: weeklyPlan.weekly_plan.week_start,
    })
  }

  const handleGenerate = async (payload: PlanGenerateRequest) => {
    await generatePlan({ ...payload, user_id: getUserId() })
  }

  const availableDates = useMemo(() => weeklyPlan?.weekly_plan.daily_plans.map((plan) => plan.date) ?? [], [weeklyPlan])

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
        <Typography variant="h4">Weekly Plan</Typography>
        <Button variant="outlined" onClick={handleRefresh} disabled={loading || !weeklyPlan}>
          {loading ? 'Refreshing...' : 'Refresh Plan'}
        </Button>
      </Stack>
      <PlanGenerator onGenerate={handleGenerate} loading={loading} error={error} />
      {weeklyPlan && (
        <TextField
          select
          label="Track completion for"
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
          SelectProps={{ native: true }}
          sx={{ maxWidth: 240 }}
        >
          <option value="">Select date</option>
          {availableDates.map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </TextField>
      )}
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
