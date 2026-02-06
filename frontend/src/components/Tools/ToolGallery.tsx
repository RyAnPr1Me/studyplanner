import { Box, Button, Card, CardActionArea, CardContent, Stack, Typography } from '@mui/material'
import type { ToolListItem } from '../../types/tool'

interface ToolGalleryProps {
  tools: ToolListItem[]
  onSelect: (toolId: string) => void
  onCreate: () => void
}

const ToolGallery = ({ tools, onSelect, onCreate }: ToolGalleryProps) => (
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
          <CardActionArea onClick={() => onSelect(tool.tool_id)}>
            <CardContent>
              <Typography variant="h6">{tool.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {tool.tool_type}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  </Stack>
)

export default ToolGallery
