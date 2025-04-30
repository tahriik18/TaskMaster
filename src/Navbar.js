// src/Navbar.js
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Optional: Clear user session or token here
    navigate('/');
  };

  const isTasksPage = location.pathname === '/tasks';

  return (
    <nav className="navbar">
      <div className="navbar-logo">TaskMaster</div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        {isTasksPage ? (
          <button onClick={handleLogout} className="logout-button">Logout</button>
        ) : (
          <Link to="/signup">Sign Up</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
