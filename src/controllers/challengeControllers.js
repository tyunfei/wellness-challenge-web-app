const Challenge = require("../models/challengeModels");

//////////////////////////////////////////////////////
// CREATE CHALLENGE (JWT)
//////////////////////////////////////////////////////
exports.createChallenge = (req, res) => {

  // Get logged-in user ID from JWT middleware
  const creatorId = res.locals.userId;

  // Extract data from frontend request body
  const { description, points, coins_reward, pet_xp_reward } = req.body;

  // Basic validation (required fields)
  if (!description || !points) {
    return res.status(400).json({ error: "Description and points are required" });
  }

   // Convert values to numbers
  const parsedPoints = Number(points);
  const parsedCoins = coins_reward ? Number(coins_reward) : 0;
  const parsedPetXp = pet_xp_reward ? Number(pet_xp_reward) : 0;

  // Reward limits
  const MAX_POINTS = 30;
  const MAX_COINS = 30;
  const MAX_PET_XP = 30;


   // Validate reward boundaries
  if (
  parsedPoints <= 0 || parsedPoints > MAX_POINTS ||
  parsedCoins < 0 || parsedCoins > MAX_COINS ||
  parsedPetXp < 0 || parsedPetXp > MAX_PET_XP
) {
  return res.status(400).json({
    error: "Points, coins and pet XP must be between 0 and 30"
  });
}


// Call model function to create challenge + rewards in database
  Challenge.createChallengeWithRewards(
    creatorId,
    description,
    parsedPoints,
    parsedCoins,
    parsedPetXp,
    (err, result) => {

      // Database error handling
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to create challenge" });
      }

      // Success response
      res.status(201).json({
        message: "Challenge created successfully",
        challenge_id: result.challenge_id
      });

    }
  );
};

//////////////////////////////////////////////////////
// GET CHALLENGES (SYSTEM + USER)
//////////////////////////////////////////////////////
exports.getAllChallenges = (req, res) => {

  // Logged-in user ID
  const userId = res.locals.userId;

  // Fetch system challenges + user's own challenges
  Challenge.getChallengesForUser(userId, (err, results) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch challenges" });
    }

     // Return challenge list to frontend
    res.status(200).json(results);

  });

};


//////////////////////////////////////////////////////
// UPDATE CHALLENGE (OWNER ONLY)
//////////////////////////////////////////////////////
exports.updateChallenge = (req, res) => {

  const creatorId = res.locals.userId;
  const { description, points } = req.body;
  const { challenge_id } = req.params;

   // Validation
  if (!description || !points) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Get challenge to verify ownership
  Challenge.getChallengeById(challenge_id, (err, results) => {

    // Check challenge exists
    if (!results || results.length === 0) {
      return res.status(404).json({ error: "Challenge not found" });
    }

    const challenge = results[0];

    // Prevent editing system challenges
    if (challenge.creator_id === null) {
      return res.status(403).json({ error: "Cannot modify system challenge" });
    }

    // Ownership check
    if (challenge.creator_id !== creatorId) {
      return res.status(403).json({ error: "Not challenge owner" });
    }

    // Update challenge in database
    Challenge.updateChallenge(
      challenge_id,
      description,
      points,
      () => {

        res.status(200).json({
          message: "Challenge updated successfully"
        });

      }
    );

  });

};

//////////////////////////////////////////////////////
// DELETE CHALLENGE (OWNER ONLY)
//////////////////////////////////////////////////////
exports.deleteChallenge = (req, res) => {

  const creatorId = res.locals.userId;
  const { challenge_id } = req.params;

  // Fetch challenge for validation
  Challenge.getChallengeById(challenge_id, (err, results) => {

    if (!results || results.length === 0) {
      return res.status(404).json({ error: "Challenge not found" });
    }

    const challenge = results[0];

    // Prevent deleting system challenges
    if (challenge.creator_id === null) {
      return res.status(403).json({ error: "Cannot delete system challenge" });
    }

    // Ownership validation
    if (challenge.creator_id !== creatorId) {
      return res.status(403).json({ error: "Not challenge owner" });
    }

    // Delete challenge
    Challenge.deleteChallenge(challenge_id, (err2) => {

      if (err2) {
        console.error(err2);
        return res.status(500).json({ error: "Delete failed" });
      }

      res.status(200).json({ message: "Challenge deleted" });

    });

  });

};
