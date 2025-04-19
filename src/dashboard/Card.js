import React from "react";
import { useNavigate } from 'react-router-dom';  // Importing useNavigate for navigation
import './Card.css'

function Card({ name, Type, Point, progress, challengeId, userId, targetQuantity, userProgress }) {
  const navigate = useNavigate();  // Hook to navigate programmatically

  // Function to handle the button click and navigate to the verification page
  const handleGetChallenge = () => {
    navigate(`/dashboard/Verification/${challengeId}/${userId}`);  // Redirects to the verification page with challengeId and userId
  };

  // Calculate progress percentage if progress is in progress
  const progressPercentage = targetQuantity > 0 ? (userProgress / targetQuantity) * 100 : 0;

  console.log(`Challenge: ${name},progress: ${progress}, Progress: ${userProgress}, Target: ${targetQuantity}, Progress Percentage: ${progressPercentage}`); // Debug progress

  return (
    <div className="challenge-card">
      <h3 className="challenge-title">{name}</h3>
      <p><strong>{Type}</strong></p>
      <p><strong>Reward:</strong> {Point} Eco Points</p>
      <p><strong>Status:</strong> {progress}</p> {/* Shows Completed/In Progress/etc */}

      {/* Display progress bar only if the challenge is in progress */}
      {progress === "in-progress" && (
        <div className="progress-container">
          <div
            className="progress-bar"
            style={{ width: `${progressPercentage}%`, transition: 'width 0.3s ease' }}
          ></div>
          <p>{Math.round(progressPercentage)}% Completed</p>
        </div>
      )}

      <button className="challenge-btn" onClick={handleGetChallenge}>
        Get Challenge
      </button>
    </div>
  );
}

export default Card;
