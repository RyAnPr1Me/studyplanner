import { Paper, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'

const Calculator = () => {
  const [value, setValue] = useState('')

  return (
    <Paper sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h6">Quick Calculator</Typography>
        <TextField label="Expression" value={value} onChange={(event) => setValue(event.target.value)} />
        <Typography variant="body2" color="text.secondary">
          Result will appear here.
        </Typography>
      </Stack>
    </Paper>
  )
}

export default Calculator
