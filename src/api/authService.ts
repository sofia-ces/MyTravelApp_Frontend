import { api } from './api';

export const login = async (credentials: { email: string; password: string }) => {
  const response = await api.post('/login', credentials);
  const { token } = response.data;

  // Save token to localStorage
  localStorage.setItem('authToken', token);
  
  return token;
};

export const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
};