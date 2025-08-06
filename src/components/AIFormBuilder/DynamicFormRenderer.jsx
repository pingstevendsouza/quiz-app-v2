import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  Checkbox,
  Alert,
  Grid
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

const DynamicFormRenderer = ({ schema, onSubmit, onChange }) => {
  const [formData, setFormData] = useState({});
  const [conditionalVisibility, setConditionalVisibility] = useState({});
  
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm();

  const watchedValues = watch();

  useEffect(() => {
    if (schema) {
      reset();
      setFormData({});
    }
  }, [schema, reset]);

  useEffect(() => {
    if (onChange) {
      onChange(formData);
    }
  }, [formData, onChange]);

  const evaluateCondition = useCallback((rule, values) => {
    if (!rule) return true;
    
    const { condition, operator, value } = rule;
    
    switch (operator) {
      case 'equals':
        return values[condition] === value;
      case 'not_equals':
        return values[condition] !== value;
      case 'contains':
        return String(values[condition] || '').includes(String(value));
      case 'not_contains':
        return !String(values[condition] || '').includes(String(value));
      case 'greater_than':
        return Number(values[condition]) > Number(value);
      case 'less_than':
        return Number(values[condition]) < Number(value);
      case 'greater_than_equals':
        return Number(values[condition]) >= Number(value);
      case 'less_than_equals':
        return Number(values[condition]) <= Number(value);
      case 'is_empty':
        return !values[condition] || values[condition].length === 0;
      case 'is_not_empty':
        return values[condition] && values[condition].length > 0;
      default:
        return true;
    }
  }, []);

  useEffect(() => {
    if (schema?.fields) {
      const visibility = {};
      schema.fields.forEach(field => {
        if (field.visibilityRule) {
          const isVisible = evaluateCondition(field.visibilityRule, watchedValues);
          visibility[field.name] = isVisible;
        } else {
          visibility[field.name] = true;
        }
      });
      setConditionalVisibility(visibility);
    }
  }, [watchedValues, schema, evaluateCondition]);




  const renderField = (field) => {
    if (conditionalVisibility[field.name] === false) {
      return null;
    }

    const commonProps = {
      key: field.name,
      name: field.name,
      label: field.label,
      required: field.required,
      error: errors[field.name],
      helperText: errors[field.name]?.message
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <Controller
            name={field.name}
            control={control}
            rules={getValidationRules(field)}
            render={({ field: controllerField }) => (
              <TextField
                {...commonProps}
                {...controllerField}
                type={field.type}
                placeholder={field.placeholder}
                fullWidth
                margin="normal"
              />
            )}
          />
        );

      case 'textarea':
        return (
          <Controller
            name={field.name}
            control={control}
            rules={getValidationRules(field)}
            render={({ field: controllerField }) => (
              <TextField
                {...commonProps}
                {...controllerField}
                multiline
                rows={4}
                placeholder={field.placeholder}
                fullWidth
                margin="normal"
              />
            )}
          />
        );

      case 'select':
        return (
          <Controller
            name={field.name}
            control={control}
            rules={getValidationRules(field)}
            render={({ field: controllerField }) => (
              <FormControl
                fullWidth
                margin="normal"
                error={errors[field.name]}
              >
                <InputLabel>{field.label}</InputLabel>
                <Select
                  {...controllerField}
                  label={field.label}
                >
                  {field.options?.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors[field.name] && (
                  <Typography variant="caption" color="error">
                    {errors[field.name].message}
                  </Typography>
                )}
              </FormControl>
            )}
          />
        );

      case 'radio':
        return (
          <Controller
            name={field.name}
            control={control}
            rules={getValidationRules(field)}
            render={({ field: controllerField }) => (
              <FormControl component="fieldset" margin="normal">
                <FormLabel component="legend">{field.label}</FormLabel>
                <RadioGroup {...controllerField}>
                  {field.options?.map(option => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio />}
                      label={option.label}
                    />
                  ))}
                </RadioGroup>
                {errors[field.name] && (
                  <Typography variant="caption" color="error">
                    {errors[field.name].message}
                  </Typography>
                )}
              </FormControl>
            )}
          />
        );

      case 'checkbox':
        if (field.options && field.options.length > 1) {
          return (
            <Controller
              name={field.name}
              control={control}
              rules={getValidationRules(field)}
              render={({ field: controllerField }) => (
                <FormControl component="fieldset" margin="normal">
                  <FormLabel component="legend">{field.label}</FormLabel>
                  {field.options?.map(option => (
                    <FormControlLabel
                      key={option.value}
                      control={
                        <Checkbox
                          checked={controllerField.value?.includes(option.value) || false}
                          onChange={(e) => {
                            const newValue = e.target.checked
                              ? [...(controllerField.value || []), option.value]
                              : (controllerField.value || []).filter(v => v !== option.value);
                            controllerField.onChange(newValue);
                          }}
                        />
                      }
                      label={option.label}
                    />
                  ))}
                  {errors[field.name] && (
                    <Typography variant="caption" color="error">
                      {errors[field.name].message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />
          );
        } else {
          return (
            <Controller
              name={field.name}
              control={control}
              rules={getValidationRules(field)}
              render={({ field: controllerField }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      {...controllerField}
                      checked={controllerField.value || false}
                    />
                  }
                  label={field.label}
                />
              )}
            />
          );
        }

      case 'date':
        return (
          <Controller
            name={field.name}
            control={control}
            rules={getValidationRules(field)}
            render={({ field: controllerField }) => (
              <TextField
                {...commonProps}
                {...controllerField}
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                margin="normal"
              />
            )}
          />
        );

      case 'file':
        return (
          <Controller
            name={field.name}
            control={control}
            rules={getValidationRules(field)}
            render={({ field: controllerField }) => (
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ mt: 2, mb: 1 }}
              >
                {field.label}
                <input
                  type="file"
                  hidden
                  onChange={(e) => {
                    controllerField.onChange(e.target.files[0]);
                  }}
                />
              </Button>
            )}
          />
        );

      default:
        return (
          <Typography color="error">
            Unsupported field type: {field.type}. Please add a case for this field type in the renderField function.
          </Typography>
        );
    }
  };

  const getValidationRules = (field) => {
    const rules = {};

    if (field.required) {
      rules.required = field.label ? `${field.label} is required` : 'This field is required';
    }

    if (field.validationRule) {
      const { type, min, max, pattern } = field.validationRule;
      
      switch (type) {
        case 'minLength':
          rules.minLength = {
            value: min,
            message: `Minimum length is ${min} characters`
          };
          break;
        case 'maxLength':
          rules.maxLength = {
            value: max,
            message: `Maximum length is ${max} characters`
          };
          break;
        case 'pattern':
          rules.pattern = {
            value: new RegExp(pattern),
            message: 'Invalid format'
          };
          break;
        case 'min':
          rules.min = {
            value: min,
            message: `Minimum value is ${min}`
          };
          break;
        case 'max':
          rules.max = {
            value: max,
            message: `Maximum value is ${max}`
          };
          break;
      }
    }

    return rules;
  };

  const handleSubmitForm = (data) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  if (!schema) {
    return (
      <Alert severity="info">
        No form schema provided. Please generate a form first.
      </Alert>
    );
  }

  const renderGrid = () => {
    const columns = schema.columns || 1;
    const columnWidth = 12 / columns;

    return (
      <Grid container spacing={3}>
        {schema.fields.map((field) => (
          <Grid item xs={12} md={columnWidth} key={field.name}>
            {renderField(field)}
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {schema.formName || 'Dynamic Form'}
      </Typography>
      
      {schema.formDescription && (
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {schema.formDescription}
        </Typography>
      )}

      <form onSubmit={handleSubmit(handleSubmitForm)}>
        {renderGrid()}
        
        <Box mt={3}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth={schema.columns === 1}
          >
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default DynamicFormRenderer;
