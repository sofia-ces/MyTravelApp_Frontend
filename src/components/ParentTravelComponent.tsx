import React, { useState } from 'react';
import TravelForm from './TravelForm';
import { createTravel, updateTravel, Travel } from '../api/travelService';

const ParentTravelComponent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTravel] = useState(null);

  const handleCreateUser = async (userData: Travel) => {
    try {
      await createTravel(userData);
      // Refresh user list or take other actions after creation
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleUpdateUser = async (userData: Travel) => {
    if (currentTravel) {
      try {
        await updateTravel(currentTravel.id, userData);
        // Refresh user list or take other actions after update
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }
  };

  return (
    <div>
     
   
      {isModalOpen && (
        <TravelForm
          onSubmit={currentTravel ? handleUpdateUser : handleCreateUser}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Your table and other content */}
    </div>
  );
};

export default ParentTravelComponent;