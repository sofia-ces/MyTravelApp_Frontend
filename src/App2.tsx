import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchUsers, createUser, updateUser, deleteUser, User } from './api/itemsService';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import ParentComponent from './components/ParentComponent';
import ParentTravelComponent from './components/ParentTravelComponent';
import './styles/App.css';
import WeatherWidget from './components/WeatherWidget';
import TravelList from './components/TravelList';
import TravelForm from './components/TravelForm';
import TravelImageGallery from './components/TravelImageGallery';
import WikipediaWidget from './components/WikipediaWidget';
import CurrencyConverter from './components/CurrencyConverter';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider,useAuth } from './contexts/AuthContext';



const App: React.FC = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [location, setLocation] = useState<string>('Palawan');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Login and Logout
  const queryClient = useQueryClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Default to logged out
  const [authToken, setAuthToken] = useState<string | null>(null);


  const { token, setIsLoading, setToken } = useAuth(); // Get token from context

  const handleLoginSuccess = (token: string) => {
    setToken(token); // Update the token in the context
    // setAuthToken(token);
    // setIsLoggedIn(true);
    // localStorage.setItem('authToken', token); // Store the token for persistence

    
  };
  

  const handleLogout = () => {
    setAuthToken(null);
    setIsLoggedIn(false);
    localStorage.removeItem('authToken'); // Clear the token
  };
  useEffect(() => {
    // Load token from localStorage on component mount
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setIsLoading(true);
      setTimeout(() => {
        setToken(storedToken);
        setIsLoading(false);
      }, 500); // Simulate a delay to show the loading indicator
    }
  }, [setToken, setIsLoading]);

  useEffect(() => {
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   setAuthToken(token);
    //   setIsLoggedIn(true);
    // }

    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   setAuthToken(token);
    //   setIsLoggedIn(true);
    // } else {
    //   setIsLoggedIn(false); // Avoid state updates that may re-trigger effects
    // }
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const { data: users = [], isLoading } = useQuery<User[]>('users', fetchUsers);

  const createMutation = useMutation(createUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
      setIsFormVisible(false);
    },
  });

  const updateMutation = useMutation((user: User) => updateUser(user.id!, user), {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
      setEditingUser(null);
      setIsFormVisible(false);
    },
  });

  const deleteMutation = useMutation(deleteUser, {
    onSuccess: () => queryClient.invalidateQueries('users'),
  });

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setIsFormVisible(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleFormSubmit = (user: User) => {
    if (editingUser) {
      updateMutation.mutate(user);
    } else {
      createMutation.mutate(user);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
  
      <AuthProvider>
          <Router>
        <Routes>
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/user-list" element={
            <ProtectedRoute>
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
            </ProtectedRoute>
          } />
          <Route path="/travel-plans" element={
            <ProtectedRoute>
              {isFormVisible && (
                <TravelForm
                  onSubmit={handleFormSubmit}
                  initialData={editingUser || undefined}
                />
              )}
              <ParentTravelComponent />
              <TravelList
                users={users}
                onEdit={handleEditClick}
                onDelete={handleDelete}
              />
              <div className="right-column">
                <WeatherWidget />
                <CurrencyConverter />
              </div>
            </ProtectedRoute>
          } />
          <Route path="/group-plans" element={<ProtectedRoute><h4>This feature is still under construction.</h4></ProtectedRoute>} />
          <Route path="/weather-info" element={
            <ProtectedRoute>
              <div className="row-container">
                <div className="right-column">
                  <WikipediaWidget />
                </div>
                <div className="right-column">
                  <h2>Location Image</h2>
                  <input
                    type="text"
                    placeholder="Enter location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                  <TravelImageGallery location={location} />
                </div>
              </div>
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        </Router>
      </AuthProvider>
    
  );

};

export default App;
