import React from 'react';
import {
  Box,
  Grid,
  TextField,
  Typography,
  Chip,
  IconButton,
  Button,
  Card,
  CardContent,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parseISO } from 'date-fns';

const ProfessionalTab = ({ profileData, isEditing, onUpdate }) => {
  const [localData, setLocalData] = React.useState(profileData || {});
  const [skillInput, setSkillInput] = React.useState('');
  const [educationDialog, setEducationDialog] = React.useState(false);
  const [certificationDialog, setCertificationDialog] = React.useState(false);
  const [editingEducation, setEditingEducation] = React.useState(null);
  const [editingCertification, setEditingCertification] = React.useState(null);

  React.useEffect(() => {
    setLocalData(profileData || {});
  }, [profileData]);

  const handleFieldChange = (field, value) => {
    const updatedData = { ...localData };
    
    if (field.includes('.')) {
      const keys = field.split('.');
      let current = updatedData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
    } else {
      updatedData[field] = value;
    }
    
    setLocalData(updatedData);
    if (onUpdate) onUpdate(updatedData);
  };

  const handleSkillAdd = () => {
    if (skillInput.trim()) {
      const currentSkills = localData.professional?.skills || [];
      if (!currentSkills.includes(skillInput.trim())) {
        handleFieldChange('professional.skills', [...currentSkills, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    const currentSkills = localData.professional?.skills || [];
    handleFieldChange('professional.skills', 
      currentSkills.filter(skill => skill !== skillToRemove)
    );
  };

  const handleEducationSave = (education) => {
    const currentEducation = localData.professional?.education || [];
    let updatedEducation;
    
    if (editingEducation !== null) {
      updatedEducation = [...currentEducation];
      updatedEducation[editingEducation] = education;
    } else {
      updatedEducation = [...currentEducation, education];
    }
    
    handleFieldChange('professional.education', updatedEducation);
    setEducationDialog(false);
    setEditingEducation(null);
  };

  const handleEducationDelete = (index) => {
    const currentEducation = localData.professional?.education || [];
    handleFieldChange('professional.education', 
      currentEducation.filter((_, i) => i !== index)
    );
  };

  const handleCertificationSave = (certification) => {
    const currentCertifications = localData.professional?.certifications || [];
    let updatedCertifications;
    
    if (editingCertification !== null) {
      updatedCertifications = [...currentCertifications];
      updatedCertifications[editingCertification] = certification;
    } else {
      updatedCertifications = [...currentCertifications, certification];
    }
    
    handleFieldChange('professional.certifications', updatedCertifications);
    setCertificationDialog(false);
    setEditingCertification(null);
  };

  const handleCertificationDelete = (index) => {
    const currentCertifications = localData.professional?.certifications || [];
    handleFieldChange('professional.certifications', 
      currentCertifications.filter((_, i) => i !== index)
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Typography variant="h6" fontWeight={600} mb={3}>
          Professional Information
        </Typography>

        <Grid container spacing={3}>
          {/* Work Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Current Position
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Company"
              value={localData.professional?.company || ''}
              onChange={(e) => handleFieldChange('professional.company', e.target.value)}
              disabled={!isEditing}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Position"
              value={localData.professional?.position || ''}
              onChange={(e) => handleFieldChange('professional.position', e.target.value)}
              disabled={!isEditing}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Department"
              value={localData.professional?.department || ''}
              onChange={(e) => handleFieldChange('professional.department', e.target.value)}
              disabled={!isEditing}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Employee ID"
              value={localData.professional?.employeeId || ''}
              onChange={(e) => handleFieldChange('professional.employeeId', e.target.value)}
              disabled={!isEditing}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Start Date"
              value={localData.professional?.startDate ? parseISO(localData.professional.startDate) : null}
              onChange={(date) => {
                if (date) {
                  handleFieldChange('professional.startDate', format(date, 'yyyy-MM-dd'));
                }
              }}
              disabled={!isEditing}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Manager"
              value={localData.professional?.manager || ''}
              onChange={(e) => handleFieldChange('professional.manager', e.target.value)}
              disabled={!isEditing}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Years of Experience"
              value={localData.professional?.experience || ''}
              onChange={(e) => handleFieldChange('professional.experience', e.target.value)}
              disabled={!isEditing}
              variant="outlined"
            />
          </Grid>

          {/* Skills */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Skills & Expertise
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
              {(localData.professional?.skills || []).map((skill) => (
                <Chip
                  key={skill}
                  label={skill}
                  onDelete={isEditing ? () => handleSkillRemove(skill) : undefined}
                  deleteIcon={<CloseIcon />}
                  variant="outlined"
                  color="primary"
                />
              ))}
            </Box>
            {isEditing && (
              <Box display="flex" gap={1} alignItems="center">
                <TextField
                  size="small"
                  label="Add Skill"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSkillAdd();
                    }
                  }}
                />
                <IconButton onClick={handleSkillAdd} color="primary">
                  <AddIcon />
                </IconButton>
              </Box>
            )}
          </Grid>

          {/* Education */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle1" fontWeight={600}>
                Education
              </Typography>
              {isEditing && (
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => setEducationDialog(true)}
                  variant="outlined"
                  size="small"
                >
                  Add Education
                </Button>
              )}
            </Box>
            
            {(localData.professional?.education || []).map((edu, index) => (
              <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {edu.degree}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {edu.institution}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {edu.year} {edu.gpa && `• GPA: ${edu.gpa}`}
                      </Typography>
                    </Box>
                    {isEditing && (
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setEditingEducation(index);
                            setEducationDialog(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleEducationDelete(index)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Grid>

          {/* Certifications */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle1" fontWeight={600}>
                Certifications
              </Typography>
              {isEditing && (
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => setCertificationDialog(true)}
                  variant="outlined"
                  size="small"
                >
                  Add Certification
                </Button>
              )}
            </Box>
            
            {(localData.professional?.certifications || []).map((cert, index) => (
              <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {cert.name}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {cert.issuer}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Issued: {cert.date}
                        {cert.expiryDate && ` • Expires: ${cert.expiryDate}`}
                      </Typography>
                    </Box>
                    {isEditing && (
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setEditingCertification(index);
                            setCertificationDialog(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleCertificationDelete(index)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Grid>

        {/* Education Dialog */}
        <EducationDialog
          open={educationDialog}
          onClose={() => {
            setEducationDialog(false);
            setEditingEducation(null);
          }}
          onSave={handleEducationSave}
          education={editingEducation !== null ? localData.professional?.education?.[editingEducation] : null}
        />

        {/* Certification Dialog */}
        <CertificationDialog
          open={certificationDialog}
          onClose={() => {
            setCertificationDialog(false);
            setEditingCertification(null);
          }}
          onSave={handleCertificationSave}
          certification={editingCertification !== null ? localData.professional?.certifications?.[editingCertification] : null}
        />
      </Box>
    </LocalizationProvider>
  );
};

// Education Dialog Component
const EducationDialog = ({ open, onClose, onSave, education }) => {
  const [formData, setFormData] = React.useState({
    degree: '',
    institution: '',
    year: '',
    gpa: ''
  });

  React.useEffect(() => {
    if (education) {
      setFormData(education);
    } else {
      setFormData({
        degree: '',
        institution: '',
        year: '',
        gpa: ''
      });
    }
  }, [education, open]);

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {education ? 'Edit Education' : 'Add Education'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Degree"
              value={formData.degree}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Institution"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Year"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="GPA (Optional)"
              value={formData.gpa}
              onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Certification Dialog Component
const CertificationDialog = ({ open, onClose, onSave, certification }) => {
  const [formData, setFormData] = React.useState({
    name: '',
    issuer: '',
    date: '',
    expiryDate: ''
  });

  React.useEffect(() => {
    if (certification) {
      setFormData(certification);
    } else {
      setFormData({
        name: '',
        issuer: '',
        date: '',
        expiryDate: ''
      });
    }
  }, [certification, open]);

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {certification ? 'Edit Certification' : 'Add Certification'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Certification Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Issuing Organization"
              value={formData.issuer}
              onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Issue Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Expiry Date (Optional)"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfessionalTab;
