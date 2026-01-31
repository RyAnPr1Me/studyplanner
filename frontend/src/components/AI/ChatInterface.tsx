import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useAI } from '../../hooks/useAI'
import { getUserId } from '../../utils/user'

const ChatInterface = () => {
  const [message, setMessage] = useState('')
  const { messages, isProcessing, error, sendMessage } = useAI()

  const handleSend = async () => {
    if (!message.trim()) {
      return
    }
    const current = message
    setMessage('')
    await sendMessage({ user_id: getUserId(), message: current })
  }

  return (
    <Stack spacing={2}>
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ maxHeight: 200, overflowY: 'auto', border: '1px solid #e8eaed', borderRadius: 2, p: 2 }}>
        {messages.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Ask the AI for study guidance or tool ideas.
          </Typography>
        ) : (
          messages.map((item, index) => (
            <Box key={`${item.conversation_id}-${index}`} sx={{ mb: 1.5 }}>
              <Typography variant="body2" color="text.secondary">
                AI
              </Typography>
              <Typography variant="body1">{item.response}</Typography>
            </Box>
          ))
        )}
      </Box>
      <TextField
        label="Ask the AI"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />
      <Button variant="contained" onClick={handleSend} disabled={!message.trim() || isProcessing}>
        {isProcessing ? 'Sending...' : 'Send'}
      </Button>
    </Stack>
  )
}

export default ChatInterface
