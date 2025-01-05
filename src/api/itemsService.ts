import { api } from './api';

export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

// Fetch users with optional sorting and filtering
export const fetchUsers = async (params?: { sortBy?: string; sortOrder?: 'asc' | 'desc'; filter?: string }) => {
  const response = await api.get('/list', { params });
  return response.data.data;
};

// Create a new user
export const createUser = async (user: User) => {
  const response = await api.post('/create', user);
  return response.data;
};

export const updateUser = async (id: number, user: Partial<User>) => {
  try {
    const response = await api.put(`/update/${id}`, user); // Use api.put here
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};
// Delete a user
export const deleteUser = async (id: number) => {
  await api.delete(`/remove/${id}`);
}