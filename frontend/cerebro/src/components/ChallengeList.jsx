import React, { useEffect, useState } from "react";
import axios from "axios";

const ChallengeList = () => {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/challenges")
      .then((res) => setChallenges(res.data))
      .catch((err) => console.error("Failed to fetch challenges:", err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">All Challenges</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {challenges.map((challenge) => (
          <div
            key={challenge.id}
            className="p-4 bg-white shadow rounded-xl border border-gray-200"
          >
            <h3 className="text-xl font-semibold">{challenge.title}</h3>
            <p className="text-gray-600">{challenge.description}</p>
            <p className="mt-2"><strong>Type:</strong> {challenge.type}</p>
            <p><strong>Target Hours:</strong> {challenge.targetHours ?? "N/A"}</p>
            <p><strong>Start:</strong> {challenge.startDate}</p>
            <p><strong>End:</strong> {challenge.endDate}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChallengeList;
