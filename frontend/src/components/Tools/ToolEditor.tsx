import { Button, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'

interface ToolEditorProps {
  onEdit: (instruction: string) => void
  loading?: boolean
}

const ToolEditor = ({ onEdit, loading }: ToolEditorProps) => {
  const [instruction, setInstruction] = useState('')

  const handleSubmit = () => {
    if (!instruction.trim()) {
      return
    }
    onEdit(instruction)
    setInstruction('')
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Edit Tool</Typography>
      <TextField
        label="Edit instruction"
        value={instruction}
        onChange={(event) => setInstruction(event.target.value)}
      />
      <Button variant="contained" onClick={handleSubmit} disabled={!instruction.trim() || loading}>
        {loading ? 'Sending...' : 'Send to AI'}
      </Button>
    </Stack>
  )
}

export default ToolEditor
