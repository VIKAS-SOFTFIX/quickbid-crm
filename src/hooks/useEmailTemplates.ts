import { useState, useEffect, useCallback } from 'react';
import {
  EmailTemplate,
  EmailTemplateVariable,
  CreateEmailTemplateData,
  EmailTemplateFilter,
  getEmailTemplates,
  getEmailTemplateById,
  createEmailTemplate,
  updateEmailTemplate,
  deleteEmailTemplate,
  previewEmailTemplate,
  testEmailTemplate,
} from '../services/emailTemplateService';

export const useEmailTemplates = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<EmailTemplate | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [previewSubject, setPreviewSubject] = useState<string>('');
  const [isClient, setIsClient] = useState<boolean>(false);

  // Set isClient to true once component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch all templates
  const fetchTemplates = useCallback(async (filters?: EmailTemplateFilter) => {
    // Only run on the client side
    if (!isClient) return;
    
    try {
      setLoading(true);
      const data = await getEmailTemplates(filters);
      
      // Ensure we're setting an array
      setTemplates(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch email templates');
      console.error('Error fetching templates:', err);
      // Set templates to empty array on error
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  }, [isClient]);

  // Fetch template by ID
  const fetchTemplateById = useCallback(async (id: string) => {
    // Only run on the client side
    if (!isClient) return null;
    
    try {
      setLoading(true);
      const data = await getEmailTemplateById(id);
      setCurrentTemplate(data);
      setError(null);
      return data;
    } catch (err: any) {
      setError(err.message || `Failed to fetch template with ID: ${id}`);
      console.error(`Error fetching template ${id}:`, err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isClient]);

  // Create new template
  const addTemplate = useCallback(async (templateData: CreateEmailTemplateData) => {
    // Only run on the client side
    if (!isClient) return null;
    
    try {
      setLoading(true);
      const newTemplate = await createEmailTemplate(templateData);
      setTemplates(prev => [...prev, newTemplate]);
      setError(null);
      return newTemplate;
    } catch (err: any) {
      setError(err.message || 'Failed to create template');
      console.error('Error creating template:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isClient]);

  // Update template
  const editTemplate = useCallback(async (id: string, templateData: Partial<CreateEmailTemplateData>) => {
    // Only run on the client side
    if (!isClient) return null;
    
    try {
      setLoading(true);
      const updatedTemplate = await updateEmailTemplate(id, templateData);
      
      // Update templates list
      setTemplates(prev => 
        prev.map(template => template._id === id ? updatedTemplate : template)
      );
      
      // Update current template if it's the one being edited
      if (currentTemplate && currentTemplate._id === id) {
        setCurrentTemplate(updatedTemplate);
      }
      
      setError(null);
      return updatedTemplate;
    } catch (err: any) {
      setError(err.message || `Failed to update template with ID: ${id}`);
      console.error(`Error updating template ${id}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentTemplate, isClient]);

  // Delete template
  const removeTemplate = useCallback(async (id: string) => {
    // Only run on the client side
    if (!isClient) return false;
    
    try {
      setLoading(true);
      await deleteEmailTemplate(id);
      
      // Remove from templates list
      setTemplates(prev => prev.filter(template => template._id !== id));
      
      // Clear current template if it's the one being deleted
      if (currentTemplate && currentTemplate._id === id) {
        setCurrentTemplate(null);
      }
      
      setError(null);
      return true;
    } catch (err: any) {
      setError(err.message || `Failed to delete template with ID: ${id}`);
      console.error(`Error deleting template ${id}:`, err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentTemplate, isClient]);

  // Preview template
  const getTemplatePreview = useCallback(async (id: string) => {
    // Only run on the client side
    if (!isClient) return null;
    
    try {
      setLoading(true);
      const preview = await previewEmailTemplate(id);
      setPreviewHtml(preview.html);
      setPreviewSubject(preview.subject);
      setError(null);
      return preview;
    } catch (err: any) {
      setError(err.message || `Failed to preview template with ID: ${id}`);
      console.error(`Error previewing template ${id}:`, err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isClient]);

  // Test template
  const sendTestEmail = useCallback(async (id: string, email: string, variables: Record<string, string> = {}) => {
    // Only run on the client side
    if (!isClient) return false;
    
    try {
      setLoading(true);
      await testEmailTemplate(id, email, variables);
      setError(null);
      return true;
    } catch (err: any) {
      setError(err.message || `Failed to send test email for template with ID: ${id}`);
      console.error(`Error sending test email for template ${id}:`, err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [isClient]);

  // Clear current template
  const clearCurrentTemplate = useCallback(() => {
    setCurrentTemplate(null);
  }, []);

  return {
    templates,
    currentTemplate,
    loading,
    error,
    previewHtml,
    previewSubject,
    fetchTemplates,
    fetchTemplateById,
    addTemplate,
    editTemplate,
    removeTemplate,
    getTemplatePreview,
    sendTestEmail,
    clearCurrentTemplate,
    setCurrentTemplate,
    isClient,
  };
}; 