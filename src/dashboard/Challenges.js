import Navbar from "./Navbar";
import Card from "./Card";
import React, { useEffect, useState } from "react";
import "./Challenges.css";
import { Link } from "react-router-dom";
import { db, auth } from "../Configuration";
import { getDocs, query, collection, where } from "firebase/firestore";
import { toast } from "react-toastify";

function Challenges() {
  const [ChallengeList, setChallengeList] = useState([]);
  const [userChallenges, setUserChallenges] = useState([]);
  const [typeMap, setTypeMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedType, setSelectedType] = useState("All");

  // Fetch challenge types and map type ID to name
  const fetchChallengeTypes = async () => {
    try {
      const typeQuery = query(collection(db, "ChallengeType"));
      const typeSnapshot = await getDocs(typeQuery);
      const map = {};
      typeSnapshot.forEach((doc) => {
        map[doc.id] = doc.data().ChallengeTypeModel.ChallengeTypeName;
      });
      setTypeMap(map);
    } catch (error) {
      toast.error("Error fetching challenge types.", { position: "top-center" });
    }
  };

  // Fetch all challenges
  const fetchChallenges = async () => {
    try {
      const challengeQuery = query(collection(db, "Challenges"));
      const challengeSnapshot = await getDocs(challengeQuery);
      const challenges = challengeSnapshot.docs.map((doc) => ({
        Id: doc.id,
        ChallengeName: doc.data().name,
        Type: doc.data().type,
        Point: doc.data().points,
        TargetQuantity: parseInt(doc.data().targetQuantity), // assuming targetQuantity is an integer
      }));
      setChallengeList(challenges);
    } catch (error) {
      toast.error("Error fetching challenges.", { position: "top-center" });
    }
  };

  // Fetch user-specific challenge progress
  const fetchUserChallenges = async () => {
    try {
      const userId = auth.currentUser.uid;
      const userChallengeQuery = query(
        collection(db, "UserRewards"),
        where("userId", "==", userId)
      );
      const userChallengeSnapshot = await getDocs(userChallengeQuery);
      const userChallengesData = userChallengeSnapshot.docs.map((doc) => doc.data());
      console.log("Fetched User Challenges: ", userChallengesData); // Debug user challenge data
      setUserChallenges(userChallengesData);
    } catch (error) {
      toast.error("Error fetching user progress.", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      await fetchChallengeTypes();
      await fetchChallenges();
      await fetchUserChallenges();
    };
    loadAll();
  }, []);

  // Apply filters
  const filteredChallenges = ChallengeList.filter((challenge) => {
    const userProgress = userChallenges.find(
      (uc) => uc.challengeId === challenge.Id
    );

    console.log(`Checking challenge progress for ${challenge.ChallengeName}:`, userProgress); // Debug user progress

    const status = userProgress ? userProgress.status : "Not Attempted";
    console.log(`Status for ${challenge.ChallengeName}:`, status); // Debug status

    // Filter by active tab (status)
    const matchesTab =
      activeTab === "All" || status.toLowerCase() === activeTab.toLowerCase();

    // Filter by selected challenge type
    const matchesType =
      selectedType === "All" || typeMap[challenge.Type] === selectedType;

    return matchesTab && matchesType;
  });

  return (
    <>
      <Navbar />
      <div className="role-mode-container">
        <Link to="/Rolemodel/Rolemode">
          <button className="role-mode-btn">Role Mode</button>
        </Link>
      </div>

      <div className="challengesarea">
        <div className="makeup"></div>

        <div className="filters-container" style={{ display: "flex", justifyContent: "space-between", margin: "20px" }}>
          <div className="tabs">
            {["All", "Completed", "In Progress", "Not Attempted"].map((tab) => (
              <button
                key={tab}
                className={`tab-button ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="dropdown">
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
              <option value="All">All Types</option>
              {Object.values(typeMap).map((typeName, index) => (
                <option key={index} value={typeName}>
                  {typeName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="challenges-container">
          <h2 style={{ color: "white", textAlign: "center" }}>Your Challenges</h2>

          {loading ? (
            <p style={{ color: "white", textAlign: "center" }}>Loading...</p>
          ) : (
            filteredChallenges.map((item) => {
              const userProgress = userChallenges.find(
                (userChallenge) => userChallenge.challengeId === item.Id
              );

              console.log(`User progress for ${item.ChallengeName}:`, userProgress); // Debug

              const typeName = typeMap[item.Type] || "Unknown Type";
              const userProgressCount = userProgress ? parseInt(userProgress.progress) : 0;

              return (
                <Card
                  key={item.Id}
                  name={item.ChallengeName}
                  Type={typeName}
                  Point={item.Point}
                  progress={userProgress ? userProgress.status : "Not Attempted"}
                  challengeId={item.Id} // Pass challengeId as prop
                  userId={auth.currentUser.uid} // Pass userId as prop
                  targetQuantity={item.TargetQuantity} // Pass targetQuantity as prop
                  userProgress={userProgressCount} // Pass user progress as prop
                />
              );
            })
          )}
        </div>
      </div>
      <br />
      <br />
    </>
  );
}

export default Challenges;
