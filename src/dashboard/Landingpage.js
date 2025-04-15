import Navbar from "./Navbar";
import React, { useState } from "react"
import "./Landpage.css"
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Configuration";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
function Landingpage()
{
  const [Email,setEmail]=useState("")
  const [Password,setPassword]=useState("") 
  const handleSubmit=async (e)=>{
    console.log("")
   // console.log(Email,Password);
    e.preventDefault();
    try{
       await signInWithEmailAndPassword(auth,Email,Password);
        console.log("created successfully");
         toast.success("Login Successfully",{position:'top-center'})
         setInterval(() => {
              window.location.href="Challenges";
         }, 1000);
       
    }
    catch(error)
    {
           console.log(error.message);
         toast.error(error.message,{position:'top-center'})
    }
};
   return(
    <>
    <div className="main">
      <Navbar></Navbar>
      <div class="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} method="POST">
            <input type="email" placeholder="Email" required value={Email} onChange={(e)=>setEmail(e.target.value)}></input>
            <input type="password" placeholder="Password" required  value={Password} onChange={(e)=>setPassword(e.target.value)}></input>
            <button>Login</button>
            <p class="create-account">Don't have an account? <Link to="/dashboard/Sign">Create Account</Link></p>

        </form>
    </div>
    </div>
   </>

   );
}
export default Landingpage
         