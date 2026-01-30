import { Box, Typography } from '@mui/material'
import Loading from '../Common/Loading'

interface ToolRendererProps {
  toolId: string
  code: string
  editMode?: boolean
  onUpdate?: (newCode: string) => void
}

const ToolRenderer = ({ toolId, code }: ToolRendererProps) => {
  if (!code) {
    return <Loading />
  }

  return (
    <Box sx={{ p: 2, border: '1px solid #e8eaed', borderRadius: 2 }}>
      <Typography variant="subtitle1">Tool preview: {toolId}</Typography>
      <Typography variant="body2" color="text.secondary">
        Dynamic tool rendering will load the generated component here.
      </Typography>
      <pre style={{ whiteSpace: 'pre-wrap', marginTop: 16 }}>{code}</pre>
    </Box>
  )
}

export default ToolRenderer
