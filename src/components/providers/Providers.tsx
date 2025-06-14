'use client';

import { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { GlobalNotification } from '@/components/common/GlobalNotification';
import EmotionStyleRegistry from '@/app/document';
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }: { children: React.ReactNode }) {
  // State to track if component is mounted (client-side)
  const [mounted, setMounted] = useState(false);

  // After first render (which happens on client), set mounted to true
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <EmotionStyleRegistry>
      <AuthProvider>
        <NotificationProvider>
          <ThemeProvider theme={theme}>
            {/* CssBaseline only on client to avoid hydration mismatch */}
            {mounted && <CssBaseline />}
            {children}
            {mounted && (
              <>
                <GlobalNotification />
                <Toaster 
                  position="top-right"
                  toastOptions={{
                    duration: 3000,
                    style: {
                      background: '#333',
                      color: '#fff',
                    },
                    success: {
                      style: {
                        background: '#4caf50',
                      },
                    },
                    error: {
                      style: {
                        background: '#f44336',
                      },
                    },
                  }}
                />
              </>
            )}
          </ThemeProvider>
        </NotificationProvider>
      </AuthProvider>
    </EmotionStyleRegistry>
  );
} 