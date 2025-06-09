import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect, useRef } from 'react';

export type NotificationSeverity = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  message: string;
  severity: NotificationSeverity;
  timestamp: Date;
  read: boolean;
  title?: string;
  link?: string;
}

interface NotificationContextProps {
  showNotification: (message: string, severity?: NotificationSeverity, title?: string, link?: string) => void;
  hideNotification: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  testSound: () => Promise<void>;
  notificationState: {
    open: boolean;
    message: string;
    severity: NotificationSeverity;
  };
  notifications: Notification[];
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

// Audio file paths
const SOUND_PATHS = {
  MP3: '/sounds/notification-sound.mp3',
  WAV: '/sounds/notification.wav',
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notificationState, setNotificationState] = useState({
    open: false,
    message: '',
    severity: 'info' as NotificationSeverity,
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [userInteracted, setUserInteracted] = useState(false);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Calculate unread notification count
  const unreadCount = notifications.filter(notif => !notif.read).length;

  // Track user interaction to allow audio to play
  useEffect(() => {
    const handleInteraction = () => {
      console.log('User interaction detected!');
      setUserInteracted(true);

      // Initialize Web Audio API on interaction
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
          console.log('Audio context initialized successfully');
        }
      } catch (error) {
        console.error('Failed to initialize Audio Context:', error);
      }

      // Clean up event listeners after first interaction
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  // Initialize audio elements when component mounts
  useEffect(() => {
    console.log('Initializing audio elements');
    
    // Create Audio element
    audioRef.current = new Audio(SOUND_PATHS.WAV);
    audioRef.current.preload = 'auto';
    
    // Create a hidden audio element in the DOM
    const audioElement = document.createElement('audio');
    audioElement.src = SOUND_PATHS.WAV;
    audioElement.id = 'notification-sound';
    audioElement.preload = 'auto';
    document.body.appendChild(audioElement);
    audioElementRef.current = audioElement;
    
    // Load notifications from localStorage
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        const parsedNotifications = JSON.parse(savedNotifications);
        // Convert string timestamps back to Date objects
        const processedNotifications = parsedNotifications.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
        setNotifications(processedNotifications);
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }
    
    // Cleanup when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(console.error);
        audioContextRef.current = null;
      }
      
      if (audioElementRef.current) {
        document.body.removeChild(audioElementRef.current);
        audioElementRef.current = null;
      }
    };
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Function to play notification sound using multiple methods to ensure at least one works
  const playNotificationSound = async () => {
    console.log('Attempting to play notification sound...');
    
    if (!userInteracted) {
      console.warn('User has not interacted with the page yet, sound may not play');
    }
    
    // Method 1: Standard Audio element
    const playStandardAudio = async () => {
      try {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            await playPromise;
            console.log('Sound played successfully (Method 1)');
            return true;
          }
        }
      } catch (error) {
        console.error('Method 1 failed:', error);
      }
      return false;
    };
    
    // Method 2: Web Audio API
    const playWebAudio = async () => {
      try {
        if (audioContextRef.current) {
          const response = await fetch(SOUND_PATHS.WAV);
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
          
          const source = audioContextRef.current.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioContextRef.current.destination);
          source.start(0);
          console.log('Sound played successfully (Method 2)');
          return true;
        }
      } catch (error) {
        console.error('Method 2 failed:', error);
      }
      return false;
    };
    
    // Method 3: DOM Audio element
    const playDomAudio = async () => {
      try {
        if (audioElementRef.current) {
          audioElementRef.current.currentTime = 0;
          const playPromise = audioElementRef.current.play();
          if (playPromise !== undefined) {
            await playPromise;
            console.log('Sound played successfully (Method 3)');
            return true;
          }
        }
      } catch (error) {
        console.error('Method 3 failed:', error);
      }
      return false;
    };
    
    // Try all methods
    const method1Success = await playStandardAudio();
    if (!method1Success) {
      const method2Success = await playWebAudio();
      if (!method2Success) {
        await playDomAudio();
      }
    }
  };

  // Test sound function
  const testSound = async () => {
    console.log('Test sound requested');
    await playNotificationSound();
  };

  const showNotification = useCallback((
    message: string, 
    severity: NotificationSeverity = 'info',
    title?: string,
    link?: string
  ) => {
    // Show snackbar notification
    setNotificationState({
      open: true,
      message,
      severity,
    });
    
    // Add to notifications list
    const newNotification: Notification = {
      id: Date.now().toString(),
      message,
      severity,
      timestamp: new Date(),
      read: false,
      title,
      link
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Play notification sound
    playNotificationSound();
  }, []);

  const hideNotification = useCallback(() => {
    setNotificationState(prev => ({
      ...prev,
      open: false,
    }));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <>
      <NotificationContext.Provider
        value={{
          showNotification,
          hideNotification,
          markAsRead,
          markAllAsRead,
          deleteNotification,
          clearAllNotifications,
          testSound,
          notificationState,
          notifications,
          unreadCount
        }}
      >
        {children}
      </NotificationContext.Provider>
      
      {/* Embedded audio element as a backup method */}
      <audio 
        id="notification-sound-embedded" 
        src={SOUND_PATHS.WAV} 
        preload="auto" 
        style={{ display: 'none' }} 
      />
    </>
  );
};

export const useNotification = (): NotificationContextProps => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}; 