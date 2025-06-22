import React, { useState, useContext } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState(''); // to display error messages

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); // reset error before submit
    try {
      await axios.post('/auth/register', formData);
      // After registration, auto-login user
      const res = await axios.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });
      login(res.data.user, res.data.token);
      navigate('/tasks');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Show error message */}
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ marginBottom: '10px', display: 'block', width: '300px' }}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ marginBottom: '10px', display: 'block', width: '300px' }}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ marginBottom: '10px', display: 'block', width: '300px' }}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
