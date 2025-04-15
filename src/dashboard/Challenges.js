import Navbar from "./Navbar";
import Card from "./Card";
import React, { useEffect, useState } from "react";
import "./Challenges.css"
import { Link } from "react-router-dom";
import Footer from "./Footer";
import Foot from "./Foot";
import { addDoc, collection, getDocs, query,deleteDoc, doc, updateDoc ,getDoc,setDoc} from "firebase/firestore";
import { auth ,db} from "../Configuration";

function Challenges() {
    const [ChallengeList, setChallengeList] = useState([]);
      const dbChallenge = collection(db, 'Challenges');
    const LoadChallengesList = async () => {
        const res = await getDocs(query(dbChallenge))
        const CList = res.docs.map(doc => ({
            ChallengeName: doc.data().ChallengeModel.ChallengeName,
            Type: doc.data().ChallengeModel.Type,
            Point: doc.data().ChallengeModel.Point,
            Id: doc.id
        }));
        setChallengeList(CList);
      console.log(ChallengeList)
    }
    useEffect(() => {
        LoadChallengesList();
    }, [])
    return (
        <>
            <Navbar></Navbar>

            <div class="role-mode-container">
                <Link to="/Rolemodel/Rolemode">
                    <button className="role-mode-btn">Role Mode</button>
                </Link>
            </div>
            <div className="challengesarea">
                <div className="makeup">

                </div>
                <div className="challenges-container">
                    <h2 style={{ color: "white", textAlign: "center" }}>Your Challenges</h2>
                    {ChallengeList.map((item, index) => (
                        <Card 
                        key={item.Id} 
                        name={item.ChallengeName}
                        Type={item.Type} 
                        Point={item.Point} />
                    ))}
                  
                </div>
            </div>

            <br></br><br></br>

        </>
    );
}
export default Challenges