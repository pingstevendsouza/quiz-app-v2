import { useState, useEffect, useCallback } from 'react';
import { userProfileService } from '../services/userProfileService';

export const useUserProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Load profile data on mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userProfileService.getProfile();
      setProfileData(data);
      setOriginalData(JSON.parse(JSON.stringify(data))); // Deep copy
    } catch (err) {
      setError(err.message);
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = useCallback(async (updates = null) => {
    try {
      setSaving(true);
      setError(null);
      
      const dataToSave = updates || profileData;
      const updatedData = await userProfileService.updateProfile(dataToSave);
      
      setProfileData(updatedData);
      setOriginalData(JSON.parse(JSON.stringify(updatedData))); // Deep copy
      
      return updatedData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [profileData]);

  const updateField = useCallback((field, value) => {
    setProfileData(prev => {
      // Handle nested field updates (e.g., 'address.street')
      if (field.includes('.')) {
        const keys = field.split('.');
        const newData = { ...prev };
        let current = newData;
        
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) current[keys[i]] = {};
          current[keys[i]] = { ...current[keys[i]] };
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        return newData;
      }
      
      return {
        ...prev,
        [field]: value
      };
    });
  }, []);

  const uploadAvatar = useCallback(async (file) => {
    try {
      setSaving(true);
      setError(null);
      
      const avatarUrl = await userProfileService.uploadAvatar(file);
      
      setProfileData(prev => ({
        ...prev,
        avatar: avatarUrl
      }));
      
      // Auto-save avatar change
      await updateProfile({
        ...profileData,
        avatar: avatarUrl
      });
      
      return avatarUrl;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [profileData, updateProfile]);

  const resetChanges = useCallback(() => {
    if (originalData) {
      setProfileData(JSON.parse(JSON.stringify(originalData))); // Deep copy
    }
  }, [originalData]);

  const hasUnsavedChanges = useCallback(() => {
    if (!profileData || !originalData) return false;
    return JSON.stringify(profileData) !== JSON.stringify(originalData);
  }, [profileData, originalData]);

  // Auto-save functionality with debounce
  const [autoSaveTimeout, setAutoSaveTimeout] = useState(null);
  
  const enableAutoSave = useCallback((delay = 2000) => {
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }
    
    if (hasUnsavedChanges()) {
      const timeout = setTimeout(() => {
        updateProfile();
      }, delay);
      
      setAutoSaveTimeout(timeout);
    }
  }, [autoSaveTimeout, hasUnsavedChanges, updateProfile]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [autoSaveTimeout]);

  return {
    profileData,
    originalData,
    loading,
    saving,
    error,
    updateProfile,
    updateField,
    uploadAvatar,
    resetChanges,
    hasUnsavedChanges: hasUnsavedChanges(),
    enableAutoSave,
    reload: loadProfile
  };
};
