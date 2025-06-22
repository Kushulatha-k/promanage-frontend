import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://promanage-backend-1-9jk7.onrender.com/', // Backend URL
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
