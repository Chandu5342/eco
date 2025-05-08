// Card.js
import React  from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Card.css';
import glass from '../images/glass.png';
import plastic from '../images/bag.png';
import Metals from '../images/metal.png';
import Bottles from '../images/bottle.png'
function Card({ name, Type, Point, progress, challengeId, userId, targetQuantity, userProgress, image }) {
  const progressPercentage = targetQuantity > 0 ? (userProgress / targetQuantity) * 100 : 0;
  const navigate = useNavigate();  
console.log("typsdfffffffffffffe",Type)
 let {img}=`${image}`
 const handleGetChallenge = () => {
  navigate(`/dashboard/Verification/${challengeId}/${userId}`);  // Redirects to the verification page with challengeId and userId
};
  const imageMap = {
    glass,
    plastic,
    metals: Metals,
    bottles: Bottles,
    'plastic cover': plastic, // if you want to reuse the plastic image

  };
  
  return (
    <div className="fancy-card">
      <div className="icon-circle">
      <img src={imageMap[Type.toLowerCase()]} alt={`${name} icon`} />
      </div>
      <h3 className="title">{name}</h3>
      <div className="type-badge">{Type}</div>
      <div className="type-badge">{progress}</div>
      <p className="reward">Reward: <strong>{Point} pts</strong></p>
   
      {progress === "in-progress" && (
        <div className="progress-bar-wrapper">
          <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      )}

      <button className="get-btn" onClick={handleGetChallenge}>
        Get Challenge
      </button>
    </div>
  );
}

export default Card;
