import { Box, Button, LinearProgress, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

const Timer = () => {
  const INITIAL_DURATION = 1500
  const [seconds, setSeconds] = useState(INITIAL_DURATION)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((value) => value - 1)
      }, 1000)
    } else if (seconds === 0) {
      setIsActive(false)
    }
    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isActive, seconds])

  const progress = ((INITIAL_DURATION - seconds) / INITIAL_DURATION) * 100
  const minutes = Math.floor(seconds / 60)
  const secs = (seconds % 60).toString().padStart(2, '0')

  const reset = () => {
    setSeconds(INITIAL_DURATION)
    setIsActive(false)
  }

  return (
    <Box sx={{ textAlign: 'center', p: 3 }}>
      <Typography variant="h4">
        {minutes}:{secs}
      </Typography>
      <LinearProgress variant="determinate" value={progress} sx={{ my: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
        <Button variant="contained" onClick={() => setIsActive((value) => !value)}>
          {isActive ? 'Pause' : 'Start'}
        </Button>
        <Button variant="outlined" onClick={reset}>
          Reset
        </Button>
      </Box>
    </Box>
  )
}

export default Timer
