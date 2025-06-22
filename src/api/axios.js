import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // Backend URL
});

// Add a request interceptor to attach JWT token to every request if present
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');  // Get token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;  // Attach token as Bearer token
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default instance;
