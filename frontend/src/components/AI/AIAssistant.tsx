import { Stack, Typography, useTheme } from '@mui/material'
import ChatInterface from './ChatInterface'
import Suggestions from './Suggestions'

interface AIAssistantProps {
  position?: 'sidebar' | 'floating'
}

const AIAssistant = ({ position = 'sidebar' }: AIAssistantProps) => {
  const theme = useTheme()

  return (
    <Stack
      spacing={2}
      sx={{
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(26,28,32,0.95)' : '#ffffff',
        borderRadius: 3,
        border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(138,180,248,0.16)' : '#e8eaed'}`,
        p: 2,
      }}
    >
      <Typography variant="h6">AI Assistant</Typography>
      <ChatInterface />
      <Suggestions position={position} />
    </Stack>
  )
}

export default AIAssistant
