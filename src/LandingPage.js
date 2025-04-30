import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-container">
      <main className="main-content">
        <h1>Welcome to TaskMaster</h1>
        <p>Organize your life with smart task tracking.</p>
        <Link to="/login">
          <button className="cta-button">Login</button>
        </Link>
      </main>
    </div>
  );
}

export default LandingPage;
