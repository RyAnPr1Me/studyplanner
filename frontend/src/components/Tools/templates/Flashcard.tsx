import { Button, Paper, Stack, Typography } from '@mui/material'
import { useState } from 'react'

const Flashcard = () => {
  const [showAnswer, setShowAnswer] = useState(false)

  return (
    <Paper sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h6">Flashcard</Typography>
        <Typography variant="body1">What is the derivative of x²?</Typography>
        {showAnswer && <Typography variant="h5">2x</Typography>}
        <Button onClick={() => setShowAnswer((prev) => !prev)}>
          {showAnswer ? 'Hide' : 'Show'} Answer
        </Button>
      </Stack>
    </Paper>
  )
}

export default Flashcard
