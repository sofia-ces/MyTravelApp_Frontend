import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom'; // Import routing components
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


const App: React.FC = () => {

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [location, setLocation] = useState<string>('Palawan');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  //Login 
  const queryClient = useQueryClient();

  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [authToken, setAuthToken] = useState<string | null>(null);
  //const handleLoginSuccess = () => {
  const handleLoginSuccess = (token: string) => {
     setAuthToken(token);
    setIsLoggedIn(true);
     localStorage.setItem('authToken', token); // Store the token for persistence
  };

  const handleLogout = () => {
    setAuthToken(null);
    setIsLoggedIn(false);
    localStorage.removeItem('authToken'); // Clear the token
  };


  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
      setIsLoggedIn(true);
    }
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
    <Router>
        {!isLoggedIn ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
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
                      {' '}
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
                  <button onClick={handleLogout} >
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
                    <> <ProtectedRoute isLoggedIn={isLoggedIn}>
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
                      </div>   </ProtectedRoute>
                    </>
                  }
                />

                <Route
                  path="/travel-plans"
                  element={
                    <> <ProtectedRoute isLoggedIn={isLoggedIn}>
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
                        {/* <Currency/> */}
                      </div>   </ProtectedRoute>
                    </>
                  }
                />

            <Route
                  path="/group-plans"
                  element={
                    <> 
                        <div className="user-list-container">
                       <h4>This feature is still under construction, but we'll let you know as soon as it's ready.</h4> 
                         </div>
                    </>
                  }
                />

                <Route
                  path="/weather-info"
                  element={
                    <> <ProtectedRoute isLoggedIn={isLoggedIn}>
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
                      </div>   </ProtectedRoute>
                    </>
                  }
                />
                <Route path="*" element={<Navigate to="/login" />} />
              </Routes>
            </div>
          </div>
        </div>
      )}
    </Router>
  );
};

export default App;
