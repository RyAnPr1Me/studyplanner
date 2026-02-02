import { Stack, Typography } from '@mui/material'
import ChatInterface from './ChatInterface'
import Suggestions from './Suggestions'

interface AIAssistantProps {
  position?: 'sidebar' | 'floating'
}

const AIAssistant = ({ position = 'sidebar' }: AIAssistantProps) => (
  <Stack
    spacing={2}
    sx={{
      backgroundColor: 'rgba(26,28,32,0.95)',
      borderRadius: 3,
      border: '1px solid rgba(138,180,248,0.16)',
      p: 2,
    }}
  >
    <Typography variant="h6">AI Assistant</Typography>
    <ChatInterface />
    <Suggestions position={position} />
  </Stack>
)

export default AIAssistant
