import React, { useEffect, useState } from 'react';
import { Snackbar, Alert, Slide, SlideProps } from '@mui/material';
import { useNotification } from '@/contexts/NotificationContext';

type TransitionProps = Omit<SlideProps, 'direction'>;

function TransitionUp(props: TransitionProps) {
  return <Slide {...props} direction="up" />;
}

export const GlobalNotification: React.FC = () => {
  const { notificationState, hideNotification } = useNotification();
  const [transition, setTransition] = useState<
    React.ComponentType<TransitionProps> | undefined
  >(undefined);

  useEffect(() => {
    // Set transition animation when notification opens
    if (notificationState.open) {
      setTransition(() => TransitionUp);
    }
  }, [notificationState.open]);

  return (
    <Snackbar
      open={notificationState.open}
      autoHideDuration={6000}
      onClose={hideNotification}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      TransitionComponent={transition}
    >
      <Alert
        onClose={hideNotification}
        severity={notificationState.severity}
        variant="filled"
        sx={{ 
          width: '100%',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}
      >
        {notificationState.message}
      </Alert>
    </Snackbar>
  );
}; 