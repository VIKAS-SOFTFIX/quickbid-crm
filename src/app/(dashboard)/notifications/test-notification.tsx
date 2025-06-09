'use client';

import React, { useState, useEffect } from 'react';
import { Box, Button, Stack, Typography, Card, CardContent, FormControl, InputLabel, Select, MenuItem, TextField, Divider, Alert, Snackbar } from '@mui/material';
import { useNotification, NotificationSeverity } from '@/contexts/NotificationContext';
import { VolumeUp as VolumeUpIcon, PlayArrow as PlayArrowIcon } from '@mui/icons-material';

export default function TestNotification() {
  const { showNotification, testSound } = useNotification();
  const [severity, setSeverity] = React.useState<NotificationSeverity>('info');
  const [title, setTitle] = React.useState('Test Notification');
  const [message, setMessage] = React.useState('This is a test notification message');
  const [link, setLink] = React.useState('/dashboard');
  const [soundTestActive, setSoundTestActive] = useState(false);
  const [directPlayActive, setDirectPlayActive] = useState(false);
  const [playAttempted, setPlayAttempted] = useState(false);
  const [soundStatus, setSoundStatus] = useState<'none' | 'success' | 'error'>('none');

  useEffect(() => {
    // Preload the audio files
    const audioFiles = [
      '/sounds/notification.wav',
      '/sounds/notification-sound.mp3'
    ];
    
    audioFiles.forEach(file => {
      const audio = new Audio(file);
      audio.preload = 'auto';
      // Forcing a load attempt
      audio.load();
    });
  }, []);

  const handleAddNotification = () => {
    showNotification(message, severity, title, link);
  };

  const handleSoundTest = async () => {
    setSoundTestActive(true);
    setPlayAttempted(true);
    try {
      await testSound();
      setSoundStatus('success');
    } catch (error) {
      console.error("Sound test failed:", error);
      setSoundStatus('error');
    }
    setTimeout(() => setSoundTestActive(false), 2000);
  };

  const handleDirectPlay = async () => {
    setDirectPlayActive(true);
    setPlayAttempted(true);
    
    try {
      // Try multiple sound playing methods
      console.log('Attempting direct sound play...');
      
      // Method 1: Simple Audio API
      const audio = new Audio('/sounds/notification.wav');
      audio.volume = 1.0;
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise;
        console.log('Direct sound played successfully');
        setSoundStatus('success');
      }
    } catch (error) {
      console.error('Direct sound play failed:', error);
      
      try {
        // Method 2: Get embedded element and play
        const audioElement = document.getElementById('notification-sound-embedded') as HTMLAudioElement;
        if (audioElement) {
          audioElement.volume = 1.0;
          audioElement.currentTime = 0;
          await audioElement.play();
          console.log('Embedded audio element played successfully');
          setSoundStatus('success');
        } else {
          throw new Error('Embedded audio element not found');
        }
      } catch (fallbackError) {
        console.error('Fallback sound play failed:', fallbackError);
        setSoundStatus('error');
      }
    }
    
    setTimeout(() => setDirectPlayActive(false), 2000);
  };

  return (
    <Card variant="outlined" sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Test Notifications
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Browser security requires user interaction before sounds can play. Click anywhere on the page first.
            {playAttempted && (
              <Box component="span" sx={{ display: 'block', mt: 1, fontWeight: 'bold' }}>
                Sound status: {soundStatus === 'none' ? 'Not tested' : 
                              soundStatus === 'success' ? 'Successfully played' : 
                              'Failed to play (check console for details)'}
              </Box>
            )}
          </Typography>
        </Alert>
        
        <Stack spacing={3}>
          <FormControl fullWidth>
            <InputLabel>Severity</InputLabel>
            <Select
              value={severity}
              label="Severity"
              onChange={(e) => setSeverity(e.target.value as NotificationSeverity)}
            >
              <MenuItem value="info">Info</MenuItem>
              <MenuItem value="success">Success</MenuItem>
              <MenuItem value="warning">Warning</MenuItem>
              <MenuItem value="error">Error</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          
          <TextField
            label="Message"
            fullWidth
            multiline
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          
          <TextField
            label="Link (optional)"
            fullWidth
            value={link}
            onChange={(e) => setLink(e.target.value)}
            helperText="Where should the notification take you when clicked?"
          />
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleAddNotification}
              sx={{ flexGrow: 1 }}
            >
              Add Test Notification
            </Button>
            
            <Button 
              variant="outlined" 
              color="secondary" 
              onClick={handleSoundTest}
              startIcon={<VolumeUpIcon />}
              disabled={soundTestActive}
            >
              {soundTestActive ? 'Playing...' : 'Test Sound'}
            </Button>
            
            <Button 
              variant="outlined" 
              color="warning" 
              onClick={handleDirectPlay}
              startIcon={<PlayArrowIcon />}
              disabled={directPlayActive}
            >
              {directPlayActive ? 'Playing...' : 'Direct Play'}
            </Button>
          </Box>
        </Stack>
      </CardContent>

      <Snackbar
        open={soundTestActive || directPlayActive}
        message={directPlayActive ? "Testing direct sound play..." : "Testing notification sound..."}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Card>
  );
} 