// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { apiRequest } from '../utils/api.js';

// Import Firebase (will be null if not configured)
import { auth, googleProvider } from '../firebase.js';

// Import Firebase Auth functions conditionally
let signInWithPopup = null;
if (auth && googleProvider) {
  try {
    // Dynamic import to avoid errors if Firebase is not installed
    import('firebase/auth').then((firebaseAuth) => {
      signInWithPopup = firebaseAuth.signInWithPopup;
    }).catch(() => {
      // Firebase auth not available
    });
  } catch (error) {
    // Ignore
  }
}

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Check authentication status on app load
   */
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await apiRequest('/auth/me');
      if (response && response.success) {
        setUser(response.data.user);
        // Token is already in localStorage, no need to set again
      } else {
        // Invalid token or backend unavailable
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      // If backend is unreachable, keep token but don't set user
      // This allows offline functionality
      if (error.message && error.message.includes('Failed to fetch')) {
        console.warn('Backend unreachable during auth check');
        // Keep token for when backend comes back online
      } else {
        // Invalid token or other error
        localStorage.removeItem('token');
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Initialize auth check on mount
   */
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Register new user
   * @param {Object} userData - { name, email, password, phone? }
   */
  const signup = async (userData) => {
    try {
      setLoading(true);
      const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      // Handle backend offline case
      if (response && response.isOffline) {
        return { 
          success: false, 
          error: response.message || 'Unable to connect to the server. Please try again later.',
          errorCode: 'BACKEND_OFFLINE'
        };
      }

      // Handle null response (shouldn't happen for auth endpoints, but handle gracefully)
      if (response === null) {
        return { 
          success: false, 
          error: 'Unable to connect to the server. The backend may be offline.',
          errorCode: 'BACKEND_OFFLINE'
        };
      }

      if (response && response.success) {
        // Store token in localStorage
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        
        setUser(response.data.user);
        toast.success('Account created successfully!');
        return { success: true, user: response.data.user };
      } else {
        // Return error with code for specific handling
        let errorMessage = response?.message || 'Registration failed due to an unexpected issue.';
        let errorCode = response?.errorCode || 'SIGNUP_FAILED';
        
        // Handle database unavailable error
        if (errorCode === 'DATABASE_UNAVAILABLE') {
          errorMessage = 'Database is not available. Please try again later.';
        }
        
        return { 
          success: false, 
          error: errorMessage,
          errorCode
        };
      }
    } catch (error) {
      // Handle API errors with error codes
      let errorMessage = 'Registration failed due to an unexpected issue.';
      let errorCode = 'SIGNUP_FAILED';
      
      // Extract error from response if available
      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || errorMessage;
        errorCode = error.response.data.errorCode || errorCode;
      } else if (error.errorCode) {
        errorCode = error.errorCode;
        errorMessage = error.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Don't show toast here - let the Login component handle it
      return { success: false, error: errorMessage, errorCode };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login user
   * @param {Object} credentials - { email, password }
   */
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      // Handle backend offline case
      if (response && response.isOffline) {
        return { 
          success: false, 
          error: response.message || 'Unable to connect to the server. Please try again later.',
          errorCode: 'BACKEND_OFFLINE'
        };
      }

      // Handle null response (shouldn't happen for auth endpoints, but handle gracefully)
      if (response === null) {
        return { 
          success: false, 
          error: 'Unable to connect to the server. The backend may be offline.',
          errorCode: 'BACKEND_OFFLINE'
        };
      }

      if (response && response.success) {
        // Store token in localStorage
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        
        setUser(response.data.user);
        toast.success('Login successful!');
        return { success: true, user: response.data.user };
      } else {
        // Return error with code for specific handling
        let errorMessage = response?.message || 'Login failed. Please try again or contact support.';
        let errorCode = response?.errorCode || 'LOGIN_FAILED';
        
        // Handle database unavailable error
        if (errorCode === 'DATABASE_UNAVAILABLE') {
          errorMessage = 'Database is not available. Please try again later.';
        }
        
        return { 
          success: false, 
          error: errorMessage,
          errorCode
        };
      }
    } catch (error) {
      // Handle API errors with error codes
      let errorMessage = 'Login failed. Please try again or contact support.';
      let errorCode = 'LOGIN_FAILED';
      
      // Extract error from response if available
      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || errorMessage;
        errorCode = error.response.data.errorCode || errorCode;
      } else if (error.errorCode) {
        errorCode = error.errorCode;
        errorMessage = error.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Don't show toast here - let the Login component handle it
      return { success: false, error: errorMessage, errorCode };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Google Login
   */
  const googleLogin = async () => {
    if (!auth || !googleProvider) {
      toast.error('Google login is not configured. Please add Firebase credentials to .env file.');
      return { success: false, error: 'Google login not available' };
    }

    try {
      setLoading(true);
      
      // Dynamically import signInWithPopup if not already loaded
      if (!signInWithPopup) {
        const firebaseAuth = await import('firebase/auth');
        signInWithPopup = firebaseAuth.signInWithPopup;
      }
      
      // Sign in with Google using Firebase
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      
      // Get the ID token from Firebase
      const idToken = await firebaseUser.getIdToken();
      
      // Optionally call backend to create/update user and get JWT
      try {
        const response = await apiRequest('/auth/google', {
          method: 'POST',
          body: JSON.stringify({
            idToken: idToken,
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          }),
        });
        
        if (response && response.success) {
          // Store backend JWT token if provided
          if (response.data.token) {
            localStorage.setItem('token', response.data.token);
          }
          
          // Set user from backend response (which includes photoURL) or fallback to Firebase
          const userData = response.data.user || {
            id: firebaseUser.uid,
            name: firebaseUser.displayName,
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
          };
          // Ensure photoURL is included
          if (!userData.photoURL && firebaseUser.photoURL) {
            userData.photoURL = firebaseUser.photoURL;
          }
          setUser(userData);
          
          // Debug: Log user data to verify photoURL
          if (import.meta.env.DEV) {
            console.log('Google login - User data set:', { 
              hasPhotoURL: !!userData.photoURL, 
              photoURL: userData.photoURL 
            });
          }
          
          toast.success('Login successful!');
          return { success: true, user: userData };
        }
      } catch (backendError) {
        // If backend is unavailable, use Firebase auth only
        console.warn('Backend Google auth failed, using Firebase only:', backendError);
        
        // Store Firebase ID token
        localStorage.setItem('firebaseToken', idToken);
        
        // Set user from Firebase (when backend is unavailable)
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL || null,
        });
        
        toast.success('Login successful!');
        return { success: true, user: firebaseUser };
      }
    } catch (error) {
      console.error('Google login failed:', error);
      const errorMessage = error.code === 'auth/popup-closed-by-user' 
        ? 'Sign-in cancelled'
        : error.message || 'Google login failed. Please try again.';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      // Sign out from Firebase if logged in via Google
      if (auth.currentUser) {
        await auth.signOut();
      }
      
      // Call logout endpoint to clear cookie
      await apiRequest('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state regardless of API call
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('firebaseToken');
      toast.success('Logged out successfully');
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    signup,
    logout,
    googleLogin,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

