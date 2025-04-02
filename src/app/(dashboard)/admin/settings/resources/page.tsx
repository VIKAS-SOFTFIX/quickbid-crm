'use client';

import React from 'react';
import { useState, useRef, useEffect } from 'react';
import {
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Grid, 
  TextField, 
  IconButton, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  ListItemSecondaryAction, 
  Divider, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Chip, 
  Alert, 
  Snackbar, 
  Tab, 
  Tabs,
  Paper,
  CircularProgress,
  alpha,
  LinearProgress,
  Tooltip,
  useTheme,
  InputAdornment,
  SelectChangeEvent,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FileCopy as FileCopyIcon,
  PictureAsPdf as PdfIcon,
  Description as DocIcon,
  Slideshow as PptIcon,
  VideoLibrary as VideoIcon,
  Link as LinkIcon,
  Save as SaveIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  ArrowBack as ArrowBackIcon,
  InsertDriveFile as FileIcon,
  Add as AddIcon,
  Help as HelpIcon,
  PlayArrow as PlayIcon,
  OndemandVideo as OndemandVideoIcon,
  Headset as HeadsetIcon,
} from '@mui/icons-material';

// Define resource types
type ResourceType = 'pdf' | 'docx' | 'pptx' | 'video' | 'link' | 'audio' | 'script';
type ResourceCategory = 'script' | 'presentation' | 'guide' | 'video' | 'training' | 'other';
type ResourceUseCase = 'demo' | 'lead_call' | 'callback_request' | 'expert_consultation' | 'service' | 'general';

// Define the resource interface
interface Resource {
  id: string;
  name: string;
  description: string;
  type: ResourceType;
  category: ResourceCategory;
  useCases: ResourceUseCase[];
  url: string;
  size?: string;
  createdAt: string;
  updatedAt: string;
  isDefault?: boolean;
  tags: string[];
  scriptContent?: string;
  videoSource?: 'upload' | 'youtube';
  youtubeUrl?: string;
}

// Mock data
const mockResources: Resource[] = [
  {
    id: '1',
    name: 'Product Demo Script',
    description: 'Standard script for product demonstrations',
    type: 'docx',
    category: 'script',
    useCases: ['demo', 'lead_call'],
    url: '/resources/product-demo-script.docx',
    size: '568 KB',
    createdAt: '2024-03-15',
    updatedAt: '2024-03-20',
    isDefault: true,
    tags: ['script', 'demo', 'product'],
  },
  {
    id: '2',
    name: 'Enterprise Features Guide',
    description: 'Comprehensive guide for enterprise features',
    type: 'pdf',
    category: 'guide',
    useCases: ['demo'],
    url: '/resources/enterprise-features-guide.pdf',
    size: '1.8 MB',
    createdAt: '2024-03-10',
    updatedAt: '2024-03-15',
    isDefault: true,
    tags: ['guide', 'enterprise', 'features'],
  },
  {
    id: '3',
    name: 'Product Presentation',
    description: 'Official product presentation for demos',
    type: 'pptx',
    category: 'presentation',
    useCases: ['demo'],
    url: '/resources/product-presentation.pptx',
    size: '2.5 MB',
    createdAt: '2024-03-05',
    updatedAt: '2024-03-18',
    isDefault: true,
    tags: ['presentation', 'demo', 'slides'],
  },
  {
    id: '4',
    name: 'Technical Demo Script',
    description: 'Script focused on technical aspects of the product',
    type: 'docx',
    category: 'script',
    useCases: ['demo'],
    url: '/resources/tech-demo-script.docx',
    size: '720 KB',
    createdAt: '2024-03-12',
    updatedAt: '2024-03-22',
    isDefault: false,
    tags: ['script', 'technical', 'advanced'],
  },
  {
    id: '5',
    name: 'Basic Features Video',
    description: 'Video walkthrough of basic product features',
    type: 'video',
    category: 'video',
    useCases: ['demo'],
    url: 'https://example.com/videos/basic-features',
    createdAt: '2024-02-28',
    updatedAt: '2024-03-01',
    isDefault: false,
    tags: ['video', 'basic', 'tutorial'],
  },
  {
    id: '6',
    name: 'Integration Guide',
    description: 'How to integrate with other systems',
    type: 'pdf',
    category: 'guide',
    useCases: ['service'],
    url: '/resources/integration-guide.pdf',
    size: '3.2 MB',
    createdAt: '2024-03-08',
    updatedAt: '2024-03-15',
    isDefault: false,
    tags: ['guide', 'integration', 'technical'],
  },
  {
    id: '7',
    name: 'Cold Call Script',
    description: 'Script template for cold calling prospects',
    type: 'docx',
    category: 'script',
    useCases: ['lead_call'],
    url: '/resources/cold-call-script.docx',
    size: '450 KB',
    createdAt: '2024-03-05',
    updatedAt: '2024-03-20',
    isDefault: true,
    tags: ['script', 'call', 'sales'],
  },
  {
    id: '8',
    name: 'Objection Handling Training',
    description: 'Audio training on handling common objections',
    type: 'audio',
    category: 'training',
    useCases: ['lead_call'],
    url: '/resources/objection-handling.mp3',
    size: '15.4 MB',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-10',
    isDefault: false,
    tags: ['training', 'audio', 'objections', 'sales'],
  },
  {
    id: '9',
    name: 'Discovery Call Template',
    description: 'Template for conducting effective discovery calls',
    type: 'docx',
    category: 'script',
    useCases: ['lead_call'],
    url: '/resources/discovery-call-template.docx',
    size: '520 KB',
    createdAt: '2024-03-10',
    updatedAt: '2024-03-18',
    isDefault: true,
    tags: ['script', 'discovery', 'template'],
  },
  {
    id: '10',
    name: 'Callback Request Guide',
    description: 'How to handle callback requests efficiently',
    type: 'pdf',
    category: 'guide',
    useCases: ['callback_request'],
    url: '/resources/callback-request-guide.pdf',
    size: '420 KB',
    createdAt: '2024-03-15',
    updatedAt: '2024-03-21',
    isDefault: true,
    tags: ['guide', 'callback', 'process'],
  },
  {
    id: '11',
    name: 'Expert Consultation Script',
    description: 'Script for technical expert consultations',
    type: 'docx',
    category: 'script',
    useCases: ['expert_consultation'],
    url: '/resources/expert-consultation-script.docx',
    size: '680 KB',
    createdAt: '2024-03-12',
    updatedAt: '2024-03-25',
    isDefault: true,
    tags: ['script', 'expert', 'consultation', 'technical'],
  },
  {
    id: '12',
    name: 'Service Overview Presentation',
    description: 'Presentation for service offerings',
    type: 'pptx',
    category: 'presentation',
    useCases: ['service'],
    url: '/resources/service-overview.pptx',
    size: '3.1 MB',
    createdAt: '2024-03-08',
    updatedAt: '2024-03-20',
    isDefault: true,
    tags: ['presentation', 'service', 'overview'],
  },
];

// Helper functions
const getUseCaseLabel = (useCase: ResourceUseCase) => {
  switch (useCase) {
    case 'demo':
      return 'Product Demo';
    case 'lead_call':
      return 'Lead Call';
    case 'callback_request':
      return 'Callback Request';
    case 'expert_consultation':
      return 'Expert Consultation';
    case 'service':
      return 'Service';
    case 'general':
      return 'General';
    default:
      return 'General';
  }
};

const getUseCaseColor = (useCase: ResourceUseCase, theme: any) => {
  switch (useCase) {
    case 'demo':
      return theme.palette.primary.main;
    case 'lead_call':
      return theme.palette.success.main;
    case 'callback_request':
      return theme.palette.warning.main;
    case 'expert_consultation':
      return theme.palette.secondary.main;
    case 'service':
      return theme.palette.info.main;
    case 'general':
      return theme.palette.grey[700];
    default:
      return theme.palette.grey[700];
  }
};

export default function ResourcesPage() {
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State declarations
  const [resources, setResources] = useState<Resource[]>(mockResources);
  const [filteredResources, setFilteredResources] = useState<Resource[]>(mockResources);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ResourceCategory | ''>('');
  const [typeFilter, setTypeFilter] = useState<ResourceType | ''>('');
  const [useCaseFilter, setUseCaseFilter] = useState<ResourceUseCase | ''>('');
  const [currentTab, setCurrentTab] = useState(0);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [formData, setFormData] = useState<Partial<Resource>>({
    name: '',
    description: '',
    type: 'link',
    category: 'guide',
    useCases: [],
    tags: [],
    scriptContent: '',
    videoSource: 'upload',
    youtubeUrl: '',
  });
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  // Event handlers
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleFormSelectChange = (event: SelectChangeEvent<ResourceType | ResourceCategory>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Filtering effect
  useEffect(() => {
    let result = resources;
    
    // Filter by category
    if (categoryFilter) {
      result = result.filter(resource => resource.category === categoryFilter);
    }
    
    // Filter by type
    if (typeFilter) {
      result = result.filter(resource => resource.type === typeFilter);
    }
    
    // Filter by useCase
    if (useCaseFilter) {
      result = result.filter(resource => resource.useCases.includes(useCaseFilter));
    }
    
    // Filter by tab
    if (currentTab === 1) { // Demo resources
      result = result.filter(resource => resource.useCases.includes('demo'));
    } else if (currentTab === 2) { // Lead call resources
      result = result.filter(resource => resource.useCases.includes('lead_call'));
    } else if (currentTab === 3) { // Callback request resources
      result = result.filter(resource => resource.useCases.includes('callback_request'));
    } else if (currentTab === 4) { // Expert consultation resources
      result = result.filter(resource => resource.useCases.includes('expert_consultation'));
    } else if (currentTab === 5) { // Services resources
      result = result.filter(resource => resource.useCases.includes('service'));
    }
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        resource => 
          resource.name.toLowerCase().includes(query) ||
          resource.description.toLowerCase().includes(query) ||
          resource.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    setFilteredResources(result);
  }, [resources, searchQuery, categoryFilter, typeFilter, useCaseFilter, currentTab]);

  return (
    <Box sx={{ pb: 5 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" sx={{ flexGrow: 1 }}>
              Resource Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setSelectedResource(null);
                setFormData({
                  name: '',
                  description: '',
                  type: 'link',
                  category: 'guide',
                  useCases: [],
                  tags: [],
                  scriptContent: '',
                  videoSource: 'upload',
                  youtubeUrl: '',
                });
                setIsFormDialogOpen(true);
              }}
            >
              New Resource
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={0} variant="outlined" sx={{ borderRadius: 1 }}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="All Resources" />
              <Tab label="Demo Resources" />
              <Tab label="Lead Call Scripts" />
              <Tab label="Callback Scripts" />
              <Tab label="Expert Consultation" />
              <Tab label="Services Resources" />
            </Tabs>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Filters</Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Resource Type</InputLabel>
                <Select
                  value={typeFilter}
                  label="Resource Type"
                  onChange={(e) => setTypeFilter(e.target.value as ResourceType | '')}
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="pdf">PDF</MenuItem>
                  <MenuItem value="docx">Word Document</MenuItem>
                  <MenuItem value="pptx">PowerPoint</MenuItem>
                  <MenuItem value="video">Video</MenuItem>
                  <MenuItem value="audio">Audio</MenuItem>
                  <MenuItem value="link">Link</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  label="Category"
                  onChange={(e) => setCategoryFilter(e.target.value as ResourceCategory | '')}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  <MenuItem value="script">Scripts</MenuItem>
                  <MenuItem value="guide">Guides</MenuItem>
                  <MenuItem value="presentation">Presentations</MenuItem>
                  <MenuItem value="video">Videos</MenuItem>
                  <MenuItem value="training">Training</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Use Case</InputLabel>
                <Select
                  value={useCaseFilter}
                  label="Use Case"
                  onChange={(e) => setUseCaseFilter(e.target.value as ResourceUseCase | '')}
                >
                  <MenuItem value="">All Use Cases</MenuItem>
                  <MenuItem value="demo">Product Demos</MenuItem>
                  <MenuItem value="lead_call">Lead Calls</MenuItem>
                  <MenuItem value="callback_request">Callback Requests</MenuItem>
                  <MenuItem value="expert_consultation">Expert Consultation</MenuItem>
                  <MenuItem value="service">Services</MenuItem>
                  <MenuItem value="general">General</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={9}>
          <Card variant="outlined">
            <List sx={{ p: 0 }}>
              {filteredResources.map((resource, index) => (
                <React.Fragment key={resource.id}>
                  <ListItem
                    sx={{
                      py: 2,
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                      },
                    }}
                  >
                    <ListItemIcon>
                      {resource.type === 'pdf' ? <PdfIcon color="error" /> :
                       resource.type === 'docx' ? <DocIcon color="primary" /> :
                       resource.type === 'pptx' ? <PptIcon color="warning" /> :
                       resource.type === 'video' ? <VideoIcon color="secondary" /> :
                       resource.type === 'audio' ? <HeadsetIcon color="primary" /> :
                       <FileIcon color="primary" />
                      }
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle1">{resource.name}</Typography>
                          {resource.isDefault && (
                            <Chip
                              label="Default"
                              size="small"
                              color="primary"
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {resource.description}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, flexWrap: 'wrap', gap: 0.5 }}>
                            <Chip
                              label={resource.type.toUpperCase()}
                              size="small"
                              sx={{ mr: 1, backgroundColor: alpha(theme.palette.grey[500], 0.2) }}
                            />
                            <Chip
                              label={resource.category}
                              size="small"
                              sx={{
                                mr: 1,
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                              }}
                            />
                            {resource.useCases.map((useCase, index) => (
                              <Chip
                                key={index}
                                label={getUseCaseLabel(useCase)}
                                size="small"
                                sx={{
                                  mr: 1,
                                  backgroundColor: alpha(getUseCaseColor(useCase, theme), 0.1),
                                  color: getUseCaseColor(useCase, theme),
                                }}
                              />
                            ))}
                            {resource.size && (
                              <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                                {resource.size}
                              </Typography>
                            )}
                            <Typography variant="caption" color="text.secondary">
                              Updated {new Date(resource.updatedAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit Resource">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedResource(resource);
                              setFormData(resource);
                              setIsFormDialogOpen(true);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Upload New Version">
                          <IconButton
                            size="small"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                          >
                            <CloudUploadIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Resource">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => {
                              setSnackbar({
                                open: true,
                                message: 'Resource deleted successfully',
                                severity: 'success',
                              });
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < filteredResources.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Card>
        </Grid>
      </Grid>

      {/* Resource Form Dialog */}
      <Dialog
        open={isFormDialogOpen}
        onClose={() => setIsFormDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedResource ? 'Edit Resource' : 'Add New Resource'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Resource Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </Grid>
            {formData.type === 'script' && (
              <Grid item xs={12}>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Script Content
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={10}
                    label="Script"
                    value={formData.scriptContent || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, scriptContent: e.target.value }))}
                    placeholder="Enter your script content here..."
                    sx={{
                      '& .MuiInputBase-root': {
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        lineHeight: 1.5,
                      },
                    }}
                  />
                </Box>
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Resource Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type || ''}
                  label="Resource Type"
                  onChange={handleFormSelectChange}
                >
                  <MenuItem value="pdf">PDF</MenuItem>
                  <MenuItem value="docx">Word Document</MenuItem>
                  <MenuItem value="pptx">PowerPoint</MenuItem>
                  <MenuItem value="video">Video</MenuItem>
                  <MenuItem value="audio">Audio</MenuItem>
                  <MenuItem value="link">Link</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category || ''}
                  label="Category"
                  onChange={handleFormSelectChange}
                >
                  <MenuItem value="script">Script</MenuItem>
                  <MenuItem value="guide">Guide</MenuItem>
                  <MenuItem value="presentation">Presentation</MenuItem>
                  <MenuItem value="video">Video</MenuItem>
                  <MenuItem value="training">Training</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Use Cases</InputLabel>
                <Select
                  multiple
                  name="useCases"
                  value={formData.useCases || []}
                  label="Use Cases"
                  onChange={(e) => {
                    const value = e.target.value as ResourceUseCase[];
                    setFormData(prev => ({ ...prev, useCases: value }));
                  }}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as ResourceUseCase[]).map((value) => (
                        <Chip
                          key={value}
                          label={getUseCaseLabel(value)}
                          size="small"
                          sx={{
                            backgroundColor: alpha(getUseCaseColor(value, theme), 0.1),
                            color: getUseCaseColor(value, theme),
                          }}
                        />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value="demo">Product Demos</MenuItem>
                  <MenuItem value="lead_call">Lead Calls</MenuItem>
                  <MenuItem value="callback_request">Callback Requests</MenuItem>
                  <MenuItem value="expert_consultation">Expert Consultation</MenuItem>
                  <MenuItem value="service">Services</MenuItem>
                  <MenuItem value="general">General</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {formData.type === 'video' && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Video Source</InputLabel>
                  <Select
                    name="videoSource"
                    value={formData.videoSource || 'upload'}
                    label="Video Source"
                    onChange={(e: SelectChangeEvent<'upload' | 'youtube'>) => 
                      setFormData((prev:any) => ({ 
                        ...prev, 
                        videoSource: e.target.value 
                      }))
                    }
                  >
                    <MenuItem value="upload">Upload Video File</MenuItem>
                    <MenuItem value="youtube">YouTube Link</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
            {formData.type === 'video' && formData.videoSource === 'youtube' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="YouTube URL"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={formData.youtubeUrl || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                  helperText="Enter the full YouTube video URL"
                />
              </Grid>
            )}
            {formData.type === 'link' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Resource URL"
                  placeholder="https://example.com/resource"
                  value={formData.url || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  helperText="Enter the full URL of the resource"
                />
              </Grid>
            )}
            {(formData.type !== 'link' && formData.type !== 'video') || (formData.type === 'video' && formData.videoSource === 'upload') ? (
              <Grid item xs={12}>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Upload Resource File
                  </Typography>
                  <Box
                    sx={{
                      border: '2px dashed',
                      borderColor: 'divider',
                      borderRadius: 1,
                      p: 3,
                      textAlign: 'center',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: 'primary.main',
                      },
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setIsUploading(true);
                          // Simulate upload progress
                          let progress = 0;
                          const interval = setInterval(() => {
                            progress += 10;
                            setUploadProgress(progress);
                            if (progress >= 100) {
                              clearInterval(interval);
                              setIsUploading(false);
                              setSnackbar({
                                open: true,
                                message: 'File uploaded successfully',
                                severity: 'success',
                              });
                            }
                          }, 500);
                        }
                      }}
                    />
                    {isUploading ? (
                      <Box sx={{ width: '100%' }}>
                        <LinearProgress variant="determinate" value={uploadProgress} />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Uploading... {uploadProgress}%
                        </Typography>
                      </Box>
                    ) : (
                      <>
                        <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                        <Typography variant="body1" color="text.secondary">
                          Drag and drop a file here, or click to select
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                          {formData.type === 'video' 
                            ? 'Supported formats: MP4, WebM, MOV'
                            : 'Supported formats: PDF, DOCX, PPTX, MP3'}
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
              </Grid>
            ) : null}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsFormDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={() => {
              setSnackbar({
                open: true,
                message: selectedResource ? 'Resource updated successfully' : 'Resource added successfully',
                severity: 'success',
              });
              setIsFormDialogOpen(false);
            }}
          >
            {selectedResource ? 'Update' : 'Add'} Resource
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 