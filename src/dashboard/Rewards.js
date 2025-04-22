import React from "react";
import "./Rewards.css"; // Make sure to import the CSS

const rewardsData = [
  {
    img: "sticker.png",
    title: "Eco Sticker Pack",
    points: "50 pts",
  },
  {
    img: "straw.png",
    title: "Reusuable Straw Set",
    points: "35 pts",
  },
  {
    img: "tree.png",
    title: "Tree Planting in Your Name",
    points: "70 pts",
  },
  {
    img: "note.png",
    title: "Recycled Paper Notebook",
    points: "150 pts",
  },
  {
    img: "badge.png",
    title: "Eco Hero Badge + bonus points (6000)",
    points: "5000 pts",
  },
  {
    img: "travel.png",
    title: "Travel Refill Bottle Set",
    points: "200 pts",
  },
  {
    img: "tendis.png",
    title: "45% Discount Coupon (Amazon, Flipkart, Swiggy, Zomato)",
    points: "1000 pts",
  },
  {
    img: "pic.png",
    title: "Eco Branded Water Bottle",
    points: "500 pts",
  },
  {
    img: "snack.png",
    title: "Organic Snacks Box",
    points: "600 pts",
  },
  {
    img: "cup.png",
    title: "Cup (Eco-Friendly Product)",
    points: "250 pts",
  },
  {
    img: "movie.png",
    title: "Movie Ticket (1) Gift Voucher",
    points: "1000 pts",
  },
  {
    img: "gift.png",
    title: "₹500 Gift Card (Amazon, Myntra, Swiggy)",
    points: "10000 pts",
  },
];

const Rewards = () => {
  return (
    <div className="rewards-page">
      <div className="containerss">
        <div className="header">
          <h1>Rewards Store</h1>
        </div>

        <div className="points">Points: 105</div>

        <div className="grid-wrapper">
          <div className="grid">
            {rewardsData.map((reward, index) => (
              <div className="card" key={index}>
                <img src={reward.img} alt={reward.title} />
                <h3>
                  {reward.title}
                  <strong>{reward.points}</strong>
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rewards;
