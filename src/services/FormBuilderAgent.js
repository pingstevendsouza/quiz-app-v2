/**
 * AI Form Builder Agent
 * Dynamically generates forms from structured inputs (JSON, Excel, Form)
 */

class FormBuilderAgent {
  constructor() {
    this.formSchema = {
      formProperties: {},
      fieldProperties: [],
      validationRules: {},
      dependencies: {},
      conditionalLogic: {}
    };
  }

  /**
   * Process input and generate form schema
   * @param {Object} input - Form definition in JSON, Excel, or Form format
   * @returns {Object} - Processed form schema
   */
  async processInput(input) {
    try {
      const normalizedInput = this.normalizeInput(input);
      const validatedSchema = this.validateSchema(normalizedInput);
      const processedSchema = this.processDependencies(validatedSchema);
      
      return {
        success: true,
        schema: processedSchema,
        metadata: this.generateMetadata(processedSchema)
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        details: this.formatError(error)
      };
    }
  }

  /**
   * Normalize different input formats to standard schema
   */
  normalizeInput(input) {
    if (this.isJSONFormat(input)) {
      return this.normalizeJSON(input);
    } else if (this.isExcelFormat(input)) {
      return this.normalizeExcel(input);
    } else if (this.isFormFormat(input)) {
      return this.normalizeForm(input);
    } else {
      throw new Error('Unsupported input format');
    }
  }

  /**
   * Validate form schema structure
   */
  validateSchema(schema) {
    const requiredProps = ['formName', 'fields'];
    const missingProps = requiredProps.filter(prop => !schema[prop]);
    
    if (missingProps.length > 0) {
      throw new Error(`Missing required properties: ${missingProps.join(', ')}`);
    }

    // Validate each field
    schema.fields.forEach((field, index) => {
      this.validateField(field, index);
    });

    return schema;
  }

  /**
   * Validate individual field properties
   */
  validateField(field, index) {
    const requiredFieldProps = ['name', 'type'];
    const missingFieldProps = requiredFieldProps.filter(prop => !field[prop]);
    
    if (missingFieldProps.length > 0) {
      throw new Error(`Field ${index}: Missing required properties: ${missingFieldProps.join(', ')}`);
    }

    // Validate field type
    const validTypes = ['text', 'email', 'number', 'date', 'select', 'checkbox', 'radio', 'textarea', 'file'];
    if (!validTypes.includes(field.type)) {
      throw new Error(`Field ${index}: Invalid type '${field.type}'. Must be one of: ${validTypes.join(', ')}`);
    }

    // Validate select/radio options
    if (['select', 'radio'].includes(field.type) && (!field.options || field.options.length === 0)) {
      throw new Error(`Field ${index}: Type '${field.type}' requires options array`);
    }
  }

  /**
   * Process field dependencies and conditional logic
   */
  processDependencies(schema) {
    const processedSchema = { ...schema };
    
    processedSchema.fields = schema.fields.map(field => {
      const processedField = { ...field };
      
      // Process conditional visibility
      if (field.visibilityRule) {
        processedField.visibilityRule = this.processConditionalRule(field.visibilityRule);
      }

      // Process validation dependencies
      if (field.validationRule) {
        processedField.validationRule = this.processValidationRule(field.validationRule);
      }

      // Process dynamic options
      if (field.options && typeof field.options === 'string' && field.options.startsWith('$')) {
        processedField.options = this.resolveDynamicOptions(field.options);
      }

      return processedField;
    });

    return processedSchema;
  }

  /**
   * Normalize JSON format input
   */
  normalizeJSON(json) {
    return {
      formName: json.formName || json.name,
      formDescription: json.description || json.formDescription,
      columns: json.columns || json.layout?.columns || 1,
      fields: Array.isArray(json.fields) ? json.fields : json.fieldProperties || [],
      validation: json.validation || {},
      styling: json.styling || json.appearance || {},
      metadata: json.metadata || {}
    };
  }

  /**
   * Normalize Excel format input
   */
  normalizeExcel(excelData) {
    const formProps = excelData.formProperties || {};
    const fieldProps = excelData.fieldProperties || excelData.fields || [];

    return {
      formName: formProps.formName || formProps.name,
      formDescription: formProps.description,
      columns: formProps.columns || 1,
      fields: fieldProps.map(field => ({
        name: field.fieldName || field.name,
        type: field.fieldType || field.type,
        label: field.label || field.fieldName,
        required: field.mandatory || field.required || false,
        placeholder: field.placeholder,
        options: field.options || field.listOfValues,
        validation: field.validation,
        dependency: field.dependency,
        visibilityRule: field.visibilityRule,
        styling: field.styling
      })),
      validation: formProps.validation || {},
      styling: formProps.styling || {},
      metadata: formProps.metadata || {}
    };
  }

  /**
   * Normalize Form format input
   */
  normalizeForm(formData) {
    return {
      formName: formData.formName,
      formDescription: formData.description,
      columns: formData.columns || 1,
      fields: formData.fields || [],
      validation: formData.validation || {},
      styling: formData.styling || {},
      metadata: formData.metadata || {}
    };
  }

  /**
   * Process conditional rules
   */
  processConditionalRule(rule) {
    return {
      type: rule.type || 'visibility',
      condition: rule.condition,
      targetField: rule.targetField,
      operator: rule.operator || 'equals',
      value: rule.value,
      logic: rule.logic || 'and'
    };
  }

  /**
   * Process validation rules
   */
  processValidationRule(rule) {
    return {
      type: rule.type || 'required',
      condition: rule.condition,
      message: rule.message,
      validator: rule.validator
    };
  }

  /**
   * Resolve dynamic options
   */
  resolveDynamicOptions(optionsPath) {
    // Implementation for resolving dynamic options
    // Could fetch from API, local storage, or context
    const dynamicOptions = {
      '$countries': [
        { value: 'US', label: 'United States' },
        { value: 'UK', label: 'United Kingdom' },
        { value: 'IN', label: 'India' }
      ],
      '$states': [
        { value: 'CA', label: 'California' },
        { value: 'NY', label: 'New York' },
        { value: 'TX', label: 'Texas' }
      ]
    };

    return dynamicOptions[optionsPath] || [];
  }

  /**
   * Generate form metadata
   */
  generateMetadata(schema) {
    return {
      totalFields: schema.fields.length,
      requiredFields: schema.fields.filter(f => f.required).length,
      conditionalFields: schema.fields.filter(f => f.visibilityRule).length,
      validationRules: schema.fields.filter(f => f.validationRule).length,
      estimatedCompletionTime: this.calculateCompletionTime(schema.fields),
      complexity: this.calculateComplexity(schema.fields)
    };
  }

  /**
   * Calculate estimated completion time
   */
  calculateCompletionTime(fields) {
    const baseTimePerField = 15; // seconds
    const complexFieldMultiplier = 1.5;
    
    let totalTime = 0;
    fields.forEach(field => {
      let fieldTime = baseTimePerField;
      
      if (['select', 'radio', 'checkbox'].includes(field.type)) {
        fieldTime *= complexFieldMultiplier;
      }
      
      if (field.required) {
        fieldTime *= 1.2;
      }
      
      totalTime += fieldTime;
    });

    return Math.round(totalTime / 60); // minutes
  }

  /**
   * Calculate form complexity score
   */
  calculateComplexity(fields) {
    let complexity = 0;
    
    fields.forEach(field => {
      if (field.required) complexity += 1;
      if (field.visibilityRule) complexity += 2;
      if (field.validationRule) complexity += 1;
      if (['select', 'radio', 'checkbox'].includes(field.type)) complexity += 1;
    });

    if (complexity <= 5) return 'simple';
    if (complexity <= 10) return 'moderate';
    return 'complex';
  }

  /**
   * Format error messages for user display
   */
  formatError(error) {
    return {
      message: error.message,
      timestamp: new Date().toISOString(),
      suggestions: this.getErrorSuggestions(error)
    };
  }

  /**
   * Get error suggestions based on error type
   */
  getErrorSuggestions(error) {
    const suggestions = {
      'Missing required properties': [
        'Check that all required fields are provided',
        'Ensure formName and fields array are present',
        'Verify field definitions include name and type'
      ],
      'Invalid type': [
        'Use one of the supported field types',
        'Check spelling and capitalization',
        'Refer to documentation for valid types'
      ]
    };

    return suggestions[error.message] || [
      'Check input format and structure',
      'Verify all required properties are provided',
      'Ensure data types are correct'
    ];
  }

  /**
   * Input format detection helpers
   */
  isJSONFormat(input) {
    return typeof input === 'object' && 
           input !== null && 
           (input.hasOwnProperty('formName') || input.hasOwnProperty('name'));
  }

  isExcelFormat(input) {
    return typeof input === 'object' && 
           input !== null && 
           (input.hasOwnProperty('formProperties') || input.hasOwnProperty('fieldProperties'));
  }

  isFormFormat(input) {
    return typeof input === 'object' && 
           input !== null && 
           input.hasOwnProperty('fields') && 
           Array.isArray(input.fields);
  }
}

export default FormBuilderAgent;
