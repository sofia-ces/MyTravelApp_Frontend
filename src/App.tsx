import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchUsers, createUser, updateUser, deleteUser, User } from './api/itemsService';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import ParentComponent from './components/ParentComponent';
import './styles/App.css';
import WeatherWidget from './components/WeatherWidget';


const App: React.FC = () => {
  const queryClient = useQueryClient();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { data: users = [], isLoading } = useQuery<User[]>('users', fetchUsers);

  const createMutation = useMutation(createUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
      setIsFormVisible(false); // Hide form after creation
    },
  });

  const updateMutation = useMutation((user: User) => updateUser(user.id!, user), {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
      setEditingUser(null); // Reset editing user
      setIsFormVisible(false); // Hide form after update
    },
  });

  const deleteMutation = useMutation(deleteUser, {
    onSuccess: () => queryClient.invalidateQueries('users'),
  });

  // const handleCreateClick = () => {
  //   setEditingUser(null); // Clear editing state
  //   setIsFormVisible(true); // Show form for creating a new user
  // };

  const handleEditClick = (user: User) => {
    setEditingUser(user); // Set the user to edit
    setIsFormVisible(true); // Show form for editing
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleFormSubmit = (user: User) => {
    if (editingUser) {
      updateMutation.mutate(user); // Update user
    } else {
      createMutation.mutate(user); // Create new user
    }
  };

  const [showWeather, setShowWeather] = useState(false);

  const handleWeatherButtonClick = () => {
    setShowWeather(true); // Display the WeatherWidget
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div id="root">
      <h1><center>Travel Management System</center></h1>

<div className="main-container">
<div className="row-container">

      {isFormVisible && (
        <UserForm
          onSubmit={handleFormSubmit}
          initialData={editingUser || undefined}
        />
      )}
  <div className="left-column">
  <ParentComponent />
  <UserList
        users={users}
        onEdit={handleEditClick}
        onDelete={handleDelete}
      />
  </div>
  <div className="right-column">
    <WeatherWidget />
  </div>
</div>
</div>
</div>
  );
};

export default App;