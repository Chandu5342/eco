
import Navbar from "./Navbar";
import React, { useState } from "react";
import "./Landpage.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Configuration";
import { Link, useNavigate } from "react-router-dom";  // Import useNavigate
import { toast } from 'react-toastify';

function Landingpage() {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const navigate = useNavigate();  // Use useNavigate instead of useHistory

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, Email, Password);
      toast.success("Login Successfully", { position: 'top-center' });

      // Redirect to Challenges page using navigate
      setInterval(() => {
        navigate("/dashboard/Challenges");  // Use navigate instead of history.push
      }, 1000);
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, { position: 'top-center' });
    }
  };

  return (
    <>
      <div className="main">
        <Navbar />
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
    </>
  );
}

export default Landingpage;

