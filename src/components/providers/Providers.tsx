'use client';

import { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { GlobalNotification } from '@/components/common/GlobalNotification';
import EmotionStyleRegistry from '@/app/document';

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
            {mounted && <GlobalNotification />}
          </ThemeProvider>
        </NotificationProvider>
      </AuthProvider>
    </EmotionStyleRegistry>
  );
} 