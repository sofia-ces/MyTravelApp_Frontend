import React, { useState, useEffect } from 'react';
import { User } from '../api/itemsService';

interface UserFormProps {
  onSubmit: (user: User) => void;
  initialData?: User;
  onClose: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ onSubmit, initialData, onClose }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(initialData?.role || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ id: initialData?.id, name, email, password, role });
    setName('');  // Clear the form fields after submit
    setEmail('');
    setPassword('');
    setRole('');
    onClose();  // Close the modal after submission
  };

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setEmail(initialData.email || '');
      setRole(initialData.role || '');
    }
  }, [initialData]);

  return (
    <div className="table-container">
      <div className="overlay">
        <div className="modal">
          <form onSubmit={handleSubmit}>
            <h2>{initialData ? 'Update User' : 'Create User'} Information</h2>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!initialData}
            />
            <input
              type="text"
              placeholder="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
            <button type="submit">{initialData ? 'Update User' : 'Create User'}</button>
            <button type="button" className="close-button" onClick={onClose}>Cancel</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm;