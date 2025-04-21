import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import './Navbar.css'; // assuming you have styles here

function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="container header-container">
      <h1 className="logo">EcoRecyclr</h1>
      <nav>
        <ul className="nav-list">
          <li><a href="#">Home</a></li>
          <li><a href="#">Challenges</a></li>
          <li><a href="#">Rewards</a></li>
          <li><a href="/dashboard/HIW">How It Works</a></li>
          <li><a href="#">Contact</a></li>
          <div className="profile-dropdown">
            <FaUserCircle size={28} onClick={toggleDropdown} className="profile-icon" />
            {showDropdown && (
              <div className="dropdown-menu">
                <a href="/dashboard/Profile">My Profile</a>
                <a href="/logout">Logout</a>
              </div>
            )}
          </div>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
