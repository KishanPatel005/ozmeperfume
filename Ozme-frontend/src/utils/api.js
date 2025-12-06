/**
 * API utility for frontend
 * Handles all API requests with error handling and token management
 */

// Get API base URL from environment, default to production URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://82.112.231.165:3002/api';

// Log API base URL on load (for debugging)
if (import.meta.env.DEV) {
  console.log('API Base URL:', API_BASE_URL);
}

/**
 * Get auth token from localStorage
 */
const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Get guest token from cookies
 */
const getGuestToken = () => {
  const cookies = document.cookie.split('; ');
  const guestCookie = cookies.find((row) => row.startsWith('guestToken='));
  return guestCookie ? guestCookie.split('=')[1] : null;
};

/**
 * Make API request
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} Response data
 */
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();
  const guestToken = getGuestToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (guestToken && !token) {
    headers['x-guest-token'] = guestToken;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Include cookies for guest tokens
    });

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      // For authentication errors (401, 403), throw with error data for proper handling
      if (response.status === 401 || response.status === 403) {
        const authError = new Error(data.message || `API request failed: ${response.status}`);
        authError.response = { status: response.status, data };
        authError.errorCode = data.errorCode;
        throw authError;
      }
      
      // For 404s, return null to allow graceful handling
      if (response.status === 404) {
        console.warn(`Endpoint not found: ${url}`);
        return null;
      }
      
      // For other errors, throw with error data
      const apiError = new Error(data.message || `API request failed: ${response.status}`);
      apiError.response = { status: response.status, data };
      apiError.errorCode = data.errorCode;
      throw apiError;
    }

    return data;
  } catch (error) {
    // Detect connection refused / network errors
    // Check for various network error patterns including ERR_CONNECTION_REFUSED
    const isConnectionError = 
      (error.message && (
        error.message.includes('Failed to fetch') || 
        error.message.includes('NetworkError') ||
        error.message.includes('Network request failed') ||
        error.message.includes('ERR_CONNECTION_REFUSED') ||
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('ERR_NETWORK')
      )) ||
      error.code === 'ERR_NETWORK' ||
      error.code === 'ECONNREFUSED' ||
      (error.name === 'TypeError' && error.message && error.message.includes('fetch')) ||
      // Check if error is a network error (no response object means connection failed)
      (!error.response && error.message);

    if (isConnectionError) {
      // Log error for debugging
      console.error('Backend offline. API request failed:', {
        endpoint,
        error: error.message,
        url
      });

      // Return structured error object for auth endpoints
      if (endpoint.includes('/auth/')) {
        return {
          success: false,
          message: 'Unable to connect to the server. The backend may be offline.',
          errorCode: 'BACKEND_OFFLINE',
          isOffline: true
        };
      }

      // For other endpoints, return null for graceful fallback
      return null;
    }
    
    // Re-throw authentication and API errors so they can be handled by callers
    if (error.response || error.errorCode) {
      throw error;
    }
    
    // For unexpected errors, return structured error for auth endpoints
    if (endpoint.includes('/auth/')) {
      return {
        success: false,
        message: 'An unexpected error occurred. Please try again.',
        errorCode: 'UNKNOWN_ERROR'
      };
    }
    
    // For other endpoints, return null to prevent component crashes
    console.error('API request error:', error);
    return null;
  }
};

/**
 * Check backend health
 * @returns {Promise<boolean>} True if backend is reachable
 */
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/api/health`, {
      method: 'GET',
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

export default apiRequest;

