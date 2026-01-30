import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material'
import type { Tool } from '../../types/tool'

interface ToolGalleryProps {
  tools: Tool[]
  onCreate: () => void
}

const ToolGallery = ({ tools, onCreate }: ToolGalleryProps) => (
  <Stack spacing={2}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h5">Your Tools</Typography>
      <Button variant="contained" onClick={onCreate}>
        Create Tool
      </Button>
    </Box>
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 2 }}>
      {tools.map((tool) => (
        <Card key={tool.tool_id} elevation={2}>
          <CardContent>
            <Typography variant="h6">{tool.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {tool.description ?? 'No description'}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  </Stack>
)

export default ToolGallery
