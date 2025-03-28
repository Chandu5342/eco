import Navbar from "./Navbar";
import Card from "./Card";
import React from "react";
import "./Challenges.css"
import { Link } from "react-router-dom";
import Footer from "./Footer";
import Foot from "./Foot";

function Challenges()
{
    return(
        <>
        <Navbar></Navbar>
        
   <div class="role-mode-container">
      <Link to="/Rolemodel/Rolemode">
    <button className="role-mode-btn">Role Mode</button>
</Link>
    </div>

    <div class="challenges-container">
        
        <Card></Card>
        <Card></Card>
        <Card></Card>
    </div>
    <br></br><br></br>
    <Foot></Foot>

</>
    );
}
export default Challenges