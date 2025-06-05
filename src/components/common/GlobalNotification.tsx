import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useNotification } from '@/contexts/NotificationContext';

export const GlobalNotification: React.FC = () => {
  const { notificationState, hideNotification } = useNotification();
  
  return (
    <Snackbar
      open={notificationState.open}
      autoHideDuration={6000}
      onClose={hideNotification}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={hideNotification}
        severity={notificationState.severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {notificationState.message}
      </Alert>
    </Snackbar>
  );
}; 