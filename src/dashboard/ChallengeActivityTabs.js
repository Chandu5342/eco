import React, { useEffect, useState } from "react";
import "./ChallengeActivityTabs.css";
import { db, auth } from "../Configuration";
import { getDocs, query, collection, where } from "firebase/firestore";
import { toast } from "react-toastify";

const ChallengeActivityTabs = () => {
  const [challenges, setChallenges] = useState([]);
  const [userChallenges, setUserChallenges] = useState([]);
  const [typeMap, setTypeMap] = useState({});
  const [selectedType, setSelectedType] = useState("All");
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);

  // Fetch challenge types
  const fetchChallengeTypes = async () => {
    try {
      const typeSnapshot = await getDocs(collection(db, "ChallengeType"));
      const map = {};
      typeSnapshot.forEach((doc) => {
        map[doc.id] = doc.data().ChallengeTypeModel.ChallengeTypeName;
      });
      setTypeMap(map);
    } catch (error) {
      toast.error("Error fetching challenge types.");
    }
  };

  // Fetch all challenges
  const fetchChallenges = async () => {
    try {
      const challengeSnapshot = await getDocs(collection(db, "Challenges"));
      const data = challengeSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        type: doc.data().type,
        points: doc.data().points,
        targetQuantity: parseInt(doc.data().targetQuantity),
      }));
      setChallenges(data);
    } catch (error) {
      toast.error("Error fetching challenges.");
    }
  };

  // Fetch user-specific challenge progress
  const fetchUserProgress = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const userSnapshot = await getDocs(
        query(collection(db, "UserRewards"), where("userId", "==", userId))
      );
      const userData = userSnapshot.docs.map((doc) => doc.data());
      setUserChallenges(userData);
    } catch (error) {
      toast.error("Error fetching user progress.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchChallengeTypes();
      await fetchChallenges();
      await fetchUserProgress();
    };
    load();
  }, []);

  // Merge and filter
  const filteredChallenges = challenges
    .map((challenge) => {
      const userProgress = userChallenges.find(
        (uc) => uc.challengeId === challenge.id
      );
      const status = userProgress?.status || "Not Attempted";

      return {
        ...challenge,
        status,
        daysAgo: userProgress?.lastUpdated || "N/A",
      };
    })
    .filter((challenge) => {
      const matchesTab =
        activeTab === "All" || challenge.status === activeTab;
      const matchesType =
        selectedType === "All" ||
        typeMap[challenge.type] === selectedType;
      return matchesTab && matchesType;
    });

  return (
    <div className="activity-tabs">
      <div className="tabs">
        {["All", "Completed", "In Progress", "Not Attempted"].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="dropdown">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="All">All Types</option>
          {Object.values(typeMap).map((typeName, i) => (
            <option key={i} value={typeName}>
              {typeName}
            </option>
          ))}
        </select>
      </div>

      <div className="challenge-list">
        {loading ? (
          <p className="loading-text">Loading...</p>
        ) : filteredChallenges.length === 0 ? (
          <p className="no-data">No challenges found.</p>
        ) : (
          filteredChallenges.map((challenge, index) => (
            <div key={index} className="challenge-item">
              <div className="challenge-title">
                {challenge.name} - ({typeMap[challenge.type] || "Unknown"})
              </div>
              <div className="challenge-meta">
                Status: {challenge.status} | Points: {challenge.points}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChallengeActivityTabs;
