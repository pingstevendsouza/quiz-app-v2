import React from 'react';
import { Backdrop, CircularProgress, Box, Typography } from '@mui/material';
import { useApp } from '../../contexts/AppContext';
import { useTranslation } from 'react-i18next';

const GlobalLoader = () => {
  const { loading } = useApp();
  const { t } = useTranslation();
  
  // Check if any loading state is true
  const isLoading = loading.global || Object.values(loading).some(val => Boolean(val));
  
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}
      open={isLoading}
    >
      <CircularProgress color="primary" size={60} thickness={4} />
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">{t('common.loading')}</Typography>
      </Box>
    </Backdrop>
  );
};

export default GlobalLoader;
