import Navbar  from "./Navbar"
import "./Landpage.css"
import { useState } from "react";
function Sign()
{
    let [UName,SetUName]=useState("");
    let [Email,SetEmail]=useState("");
    let [Password,SetPassword]=useState("l");
    let chck=()=>{
        console.log(chck);
    }
    function handlesubmit(){
        console.log(UName,Email,Password)
        window.location.href="Challenges"
    }
    
return (
     <>
    <Navbar></Navbar>
    <div className=""></div>
    <div class="login-container">
        <h2>Sign Up</h2>
        <form>
             <input type="text" placeholder="Username" required 
                        value={UName} 
                        onChange={(e) => {SetUName(e.target.value)} } 
                        
                    />
            <input type="email" placeholder="Email" required value={Email} onChange={(e)=>{SetEmail(e.target.value)}}></input>
            <input type="password" placeholder="Password" required value={Password} onChange={(e)=>{SetPassword(e.target.value)}}></input>
            <button  onClick={handlesubmit}>Create Account</button>

            <p class="create-account">Already have an account? Login</p>
        </form>
    </div>

</>
)
}
export default Sign