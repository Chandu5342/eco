import React from 'react';
import './HIW.css';
import hw1 from '../images/hw-3.png';
import hw2 from '../images/loc.png';
import hw3 from '../images/v3.png';
import hw4 from '../images/hw-1.png';
import Navbar from './Navbar';

const HIW = () => {
  return (
    <>    <Navbar></Navbar>
    <div className="hiw-container">
      <h1 className="hiw-title">How It Works</h1>
      <p className="hiw-description">
        Join the movement to recycle smarter! Complete challenges, verify your actions, and earn rewards.
      </p>

      <div className="hiw-steps">
        <div className="hiw-step">
          <img src={hw1} alt="Scan QR Code" />
          <div className="hiw-step-title">Scan the QR Code</div>
          <div className="hiw-step-desc">
            Find a recycling bin with our QR code and scan it using the app.
          </div>
        </div>

        <div className="hiw-step">
          <img src={hw2} alt="Verify Location" />
          <div className="hiw-step-title">Verify Your Location</div>
          <div className="hiw-step-desc">
            We check your GPS to make sure you’re at an approved recycling site.
          </div>
        </div>

        <div className="hiw-step">
          <img src={hw3} alt="Upload Photo" />
          <div className="hiw-step-title">Take or Upload a Photo</div>
          <div className="hiw-step-desc">
            Capture a photo of the item you’re recycling.
          </div>
        </div>

        <div className="hiw-step">
          <img src={hw4} alt="Earn Rewards" />
          <div className="hiw-step-title">Earn Rewards!</div>
          <div className="hiw-step-desc">
            Complete challenges, earn points, and unlock rewards.
          </div>
        </div>
      </div>

      <div className="hiw-why">
        <h2>Why Should You Participate?</h2>
        <p>
          Recycling helps reduce waste and protect the environment. With our app, your actions are verified and rewarded
          to encourage better habits. Let’s make an impact together!
        </p>
        <a href='/dashboard/challenges'><button className="hiw-btn">Start a Challenge</button></a>
      </div>
    </div>
    </>

  );
};

export default HIW;
