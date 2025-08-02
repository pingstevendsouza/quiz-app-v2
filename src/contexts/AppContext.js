import React, { createContext, useContext, useReducer, useMemo } from 'react';
import { useTheme } from './ThemeContext';
import { useTranslation } from 'react-i18next';

// Initial state
const initialState = {
  loading: {
    global: false,
    auth: false,
    quiz: false
  },
  notifications: [],
  userPreferences: {
    quizStartSound: true,
    quizEndSound: true,
    autoSubmit: true,
    showTimer: true,
    showProgressBar: true
  }
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  SET_USER_PREFERENCE: 'SET_USER_PREFERENCE'
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value
        }
      };
      
    case ActionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, {
          id: Date.now(), // Simple unique ID
          ...action.payload
        }]
      };
      
    case ActionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload
        )
      };
      
    case ActionTypes.SET_USER_PREFERENCE:
      return {
        ...state,
        userPreferences: {
          ...state.userPreferences,
          [action.payload.key]: action.payload.value
        }
      };
      
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// App provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { mode, toggleThemeMode } = useTheme();
  const { i18n } = useTranslation();
  
  // Load user preferences from localStorage on initial render
  React.useEffect(() => {
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      try {
        const parsedPreferences = JSON.parse(savedPreferences);
        Object.keys(parsedPreferences).forEach(key => {
          dispatch({
            type: ActionTypes.SET_USER_PREFERENCE,
            payload: { key, value: parsedPreferences[key] }
          });
        });
      } catch (error) {
        console.error('Error parsing saved preferences:', error);
      }
    }
  }, []);
  
  // Save user preferences to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(state.userPreferences));
  }, [state.userPreferences]);
  
  // Actions
  const setLoading = (key, value) => {
    dispatch({ 
      type: ActionTypes.SET_LOADING, 
      payload: { key, value } 
    });
  };
  
  const addNotification = (message, severity = 'info', autoHideDuration = 5000) => {
    const id = Date.now();
    dispatch({ 
      type: ActionTypes.ADD_NOTIFICATION, 
      payload: { id, message, severity, autoHideDuration } 
    });
    
    // Auto remove notification after duration
    if (autoHideDuration) {
      setTimeout(() => {
        removeNotification(id);
      }, autoHideDuration);
    }
    
    return id;
  };
  
  const removeNotification = (id) => {
    dispatch({ type: ActionTypes.REMOVE_NOTIFICATION, payload: id });
  };
  
  const setUserPreference = (key, value) => {
    dispatch({ 
      type: ActionTypes.SET_USER_PREFERENCE, 
      payload: { key, value } 
    });
  };
  
  // Change language
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };
  
  // Memoize context value to prevent unnecessary renders
  const contextValue = useMemo(() => ({
    ...state,
    setLoading,
    addNotification,
    removeNotification,
    setUserPreference,
    theme: { mode, toggleThemeMode },
    language: { 
      current: i18n.language, 
      change: changeLanguage 
    }
  }), [state, mode, toggleThemeMode, i18n.language]);
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using the app context
export const useApp = () => useContext(AppContext);

export default AppContext;
