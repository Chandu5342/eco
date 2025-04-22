import Navbar from "./Navbar";
import React, { useState } from "react";
import "./Landpage.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Configuration";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import recycle from '../images/re1.png';

function Landingpage() {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, Email, Password);
      toast.success("Login Successfully", { position: 'top-center' });
      setTimeout(() => {
        navigate("/dashboard/Challenges");
      }, 1000);
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, { position: 'top-center' });
    }
  };

  return (
    <>
       <div className="wrapper"> {/* Entire full-height container */}
      <div className="left-pane">
       
        <div className="image-wrapper">
          <img src={recycle} alt="Recycle Reward" />
        </div>
      </div>

      <div className="right-pane">
        <div className="login-container">
          <h2>Login</h2>
          <form onSubmit={handleSubmit} method="POST">
            <input
              type="email"
              placeholder="Email"
              required
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
            <p className="create-account">
              Don't have an account? <Link to="/dashboard/Sign">Create Account</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}

export default Landingpage;
