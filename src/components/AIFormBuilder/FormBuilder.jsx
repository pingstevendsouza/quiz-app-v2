import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Switch,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Checkbox
} from '@mui/material';
import { Upload, Download, Add, Delete, HelpOutline } from '@mui/icons-material';

const FormBuilder = ({ onFormGenerated, onFileImport, onExportForm, isProcessing }) => {
  const [buildType, setBuildType] = useState('form');
  const [formData, setFormData] = useState({
    formName: '',
    columnType: 'Single',
    showSave: true,
    showSubmit: true,
    fields: []
  });
  const [jsonInput, setJsonInput] = useState('');
  const [excelFile, setExcelFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [currentField, setCurrentField] = useState({
    fieldName: '',
    fieldType: 'Text',
    tooltip: '',
    required: false,
    fieldValues: ''
  });

  const fieldTypes = [
    'Text', 'Email', 'Number', 'Password', 'Textarea', 'Date', 'Time', 'DateTime',
    'Dropdown', 'Multi-Select', 'Radio', 'Checkbox', 'Switch', 'File Upload',
    'Image Upload', 'URL', 'Phone', 'Currency', 'Percentage', 'Rating',
    'Slider', 'Range', 'Color', 'Signature', 'Rich Text', 'Markdown',
    'JSON Editor', 'Code Editor', 'Location', 'QR Code', 'Barcode'
  ];

  const handleBuildTypeChange = (type) => {
    setBuildType(type);
  };

  const handleFormPropertyChange = (property, value) => {
    setFormData(prev => ({
      ...prev,
      [property]: value
    }));
  };

  const handleFieldChange = (property, value) => {
    setCurrentField(prev => ({
      ...prev,
      [property]: value
    }));
  };

  const addField = () => {
    if (!currentField.fieldName.trim()) {
      setError('Field name is required');
      return;
    }

    const newField = {
      ...currentField,
      id: Date.now(),
      fieldValues: currentField.fieldType.includes('Dropdown') || 
                   currentField.fieldType.includes('Multi-Select') || 
                   currentField.fieldType.includes('Radio') || 
                   currentField.fieldType.includes('Checkbox')
                   ? currentField.fieldValues.split(',').map(v => v.trim()).filter(v => v)
                   : []
    };

    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));

    // Reset current field
    setCurrentField({
      fieldName: '',
      fieldTooltip: '',
      fieldType: 'Text',
      fieldValues: '',
      fieldRequired: false
    });
  };

  const deleteField = (id) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== id)
    }));
  };

  const downloadExcelTemplate = () => {
    const template = [
      ['Field Name', 'Field Type', 'Required', 'Options', 'Tooltip', 'Validation'],
      ['First Name', 'Text', 'Yes', '', 'Enter your first name', 'required'],
      ['Email', 'Email', 'Yes', '', 'Enter your email address', 'required|email'],
      ['Country', 'Dropdown', 'No', 'USA,Canada,UK,Australia', 'Select your country', ''],
      ['Interests', 'Multi-Select', 'No', 'Sports,Music,Reading,Travel', 'Select your interests', '']
    ];

    // Create CSV content
    const csvContent = template.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'form_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleGenerateForm = () => {
    try {
      let schema;
      
      if (buildType === 'form') {
        schema = {
          formName: formData.formName,
          columnType: formData.columnType,
          showSave: formData.showSave,
          showSubmit: formData.showSubmit,
          fields: formData.fields,
          buildType: 'form'
        };
      } else if (buildType === 'json') {
        schema = JSON.parse(jsonInput);
        schema.buildType = 'json';
      } else if (buildType === 'excel') {
        schema = {
          formName: excelFile.name.replace(/\.[^/.]+$/, ""),
          buildType: 'excel',
          fileName: excelFile.name
        };
      }

      onFormGenerated(schema);
      setSuccess('Form created successfully!');
    } catch (error) {
      setError('Failed to create form: ' + error.message);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setExcelFile(file);
      // Process Excel file here
      setSuccess('Excel file uploaded successfully!');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        AI Form Builder Agent
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl>
            <InputLabel id="build-type-label">Build Type</InputLabel>
            <Select
              labelId="build-type-label"
              id="build-type-select"
              value={buildType}
              label="Build Type"
              onChange={(e) => handleBuildTypeChange(e.target.value)}
            >
              <MenuItem value="form">Form Builder</MenuItem>
              <MenuItem value="json">JSON Editor</MenuItem>
              <MenuItem value="excel">Excel Upload</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {buildType === 'form' && (
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Form Properties
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Form Name"
                    value={formData.formName}
                    onChange={(e) => handleFormPropertyChange('formName', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Column Type</InputLabel>
                    <Select
                      value={formData.columnType}
                      onChange={(e) => handleFormPropertyChange('columnType', e.target.value)}
                    >
                      <MenuItem value="Single">Single</MenuItem>
                      <MenuItem value="Multi - (2)">Multi - (2)</MenuItem>
                      <MenuItem value="Multi - (3)">Multi - (3)</MenuItem>
                      <MenuItem value="Multi - (4)">Multi - (4)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.showSave}
                        onChange={(e) => handleFormPropertyChange('showSave', e.target.checked)}
                      />
                    }
                    label="Show Save Button"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.showSubmit}
                        onChange={(e) => handleFormPropertyChange('showSubmit', e.target.checked)}
                      />
                    }
                    label="Show Submit Button"
                  />
                </Grid>
              </Grid>
            </Paper>

            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Field Properties
              </Typography>
              
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Field Name"
                    value={currentField.fieldName}
                    onChange={(e) => handleFieldChange('fieldName', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel>Field Type</InputLabel>
                    <Select
                      value={currentField.fieldType}
                      onChange={(e) => handleFieldChange('fieldType', e.target.value)}
                    >
                      {fieldTypes.map(type => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Tooltip"
                    value={currentField.fieldTooltip}
                    onChange={(e) => handleFieldChange('fieldTooltip', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={currentField.fieldRequired}
                        onChange={(e) => handleFieldChange('fieldRequired', e.target.checked)}
                      />
                    }
                    label="Required"
                  />
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Button
                    variant="contained"
                    onClick={addField}
                    startIcon={<Add />}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>

              {(currentField.fieldType.includes('Dropdown') || 
                currentField.fieldType.includes('Multi-Select') || 
                currentField.fieldType.includes('Radio') || 
                currentField.fieldType.includes('Checkbox')) && (
                <Grid item xs={12} sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Field Values (comma-separated)"
                    value={currentField.fieldValues}
                    onChange={(e) => handleFieldChange('fieldValues', e.target.value)}
                    placeholder="Option1, Option2, Option3"
                  />
                </Grid>
              )}

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Field Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Tooltip</TableCell>
                      <TableCell>Required</TableCell>
                      <TableCell>Values</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.fields.map((field) => (
                      <TableRow key={field.id}>
                        <TableCell>{field.fieldName}</TableCell>
                        <TableCell>
                          <Chip label={field.fieldType} size="small" />
                        </TableCell>
                        <TableCell>{field.fieldTooltip || '-'}</TableCell>
                        <TableCell>
                          <Chip 
                            label={field.fieldRequired ? 'Yes' : 'No'} 
                            size="small"
                            color={field.fieldRequired ? 'error' : 'default'}
                          />
                        </TableCell>
                        <TableCell>
                          {Array.isArray(field.fieldValues) && field.fieldValues.length > 0
                            ? field.fieldValues.join(', ')
                            : '-'}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => deleteField(field.id)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        )}

        {buildType === 'json' && (
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              JSON Editor
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={10}
                  label="JSON Input"
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                />
              </Grid>
            </Grid>
          </Grid>
        )}

        {buildType === 'excel' && (
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Excel Upload
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={downloadExcelTemplate}
                  sx={{ mr: 2 }}
                >
                  Download Template
                </Button>
                <Tooltip title="Upload an Excel file (.xlsx, .xls, .csv) with form structure">
                  <IconButton color="info">
                    <HelpOutline />
                  </IconButton>
                </Tooltip>
              </Box>
              <Button
                variant="contained"
                component="label"
                startIcon={<Upload />}
              >
                Upload Excel File
                <input
                  type="file"
                  hidden
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                />
              </Button>
              {excelFile && (
                <Chip
                  label={excelFile.name}
                  onDelete={() => setExcelFile(null)}
                  sx={{ ml: 2 }}
                />
              )}
            </Paper>
          </Grid>
        )}

        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={handleGenerateForm}
          >
            Generate Form
          </Button>
        </Grid>
      </Grid>

      {error && (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          message={error}
          severity="error"
        />
      )}

      {success && (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          onClose={() => setSuccess(null)}
          message={success}
          severity="success"
        />
      )}
    </Box>
  );
};

export default FormBuilder;
