import { Box, CircularProgress, Typography } from '@mui/material'

const Loading = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 6, gap: 2 }}>
    <CircularProgress color="primary" />
    <Typography variant="body2" color="text.secondary">
      Loading...
    </Typography>
  </Box>
)

export default Loading
