import React from "react";
import "./Rewards.css"; // Make sure to import the CSS
import Travel from '../images/travel.png'
import Tree from '../images/tree.png'
import Pic from '../images/pic.png'
import Movie from '../images/movie.png'
import tendis from '../images/tendis.png'
import straw from '../images/straw.png'
import gift from '../images/gift.png'
import sticker from '../images/sticker.png'
import snack from '../images/snack.png'
import cup from '../images/cup.png'
import note from '../images/note.png'
import badge from '../images/badge (1).png'
import Navbar from "./Navbar";
const imageMap = {
  Travel,
};
const rewardsData = [
  {
    img:sticker,
    title: "Eco Sticker Pack",
    points: "50 pts",
  },
  {
    img: straw,
    title: "Reusuable Straw Set",
    points: "35 pts",
  },
  {
    img: Tree,
    title: "Tree Planting in Your Name",
    points: "70 pts",
  },
  {
    img:note,
    title: "Recycled Paper Notebook",
    points: "150 pts",
  },
  {
    img: badge,
    title: "Eco Hero Badge + bonus points (6000)",
    points: "5000 pts",
  },
  {
    img: Travel,
    title: "Travel Refill Bottle Set",
    points: "200 pts",
  },
  {
    img: tendis,
    title: "45% Discount Coupon (Amazon, Flipkart, Swiggy, Zomato)",
    points: "1000 pts",
  },
  {
    img:  Pic,
    title: "Eco Branded Water Bottle",
    points: "500 pts",
  },
  {
    img: snack,
    title: "Organic Snacks Box",
    points: "600 pts",
  },
  {
    img: cup,
    title: "Cup (Eco-Friendly Product)",
    points: "250 pts",
  },
  {
    img: Movie,
    title: "Movie Ticket (1) Gift Voucher",
    points: "1000 pts",
  },
  {
    img:gift,
    title: "₹500 Gift Card (Amazon, Myntra, Swiggy)",
    points: "10000 pts",
  },
];

const Rewards = () => {
  return (
    <>
    <Navbar></Navbar>
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
    </>
  );
};

export default Rewards;
