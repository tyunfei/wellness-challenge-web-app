const db = require("../services/db");

// Get reward for a specific challenge
exports.getRewardByChallengeId = (challengeId, callback) => {
  const sql = `
    SELECT coins_reward, pet_xp_reward
    FROM ChallengeReward
    WHERE challenge_id = ?
  `;
  db.query(sql, [challengeId], callback);
};
