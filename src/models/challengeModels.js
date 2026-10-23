// Import database connection pool
const db = require("../services/db");


// Create challenge
// Used by POST /challenge
exports.createChallenge = (creatorId, description, points, callback) => {
  // SQL query to insert a new challenge into the WellnessChallenge table
  const sql = `
    INSERT INTO WellnessChallenge (creator_id, description, points)
    VALUES (?, ?, ?)
  `;

  // Execute parameterised query to prevent SQL injection
  db.query(sql, [creatorId, description, points], callback);
};


// Get all challenges
// Used by GET /challenges
exports.getAllChallenges = (callback) => {
  // SQL query to retrieve essential challenge details
  const sql = `
    SELECT challenge_id, description, creator_id, points
    FROM WellnessChallenge
  `;

  // Execute query and return results through callback
  db.query(sql, callback);
};


// Get challenge by id
//to validate challenge existence
exports.getChallengeById = (challengeId, callback) => {

  //  Used to validate challenge existence & ownership
  const sql = `
    SELECT * FROM WellnessChallenge WHERE challenge_id = ?
  `;

  // Execute query with challengeId as parameter
  db.query(sql, [challengeId], callback);
};



// Update challenge
// Used by PUT /challenges/:challenge_id
exports.updateChallenge = (challengeId, description, points, callback) => {
  // SQL query to update challenge description and points
  const sql = `
    UPDATE WellnessChallenge
    SET description = ?, points = ?
    WHERE challenge_id = ?
  `;

  // Execute update query with new values
  db.query(sql, [description, points, challengeId], callback);
};



// Delete challenge
//Used by DELETE /challenges/:challenge_id
exports.deleteChallenge = (challengeId, callback) => {
  // SQL query to delete a challenge by its ID
  const sql = `
    DELETE FROM WellnessChallenge WHERE challenge_id = ?
  `;

  //Execute delete query
  db.query(sql, [challengeId], callback);
};

// GET REWARD FOR A CHALLENGE
//section c
exports.getRewardByChallenge = (challengeId, callback) => {

  // Fetch reward values linked to a challenge
  const sql = `
    SELECT * FROM ChallengeReward
    WHERE challenge_id = ?
  `;
  db.query(sql, [challengeId], callback);
};

//CA2
// Get all challenges WITH rewards
// Used by GET /challenges (frontend display)
// Get all challenges WITH rewards
exports.getAllChallengesWithRewards = (callback) => {

  // Join WellnessChallenge and ChallengeReward tables
  const sql = `
    SELECT
      c.challenge_id,
      c.description,
      c.creator_id,
      c.points,
      r.coins_reward AS coins,
      r.pet_xp_reward AS pet_xp
    FROM WellnessChallenge c
    LEFT JOIN ChallengeReward r
      ON c.challenge_id = r.challenge_id
  `;

  db.query(sql, callback);
};


// Create challenge + rewards (CA2 GAMIFICATION)
exports.createChallengeWithRewards = (
  creatorId,
  description,
  points,
  coinsReward,
  petXpReward,
  callback
) => {


   // Step 1 — Insert challenge
  const insertChallengeSQL = `
    INSERT INTO WellnessChallenge (creator_id, description, points)
    VALUES (?, ?, ?)
  `;

  db.query(insertChallengeSQL, [creatorId, description, points], (err, result) => {

    // Stop if challenge insert fails
    if (err) return callback(err);

     // Get newly created challenge ID
    const challengeId = result.insertId;

     // Step 2 — Insert reward tied to that challenge
    const insertRewardSQL = `
      INSERT INTO ChallengeReward (challenge_id, coins_reward, pet_xp_reward)
      VALUES (?, ?, ?)
    `;


    db.query(
      insertRewardSQL,
      [challengeId, coinsReward, petXpReward],
      (err2) => {

        // Stop if reward insert fails
        if (err2) return callback(err2);

        // Return created challenge ID
        callback(null, {
          challenge_id: challengeId
        });

      }
    );
  });
};


// GET CHALLENGES FOR USER (SYSTEM + OWN)
exports.getChallengesForUser = (userId, callback) => {

  // Show:
  // - System challenges (creator_id IS NULL)
  // - User-created challenges (creator_id = logged-in user)

  const sql = `
    SELECT
      c.challenge_id,
      c.description,
      c.creator_id,
      c.points,
      r.coins_reward AS coins,
      r.pet_xp_reward AS pet_xp
    FROM WellnessChallenge c
    LEFT JOIN ChallengeReward r
      ON c.challenge_id = r.challenge_id
    WHERE c.creator_id IS NULL
       OR c.creator_id = ?
    ORDER BY c.challenge_id ASC
  `;

  db.query(sql, [userId], callback);

};


