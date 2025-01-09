import { api } from './api';

export interface Travel {
    id: number;
    destination: string;
    start_date: string;
    end_date: string;
    description: string;
}

// Fetch users with optional sorting and filtering
export const fetchTravel = async (params?: { sortBy?: string; sortOrder?: 'asc' | 'desc'; filter?: string }) => {
  const response = await api.get('/travel/list', { params });
  return response.data.data;
};

// Create a new user
export const createTravel = async (user: Travel) => {
  const response = await api.post('/travel/create', user);
  return response.data;
};

export const updateTravel = async (id: number, user: Partial<Travel>) => {
  try {
    const response = await api.put(`/travel/update/${id}`, user); // Use api.put here
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};
// Delete a user
export const deleteTravel = async (id: number) => {
  await api.delete(`/travel/remove/${id}`);
}