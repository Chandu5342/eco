import React, { useEffect, useState } from "react";
import "./RewardJourney.css";
import Navbar from "./Navbar";
import { db, auth } from "../Configuration";
import { getDocs,doc,getDoc, query, collection, where } from "firebase/firestore";
import { toast } from "react-toastify";
import { Await, Link,useNavigate } from 'react-router-dom'
import glass from '../images/glass.png';
import plastic from '../images/bag.png';
import Metals from '../images/metal.png';
import Bottles from '../images/bottle.png'
import Ewaste from '../images/ew.png'
import Loader from "../Loader";

const RewardJourney = () => {
    const [ChallengeList, setChallengeList] = useState([]);
    const [userChallenges, setUserChallenges] = useState([]);
    const [typeMap, setTypeMap] = useState({});
     const [loading, setLoading] = useState(true); 
    const [teMap, setteMap] = useState({});
    const [activeTab, setActiveTab] = useState("All");
    const [selectedType, setSelectedType] = useState("All");

    const navigate = useNavigate();  
    const imageMap = {
        glass,
        plastic,
        metals: Metals,
        bottles: Bottles,
        'plastic cover': plastic,
        ewaste : Ewaste, // if you want to reuse the plastic image
      };
       const [UserModel, setUserModel] = useState({
              Id: "0",
              userName: "",
              email: "",
              Phno:"",
              Address:"",
              Points: 0,
              Role:""
             
          });
    useEffect(() => {
        const loadAll = async () => {
            await fetchChallengeTypes();
            await fetchChallenges();
            await fetchUserChallenges();
            await fetchUserDetails();
        };
        loadAll();
    }, []);

    const fetchChallengeTypes = async () => {
        try {
            const typeQuery = query(collection(db, "ChallengeType"));
            const typeSnapshot = await getDocs(typeQuery);
            const map = {};
            const tmap = {};
            typeSnapshot.forEach((doc) => {
                map[doc.id] = doc.data().ChallengeTypeModel.ChallengeTypeName;
                tmap[doc.id] = doc.data().ChallengeTypeModel.ImgUrl;
            });
            setTypeMap(map);
            setteMap(tmap);
        } catch (error) {
            toast.error("Error fetching challenge types.");
        }
    };

    const fetchChallenges = async () => {
        try {
            const challengeQuery = query(collection(db, "Challenges"));
            const challengeSnapshot = await getDocs(challengeQuery);
            const challenges = challengeSnapshot.docs.map((doc) => ({
                Id: doc.id,
                ChallengeName: doc.data().name,
                Type: doc.data().type,
                Point: doc.data().points,
                TargetQuantity: parseInt(doc.data().targetQuantity),
            }));
            setChallengeList(challenges);
        } catch (error) {
            toast.error("Error fetching challenges.");
        }
    };

    const fetchUserChallenges = async () => {
        try {
            const userId = auth.currentUser.uid;

            
            const userChallengeQuery = query(
                collection(db, "UserRewards"),
                where("userId", "==", userId)
            );
            const userChallengeSnapshot = await getDocs(userChallengeQuery);
            const userChallengesData = userChallengeSnapshot.docs.map((doc) =>
                doc.data()
            );
            setUserChallenges(userChallengesData);
        } catch (error) {
            toast.error("Error fetching user progress.");
        }
        setLoading(false);
    };
     
    const filteredChallenges = ChallengeList.filter((challenge) => {
        const userProgress = userChallenges.find(
            (uc) => uc.challengeId === challenge.Id
        );
        const status = userProgress ? userProgress.status : "Not Attempted";
        const matchesTab =
            activeTab === "All" || status.toLowerCase() === activeTab.toLowerCase();
        const matchesType =
            selectedType === "All" || typeMap[challenge.Type] === selectedType;
        return matchesTab && matchesType;
    });
    const handleGetChallenge = (cid,uid) => {
        navigate(`/dashboard/Verification/${cid}/${uid}`);  // Redirects to the verification page with challengeId and userId
      };

     const fetchUserDetails = async () => {
            try {
                const userDocRef = doc(db, "User", auth.currentUser.uid);
                const userDoc = await getDoc(userDocRef);
    
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUserModel({
                        Id: auth.currentUser.uid,
                        username: userData.username,
                        email: userData.email,
                        Phno:userData.Phno,
                        Address:userData.Address,
                        Role: userData.Role || "no",
                        Points: userData.Points || 0,
                    });
    
                   
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching user data: ", error);
            }
        };
    return (
        <>
            <Navbar />
            
            <div className="reward-container">
            {UserModel.Role === "yes" && (
                 <div className="role-mode-container">
                 <Link to="/Rolemodel/Rolemode">
                     <button className="role-mode-btn">Role Mode</button>
                 </Link>
             </div>
            )}
            
           
                <div className="reward-card desktop">
                    <div className="reward-header">
                        <h2>Challenges</h2>
                        <div className="reward-icon">🌱</div>
                    </div>

                    {/* Tabs */}
                    <div className="reward-tabs">
                        {["All", "Completed", "In Progress", "Expired"].map((tab) => (
                            <button
                                key={tab}
                                className={activeTab === tab ? "active-tab" : ""}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Dropdown filter */}
                    <div className="reward-dropdown-container">
                        <select
                            className="reward-dropdown"
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                        >
                            <option value="All">All Types</option>
                            {Object.values(typeMap).map((typeName, index) => (
                                <option key={index} value={typeName}>
                                    {typeName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Filtered Challenge Cards */}
                    <div className="reward-list">
                        
                        {filteredChallenges.map((item) => {
                            const userProgress = userChallenges.find(
                                (uc) => uc.challengeId === item.Id
                            );
                            const progressStatus = userProgress
                                ? userProgress.status
                                : "Not Attempted";
                            const emoji = progressStatus === "Completed"
                                ? "✅"
                                : progressStatus === "in-Progress"
                                    ? "🕒"
                                    : progressStatus === "Expired"
                                        ? "❌"
                                        : "🧩";
                            const typeName = typeMap[item.Type] || "Unknown Type";
                            const icon = progressStatus === "Completed"
                                ? "✅"
                                : progressStatus === "in-Progress"
                                    ? "🕒"
                                    : progressStatus === "Expired"
                                        ? "❌"
                                        : "🧩";
                                //let url=teMap[typeName];
                            
                              

                            return (
                                <div key={item.Id} className="reward-item">
                                  <img className="emoji" src={imageMap[typeName.toLowerCase()]} alt={`${item.ChallengeName} icon`} />
                                    {/* <div className="emoji">{emoji}</div> */}
                                    <div className="reward-details">
                                        <h2>{`${item.ChallengeName}(${item.Point} pts)`}</h2>
                                        {/* <div className="title">{item.ChallengeName}</div> */}
                                        <button className="points" onClick={()=>{handleGetChallenge(item.Id,auth.currentUser.uid)}} >Get Challenge </button>
                                       
                                        {(progressStatus != "Not Attempted" ) && userProgress ? (
                                            
                                            <>
                                                <div className="date">
                                                    Progress: {userProgress.progress}/{item.TargetQuantity}
                                                </div>
                                                <div className="progress-bar-container">
                                                    <div
                                                        className="progress-bar-fill"
                                                        style={{
                                                            width: `${Math.min(
                                                                (userProgress.progress/ item.TargetQuantity)*100,
                                                                100
                                                            )}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="date">
                                                    Progress: {0}/{item.TargetQuantity}
                                                </div>
                                                <div className="progress-bar-container">
                                                    <div
                                                        className="progress-bar-fill"
                                                        style={{
                                                            width: `${Math.min(
                                                                (0 / item.TargetQuantity) * 100,
                                                                100
                                                            )}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className="reward-status">
                                        <div className={`status ${progressStatus.toLowerCase().replace(" ", "-")}`}>
                                            {progressStatus}
                                        </div>
                                        <div className="date">Target: {item.TargetQuantity}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Trophy shelf & leaderboard */}
                    <div className="reward-shelf">
                        <div className="trophy">🏆</div>
                        <div className="trophy">🎖️</div>
                        <div className="trophy">🎗️</div>
                    </div>
                    {loading && (
                             <Loader></Loader>
                        )}

                </div>
            </div>
        </>
    );
};

export default RewardJourney;
