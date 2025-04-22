import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-container">
      <nav className="navbar">
        <div className="logo">TaskMaster</div>
        <div className="nav-links">
          <button className="nav-btn">Login</button>
          <button className="nav-btn">Sign Up</button>
        </div>
      </nav>

      <main className="main-content">
        <h1>Welcome to TaskMaster</h1>
        <p>Organize your life with smart task tracking.</p>
        <Link to="/tasks">
          <button className="cta-button">Get Started</button>
        </Link>
      </main>
    </div>
  );
}

export default LandingPage;
