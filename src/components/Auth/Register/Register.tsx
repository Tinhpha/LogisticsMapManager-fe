import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../../services/authService';
import logo from '../../../assets/logo.svg';
import './Register.css';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🖱️ Register button clicked');

    // Validate empty fields
    const emptyFields = Object.entries(formData)
      .filter(([_, value]) => !value.trim())
      .map(([key]) => key);

    if (emptyFields.length > 0) {
      const message = `Please fill in the following fields: ${emptyFields.join(', ')}`;
      console.error('❌ Validation error:', message);
      setError(message);
      return;
    }

    setError(null);
    setIsLoading(true);
    console.log('⏳ Setting loading state...');

    try {
      console.log('📝 Attempting registration for user:', formData.username);
      await AuthService.register(formData);
      console.log('✅ Registration successful');
      alert('Registration completed successfully!');
      navigate('/login');
    } catch (error) {
      console.error('❌ Registration error:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Registration failed');
      }
    } finally {
      console.log('🏁 Resetting loading state');
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    console.log('👈 Navigating back to login');
    navigate('/login');
  };

  return (
    <div className="register-container">
      <div className="register-form-container">
        <form onSubmit={handleSubmit} className="register-form">
          <div className="brand-container">
            <img src={logo} alt="Logistics Manager Logo" className="logo" />
            <h1 className="form-title">Logistics Manager</h1>
          </div>
          <p className="form-subtitle">Create your account</p>

          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-container">
              <i className="fa fa-user input-icon"></i>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter a username"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-container">
              <i className="fa fa-envelope input-icon"></i>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="full_name">Full Name</label>
            <div className="input-container">
              <i className="fa fa-id-card input-icon"></i>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Enter your full name"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="button-group">
            <button
              type="button"
              onClick={handleBack}
              className="back-button"
              disabled={isLoading}
            >
              <i className="fa fa-arrow-left"></i>
              
            </button>
            <button
              type="submit"
              className="register-button"
              disabled={isLoading}
            >
              <i className="fa fa-user-plus"></i>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;