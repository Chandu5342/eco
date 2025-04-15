import Navbar  from "./Navbar"
import "./Landpage.css"
import {auth,db} from '../Configuration'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {getDoc,setDoc,doc} from 'firebase/firestore'
import { useState } from "react";
import { toast } from 'react-toastify';
function Sign()
{
    let [UName,SetUName]=useState("");
    let [Email,SetEmail]=useState("");
    let [Password,SetPassword]=useState("");
    let chck=()=>{
        console.log(chck);
    }
    const handlesubmit=async(e)=>{
        e.preventDefault();
        try{
         await  createUserWithEmailAndPassword(auth,Email,Password)
          const User=auth.currentUser
          console.log(User)
          if(User)
          {
            await setDoc(doc(db, "User", User.uid), {
                username: UName,
                email: Email,
                Role:"no",
            });
          }
          console.log("created successfully");
          toast.success("Created Successfully",{position:'top-center'})
          window.location.href="Challenges"
        }
        catch(error)
        {
           console.log(error.message);
           toast.error(error.message,{position:'top-center'})
         
        }
        
        
    }
    
return (
     <>
    <Navbar></Navbar>
    <div className=""></div>
    <div class="login-container">
        <h2>Sign Up</h2>
        <form onSubmit={handlesubmit}> 
             <input type="text" placeholder="Username" required 
                        value={UName} 
                        onChange={(e) => {SetUName(e.target.value)} } 
                        
                    />
            <input type="email" placeholder="Email" required value={Email} onChange={(e)=>{SetEmail(e.target.value)}}></input>
            <input type="password" placeholder="Password" required value={Password} onChange={(e)=>{SetPassword(e.target.value)}}></input>
            <button >Create Account</button>

            <p class="create-account">Already have an account? Login</p>
        </form>
    </div>

</>
)
}
export default Sign