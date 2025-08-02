import React from 'react';
import { Snackbar, Alert, AlertTitle, Slide } from '@mui/material';
import { useApp } from '../../contexts/AppContext';

// Transition component for Snackbar
const SlideTransition = (props) => {
  return <Slide {...props} direction="up" />;
};

const NotificationSystem = () => {
  const { notifications, removeNotification } = useApp();
  
  const handleClose = (id) => (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    removeNotification(id);
  };
  
  return (
    <>
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          TransitionComponent={SlideTransition}
          autoHideDuration={notification.autoHideDuration || 5000}
          onClose={handleClose(notification.id)}
          sx={{ mb: notifications.indexOf(notification) * 8 }}
        >
          <Alert
            onClose={handleClose(notification.id)}
            severity={notification.severity || 'info'}
            variant="filled"
            elevation={6}
            sx={{ width: '100%', alignItems: 'center' }}
          >
            {notification.title && (
              <AlertTitle>{notification.title}</AlertTitle>
            )}
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};

export default NotificationSystem;
