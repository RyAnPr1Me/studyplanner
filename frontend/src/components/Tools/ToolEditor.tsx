import { Button, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'

interface ToolEditorProps {
  onEdit: (instruction: string) => void
}

const ToolEditor = ({ onEdit }: ToolEditorProps) => {
  const [instruction, setInstruction] = useState('')

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Edit Tool</Typography>
      <TextField
        label="Edit instruction"
        value={instruction}
        onChange={(event) => setInstruction(event.target.value)}
        placeholder="Add a graph visualization"
      />
      <Button variant="contained" onClick={() => onEdit(instruction)} disabled={!instruction.trim()}>
        Send to AI
      </Button>
    </Stack>
  )
}

export default ToolEditor
