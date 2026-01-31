import { Stack, Typography } from '@mui/material'
import ChatInterface from './ChatInterface'
import Suggestions from './Suggestions'

interface AIAssistantProps {
  position?: 'sidebar' | 'floating'
}

const AIAssistant = ({ position = 'sidebar' }: AIAssistantProps) => (
  <Stack spacing={2} sx={{ backgroundColor: '#ffffff', p: 2, borderRadius: 2 }}>
    <Typography variant="h6">AI Assistant</Typography>
    <ChatInterface />
    <Suggestions position={position} />
  </Stack>
)

export default AIAssistant
