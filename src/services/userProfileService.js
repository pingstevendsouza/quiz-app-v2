// Mock user profile service - replace with actual API calls
class UserProfileService {
  constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL || '/api';
    this.mockData = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      emailVerified: true,
      phone: '+1 (555) 123-4567',
      dateOfBirth: '1990-05-15',
      role: 'Senior Developer',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      bio: 'Passionate full-stack developer with 8+ years of experience in building scalable web applications. Love working with React, Node.js, and cloud technologies.',
      
      // Personal Information
      personalInfo: {
        gender: 'Male',
        nationality: 'American',
        languages: ['English', 'Spanish'],
        timezone: 'America/New_York'
      },
      
      // Address
      address: {
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States'
      },
      
      // Professional Information
      professional: {
        company: 'Tech Solutions Inc.',
        position: 'Senior Full Stack Developer',
        department: 'Engineering',
        employeeId: 'EMP001',
        startDate: '2020-01-15',
        manager: 'Jane Smith',
        skills: ['React', 'Node.js', 'Python', 'AWS', 'Docker'],
        experience: '8 years',
        education: [
          {
            degree: 'Bachelor of Computer Science',
            institution: 'University of Technology',
            year: '2016',
            gpa: '3.8'
          }
        ],
        certifications: [
          {
            name: 'AWS Solutions Architect',
            issuer: 'Amazon Web Services',
            date: '2022-03-15',
            expiryDate: '2025-03-15'
          },
          {
            name: 'React Developer Certification',
            issuer: 'Meta',
            date: '2021-08-20',
            expiryDate: null
          }
        ]
      },
      
      // Social Links
      socialLinks: {
        linkedin: 'https://linkedin.com/in/johndoe',
        twitter: 'https://twitter.com/johndoe',
        github: 'https://github.com/johndoe',
        website: 'https://johndoe.dev'
      },
      
      // Settings/Preferences
      preferences: {
        theme: 'system', // light, dark, system
        language: 'en',
        timezone: 'America/New_York',
        notifications: {
          email: true,
          push: true,
          sms: false,
          marketing: false
        },
        privacy: {
          profileVisibility: 'public', // public, private, contacts
          showEmail: false,
          showPhone: false,
          allowMessages: true
        }
      },
      
      // Statistics
      stats: {
        projects: 24,
        tasks: 156,
        reviews: 89,
        points: 2450
      },
      
      // Timestamps
      createdAt: '2020-01-15T10:00:00Z',
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };
  }

  // Simulate API delay
  delay(ms = 1000) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get user profile
  async getProfile(userId = null) {
    await this.delay(800);
    
    try {
      // In real implementation, make API call
      // const response = await fetch(`${this.baseUrl}/profile/${userId || 'me'}`);
      // return await response.json();
      
      return { ...this.mockData };
    } catch (error) {
      throw new Error('Failed to fetch profile data');
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    await this.delay(1200);
    
    try {
      // In real implementation, make API call
      // const response = await fetch(`${this.baseUrl}/profile`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(profileData)
      // });
      // return await response.json();
      
      // Update mock data
      this.mockData = {
        ...this.mockData,
        ...profileData,
        updatedAt: new Date().toISOString()
      };
      
      return { ...this.mockData };
    } catch (error) {
      throw new Error('Failed to update profile');
    }
  }

  // Upload avatar
  async uploadAvatar(file) {
    await this.delay(2000);
    
    try {
      // In real implementation, upload to cloud storage
      // const formData = new FormData();
      // formData.append('avatar', file);
      // const response = await fetch(`${this.baseUrl}/profile/avatar`, {
      //   method: 'POST',
      //   body: formData
      // });
      // const data = await response.json();
      // return data.avatarUrl;
      
      // Mock avatar upload - return a placeholder URL
      const mockAvatarUrl = `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&t=${Date.now()}`;
      
      this.mockData.avatar = mockAvatarUrl;
      this.mockData.updatedAt = new Date().toISOString();
      
      return mockAvatarUrl;
    } catch (error) {
      throw new Error('Failed to upload avatar');
    }
  }

  // Update specific field
  async updateField(field, value) {
    await this.delay(500);
    
    try {
      // In real implementation, make API call
      // const response = await fetch(`${this.baseUrl}/profile/field`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ field, value })
      // });
      // return await response.json();
      
      // Update mock data
      if (field.includes('.')) {
        const keys = field.split('.');
        let current = this.mockData;
        
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) current[keys[i]] = {};
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
      } else {
        this.mockData[field] = value;
      }
      
      this.mockData.updatedAt = new Date().toISOString();
      
      return { ...this.mockData };
    } catch (error) {
      throw new Error(`Failed to update ${field}`);
    }
  }

  // Verify email
  async verifyEmail(token) {
    await this.delay(1000);
    
    try {
      // In real implementation, make API call
      // const response = await fetch(`${this.baseUrl}/profile/verify-email`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token })
      // });
      // return await response.json();
      
      this.mockData.emailVerified = true;
      this.mockData.updatedAt = new Date().toISOString();
      
      return { success: true, message: 'Email verified successfully' };
    } catch (error) {
      throw new Error('Failed to verify email');
    }
  }

  // Send verification email
  async sendVerificationEmail() {
    await this.delay(800);
    
    try {
      // In real implementation, make API call
      // const response = await fetch(`${this.baseUrl}/profile/send-verification`, {
      //   method: 'POST'
      // });
      // return await response.json();
      
      return { success: true, message: 'Verification email sent' };
    } catch (error) {
      throw new Error('Failed to send verification email');
    }
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    await this.delay(1000);
    
    try {
      // In real implementation, make API call
      // const response = await fetch(`${this.baseUrl}/profile/change-password`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ currentPassword, newPassword })
      // });
      // return await response.json();
      
      return { success: true, message: 'Password changed successfully' };
    } catch (error) {
      throw new Error('Failed to change password');
    }
  }

  // Delete account
  async deleteAccount(password) {
    await this.delay(1500);
    
    try {
      // In real implementation, make API call
      // const response = await fetch(`${this.baseUrl}/profile/delete`, {
      //   method: 'DELETE',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ password })
      // });
      // return await response.json();
      
      return { success: true, message: 'Account deleted successfully' };
    } catch (error) {
      throw new Error('Failed to delete account');
    }
  }
}

// Export singleton instance
export const userProfileService = new UserProfileService();
