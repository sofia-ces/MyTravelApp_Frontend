import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchUsers, createUser, updateUser, User } from './api/itemsService';
import {  Travel,createTravel,updateTravel } from './api/travelService';
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
import { useAuth } from './contexts/AuthContext';

const App: React.FC = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [location, setLocation] = useState<string>('Palawan');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  const queryClient = useQueryClient();
  const { token, isLoading, handleLogout, handleLogin } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);


 // Only fetch users if isLoading is false and token is available
 const { isLoading: usersLoading } = useQuery<User[]>(
    'users',
    () => fetchUsers(token),
    { enabled: !isLoading && token !== null } 
  );

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

  const createTravelMutation = useMutation(createTravel, {
    onSuccess: () => {
      queryClient.invalidateQueries('travel');
      setIsFormVisible(false);
    },
  });

  const updateTravelMutation = useMutation((travel: Travel) => updateTravel(travel.id!, travel), {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
      setEditingUser(null);
      setIsFormVisible(false);
    },
  });


  const handleFormSubmit = (user: User) => {
    if (editingUser) {
      updateMutation.mutate(user);
    } else {
      createMutation.mutate(user);
    }
  };

  const handleTravelFormSubmit = (travel: Travel) => {
    if (editingUser) {
        updateTravelMutation.mutate(travel);
    } else {
        createTravelMutation.mutate(travel);
    }
  };



  if (isLoading || usersLoading) return <div>Loading...</div>;

  return (

      <Router>
        <Routes>
          <Route path="/login" element={<Login onLoginSuccess={handleLogin} />} />
          <Route path="/*" element={token ? (
            <div className="main-container">
              <div className="sidebar">
                <div className="user-info">
                  <img
                    className="user-image"
                    src="https://via.placeholder.com/102"
                    alt="User Avatar"
                  />
                  <div className="user-name">John Doe</div>
                  <div className="user-email">johndoe@example.com</div>

                  <h4>
                    <i className="fa fa-clock"></i>
                    <span className="current-time"> {currentTime}</span>
                  </h4>
                </div>
                <div className="sidebar-nav">
                  <ul>
                    <li>
                      <Link to="/user-list">
                        <h3>
                          <i className="fa fa-user"></i> User List
                        </h3>
                      </Link>
                    </li>
                    <li>
                      <Link to="/travel-plans">
                        <h3>
                          <i className="fa fa-list"></i> Travel Plans
                        </h3>
                      </Link>
                    </li>
                    <li>
                      <Link to="/group-plans">
                        <h3>
                          <i className="far fa-comments"></i> Group Plans
                        </h3>
                      </Link>
                    </li>
                    <li>
                      <Link to="/weather-info">
                        <h3>
                          <i className="fa fa-location"></i> Locations
                        </h3>
                      </Link>
                    </li>
                    <li>
                      <button onClick={handleLogout}>
                        <h3>
                          <i className="fas fa-arrow-circle-down"></i> Logout
                        </h3>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="content">
                <div className="header-container">
                  <h1>Travel Management System</h1>
                  <div className="header-icon">✈️ 🌍</div>
                </div>
                <div className="row-container">
                  <Routes>
                    <Route
                      path="/user-list"
                      element={
                        <ProtectedRoute>
                          {isFormVisible && (
                             <UserForm
                             onSubmit={handleFormSubmit}
                             onClose={() => setIsFormVisible(false)}
                             initialData={editingUser || undefined} // Pass initial data for editing, or undefined for creating
                           />
                          )}
                          <div className="left-column">
                            <ParentComponent />
                            <UserList/>
                          </div>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/travel-plans"
                      element={
                        <ProtectedRoute>
                          {isFormVisible && (
                            <TravelForm
                            onSubmit={handleTravelFormSubmit}
                            onClose={() => setIsFormVisible(false)}
                          />
                          )}
                          <ParentTravelComponent />
                          <TravelList/>
                          <div className="right-column">
                            <WeatherWidget />
                            <CurrencyConverter />
                          </div>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/group-plans"
                      element={<ProtectedRoute><h4>This feature is still under construction.</h4></ProtectedRoute>}
                    />
                    <Route
                      path="/weather-info"
                      element={
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
                      }
                    />
                    <Route path="*" element={<Navigate to="/user-list" replace />} />
                  </Routes>
                </div>
              </div>
            </div>
          ) : (
            <Navigate to="/login" replace />
          )} />
        </Routes>
      </Router>

  );
};

export default App;