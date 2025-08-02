import React from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  Divider, 
  TextField, 
  Typography, 
  InputAdornment, 
  IconButton,
  FormHelperText
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useValidationSchema } from '../../utils/form-validation';
import { useApp } from '../../contexts/AppContext';
import { useTranslation } from 'react-i18next';
import GoogleIcon from '@mui/icons-material/Google';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const LoginForm = ({ onSuccess }) => {
  const { t } = useTranslation();
  const { schemas } = useValidationSchema();
  const { setLoading, addNotification } = useApp();
  const [showPassword, setShowPassword] = React.useState(false);
  
  // Initialize form
  const { 
    control, 
    handleSubmit, 
    formState: { errors, isSubmitting }, 
    reset 
  } = useForm({
    resolver: yupResolver(schemas.login),
    defaultValues: {
      email: '',
      password: ''
    }
  });
  
  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setLoading('auth', true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success notification
      addNotification(t('auth.loginSuccess'), 'success');
      
      // Reset form
      reset();
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(data);
      }
    } catch (error) {
      // Show error notification
      addNotification(t('auth.loginError'), 'error');
      console.error('Login error:', error);
    } finally {
      setLoading('auth', false);
    }
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <Card elevation={3} sx={{ maxWidth: 450, mx: 'auto', overflow: 'visible' }}>
      <CardHeader 
        title={
          <Typography variant="h4" color="primary" fontWeight="medium">
            {t('common.login')}
          </Typography>
        } 
        subheader={t('auth.loginSubtitle')}
        sx={{ pb: 0 }}
      />
      <CardContent sx={{ pt: 3 }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                margin="normal"
                label={t('auth.email')}
                type="email"
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineIcon color={errors.email ? 'error' : 'action'} />
                    </InputAdornment>
                  ),
                }}
                disabled={isSubmitting}
              />
            )}
          />
          
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                margin="normal"
                label={t('auth.password')}
                type={showPassword ? 'text' : 'password'}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon color={errors.password ? 'error' : 'action'} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={toggleShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                disabled={isSubmitting}
              />
            )}
          />
          
          <Box sx={{ mt: 1, textAlign: 'right' }}>
            <Typography 
              variant="body2" 
              color="primary" 
              sx={{ cursor: 'pointer', display: 'inline-block' }}
            >
              {t('auth.forgotPassword')}
            </Typography>
          </Box>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={isSubmitting}
            sx={{ mt: 3, mb: 2 }}
          >
            {t('common.login')}
          </Button>
          
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              {t('common.or')}
            </Typography>
          </Divider>
          
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            size="large"
            startIcon={<GoogleIcon />}
            sx={{ mb: 3 }}
          >
            {t('auth.loginWithGoogle')}
          </Button>
          
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              {t('auth.dontHaveAccount')}{' '}
              <Typography 
                component="span" 
                variant="body2" 
                color="primary" 
                sx={{ cursor: 'pointer', fontWeight: 'medium' }}
              >
                {t('common.register')}
              </Typography>
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
