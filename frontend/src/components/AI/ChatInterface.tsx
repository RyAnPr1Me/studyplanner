import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'

const ChatInterface = () => {
  const [message, setMessage] = useState('')

  const handleSend = () => {
    if (!message.trim()) {
      return
    }
    setMessage('')
  }

  return (
    <Stack spacing={2}>
      <Box sx={{ minHeight: 120, border: '1px solid #e8eaed', borderRadius: 2, p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          AI responses will appear here.
        </Typography>
      </Box>
      <TextField
        label="Ask the AI"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />
      <Button variant="contained" onClick={handleSend} disabled={!message.trim()}>
        Send
      </Button>
    </Stack>
  )
}

export default ChatInterface
