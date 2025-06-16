'use client';

import React from 'react';
import { useState, useEffect, Fragment } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  useTheme,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  CircularProgress,
  DialogContentText,
  Stack,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PreviewIcon from '@mui/icons-material/Preview';
import { useEmailTemplates } from '@/hooks/useEmailTemplates';
import { CreateEmailTemplateData, EmailTemplateVariable } from '@/services/emailTemplateService';

interface EmailNotificationsProps {
  showSnackbar: (message: string, severity?: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function EmailNotifications({ showSnackbar }: EmailNotificationsProps) {
  const theme = useTheme();
  const {
    templates,
    currentTemplate,
    loading,
    error,
    previewHtml,
    fetchTemplates,
    fetchTemplateById,
    addTemplate,
    editTemplate,
    removeTemplate,
    getTemplatePreview,
    sendTestEmail,
    setCurrentTemplate,
    isClient,
  } = useEmailTemplates();

  const [openTemplateDialog, setOpenTemplateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [htmlEditing, setHtmlEditing] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Template form state
  const [templateForm, setTemplateForm] = useState<CreateEmailTemplateData>({
    name: '',
    subject: '',
    html: '',
    plainText: '',
    description: '',
    tags: [],
    variables: [],
  });
  
  // Variable form state
  const [variableForm, setVariableForm] = useState<EmailTemplateVariable>({
    name: '',
    defaultValue: '',
    description: '',
    required: false,
  });

  useEffect(() => {
    // Fetch templates when component mounts and is on client-side
    if (isClient) {
      fetchTemplates();
    }
  }, [fetchTemplates, isClient]);

  useEffect(() => {
    // Show error message if any
    if (error) {
      showSnackbar(error, 'error');
    }
  }, [error, showSnackbar]);

  const handleTemplateFormChange = (field: keyof CreateEmailTemplateData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTemplateForm({
      ...templateForm,
      [field]: e.target.value,
    });
  };

  const handleVariableFormChange = (field: keyof EmailTemplateVariable) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setVariableForm({
      ...variableForm,
      [field]: field === 'required' ? (e.target as HTMLInputElement).checked : e.target.value,
    });
  };

  const handleAddVariable = () => {
    if (!variableForm.name) return;
    
    setTemplateForm({
      ...templateForm,
      variables: [
        ...(templateForm.variables || []),
        {
          name: variableForm.name,
          defaultValue: variableForm.defaultValue,
          description: variableForm.description,
          required: variableForm.required,
        },
      ],
    });
    
    // Reset variable form
    setVariableForm({
      name: '',
      defaultValue: '',
      description: '',
      required: false,
    });
  };

  const handleRemoveVariable = (index: number) => {
    const updatedVariables = [...(templateForm.variables || [])];
    updatedVariables.splice(index, 1);
    setTemplateForm({
      ...templateForm,
      variables: updatedVariables,
    });
  };

  const handleAddTag = () => {
    if (!newTag || templateForm.tags?.includes(newTag)) {
      return;
    }
    
    setTemplateForm({
      ...templateForm,
      tags: [...(templateForm.tags || []), newTag],
    });
    setNewTag('');
  };

  const handleRemoveTag = (tag: string) => {
    setTemplateForm({
      ...templateForm,
      tags: templateForm.tags?.filter(t => t !== tag),
    });
  };

  const handleCreateOrUpdateTemplate = async () => {
    try {
      setIsSubmitting(true);
      
      if (currentTemplate) {
        // Update existing template
        await editTemplate(currentTemplate._id, templateForm);
        showSnackbar('Template updated successfully', 'success');
      } else {
        // Create new template
        await addTemplate(templateForm);
        showSnackbar('Template created successfully', 'success');
      }
      
      setOpenTemplateDialog(false);
      fetchTemplates(); // Refresh the list
      
    } catch (error) {
      showSnackbar(`Error: ${(error as Error).message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTemplate = async () => {
    if (!currentTemplate) return;
    
    try {
      setIsSubmitting(true);
      
      const success = await removeTemplate(currentTemplate._id);
      
      if (success) {
        showSnackbar('Template deleted successfully', 'success');
        setOpenDeleteDialog(false);
      } else {
        showSnackbar('Failed to delete template', 'error');
      }
      
    } catch (error) {
      showSnackbar(`Error: ${(error as Error).message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestTemplate = async () => {
    if (!currentTemplate) return;
    
    try {
      setIsSubmitting(true);
      
      // Use default test email if not provided
      const email = testEmailAddress || 'test@example.com';
      
      // Prepare variables with default values
      const variables = currentTemplate.variables?.reduce((acc, variable) => {
        acc[variable.name] = variable.defaultValue || `[${variable.name}]`;
        return acc;
      }, {} as Record<string, string>) || {};
      
      const success = await sendTestEmail(currentTemplate._id, email, variables);
      
      if (success) {
        showSnackbar('Test email sent successfully', 'success');
      } else {
        showSnackbar('Failed to send test email', 'error');
      }
      
    } catch (error) {
      showSnackbar(`Error: ${(error as Error).message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTemplate = async (templateId: string) => {
    try {
      const template = await fetchTemplateById(templateId);
      
      if (template) {
        setTemplateForm({
          name: template.name,
          subject: template.subject,
          html: template.html,
          plainText: template.plainText || '',
          description: template.description || '',
          tags: [...template.tags],
          variables: [...template.variables],
        });
        
        setOpenTemplateDialog(true);
      }
    } catch (error) {
      showSnackbar(`Error: ${(error as Error).message}`, 'error');
    }
  };

  const handleNewTemplate = () => {
    setCurrentTemplate(null);
    setTemplateForm({
      name: '',
      subject: '',
      html: '',
      plainText: '',
      description: '',
      tags: [],
      variables: [],
    });
    setOpenTemplateDialog(true);
  };

  const confirmDeleteTemplate = async (templateId: string) => {
    try {
      const template = await fetchTemplateById(templateId);
      setOpenDeleteDialog(true);
    } catch (error) {
      showSnackbar(`Error: ${(error as Error).message}`, 'error');
    }
  };

  const handlePreviewTemplate = async (templateId: string) => {
    try {
      await fetchTemplateById(templateId);
      await getTemplatePreview(templateId);
      setOpenPreviewDialog(true);
    } catch (error) {
      showSnackbar(`Error: ${(error as Error).message}`, 'error');
    }
  };

  // If we're server-side rendering, return a minimal placeholder
  if (!isClient) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">
          <EmailOutlinedIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Email Templates
        </Typography>
        <Paper elevation={0} variant="outlined" sx={{ p: 3, mt: 3, height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </Paper>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          <EmailOutlinedIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Email Templates
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<AddIcon />}
          onClick={handleNewTemplate}
        >
          New Template
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={0} variant="outlined" sx={{ p: 3, height: '100%' }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : !templates || templates.length === 0 ? (
              <Typography variant="body2" sx={{ textAlign: 'center', p: 3, color: 'text.secondary' }}>
                No templates found. Create your first template to get started.
              </Typography>
            ) : (
              <List>
                {Array.isArray(templates) && templates.map((template, index) => (
                  <React.Fragment key={template._id}>
                    {index > 0 && <Divider />}
                    <ListItem
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.04),
                        },
                      }}
                    >
                      <ListItemIcon>
                        <DescriptionIcon />
                      </ListItemIcon>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body1" color="text.primary">
                          {template.name}
                        </Typography>
                        <Typography component="span" variant="body2" color="text.secondary" sx={{ opacity: 0.9, display: 'block' }}>
                          {template.description || 'No description provided'}
                        </Typography>
                        <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap' }}>
                          {template.tags && template.tags.map(tag => (
                            <Chip 
                              key={tag} 
                              label={tag} 
                              size="small" 
                              sx={{ mr: 0.5, mb: 0.5 }} 
                            />
                          ))}
                        </Box>
                      </Box>
                      <Box>
                        <IconButton onClick={() => handlePreviewTemplate(template._id)}>
                          <PreviewIcon />
                        </IconButton>
                        <IconButton onClick={() => handleEditTemplate(template._id)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => confirmDeleteTemplate(template._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Template Editor Dialog */}
      <Dialog 
        open={openTemplateDialog} 
        onClose={() => setOpenTemplateDialog(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {currentTemplate ? 'Edit Template' : 'Create New Template'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Template Name"
                value={templateForm.name}
                onChange={handleTemplateFormChange('name')}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Subject"
                value={templateForm.subject}
                onChange={handleTemplateFormChange('subject')}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={templateForm.description}
                onChange={handleTemplateFormChange('description')}
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography component="div" variant="subtitle2" gutterBottom>Tags</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                {templateForm.tags?.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    size="small"
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  label="Add tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={handleAddTag}
                >
                  Add
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography component="div" variant="subtitle2" gutterBottom>Variables</Typography>
              {templateForm.variables?.map((variable, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                  <Chip
                    label={`${variable.name}${variable.required ? ' *' : ''}`}
                    size="small"
                  />
                  <Typography component="span" variant="body2" color="text.secondary">
                    {variable.description || 'No description'} 
                    {variable.defaultValue ? ` (Default: ${variable.defaultValue})` : ''}
                  </Typography>
                  <IconButton size="small" onClick={() => handleRemoveVariable(index)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Typography component="div" variant="subtitle2">Add Variable</Typography>
                <TextField
                  size="small"
                  label="Variable Name"
                  value={variableForm.name}
                  onChange={(e) => setVariableForm({...variableForm, name: e.target.value})}
                />
                <TextField
                  size="small"
                  label="Default Value (optional)"
                  value={variableForm.defaultValue}
                  onChange={(e) => setVariableForm({...variableForm, defaultValue: e.target.value})}
                />
                <TextField
                  size="small"
                  label="Description (optional)"
                  value={variableForm.description}
                  onChange={(e) => setVariableForm({...variableForm, description: e.target.value})}
                />
                <FormControl>
                  <InputLabel>Required</InputLabel>
                  <Select
                    value={variableForm.required ? "true" : "false"}
                    label="Required"
                    onChange={(e) => setVariableForm({...variableForm, required: e.target.value === "true"})}
                    size="small"
                  >
                    <MenuItem value="false">No</MenuItem>
                    <MenuItem value="true">Yes</MenuItem>
                  </Select>
                </FormControl>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={handleAddVariable}
                >
                  Add Variable
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography component="div" variant="subtitle2">HTML Content</Typography>
                <Button 
                  size="small"
                  onClick={() => setHtmlEditing(!htmlEditing)}
                >
                  {htmlEditing ? 'Simple Editor' : 'HTML Editor'}
                </Button>
              </Box>
              <TextField
                fullWidth
                multiline
                rows={10}
                value={templateForm.html}
                onChange={handleTemplateFormChange('html')}
                placeholder={htmlEditing ? '<html>...</html>' : 'Enter template content here...'}
                InputProps={{
                  sx: htmlEditing ? { fontFamily: 'monospace' } : {},
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography component="div" variant="subtitle2" gutterBottom>Plain Text Version (Optional)</Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={templateForm.plainText}
                onChange={handleTemplateFormChange('plainText')}
                placeholder="Plain text version of your email"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTemplateDialog(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleCreateOrUpdateTemplate}
            disabled={isSubmitting || !templateForm.name || !templateForm.subject || !templateForm.html}
          >
            {isSubmitting ? <CircularProgress size={24} /> : currentTemplate ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Template</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the template "{currentTemplate?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteTemplate} 
            color="error"
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        open={openPreviewDialog}
        onClose={() => setOpenPreviewDialog(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Preview: {currentTemplate?.name}
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Typography variant="subtitle1" gutterBottom>Subject: {currentTemplate?.subject}</Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ mb: 2 }}>
                <iframe
                  title="Email Preview"
                  srcDoc={previewHtml}
                  style={{ width: '100%', height: '400px', border: '1px solid #ddd' }}
                />
              </Box>
              <Box>
                <Typography component="div" variant="subtitle2">Variables:</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                  {currentTemplate?.variables && currentTemplate.variables.map((variable) => (
                    <Chip
                      key={variable.name}
                      label={`${variable.name}${variable.required ? ' *' : ''}`}
                      size="small"
                    />
                  ))}
                </Stack>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography component="div" variant="subtitle2" gutterBottom>Send Test Email</Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <TextField
                    size="small"
                    label="Test Email Address"
                    value={testEmailAddress}
                    onChange={(e) => setTestEmailAddress(e.target.value)}
                    placeholder="test@example.com"
                    fullWidth
                  />
                </Box>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPreviewDialog(false)}>Close</Button>
          <Button 
            variant="contained" 
            onClick={handleTestTemplate}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Send Test Email'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
} 