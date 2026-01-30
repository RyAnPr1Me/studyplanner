import { Stack } from '@mui/material'
import ToolGallery from '../components/Tools/ToolGallery'
import type { Tool } from '../types/tool'

const mockTools: Tool[] = [
  {
    tool_id: 'tool-1',
    tool_type: 'calculator',
    name: 'Quadratic Solver',
    description: 'Solve quadratic equations step-by-step',
  },
  {
    tool_id: 'tool-2',
    tool_type: 'flashcard',
    name: 'Calculus Flashcards',
    description: 'Practice derivatives and integrals',
  },
]

const ToolsPage = () => (
  <Stack spacing={3}>
    <ToolGallery tools={mockTools} onCreate={() => undefined} />
  </Stack>
)

export default ToolsPage
