import React, { useState, useEffect } from 'react';
import { fetchUsers, updateUser, createUser, deleteUser } from '../api/itemsService';
import UserForm from './UserForm';
import '../styles/UserList.css';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types/user';


const UserList: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // State for search, filter, and sorting
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);  // Number of users per page

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) {
          console.error("Token is missing.");
          return;
        }
        const fetchedUsers = await fetchUsers(token);
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
  
    fetchData();
  }, []);  // Only fetch once when the component mounts
  const { token } = useAuth();

  const fetchData = async () => {
      try {
          const fetchedUsers = await fetchUsers(token); // Pass the token here
          setUsers(fetchedUsers);
      } catch (error) {
          console.error("Error fetching users:", error);
          // Handle error appropriately (e.g., display an error message)
      } finally {
          setIsLoading(false);
      }
  };

  useEffect(() => {
      fetchData();
  }, [token]); // Only refetch when the token changes

  

  // Filter and sort users based on search input and sorting dropdown
  useEffect(() => {

    let filtered = users.filter((user: any) => {
      return (
        user.name.includes(filter.toLowerCase()) ||
        user.email.toLowerCase().includes(filter.toLowerCase()) ||
        user.role?.toLowerCase().includes(filter.toLowerCase())
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

  const handleModalClose = () => {
    setShowModal(false);
    setCurrentUser(null);
  };

  const handleUpdateUser = async (updatedUser: any) => {
    try {
      const updated = await updateUser(updatedUser.id as number, updatedUser);
      const updatedUsers = [...users];
      const index = updatedUsers.findIndex((user: any) => user.id === updatedUser.id);
      updatedUsers[index] = updated;  // Update the user in the list
      setUsers(updatedUsers);  // Update the original list
      setFilteredUsers(updatedUsers);  // Update the filtered list as well
      setShowModal(false);
      setCurrentUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleCreateUser = async (newUser: User) => {
    try {
      const createdUser = await createUser(newUser); // Assume createUser returns a User object
      const newUsers = [...users, createdUser];
      setUsers(newUsers); // Update the original list
      setFilteredUsers(newUsers); // Update the filtered list as well
      setShowModal(false);
      setCurrentUser(null);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleDeleteUser = async (id: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (confirmDelete) {
      try {
        await deleteUser(id);  // Delete user via API
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
  <div className="user-list-container">
    <h1>User List</h1>

    {isLoading ? (
      <p>Loading users...</p> // Display this while data is loading
    ) : (
      <>
        {/* Search and Filter Section */}
        <div className="filter-container">
          <input
            type="text"
            placeholder="Search by Name, Email, or Role"
            value={filter}
            onChange={(e) => setFilter(e.target.value)} // Trigger filter change
          />
          
          <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="role">Role</option>
          </select>

          <select
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            value={sortOrder}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        {/* Table Section */}
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user: any) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(user)}>
                    <i className="fas fa-edit"></i> Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    )}

    {/* Pagination Controls */}
    {!isLoading && totalPages > 1 && (
      <div className="pagination">
        <button
          className="pagination-button"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
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

        <button
          className="pagination-button"
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    )}

    {/* Modal for create or update user */}
    {showModal && (
      <UserForm
      initialData={currentUser}
        onSubmit={currentUser ? handleUpdateUser : handleCreateUser}
        onClose={handleModalClose}
      />
    )}
  </div>
);
};

export default UserList;