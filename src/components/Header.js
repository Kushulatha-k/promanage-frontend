import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // clear user and token
    navigate('/login'); // redirect to login page
  };

  return (
    <header style={{ padding: '10px', backgroundColor: '#eee' }}>
      <nav>
        {/* Your existing nav links */}
        {user ? (
          <>
            <span>Welcome, {user.name}</span>
            <button onClick={handleLogout} style={{ marginLeft: '10px' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            {/* Show login/register links if user is not logged in */}
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
