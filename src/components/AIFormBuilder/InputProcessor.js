/**
 * Input Processor for AI Form Builder
 * Handles JSON, Excel, and Form input formats
 */

class InputProcessor {
  constructor() {
    this.supportedFormats = ['json', 'excel', 'csv', 'form'];
  }

  /**
   * Process input file based on format
   * @param {File} file - Input file
   * @param {string} format - File format
   * @returns {Promise<Object>} - Processed form data
   */
  async processFile(file, format) {
    try {
      if (!this.supportedFormats.includes(format)) {
        throw new Error(`Unsupported format: ${format}. Supported formats: ${this.supportedFormats.join(', ')}`);
      }

      const fileContent = await this.readFile(file);
      
      switch (format.toLowerCase()) {
        case 'json':
          return this.processJSON(fileContent);
        case 'excel':
        case 'csv':
          return this.processExcel(fileContent);
        case 'form':
          return this.processForm(fileContent);
        default:
          throw new Error(`Processing not implemented for format: ${format}`);
      }
    } catch (error) {
      throw new Error(`Failed to process file: ${error.message}`);
    }
  }

  /**
   * Read file content
   */
  readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      
      reader.onerror = (error) => {
        reject(new Error(`Failed to read file: ${error}`));
      };

      if (file.type.includes('json')) {
        reader.readAsText(file);
      } else if (file.type.includes('csv') || file.type.includes('excel') || file.type.includes('sheet')) {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
    });
  }

  /**
   * Process JSON format
   */
  processJSON(content) {
    try {
      const jsonData = JSON.parse(content);
      return this.normalizeFormData(jsonData);
    } catch (error) {
      throw new Error(`Invalid JSON format: ${error.message}`);
    }
  }

  /**
   * Process Excel/CSV format
   */
  processExcel(content) {
    // For Excel/CSV processing, we'll use a simplified approach
    // In a real implementation, you might use libraries like xlsx or papaparse
    
    try {
      // This is a simplified implementation
      // In production, use proper Excel parsing libraries
      const data = this.parseExcelData(content);
      return this.normalizeExcelData(data);
    } catch (error) {
      throw new Error(`Failed to process Excel/CSV: ${error.message}`);
    }
  }

  /**
   * Parse Excel data (simplified implementation)
   */
  parseExcelData(content) {
    // This is a placeholder for actual Excel parsing
    // In a real implementation, you would use:
    // - xlsx library for Excel files
    // - papaparse for CSV files
    
    // For demo purposes, we'll return a mock structure
    return {
      formProperties: {
        formName: 'Sample Form',
        description: 'Generated from Excel',
        columns: 2
      },
      fieldProperties: [
        {
          fieldName: 'firstName',
          fieldType: 'text',
          label: 'First Name',
          mandatory: true,
          placeholder: 'Enter your first name'
        },
        {
          fieldName: 'lastName',
          fieldType: 'text',
          label: 'Last Name',
          mandatory: true,
          placeholder: 'Enter your last name'
        },
        {
          fieldName: 'email',
          fieldType: 'email',
          label: 'Email Address',
          mandatory: true,
          placeholder: 'Enter your email'
        }
      ]
    };
  }

  /**
   * Normalize Excel data to standard format
   */
  normalizeExcelData(data) {
    const formProps = data.formProperties || {};
    const fieldProps = data.fieldProperties || [];

    return {
      formName: formProps.formName || 'Untitled Form',
      formDescription: formProps.description || '',
      columns: formProps.columns || 1,
      fields: fieldProps.map(field => ({
        name: field.fieldName || field.name,
        type: this.normalizeFieldType(field.fieldType || field.type),
        label: field.label || field.fieldName,
        required: field.mandatory || field.required || false,
        placeholder: field.placeholder,
        options: this.normalizeOptions(field.options || field.listOfValues),
        validation: this.normalizeValidation(field.validation),
        dependency: field.dependency,
        visibilityRule: field.visibilityRule
      })),
      validation: formProps.validation || {},
      styling: formProps.styling || {},
      metadata: formProps.metadata || {}
    };
  }

  /**
   * Process Form format
   */
  processForm(content) {
    try {
      const formData = JSON.parse(content);
      return this.normalizeFormData(formData);
    } catch (error) {
      throw new Error(`Invalid Form format: ${error.message}`);
    }
  }

  /**
   * Normalize form data to standard format
   */
  normalizeFormData(data) {
    return {
      formName: data.formName || data.name || 'Untitled Form',
      formDescription: data.description || data.formDescription || '',
      columns: data.columns || data.layout?.columns || 1,
      fields: this.normalizeFields(data.fields || data.fieldProperties || []),
      validation: data.validation || {},
      styling: data.styling || data.appearance || {},
      metadata: data.metadata || {}
    };
  }

  /**
   * Normalize fields array
   */
  normalizeFields(fields) {
    return fields.map(field => ({
      name: field.name || field.fieldName,
      type: this.normalizeFieldType(field.type || field.fieldType),
      label: field.label || field.name || field.fieldName,
      required: field.required || field.mandatory || false,
      placeholder: field.placeholder,
      options: this.normalizeOptions(field.options || field.listOfValues),
      validation: this.normalizeValidation(field.validation),
      dependency: field.dependency,
      visibilityRule: this.normalizeVisibilityRule(field.visibilityRule),
      styling: field.styling || {}
    }));
  }

  /**
   * Normalize field type
   */
  normalizeFieldType(type) {
    const typeMapping = {
      'string': 'text',
      'integer': 'number',
      'float': 'number',
      'boolean': 'checkbox',
      'date': 'date',
      'datetime': 'date',
      'select': 'select',
      'dropdown': 'select',
      'radio': 'radio',
      'multiselect': 'checkbox',
      'textarea': 'textarea',
      'file': 'file',
      'email': 'email',
      'password': 'text'
    };

    return typeMapping[type.toLowerCase()] || type.toLowerCase();
  }

  /**
   * Normalize options
   */
  normalizeOptions(options) {
    if (!options) return [];
    
    if (Array.isArray(options)) {
      return options.map(opt => {
        if (typeof opt === 'string') {
          return { value: opt, label: opt };
        }
        return opt;
      });
    }
    
    if (typeof options === 'string') {
      return options.split(',').map(opt => ({
        value: opt.trim(),
        label: opt.trim()
      }));
    }
    
    return [];
  }

  /**
   * Normalize validation rules
   */
  normalizeValidation(validation) {
    if (!validation) return {};
    
    if (typeof validation === 'object') {
      return validation;
    }
    
    return {};
  }

  /**
   * Normalize visibility rules
   */
  normalizeVisibilityRule(rule) {
    if (!rule) return null;
    
    if (typeof rule === 'object') {
      return {
        type: rule.type || 'visibility',
        condition: rule.condition,
        operator: rule.operator || 'equals',
        value: rule.value,
        logic: rule.logic || 'and'
      };
    }
    
    return null;
  }

  /**
   * Generate sample data for testing
   */
  generateSampleData(format) {
    switch (format.toLowerCase()) {
      case 'json':
        return {
          formName: 'Employee Registration Form',
          formDescription: 'Complete employee registration form with all necessary details',
          columns: 2,
          fields: [
            {
              name: 'firstName',
              type: 'text',
              label: 'First Name',
              required: true,
              placeholder: 'Enter your first name'
            },
            {
              name: 'lastName',
              type: 'text',
              label: 'Last Name',
              required: true,
              placeholder: 'Enter your last name'
            },
            {
              name: 'email',
              type: 'email',
              label: 'Email Address',
              required: true,
              placeholder: 'Enter your email address'
            },
            {
              name: 'department',
              type: 'select',
              label: 'Department',
              required: true,
              options: [
                { value: 'engineering', label: 'Engineering' },
                { value: 'marketing', label: 'Marketing' },
                { value: 'sales', label: 'Sales' },
                { value: 'hr', label: 'Human Resources' }
              ]
            },
            {
              name: 'experience',
              type: 'number',
              label: 'Years of Experience',
              required: false,
              placeholder: 'Enter years of experience'
            },
            {
              name: 'resume',
              type: 'file',
              label: 'Upload Resume',
              required: false
            }
          ]
        };

      case 'excel':
        return {
          formProperties: {
            formName: 'Customer Feedback Form',
            description: 'Collect customer feedback and satisfaction ratings',
            columns: 1
          },
          fieldProperties: [
            {
              fieldName: 'customerName',
              fieldType: 'text',
              label: 'Customer Name',
              mandatory: true,
              placeholder: 'Enter your full name'
            },
            {
              fieldName: 'email',
              fieldType: 'email',
              label: 'Email Address',
              mandatory: true,
              placeholder: 'Enter your email address'
            },
            {
              fieldName: 'satisfaction',
              fieldType: 'select',
              label: 'Overall Satisfaction',
              mandatory: true,
              listOfValues: 'Very Satisfied,Satisfied,Neutral,Dissatisfied,Very Dissatisfied'
            },
            {
              fieldName: 'comments',
              fieldType: 'textarea',
              label: 'Additional Comments',
              mandatory: false,
              placeholder: 'Share your detailed feedback here...'
            }
          ]
        };

      default:
        return this.generateSampleData('json');
    }
  }

  /**
   * Validate input format
   */
  validateInput(data) {
    const errors = [];

    if (!data.formName && !data.name) {
      errors.push('Form name is required');
    }

    if (!data.fields || !Array.isArray(data.fields)) {
      errors.push('Fields array is required');
    } else {
      data.fields.forEach((field, index) => {
        if (!field.name && !field.fieldName) {
          errors.push(`Field ${index}: name is required`);
        }
        if (!field.type && !field.fieldType) {
          errors.push(`Field ${index}: type is required`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Export data in specified format
   */
  exportData(data, format) {
    switch (format.toLowerCase()) {
      case 'json':
        return JSON.stringify(data, null, 2);
      case 'csv':
        return this.exportToCSV(data);
      case 'excel':
        return this.exportToExcel(data);
      default:
        return JSON.stringify(data, null, 2);
    }
  }

  /**
   * Export to CSV format
   */
  exportToCSV(data) {
    const headers = ['Field Name', 'Type', 'Label', 'Required', 'Placeholder', 'Options'];
    const rows = data.fields.map(field => [
      field.name,
      field.type,
      field.label,
      field.required || false,
      field.placeholder || '',
      Array.isArray(field.options) ? field.options.map(o => o.label || o.value).join(';') : field.options || ''
    ]);

    return [headers, ...rows].map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');
  }

  /**
   * Export to Excel format (returns JSON structure)
   */
  exportToExcel(data) {
    return {
      formProperties: {
        formName: data.formName,
        description: data.formDescription,
        columns: data.columns
      },
      fieldProperties: data.fields.map(field => ({
        fieldName: field.name,
        fieldType: field.type,
        label: field.label,
        mandatory: field.required,
        placeholder: field.placeholder,
        listOfValues: Array.isArray(field.options) 
          ? field.options.map(o => o.label || o.value).join(',')
          : field.options
      }))
    };
  }
}

export default InputProcessor;
