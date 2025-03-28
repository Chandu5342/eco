import Navbar from "./Navbar";
import "./Landpage.css"
import { Link } from "react-router-dom";
function Landingpage()
{
   return(
    <>
    <div className="main">
      <Navbar></Navbar>
      <div class="login-container">
        <h2>Login</h2>
        <form>
            <input type="email" placeholder="Email" required></input>
            <input type="password" placeholder="Password" required></input>
            <button onclick="window.location.href='challenge.html';">Login</button>
            <p class="create-account">Don't have an account? <Link to="/dashboard/Sign">Create Account</Link></p>

        </form>
    </div>
    </div>
   </>

   );
}
export default Landingpage
         