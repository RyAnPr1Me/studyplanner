import { Alert, Button, Stack, TextField, Typography } from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import DailyView from '../components/StudyPlan/DailyView'
import { useStudyPlan } from '../hooks/useStudyPlan'
import { getUserId } from '../utils/user'

const DailyPlanPage = () => {
  const { dailyPlan, loading, error, loadDailyPlan, regeneratePlan, updateTaskStatus } = useStudyPlan()
  const today = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const [selectedDate, setSelectedDate] = useState(today)
  const [adjustments, setAdjustments] = useState('')

  useEffect(() => {
    if (selectedDate) {
      void loadDailyPlan(selectedDate, getUserId())
    }
  }, [loadDailyPlan, selectedDate])

  const handleRegenerate = async () => {
    await regeneratePlan(selectedDate, {
      user_id: getUserId(),
      adjustments: adjustments || 'Refresh daily plan',
      keep_completed: true,
    })
  }

  const handleComplete = useCallback(async (taskId: string) => {
    await updateTaskStatus(taskId, { status: 'completed' })
    await loadDailyPlan(selectedDate, getUserId())
  }, [loadDailyPlan, selectedDate, updateTaskStatus])

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
        <Typography variant="h4">Daily Plan</Typography>
        <Button variant="outlined" onClick={handleRegenerate} disabled={loading || !selectedDate}>
          {loading ? 'Regenerating...' : 'Regenerate Plan'}
        </Button>
      </Stack>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
        <TextField
          label="Date"
          type="date"
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Adjustments"
          value={adjustments}
          onChange={(event) => setAdjustments(event.target.value)}
          fullWidth
        />
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
