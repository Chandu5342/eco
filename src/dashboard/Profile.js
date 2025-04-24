import React, { useEffect, useState } from "react";
import "./Profile.css"; // Move styles from <style> into this file
import ChallengeActivityTabs from "./ChallengeActivityTabs";
import { auth, db } from '../Configuration';
import { getDoc, setDoc, doc, getDocs, collection, query, where } from 'firebase/firestore';
import Navbar from "./Navbar";
import Loader from "../Loader";

const Profile = () => {
    const [ChallengeTypeModel, setChallengeTypeModel] = useState([{
        Id: "0",
        ChallengeTypeName: "",
        AvailableCount: "",
        YourCount: ""
    }]);
    const [UserModel, setUserModel] = useState({
        Id: "0",
        userName: "",
        email: "",
        Phno:"",
        Address:"",
        Points: 0,
      
    });

    const [isEditing, setIsEditing] = useState(false);

    const [loading, setLoading] = useState(true); // Loading state for the entire data fetch

    const fetchChallengeTypes = async () => {
        try {
            // Fetching challenge types
            const challengeTypesRef = collection(db, "ChallengeType");
            const querySnapshot = await getDocs(challengeTypesRef);
            const challengeTypesList = [];

            querySnapshot.forEach((doc) => {
                const challengeData = doc.data();
                challengeTypesList.push({
                    Id: doc.id,
                    ChallengeTypeName: challengeData.ChallengeTypeModel.ChallengeTypeName,
                });
            });

            // Now fetch counts and data
            await fetchChallengeTypesWithCounts();
            await calculateYourCounts(UserModel.Id);

            // Set fetched challenge types to state
            setChallengeTypeModel(challengeTypesList);

            // Finally set loading to false when all data is fetched
            setLoading(false);
        } catch (error) {
            console.error("Error fetching challenge types:", error);
        }
    };


    const calculateYourCounts = async (userId) => {
        try {
            const userRewardsRef = collection(db, "UserRewards");
            const q = query(userRewardsRef, where("userId", "==", userId), where("status", "==", "completed"));
            const userRewardsSnap = await getDocs(q);

            const challengeTypeCountMap = {};

            for (const docSnap of userRewardsSnap.docs) {
                const rewardData = docSnap.data();
                const challengeId = rewardData.challengeId;

                if (!challengeId) {
                    continue;
                }

                const challengeDocRef = doc(db, "Challenges", challengeId);
                const challengeDoc = await getDoc(challengeDocRef);

                if (!challengeDoc.exists()) {
                    continue;
                }

                const challengeData = challengeDoc.data();
                const challengeTypeId = challengeData.type;

                if (challengeTypeId) {
                    if (!challengeTypeCountMap[challengeTypeId]) {
                        challengeTypeCountMap[challengeTypeId] = 1;
                    } else {
                        challengeTypeCountMap[challengeTypeId] += 1;
                    }
                }
            }

            setChallengeTypeModel((prevChallengeTypes) =>
                prevChallengeTypes.map((ct) => ({
                    ...ct,
                    YourCount: challengeTypeCountMap[ct.Id] || 0
                }))
            );
        } catch (error) {
            console.error("Error calculating YourCounts:", error);
        }
    };

    const fetchChallengeTypesWithCounts = async () => {
        try {
            const challengeTypesRef = collection(db, "ChallengeType");
            const challengeTypeSnapshot = await getDocs(challengeTypesRef);

            const challengeTypesWithCounts = [];

            for (const docSnap of challengeTypeSnapshot.docs) {
                const challengeTypeData = docSnap.data();
                const challengeTypeId = docSnap.id;

                const challengesRef = collection(db, "Challenges");
                const q = query(challengesRef, where("type", "==", challengeTypeId));
                const challengesSnapshot = await getDocs(q);
                const availableCount = challengesSnapshot.size;

                challengeTypesWithCounts.push({
                    Id: challengeTypeId,
                    ChallengeTypeName: challengeTypeData.ChallengeTypeModel.ChallengeTypeName,
                    AvailableCount: availableCount,
                    YourCount: "", // Will be added later
                });
            }

            setChallengeTypeModel(challengeTypesWithCounts);
        } catch (error) {
            console.error("Error fetching challenge types with counts:", error);
        }
    };

    const calculateUserPoints = async (userId) => {
        try {
            const userRewardsRef = collection(db, "UserRewards");
            const q = query(userRewardsRef, where("userId", "==", userId));
            const querySnapshot = await getDocs(q);

            let totalPoints = 0;

            querySnapshot.forEach((doc) => {
                const rewardData = doc.data();
                if (rewardData.pointsAwarded) {
                    totalPoints += rewardData.pointsAwarded;
                }
            });

            setUserModel((prevState) => ({
                ...prevState,
                Points: totalPoints
            }));
        } catch (error) {
            console.error("Error fetching user rewards:", error);
        }
    };

    const fetchUserDetails = async (userId) => {
        try {
            const userDocRef = doc(db, "User", userId);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                setUserModel({
                    Id: userId,
                    username: userData.username,
                    email: userData.email,
                    Phno:userData.Phno,
                    Address:userData.Address,
                    Role: userData.Role || "no",
                    Points: userData.Points || 0,
                });

                await calculateUserPoints(userId);
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error fetching user data: ", error);
        }
    };

    const fetchUserData = async () => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                fetchUserDetails(user.uid);
            } else {
                console.log("No user logged in.");
            }
        });
    };


    
    const handleSave = async () => {
        try {
        
            await setDoc(doc(db, "User", UserModel.Id), {
               ...UserModel
             });
    
            setIsEditing(false);
            fetchUserData();
        } catch (error) {
            console.error("Error saving user data:", error);
        }
    };
    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        if (UserModel.Id !== "0") {
            fetchChallengeTypes();
        }
    }, [UserModel.Id]);

    useEffect(() => {
        if (ChallengeTypeModel.length > 0 && UserModel.Points >= 0 && loading) {
           // setLoading(false); // Set loading to false only when all data is loaded
        }
    }, [ChallengeTypeModel, UserModel.Points, loading]);

    return (
        <div className="profile-page-container">
            <Navbar></Navbar>
            <div className="dashboard">
                <div className="left-panel">
                    <div className="avatar"></div>
                    <h2>{UserModel.username}</h2>
                    <p className="email">{UserModel.email}</p>

                    <div className="medal-section">
                        <span className="medal">🥇</span>
                        <span className="medal-count">{UserModel.Points}</span>
                    </div>

                    <div className="profile-links">
    <p>PROFILE</p>
    <div className="profile-form">
        {isEditing ? (
            <>
                <div className="form-row">
                    <label>Name:</label>
                    <input type="text" value={UserModel.username} onChange={(e) => setUserModel({...UserModel,username:e.target.value})} />
                </div>
                <div className="form-row">
                    <label>Email:</label>
                    <input type="email" value={UserModel.email} onChange={(e) => setUserModel({...UserModel,email:e.target.value})} />
                </div>
                <div className="form-row">
                    <label>Phno:</label>
                    <input type="text" value={UserModel.Phno} onChange={(e) => setUserModel({...UserModel,Phno:e.target.value})} />
                </div>
                <div className="form-row">
                    <label>Address:</label>
                    <input type="text" value={UserModel.Address} onChange={(e) => setUserModel({...UserModel,Address:e.target.value})} />
                </div>
                <div className="button-row">
                    <button onClick={handleSave}>Save</button>
                </div>
            </>
        ) : (
            <>
                <div className="form-row">
                    <label>Name:</label>
                    <span className="dotted">{UserModel.username}</span>
                </div>
                <div className="form-row">
                    <label>Email:</label>
                    <span className="dotted">{UserModel.email}</span>
                </div>
                <div className="form-row">
                    <label>Phno:</label>
                    <span className="dotted">{UserModel.Phno || 'Clk on Edit'}</span>
                </div>
                <div className="form-row">
                    <label>Address:</label>
                    <span className="dotted">{UserModel.Address || 'Clk on Edit'}</span>
                </div>
                <div className="button-row">
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                </div>
            </>
        )}
    </div>
</div>


                    <div className="icon-info">
                        <div>
                            <span className="icon-msg">💬</span> <span>1</span>
                        </div>
                        <div>
                            <span className="icon-currency">🟢</span> <span>15</span>
                        </div>
                    </div>
                </div>

                <div className="main-panel">
                    <div className="top-section">
                        <div className="challenges">
                            <h3>Challenges</h3>

                                            {loading && (
                             <Loader></Loader>
                        )}


                            {/* Iterate through ChallengeTypeModel and display each item */}
                            {!loading && ChallengeTypeModel.map((challenge, index) => {
                                const progress = challenge.AvailableCount > 0 ? (challenge.YourCount / challenge.AvailableCount) * 100 : 0;
                                return (
                                    <div key={index} className="bar-container">
                                        <div className="bar-label">{challenge.ChallengeTypeName}</div>
                                        <div className="bar" title={`${challenge.YourCount} / ${challenge.AvailableCount} challenges completed`}>
                                            <div
                                                className="fill"
                                                style={{
                                                    width: `${progress}%`,
                                                }}
                                            ></div>
                                            {challenge.YourCount} / {challenge.AvailableCount}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="trades">
                            <h3>Trades</h3>
                            <p className="trade-count">15</p>

                            <div className="badge">
                                <h4>Badge Achievements</h4>
                                <div className="badge-icon">🛡️</div>
                                <p className="badge-title">Second Hand Hero</p>
                                <p className="badge-sub">Most Recent Badge</p>
                            </div>
                        </div>
                    </div>

                    <div className="yearly-activity">
                        <div className="activity-header">
                            <h3>Yearly Activity</h3>
                            <a href="#" className="leaderboard">Leaderboard ↗</a>
                        </div>

                        <div className="months-labels">
                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
                                <span key={month}>{month}</span>
                            ))}
                        </div>

                        <div className="activity-grid">
                            {[...Array(52)].map((_, weekIndex) => (
                                <div className="column" key={weekIndex}>
                                    {[...Array(7)].map((_, dayIndex) => {
                                        const level = Math.floor(Math.random() * 4);
                                        const levelClass = level === 0 ? "" : `level-${level}`;
                                        return <div key={dayIndex} className={`day ${levelClass}`}></div>;
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>

                    <ChallengeActivityTabs />
                </div>
            </div>
        </div>
    );
};

export default Profile;
