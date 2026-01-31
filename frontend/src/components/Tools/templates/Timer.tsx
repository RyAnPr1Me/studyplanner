import { Button, Paper, Stack, Typography } from '@mui/material'
import { useState } from 'react'

const Timer = () => {
  const [active, setActive] = useState(false)

  return (
    <Paper sx={{ p: 3, textAlign: 'center' }}>
      <Stack spacing={2}>
        <Typography variant="h6">Pomodoro Timer</Typography>
        <Typography variant="h4">25:00</Typography>
        <Button variant="contained" onClick={() => setActive((prev) => !prev)}>
          {active ? 'Pause' : 'Start'}
        </Button>
      </Stack>
    </Paper>
  )
}

export default Timer
