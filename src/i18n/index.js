import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English translations
const enTranslations = {
  common: {
    welcome: 'Welcome to Quiz App',
    loading: 'Loading...',
    error: 'An error occurred',
    retry: 'Retry',
    save: 'Save',
    cancel: 'Cancel',
    search: 'Search',
    settings: 'Settings',
    profile: 'Profile',
    logout: 'Logout',
    login: 'Login',
    register: 'Register',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    language: 'Language'
  },
  auth: {
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Forgot password?',
    loginWithGoogle: 'Sign in with Google',
    createAccount: 'Create an account',
    alreadyHaveAccount: 'Already have an account? Sign in',
    loginSuccess: 'Login successful!',
    loginError: 'Login failed. Please check your credentials.',
    logoutSuccess: 'You have been logged out successfully.'
  },
  quiz: {
    start: 'Start Quiz',
    next: 'Next Question',
    previous: 'Previous Question',
    submit: 'Submit Answers',
    results: 'View Results',
    score: 'Your Score',
    correctAnswers: 'Correct Answers',
    totalQuestions: 'Total Questions',
    timeRemaining: 'Time Remaining',
    difficulty: 'Difficulty',
    category: 'Category',
    allCategories: 'All Categories'
  },
  errors: {
    required: 'This field is required',
    invalidEmail: 'Please enter a valid email address',
    passwordLength: 'Password must be at least 8 characters',
    networkError: 'Network error. Please check your internet connection.',
    unknownError: 'An unknown error occurred. Please try again later.'
  }
};

// Spanish translations
const esTranslations = {
  common: {
    welcome: 'Bienvenido a Quiz App',
    loading: 'Cargando...',
    error: 'Ha ocurrido un error',
    retry: 'Reintentar',
    save: 'Guardar',
    cancel: 'Cancelar',
    search: 'Buscar',
    settings: 'Configuración',
    profile: 'Perfil',
    logout: 'Cerrar sesión',
    login: 'Iniciar sesión',
    register: 'Registrarse',
    darkMode: 'Modo oscuro',
    lightMode: 'Modo claro',
    language: 'Idioma'
  },
  auth: {
    email: 'Correo electrónico',
    password: 'Contraseña',
    forgotPassword: '¿Olvidaste tu contraseña?',
    loginWithGoogle: 'Iniciar sesión con Google',
    createAccount: 'Crear una cuenta',
    alreadyHaveAccount: '¿Ya tienes una cuenta? Inicia sesión',
    loginSuccess: '¡Inicio de sesión exitoso!',
    loginError: 'Error de inicio de sesión. Por favor verifica tus credenciales.',
    logoutSuccess: 'Has cerrado sesión correctamente.'
  },
  quiz: {
    start: 'Comenzar Quiz',
    next: 'Siguiente Pregunta',
    previous: 'Pregunta Anterior',
    submit: 'Enviar Respuestas',
    results: 'Ver Resultados',
    score: 'Tu Puntuación',
    correctAnswers: 'Respuestas Correctas',
    totalQuestions: 'Total de Preguntas',
    timeRemaining: 'Tiempo Restante',
    difficulty: 'Dificultad',
    category: 'Categoría',
    allCategories: 'Todas las Categorías'
  },
  errors: {
    required: 'Este campo es obligatorio',
    invalidEmail: 'Por favor ingresa un correo electrónico válido',
    passwordLength: 'La contraseña debe tener al menos 8 caracteres',
    networkError: 'Error de red. Por favor verifica tu conexión a internet.',
    unknownError: 'Ha ocurrido un error desconocido. Por favor intenta más tarde.'
  }
};

// Hindi translations
const hiTranslations = {
  common: {
    welcome: 'क्विज ऐप में आपका स्वागत है',
    loading: 'लोड हो रहा है...',
    error: 'एक त्रुटि हुई',
    retry: 'पुनः प्रयास करें',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    search: 'खोज',
    settings: 'सेटिंग्स',
    profile: 'प्रोफ़ाइल',
    logout: 'लॉगआउट',
    login: 'लॉगिन',
    register: 'पंजीकरण करें',
    darkMode: 'डार्क मोड',
    lightMode: 'लाइट मोड',
    language: 'भाषा'
  },
  auth: {
    email: 'ईमेल',
    password: 'पासवर्ड',
    forgotPassword: 'पासवर्ड भूल गए?',
    loginWithGoogle: 'Google से साइन इन करें',
    createAccount: 'खाता बनाएं',
    alreadyHaveAccount: 'पहले से ही खाता है? साइन इन करें',
    loginSuccess: 'लॉगिन सफल!',
    loginError: 'लॉगिन विफल। कृपया अपने प्रमाण पत्र जांचें।',
    logoutSuccess: 'आप सफलतापूर्वक लॉगआउट हो गए हैं।'
  },
  quiz: {
    start: 'क्विज शुरू करें',
    next: 'अगला प्रश्न',
    previous: 'पिछला प्रश्न',
    submit: 'उत्तर जमा करें',
    results: 'परिणाम देखें',
    score: 'आपका स्कोर',
    correctAnswers: 'सही उत्तर',
    totalQuestions: 'कुल प्रश्न',
    timeRemaining: 'शेष समय',
    difficulty: 'कठिनाई',
    category: 'श्रेणी',
    allCategories: 'सभी श्रेणियां'
  },
  errors: {
    required: 'यह फ़ील्ड आवश्यक है',
    invalidEmail: 'कृपया एक वैध ईमेल पता दर्ज करें',
    passwordLength: 'पासवर्ड कम से कम 8 अक्षरों का होना चाहिए',
    networkError: 'नेटवर्क त्रुटि। कृपया अपने इंटरनेट कनेक्शन की जांच करें।',
    unknownError: 'एक अज्ञात त्रुटि हुई। कृपया बाद में पुनः प्रयास करें।'
  }
};

// Initialize i18next
i18n
  .use(LanguageDetector) // Automatically detect language
  .use(initReactI18next) // Initialize react-i18next
  .init({
    resources: {
      en: enTranslations,
      es: esTranslations,
      hi: hiTranslations
    },
    lng: localStorage.getItem('language') || 'en', // Default language
    fallbackLng: 'en', // Fallback language
    interpolation: {
      escapeValue: false // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'] // Cache language detection
    }
  });

export default i18n;
