import React, { useState } from 'react';
import UserForm from './UserForm';
import { createUser, updateUser, fetchUsers } from '../api/itemsService';

const ParentComponent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleCreateUser = async (userData: User) => {
    try {
      await createUser(userData);
      // Refresh user list or take other actions after creation
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleUpdateUser = async (userData: User) => {
    if (currentUser) {
      try {
        await updateUser(currentUser.id, userData);
        // Refresh user list or take other actions after update
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }
  };

  return (
    <div>
      <button className="create-new-user-button"  onClick={() => { setIsModalOpen(true); setCurrentUser(null); }}>
        Create New User
      </button>

 

      {isModalOpen && (
        <UserForm
          onSubmit={currentUser ? handleUpdateUser : handleCreateUser}
          initialData={currentUser}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Your table and other content */}
    </div>
  );
};

export default ParentComponent;