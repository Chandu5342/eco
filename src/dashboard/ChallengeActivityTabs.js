import React, { useEffect, useState } from "react";
import "./ChallengeActivityTabs.css";
import { db, auth } from "../Configuration";
import { getDocs, query, collection, where } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import glass from "../images/glass.png";
import plastic from "../images/bag.png";
import Metals from "../images/metal.png";
import Bottles from "../images/bottle.png";

const ChallengeActivityTabs = () => {
  const [challengeList, setChallengeList] = useState([]);
  const [userChallenges, setUserChallenges] = useState([]);
  const [typeMap, setTypeMap] = useState({});
  const [imageUrlMap, setImageUrlMap] = useState({});
  const [activeTab, setActiveTab] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const navigate = useNavigate();

  const imageMap = {
    glass,
    plastic,
    metals: Metals,
    bottles: Bottles,
    "plastic cover": plastic,
  };

  useEffect(() => {
    const loadAll = async () => {
      await fetchChallengeTypes();
      await fetchChallenges();
      await fetchUserChallenges();
    };
    loadAll();
  }, []);

  const fetchChallengeTypes = async () => {
    try {
      const typeSnapshot = await getDocs(collection(db, "ChallengeType"));
      const map = {};
      const imgMap = {};
      typeSnapshot.forEach((doc) => {
        map[doc.id] = doc.data().ChallengeTypeModel.ChallengeTypeName;
        imgMap[doc.id] = doc.data().ChallengeTypeModel.ImgUrl;
      });
      setTypeMap(map);
      setImageUrlMap(imgMap);
    } catch (error) {
      toast.error("Error fetching challenge types.");
    }
  };

  const fetchChallenges = async () => {
    try {
      const challengeSnapshot = await getDocs(collection(db, "Challenges"));
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
      const userChallengeSnapshot = await getDocs(
        query(collection(db, "UserRewards"), where("userId", "==", userId))
      );
      const data = userChallengeSnapshot.docs.map((doc) => doc.data());
      setUserChallenges(data);
    } catch (error) {
      toast.error("Error fetching user progress.");
    }
  };

  const filteredChallenges = challengeList.filter((challenge) => {
    const userProgress = userChallenges.find(
      (uc) => uc.challengeId === challenge.Id
    );
    const status = userProgress ? userProgress.status : "Not Attempted";
    const normalizedStatus = status.toLowerCase().replace(/\s+/g, "-");
    const normalizedTab = activeTab.toLowerCase().replace(/\s+/g, "-");
    const matchesTab = normalizedTab === "all" || normalizedStatus === normalizedTab;
    const matchesType =
      selectedType === "All" || typeMap[challenge.Type] === selectedType;
    return matchesTab && matchesType;
  });

  const handleGetChallenge = (cid, uid) => {
    navigate(`/dashboard/Verification/${cid}/${uid}`);
  };

  return (
    <div className="challengeTabs-container">
      <div className="challengeTabs-header">
        {["All", "Completed", "In Progress", "Not Attempted", "Expired"].map(
          (tab) => (
            <button
              key={tab}
              className={`challengeTabs-tab ${
                activeTab === tab ? "isActive" : ""
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          )
        )}
      </div>

      <div className="challengeTabs-dropdown">
        <select
          className="challengeTabs-select"
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

      <div className="challengeTabs-list">
        {filteredChallenges.map((item) => {
          const userProgress = userChallenges.find(
            (uc) => uc.challengeId === item.Id
          );
          const progressStatus = userProgress
            ? userProgress.status
            : "Not Attempted";
          const typeName = typeMap[item.Type]?.toLowerCase() || "unknown";
          const image = imageMap[typeName] || glass;

          return (
            <div key={item.Id} className="challengeTabs-card">
              <img
                src={image}
                alt="Type"
                className="challengeTabs-icon"
              />
              <div className="challengeTabs-details">
                <h2 className="challengeTabs-title">
                  {`${item.ChallengeName} (${item.Point} pts)`}
                </h2>
                <button
                  className="challengeTabs-actionBtn"
                  onClick={() => handleGetChallenge(item.Id, auth.currentUser.uid)}
                >
                  Get Challenge
                </button>
                <div className="challengeTabs-progress">
                  <span className="challengeTabs-progressText">
                    Progress: {userProgress?.progress || 0}/{item.TargetQuantity}
                  </span>
                  <div className="challengeTabs-progressBar">
                    <div
                      className="challengeTabs-progressFill"
                      style={{
                        width: `${
                          Math.min(
                            ((userProgress?.progress || 0) /
                              item.TargetQuantity) *
                              100,
                            100
                          ) || 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="challengeTabs-meta">
                <div
                  className={`challengeTabs-status ${progressStatus
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  {progressStatus}
                </div>
                <div className="challengeTabs-target">
                  Target: {item.TargetQuantity}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChallengeActivityTabs;
