import Navbar from "./Navbar";
import "./Landpage.css"; // using same CSS as Landingpage
import { auth, db } from '../Configuration';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getDoc, setDoc, doc } from 'firebase/firestore';
import { useState } from "react";
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import recycle from '../images/re1.png';

function Sign() {
    let [UName, SetUName] = useState("");
    let [Email, SetEmail] = useState("");
    let [Password, SetPassword] = useState("");

    const handlesubmit = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, Email, Password);
            const User = auth.currentUser;
            if (User) {
                await setDoc(doc(db, "User", User.uid), {
                    username: UName,
                    email: Email,
                    Role: "no",
                });
            }
            toast.success("Created Successfully", { position: 'top-center' });
            window.location.href = "Challenges";
        } catch (error) {
            console.log(error.message);
            toast.error(error.message, { position: 'top-center' });
        }
    };

    return (
        <>
            <div className="wrapper"> {/* Consistent layout */}
                <div className="left-pane">
                    
                    <div className="image-wrapper">
                        <img src={recycle} alt="Recycle Reward" />
                    </div>
                </div>

                <div className="right-pane">
                    <div className="login-container">
                        <h2>Sign Up</h2>
                        <form onSubmit={handlesubmit}>
                            <input
                                type="text"
                                placeholder="Username"
                                required
                                value={UName}
                                onChange={(e) => SetUName(e.target.value)}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                required
                                value={Email}
                                onChange={(e) => SetEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                required
                                value={Password}
                                onChange={(e) => SetPassword(e.target.value)}
                            />
                            <button type="submit">Create Account</button>
                            <p className="create-account">
                                Already have an account? <Link to="/dashboard/LandingPage">Login</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Sign;
