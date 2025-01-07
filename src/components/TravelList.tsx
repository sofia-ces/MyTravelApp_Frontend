import React, { useState, useEffect } from 'react';
import { fetchTravel, updateTravel, createTravel, deleteTravel } from '../api/travelService';
import TravelForm from './TravelForm';
import NotAvailable from './NotAvailable';
import '../styles/UserList.css';

const TravelList: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showModalNotAvailable, setShowModalNotAvailable ] = useState(false);
  
  // State for search, filter, and sorting
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);  // Number of users per page

  useEffect(() => {
    const fetchData = async () => {
      const users = await fetchTravel();  // Fetch all users once
      setUsers(users);
      setFilteredUsers(users);  // Initially, set filtered users to all users
    };
    fetchData();
  }, []);  // Only fetch once when the component mounts

  // Filter and sort users based on search input and sorting dropdown
  useEffect(() => {
    let filtered = users.filter((user: any) => {
      return (
        user.destination.toLowerCase().includes(filter.toLowerCase()) ||
        user.start_date.toLowerCase().includes(filter.toLowerCase()) ||
        user.end_date?.toLowerCase().includes(filter.toLowerCase()) ||
        user.description?.toLowerCase().includes(filter.toLowerCase()) 
      );
    });

    // Apply sorting after filtering
    filtered = filtered.sort((a: any, b: any) => {
      const aValue = a[sortBy]?.toString().toLowerCase();
      const bValue = b[sortBy]?.toString().toLowerCase();

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredUsers(filtered);
  }, [filter, sortBy, sortOrder, users]);  // Re-run filtering and sorting when any of these values change

  // Get current users to display for the current page
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handleEdit = (user: any) => {
    setCurrentUser(user);
    setShowModal(true);
  };

  const handleShareUser = (user: any) => {
    setCurrentUser(user);
    setShowModalNotAvailable(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setShowModalNotAvailable(false);
    setCurrentUser(null);
  };

  const handleUpdateUser = async (updatedUser: any) => {
    try {
      const updated = await updateTravel(updatedUser.id as number, updatedUser);
      const updatedUsers = [...users];
      const index = updatedUsers.findIndex((user: any) => user.id === updatedUser.id);
      updateTravel[index] = updated;  // Update the user in the list
      setUsers(updatedUsers);  // Update the original list
      setFilteredUsers(updatedUsers);  // Update the filtered list as well
      setShowModal(false);
      setCurrentUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleCreateUser = async (newTravel: any) => {
    try {
      const createdUser = await createTravel(newTravel);
      const newTravel = [...users, createdUser];
      setUsers(newTravel);  // Update the original list
      setFilteredUsers(newTravel);  // Update the filtered list as well
      setShowModal(false);
      setCurrentUser(null);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleDeleteUser = async (id: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this plan?');
    if (confirmDelete) {
      try {
        await deleteTravel(id);  // Delete user via API
        const updatedUsers = users.filter((user: any) => user.id !== id);  // Remove from list
        setUsers(updatedUsers);  // Update the original list
        setFilteredUsers(updatedUsers);  // Update the filtered list as well
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  // Pagination control functions
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="user-travel-container">
      <h1>Travel Plans</h1>
    
      <div><button
          className="create-plan-button"
          onClick={() => setShowModal(true)}
          style={{ display: "inline-block", float: "right" }}
        >
          Create New Plan
        </button>
        </div>
      {/* Search and Filter Section */}
      <div className="filter-container">
        <input
          type="text"
          placeholder="Search by Name, Email, or Role"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}  // Trigger filter change
        />
        
        <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
          <option value="destination">Destination</option>
          <option value="start_date">Start Date</option>
          <option value="end_date">End Date</option>
          <option value="description">Description</option>
        </select>

        <select onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')} value={sortOrder}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Destination</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Description</th>
            {/* <th>Remarks</th> */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user: any) => (
            <tr key={user.id}>
              <td>{user.destination}</td>
              <td>{user.start_date}</td>
              <td>{user.end_date}</td>
              <td>{user.description}</td>
              {/* <td>{user.description}</td> */}
              <td>
                <button className="edit-btn" onClick={() => handleEdit(user)}> <i className="fas fa-edit"></i> Edit</button>
                <button className="delete-btn" onClick={() => handleDeleteUser(user.id)}> <i className="fas fa-trash"></i> Delete</button>
                <button className="share-btn" onClick={() => handleShareUser(user.id)}> <i className="fas fa-share"></i> Share</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <button className="pagination-button" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button 
            key={index}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}

        <button className="pagination-button"  onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>

      {/* Modal for create or update user */}
      {showModal && (
        <TravelForm
          initialData={currentUser}
          onSubmit={currentUser ? handleUpdateUser : handleCreateUser}
          onClose={handleModalClose}
        />
      )}

        {/* Modal for create or update user */}
        {showModalNotAvailable && (
        <NotAvailable
          initialData={currentUser}
      
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default TravelList;