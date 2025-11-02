import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { auth } from "../Configuration";
import './Navbar.css';

import appLogo from '../images/applog1.png';        // ✅ replace with your logo file
import collegeLogo from '../images/vig.png'; // ✅ replace with your college logo

function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  async function Logout() {
    try {
      await auth.signOut();
      console.log("User Logout Successfully");
      window.location.href = "/";
    } catch (error) {
      console.log("error.message");
    }
  }

  return (
    <div className="container header-container">
      <div className="logo-container">
        <img src={appLogo} alt="App Logo" className="app-logo" />
        <h1 className="logo">EcoRecyclr</h1>
      </div>
      <nav>
        <ul className="nav-list">
          <li><a href="/">Home</a></li>
          <li><a href="/dashboard/challenges">Challenges</a></li>
          <li><a href="/dashboard/rewards">Rewards</a></li>
          <li><a href="/dashboard/HIW">How It Works</a></li>
          <li><a href="/dashboard/contact">Contact</a></li>
        

          <div className="profile-dropdown">
            <FaUserCircle size={28} onClick={toggleDropdown} className="profile-icon" />
            <img src={collegeLogo} alt="College Logo" className="college-logo" />
            {showDropdown && (
              <div className="dropdown-menu">
                <a href="/dashboard/Profile">My Profile</a>
                <a onClick={Logout}>Logout</a>
              </div>
            )}
          </div>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
