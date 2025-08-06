import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import DashboardLayout from '../components/Layout/DashboardLayout';
import FormBuilder from '../components/AIFormBuilder/FormBuilder';
import DynamicFormRenderer from '../components/AIFormBuilder/DynamicFormRenderer';
import InputProcessor from '../components/AIFormBuilder/InputProcessor';

const AIFormBuilderPage = () => {
  const [generatedForm, setGeneratedForm] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);


  const inputProcessor = new InputProcessor();

  const handleFormGenerated = (formSchema) => {
    setGeneratedForm(formSchema);
    setSuccess('Form generated successfully!');
    
    // Add form to application menu
    if (formSchema.formName) {
      // Create a new menu item
      const newForm = {
        id: `form-${Date.now()}`,
        name: formSchema.formName,
        type: 'form',
        schema: formSchema,
        createdAt: new Date().toISOString()
      };
      
      // Store in localStorage for persistence
      const existingForms = JSON.parse(localStorage.getItem('customForms') || '[]');
      existingForms.push(newForm);
      localStorage.setItem('customForms', JSON.stringify(existingForms));
      
      // Emit custom event for menu update
      window.dispatchEvent(new CustomEvent('formCreated', { detail: newForm }));
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setIsProcessing(true);
      setError(null);
      
      // Here you would typically send the form data to your backend
      console.log('Form submitted:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Form submitted successfully!');
      
      // Optional: Navigate to results page or reset form
      // navigate('/form-results');
      
    } catch (error) {
      setError('Failed to submit form: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileImport = async (file, format) => {
    try {
      setIsProcessing(true);
      setError(null);
      
      const processedData = await inputProcessor.processFile(file, format);
      setSuccess('File imported successfully!');
      
    } catch (error) {
      setError('Failed to import file: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportForm = (formData, format) => {
    try {
      const exportedData = inputProcessor.exportData(formData, format);
      const blob = new Blob([exportedData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `form-${formData.formName || 'untitled'}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setSuccess(`Form exported as ${format.toUpperCase()} successfully!`);
    } catch (error) {
      setError('Failed to export form: ' + error.message);
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            AI Form Builder
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create dynamic forms using AI-powered generation from JSON, Excel, or direct input
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gap: 3 }}>
          {/* Form Builder */}
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Form Configuration
            </Typography>
            <FormBuilder
              onFormGenerated={handleFormGenerated}
              onFileImport={handleFileImport}
              onExportForm={handleExportForm}
              isProcessing={isProcessing}
            />
          </Paper>

          {/* Form Preview */}
          {generatedForm && (
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Form Preview
              </Typography>
              <DynamicFormRenderer
                schema={generatedForm}
                onSubmit={handleFormSubmit}
                onChange={(data) => console.log('Form data changed:', data)}
              />
            </Paper>
          )}
        </Box>

        {/* Loading Overlay */}
        {isProcessing && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {/* Snackbars */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity="error">
            {error}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity="success">
            {success}
          </Alert>
        </Snackbar>
      </Container>
    </DashboardLayout>
  );
};

export default AIFormBuilderPage;
