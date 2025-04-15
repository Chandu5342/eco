import React from "react";
function Card({name,Type,Point})
{
    return(
          
        <div class="challenge-card">
            <h3 class="challenge-title">{name}</h3>
            <p><strong>{Type}</strong></p>
            <p><strong>Reward:</strong> {Point} Eco Points</p>
            <button class="challenge-btn">Get Challenge</button>
        </div>
    );
}
export default Card