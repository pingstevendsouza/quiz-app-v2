import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

/**
 * Custom hook that returns Yup validation schemas with translated error messages
 * @returns {Object} Validation schemas and validation methods
 */
export const useValidationSchema = () => {
  const { t } = useTranslation();
  
  // Common validation schemas
  const email = yup
    .string()
    .email(t('errors.invalidEmail'))
    .required(t('errors.required'));
    
  const password = yup
    .string()
    .min(8, t('errors.passwordLength'))
    .required(t('errors.required'));
    
  const name = yup
    .string()
    .required(t('errors.required'));
  
  // Common validation schemas for forms
  const loginSchema = yup.object().shape({
    email,
    password
  });
  
  const registerSchema = yup.object().shape({
    name,
    email,
    password,
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], t('errors.passwordMatch'))
      .required(t('errors.required'))
  });
  
  const quizCreationSchema = yup.object().shape({
    title: yup.string().required(t('errors.required')),
    description: yup.string().required(t('errors.required')),
    timeLimit: yup
      .number()
      .typeError(t('errors.mustBeNumber'))
      .min(1, t('errors.minValue', { value: 1 }))
      .required(t('errors.required')),
    questions: yup
      .array()
      .of(
        yup.object().shape({
          question: yup.string().required(t('errors.required')),
          options: yup
            .array()
            .of(
              yup.object().shape({
                text: yup.string().required(t('errors.required'))
              })
            )
            .min(2, t('errors.minOptions', { value: 2 }))
            .required(t('errors.required')),
          correctOptionIndex: yup
            .number()
            .required(t('errors.requiredCorrectAnswer'))
        })
      )
      .min(1, t('errors.minQuestions', { value: 1 }))
      .required(t('errors.required'))
  });
  
  // Form error helper functions
  const hasErrors = (errors) => Object.keys(errors).length > 0;
  
  const getFirstError = (errors) => {
    if (!hasErrors(errors)) return null;
    
    // Get the first error message
    const firstField = Object.keys(errors)[0];
    return errors[firstField].message;
  };
  
  return {
    schemas: {
      login: loginSchema,
      register: registerSchema,
      quizCreation: quizCreationSchema
    },
    helpers: {
      hasErrors,
      getFirstError
    }
  };
};
