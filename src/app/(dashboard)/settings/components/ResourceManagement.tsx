'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import DescriptionIcon from '@mui/icons-material/Description';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useRouter } from 'next/navigation';

export default function ResourceManagement() {
  const router = useRouter();
  const theme = useTheme();

  const navigateToResources = () => {
    router.push('/admin/settings/resources');
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          <ArticleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Resource Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<CloudUploadIcon />}
          onClick={navigateToResources}
        >
          Manage Resources
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card 
            variant="outlined" 
            sx={{ 
              height: '100%',
              cursor: 'pointer',
              '&:hover': {
                boxShadow: theme.shadows[4],
                transform: 'translateY(-4px)',
                transition: 'all 0.2s ease-in-out',
              },
            }}
            onClick={navigateToResources}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DescriptionIcon color="primary" sx={{ fontSize: 48, mr: 2 }} />
                <Typography variant="h6">
                  Demo Scripts
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.9 }}>
                Manage and organize scripts for product demonstrations, including feature walkthroughs and presentations.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card 
            variant="outlined" 
            sx={{ 
              height: '100%',
              cursor: 'pointer',
              '&:hover': {
                boxShadow: theme.shadows[4],
                transform: 'translateY(-4px)',
                transition: 'all 0.2s ease-in-out',
              },
            }}
            onClick={navigateToResources}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ArticleIcon color="secondary" sx={{ fontSize: 48, mr: 2 }} />
                <Typography variant="h6">
                  Call Scripts
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.9 }}>
                Upload and manage scripts for sales calls, cold calling, and lead follow-ups with objection handling guidelines.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card 
            variant="outlined" 
            sx={{ 
              height: '100%',
              cursor: 'pointer',
              '&:hover': {
                boxShadow: theme.shadows[4],
                transform: 'translateY(-4px)',
                transition: 'all 0.2s ease-in-out',
              },
            }}
            onClick={navigateToResources}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CloudUploadIcon color="info" sx={{ fontSize: 48, mr: 2 }} />
                <Typography variant="h6">
                  Training Materials
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.9 }}>
                Upload and organize training materials, guides, and videos for sales team onboarding and skill development.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
} 