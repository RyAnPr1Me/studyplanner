import { Alert, Box, Button, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import type { PlanGenerateRequest } from '../../types/plan'

interface PlanGeneratorProps {
  onGenerate: (payload: PlanGenerateRequest) => Promise<void>
  loading?: boolean
  error?: string | null
  initialSubjects?: string
  initialGoals?: string
  initialHours?: number
  initialDifficulty?: string
  initialStartDate?: string
}

const PlanGenerator = ({
  onGenerate,
  loading = false,
  error,
  initialSubjects = '',
  initialGoals = '',
  initialHours = 2,
  initialDifficulty = 'intermediate',
  initialStartDate,
}: PlanGeneratorProps) => {
  const defaultStart = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const [subjects, setSubjects] = useState(initialSubjects)
  const [goals, setGoals] = useState(initialGoals)
  const [hours, setHours] = useState(initialHours)
  const [difficulty, setDifficulty] = useState(initialDifficulty)
  const [startDate, setStartDate] = useState(initialStartDate ?? defaultStart)

  const canGenerate = subjects.trim().length > 0 && goals.trim().length > 0 && hours > 0

  const handleGenerate = async () => {
    const payload: PlanGenerateRequest = {
      user_id: '',
      subjects: subjects
        .split(',')
        .map((subject) => subject.trim())
        .filter(Boolean),
      goals,
      study_hours_per_day: hours,
      difficulty_level: difficulty,
      start_date: startDate,
    }
    await onGenerate(payload)
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
      <Button variant="contained" onClick={handleGenerate} disabled={loading || !canGenerate}>
        {loading ? 'Generating...' : 'Generate Plan'}
      </Button>
    </Stack>
  )
}

export default PlanGenerator
