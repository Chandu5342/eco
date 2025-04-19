import React, { useState } from 'react';
import './ChallengeActivityTabs.css';

const challenges = [
  { title: 'Plastic Bottle Cleanup', status: 'Completed', daysAgo: '2 days ago' },
  { title: 'Metal Sorting Drive', status: 'In Progress', daysAgo: '5 days ago' },
  { title: 'Paper Collection Week', status: 'Completed', daysAgo: '6 days ago' },
  { title: 'Electronic Waste Awareness', status: 'Not Started', daysAgo: '10 days ago' },
];

const ChallengeActivityTabs = () => {
  const [activeTab, setActiveTab] = useState('All');

  const filteredChallenges = challenges.filter((challenge) =>
    activeTab === 'All' ? true : challenge.status === activeTab
  );

  return (
    <div className="activity-tabs">
      <div className="tabs">
        {['All', 'Completed', 'In Progress'].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="challenge-list">
        {filteredChallenges.map((challenge, index) => (
          <div key={index} className="challenge-item">
            <div className="challenge-title">{challenge.title}</div>
            <div className="challenge-meta">{challenge.daysAgo}</div>
          </div>
        ))}
        {filteredChallenges.length === 0 && <p className="no-data">No challenges found.</p>}
      </div>
    </div>
  );
};

export default ChallengeActivityTabs;
