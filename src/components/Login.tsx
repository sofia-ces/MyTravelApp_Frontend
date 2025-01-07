import React, { useState } from 'react';
import { login } from '../api/itemsService'; // Import the login function
import '../styles/Login.css';

interface LoginProps {
  onLoginSuccess: (token: string) => void; // Pass token back to App
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(''); // Clear previous errors

    try {
      const data = await login({ email, password });
         if (data['code']==422){
        setLoginError('Invalid username or password.');
           
      }else{
        setLoginError('');
        const { token } = data; // Assuming the API response contains a token
        onLoginSuccess(token); // Pass the token to App
        
      }
    } catch (error: any) {
      setLoginError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
     
      <form onSubmit={handleLogin} className="login-form">
        <div>
        <h1>
        LOGIN <div className="header-icon">✈️ 🌍</div>
      </h1>
          <h4>Username/Email:</h4>
          <input
            type="text"
            id="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <h4>Password:</h4>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {loginError && <p className="error-message">{loginError}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;