import { Alert, Button, Card, CardContent, Stack, Switch, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { fetchStats, upsertProfile } from '../store/api/userApi'
import { getUserId } from '../utils/user'

const Settings = () => {
  const [name, setName] = useState('Student')
  const [email, setEmail] = useState('')
  const [studyHours, setStudyHours] = useState(4)
  const [remindersEnabled, setRemindersEnabled] = useState(true)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [stats, setStats] = useState<{ total_study_hours: number; completed_tasks: number } | null>(null)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetchStats(getUserId())
        setStats({ total_study_hours: response.total_study_hours, completed_tasks: response.completed_tasks })
      } catch {
        setStats(null)
      }
    }
    void loadStats()
  }, [])

  const handleSave = async () => {
    try {
      await upsertProfile({
        name,
        email: email || undefined,
        preferences: {
          study_hours_per_day: studyHours,
          reminders_enabled: remindersEnabled,
        },
      })
      setStatusMessage('Profile saved successfully.')
    } catch {
      setStatusMessage('Failed to save profile.')
    }
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Settings</Typography>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6">Preferences</Typography>
            {statusMessage && <Alert severity="info">{statusMessage}</Alert>}
            <TextField label="Display name" value={name} onChange={(event) => setName(event.target.value)} />
            <TextField label="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
            <TextField
              label="Daily study hours"
              type="number"
              value={studyHours}
              onChange={(event) => setStudyHours(Number(event.target.value))}
            />
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography>Enable reminders</Typography>
              <Switch checked={remindersEnabled} onChange={(event) => setRemindersEnabled(event.target.checked)} />
            </Stack>
            <Button variant="contained" onClick={handleSave}>
              Save Preferences
            </Button>
          </Stack>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="h6">Study stats</Typography>
            <Typography variant="body2" color="text.secondary">
              Total study hours: {stats?.total_study_hours ?? 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Completed tasks: {stats?.completed_tasks ?? 0}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}

export default Settings
