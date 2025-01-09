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
// export const fetchUsers = async (params?: { sortBy?: string; sortOrder?: 'asc' | 'desc'; filter?: string }) => {
//   const response = await api.get('/list', { params });
//   return response.data.data;
// };

//Show User List
export const fetchUsers = async (token: string | null, params?: { sortBy?: string; sortOrder?: 'asc' | 'desc'; filter?: string }) => {
  //console.log("Token received in fetchUsers:", token); // Debug token
  const config = {
    params,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined, // Include Bearer token
    },
  };

  //console.log("Request config for /list:", config); // Debug config
  try {
    const response = await api.get('/list', config);
    return response.data.data;
  } catch (error) {
    console.error(error); // Debug error
    throw error; // Re-throw for handling in the component
  }
};

//Create User
export const createUser = async (user: User): Promise<User> => {
  const response = await api.post('/create', user);
  return response.data;
};

//Update User
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