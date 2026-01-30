import React, { useEffect, useState } from 'react';
import { Box, Button, LinearProgress, Typography } from '@mui/material';

const PomodoroTimer: React.FC = () => {
  const INITIAL_DURATION = 1500;
  const [seconds, setSeconds] = useState(INITIAL_DURATION);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((value) => value - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, seconds]);

  const progress = ((INITIAL_DURATION - seconds) / INITIAL_DURATION) * 100;
  const minutes = Math.floor(seconds / 60);
  const secs = (seconds % 60).toString().padStart(2, '0');

  return (
    <Box sx={{ textAlign: 'center', p: 3 }}>
      <Typography variant="h4">
        {minutes}:{secs}
      </Typography>
      <LinearProgress variant="determinate" value={progress} sx={{ my: 2 }} />
      <Button onClick={() => setIsActive((value) => !value)}>
        {isActive ? 'Pause' : 'Start'}
      </Button>
    </Box>
  );
};

export default PomodoroTimer;
