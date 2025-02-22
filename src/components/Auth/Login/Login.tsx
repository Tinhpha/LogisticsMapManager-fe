import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../../services/authService';
import UserService from '../../../services/userService';
import logo from '../../../assets/logo.svg';
import './Login.css';
import { toast } from 'react-toastify';

interface LoginProps {
  onLogin: (response: { user: { username: string; roles: string[] } }) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🖱️ Login button clicked');
    
    setError(null);
    setIsLoading(true);
    console.log('⏳ Setting loading state...');

    try {
      console.log('🔒 Attempting login for user:', username);
      await AuthService.login({ username, password });
      
      // Fetch user info after successful login
      console.log('🔍 Fetching user info');
      const userInfo = await UserService.getCurrentUser();
      
      console.log('✨ Login successful');
      onLogin({ 
        user: { 
          username: userInfo.username,
          roles: userInfo.roles
        } 
      });
    } catch (error) {
      console.error('❌ Login component error:', error);
      setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      console.log('🏁 Resetting loading state');
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    console.log('📝 Navigating to register page');
    navigate('/register');
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <form onSubmit={handleSubmit} className="login-form">
          <div className="brand-container">
            <img src={logo} alt="Logistics Manager Logo" className="logo" />
            <h1 className="form-title">Logistics Manager</h1>
          </div>
          <p className="form-subtitle">Please sign in to continue</p>

          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-container">
              <i className="fa fa-user input-icon"></i>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => {
                  console.log('📝 Username changed:', e.target.value);
                  setUsername(e.target.value);
                }}
                required
                placeholder="Enter your username"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-container">
              <i className="fa fa-lock input-icon"></i>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  console.log('🔒 Password changed:', e.target.value);
                  setPassword(e.target.value);
                }}
                required
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="button-group">
            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              <i className="fas fa-sign-in-alt"></i>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
            <button
              type="button"
              className="register-button"
              onClick={handleRegister}
              disabled={isLoading}
            >
              <i className="fa fa-user-plus"></i> Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;