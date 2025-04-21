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
  const [teMap, setteMap] = useState({});

  // Fetch challenge types and map type ID to name
  const fetchChallengeTypes = async () => {
    try {
      const typeQuery = query(collection(db, "ChallengeType"));
      const typeSnapshot = await getDocs(typeQuery);
      const map = {};
      const tmap = {};
      typeSnapshot.forEach((doc) => {
        map[doc.id] = doc.data().ChallengeTypeModel.ChallengeTypeName;
        tmap[doc.id]=doc.data().ChallengeTypeModel.ImgUrl;
        console.log("ChallengeTypeModel",tmap[doc.id])
      });
      setTypeMap(map);
      setteMap(tmap);
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
{/* NEW HEADER SECTION */}
<div className="header-section">
  <div className="container-box">
    <h1 className="title re">Recycling Challenges</h1>

    {/* Tabs */}
    <div className="tabs-container">
      {["All", "Completed", "In Progress", "Not Attempted"].map((tab) => (
        <button
          key={tab}
          className={`tab-btn ${activeTab === tab ? "active" : ""}`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>

    {/* Filter Dropdown */}
    <div className="dropdown-container">
      <select
        className="type-dropdown"
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
  </div>
</div>

{/* CHALLENGE CARDS SECTION */}
<div className="challenges-body">
  <h2 className="section-title">Your Challenges</h2>

  {loading ? (
    <p className="loading">Loading...</p>
  ) : (
    <div className="card-grid">
      {filteredChallenges.map((item) => {
        const userProgress = userChallenges.find(
          (userChallenge) => userChallenge.challengeId === item.Id
        );

        const typeName = typeMap[item.Type] || "Unknown Type";
        const userProgressCount = userProgress
          ? parseInt(userProgress.progress)
          : 0;
          console.log("filteredChallenges",teMap);
          let url=teMap[item.Type];
        return (
          
          <Card
          key={item.Id}
          name={item.ChallengeName}
          Type={typeName}
          Point={item.Point}
          progress={userProgress ? userProgress.status : "Not Attempted"}
          challengeId={item.Id}
          userId={auth.currentUser.uid}
          targetQuantity={item.TargetQuantity}
          userProgress={userProgressCount} 
          image={`${url}`}// <-- Use the direct URL here
        />
                   
           

        );
      })}
    </div>
  )}
</div>
    </>
  );
}

export default Challenges;
