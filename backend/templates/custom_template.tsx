import React from 'react';
import { Box, Typography } from '@mui/material';

const CustomTool: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6">Custom Study Tool</Typography>
      <Typography variant="body2" color="text.secondary">
        This is a placeholder for AI-generated custom tools.
      </Typography>
    </Box>
  );
};

export default CustomTool;
