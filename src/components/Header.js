import React, { useState, useEffect } from 'react';
import './Header.css'; // Assuming external CSS
import logo from './logo.jpg';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import { AUTH_EVENTS, clearAuthSession, getAuthSession } from '../utils/auth';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track if user is logged in
  const [username, setUsername] = useState(''); // Store username
  const [showLogout, setShowLogout] = useState(false); // Track if logout popup should be shown
  const navigate = useNavigate(); // Initialize useNavigate
  const location = useLocation();

  useEffect(() => {
    const syncAuthState = () => {
      const session = getAuthSession();
      setIsLoggedIn(Boolean(session.token));
      setUsername(session.userName || session.name || '');
    };

    syncAuthState();
    window.addEventListener(AUTH_EVENTS.changed, syncAuthState);
    window.addEventListener('storage', syncAuthState);

    return () => {
      window.removeEventListener(AUTH_EVENTS.changed, syncAuthState);
      window.removeEventListener('storage', syncAuthState);
    };
  }, [location.pathname]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    clearAuthSession();
    setIsLoggedIn(false); // Set the user as logged out
    setUsername('');
    setShowLogout(false);
    navigate('/'); // Redirect to home page after logout
  };

  const handleUsernameClick = () => {
    setShowLogout(!showLogout);
  };

  const handleDashboardClick = () => {
    setShowLogout(false); // Close the popup
    navigate('/dashboard'); // Navigate to the dashboard
  };

  return (
    <header className="header">
      <div className="logo-section">
        <img src={logo} alt="Logo" className="logo" /> {/* Replace with your logo */}
        <h1 className="site-title">Atmospheric Water Generator</h1>
      </div>
      <nav className={`nav-links ${menuOpen ? 'mobile-menu-open' : ''}`}>
        <Link to="/" className="nav-item">Home</Link>
        {isLoggedIn ? (
          <div className="username-container">
            <div className="username" onClick={handleUsernameClick}>
              {username}
            </div>
            {showLogout && (
              <div className="logout-popup show">
                <button className="logout-button" onClick={handleLogout}>Logout</button>
                <button className="logout-button" onClick={handleDashboardClick}>Dashboard</button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="nav-item">Login</Link>
            <Link to="/signup" className="nav-item">Sign up</Link>
          </>
        )}
        <Link to="/about" className="nav-item">About Us</Link>
        <Link to="/contact" className="nav-item">Contact Us</Link>
        <Link to="/products" className="nav-item">Products</Link>
      </nav>
      <div className="hamburger" onClick={toggleMenu}>
        <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
        <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
        <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
      </div>
    </header>
  );
};

export default Header;
