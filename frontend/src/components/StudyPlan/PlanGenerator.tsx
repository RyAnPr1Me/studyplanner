import { Alert, Box, Button, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import type { PlanGenerateRequest } from '../../types/plan'
import { useStudyPlan } from '../../hooks/useStudyPlan'
import { getUserId } from '../../utils/user'

const PlanGenerator = () => {
  const { generatePlan, loading, error } = useStudyPlan()
  const [subjects, setSubjects] = useState('Mathematics, Physics')
  const [goals, setGoals] = useState('Prepare for final exams')
  const [hours, setHours] = useState(4)
  const [difficulty, setDifficulty] = useState('intermediate')
  const [startDate, setStartDate] = useState('2026-02-01')

  const handleGenerate = async () => {
    const payload: PlanGenerateRequest = {
      user_id: getUserId(),
      subjects: subjects
        .split(',')
        .map((subject) => subject.trim())
        .filter(Boolean),
      goals,
      study_hours_per_day: hours,
      difficulty_level: difficulty,
      start_date: startDate,
    }
    await generatePlan(payload)
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Generate Weekly Plan</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        label="Subjects (comma separated)"
        value={subjects}
        onChange={(event) => setSubjects(event.target.value)}
      />
      <TextField label="Goals" value={goals} onChange={(event) => setGoals(event.target.value)} />
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Hours per day"
          type="number"
          value={hours}
          onChange={(event) => setHours(Number(event.target.value))}
        />
        <TextField
          select
          label="Difficulty"
          value={difficulty}
          onChange={(event) => setDifficulty(event.target.value)}
        >
          <MenuItem value="beginner">Beginner</MenuItem>
          <MenuItem value="intermediate">Intermediate</MenuItem>
          <MenuItem value="advanced">Advanced</MenuItem>
        </TextField>
        <TextField
          label="Start date"
          type="date"
          value={startDate}
          onChange={(event) => setStartDate(event.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Box>
      <Button variant="contained" onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Plan'}
      </Button>
    </Stack>
  )
}

export default PlanGenerator
