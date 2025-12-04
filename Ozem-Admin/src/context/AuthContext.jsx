import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      // TODO: Verify token with backend
      setUser({ email: 'admin@example.com' });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // This would be replaced with actual API call
    if (email === 'admin@example.com' && password === 'admin123') {
      const token = 'dummy-jwt-token';
      localStorage.setItem('adminToken', token);
      setUser({ email });
      return true;
    }
    throw new Error('Invalid credentials');
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
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