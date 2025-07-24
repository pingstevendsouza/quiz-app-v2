import React from 'react';
import {
  Box,
  Typography,
  Paper,
  useTheme,
} from '@mui/material';
import { LoadingAnimation } from '../Animations';

const Loader = ({ title, message }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          textAlign: 'center',
          borderRadius: 3,
          maxWidth: 400,
          background: 'rgba(255, 255, 255, 0.95)',
        }}
      >
        <Box sx={{ mb: 3 }}>
          <LoadingAnimation size={150} />
        </Box>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {title || 'Just one second'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {message || 'We are fetching that content for you.'}
        </Typography>
      </Paper>
    </Box>
  );
};

export default Loader;
