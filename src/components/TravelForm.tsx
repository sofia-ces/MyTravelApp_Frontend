import React, { useState, useEffect } from 'react';
import { Travel } from '../api/travelService';

interface UserFormProps {
  onSubmit: (user: Travel) => void;
  initialData?: Travel;
  onClose: () => void;
}

const TravelForm: React.FC<UserFormProps> = ({ onSubmit, initialData, onClose }) => {
  const [destination, setDestination] = useState(initialData?.destination || '');
  const [start_date, setstartDate] = useState(initialData?.start_date || '');
  const [end_date, setendDate] = useState(initialData?.end_date || '');
  const [description, setDescription] = useState(initialData?.description || '');


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ id: initialData?.id, destination, start_date, end_date, description });
    setDestination('');  // Clear the form fields after submit
    setstartDate('');
    setendDate('');
    setDescription('');
 
    onClose();  // Close the modal after submission
  };

  useEffect(() => {
    if (initialData) {
      setDestination(initialData.destination || '');
      setstartDate(initialData.start_date || '');
      setendDate(initialData.end_date || '');
      setDescription(initialData.description || '');
    }
  }, [initialData]);

  return (
    <div className="table-container">
      <div className="overlay">
        <div className="modal">
          <form onSubmit={handleSubmit}>
            <h2>{initialData ? 'Update Plan' : 'Create Plan'} Information</h2>
            <input
              type="text"
              placeholder="Destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
            <input
              type="date"
              placeholder="Start Date"
              value={start_date}
              onChange={(e) => setstartDate(e.target.value)}
              required
            />

            <input
              type="date"
              placeholder="End Date"
              value={end_date}
              onChange={(e) => setendDate(e.target.value)}
              required
            />
         
            <input 
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button type="submit">{initialData ? 'Update Plan' : 'Create Plan'}</button>
            <button type="button" className="close-button" onClick={onClose}>Cancel</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TravelForm;