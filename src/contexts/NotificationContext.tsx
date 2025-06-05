import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';

export type NotificationSeverity = 'success' | 'error' | 'info' | 'warning';

interface NotificationContextProps {
  showNotification: (message: string, severity?: NotificationSeverity) => void;
  hideNotification: () => void;
  notificationState: {
    open: boolean;
    message: string;
    severity: NotificationSeverity;
  };
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notificationState, setNotificationState] = useState({
    open: false,
    message: '',
    severity: 'info' as NotificationSeverity,
  });
  const [notificationSound, setNotificationSound] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio when component mounts
    const audio = new Audio('/sounds/notification.mp3');
    setNotificationSound(audio);
    
    return () => {
      // Cleanup when component unmounts
      if (notificationSound) {
        notificationSound.pause();
        notificationSound.currentTime = 0;
      }
    };
  }, []);

  const showNotification = useCallback((message: string, severity: NotificationSeverity = 'info') => {
    setNotificationState({
      open: true,
      message,
      severity,
    });
    
    // Play notification sound
    if (notificationSound) {
      notificationSound.currentTime = 0;
      notificationSound.play().catch(error => {
        console.error('Error playing notification sound:', error);
      });
    }
  }, [notificationSound]);

  const hideNotification = useCallback(() => {
    setNotificationState(prev => ({
      ...prev,
      open: false,
    }));
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        hideNotification,
        notificationState,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextProps => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}; 