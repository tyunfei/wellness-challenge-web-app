// Import required models for database operations
const Completion = require("../models/completionModels");
const Challenge = require("../models/challengeModels");
const User = require("../models/userModels");
const Wallet = require("../models/userWalletModels");
const Pet = require("../models/petModels");
const ChallengeReward = require("../models/challengeRewardModels");


//complete challenge
// 9. POST /challenges/:challenge_id
exports.completeChallenge = (req, res) => {

  // Get challenge ID from URL
  const { challenge_id } = req.params;

  // Get authenticated user from JWT
  const user_id = res.locals.userId;

  // Extra completion notes from frontend
  const { details } = req.body;

  // Validate required fields
  if (!user_id || !details) {
    return res.status(400).json({ error: "Missing required fields" });
  }


  // 1. Check challenge exists
  Challenge.getChallengeById(challenge_id, (err, challenges) => {
    if (!challenges.length || challenges.length === 0) {
      return res.status(404).json({ error: "Challenge not found" });
    }


    // Get challenge base points reward
    const challengePoints = challenges[0].points;

    // 2. Check user exists
    User.getUserById(user_id, (err, users) => {
      if (!users || users.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      // 3. Create completion record
      Completion.createCompletion(
        challenge_id,
        user_id,
        details,
        (err, result) => {
          if (err) return res.status(500).json(err);

          // 4. Get reward for this challenge
          ChallengeReward.getRewardByChallengeId(
            challenge_id,
            (err, rewards) => {

              let coins = 0;
              let petXP = 0;

              // If reward exists, extract values
              if (rewards && rewards.length > 0) {
                coins = rewards[0].coins_reward;
                petXP = rewards[0].pet_xp_reward;
              }

              // 5. Add coins to user's wallet
              Wallet.addCoins(user_id, coins, () => {

                // 6. Add challenge points to user 
                User.addPoints(user_id, challengePoints, () => {
          
      
                  // 7. Check if user owns a pet before adding XP
                  Pet.getEquippedPet(user_id, (err, pets) => {

                    let petXPEarned = 0;

                    // Only give pet XP if:
                    // - user has equipped pet
                    // - challenge gives pet XP reward
                    if (pets && pets.length > 0 && petXP > 0) {

                      const petId = pets[0].pet_id;
                      Pet.addPetXP(petId, petXP, () => {});
                      petXPEarned = petXP;
                    }

                    // FINAL RESPONSE TO FRONTEND
                    res.status(201).json({
                      completion_id: result.insertId,
                      challenge_id: Number(challenge_id),
                      user_id,
                      details,
                      coins_earned: coins,
                      pet_xp_earned: petXPEarned,
                      points_earned: challengePoints
                    
                });
              });
            });
          });
        });
      });
    });
  });
};

// GET COMPLETIONS FOR A CHALLENGE
// 10. GET /challenges/:challenge_id
exports.getCompletions = (req, res) => {

  // Extract challenge ID from URL parameter
  const { challenge_id } = req.params;

  // Retrieve all completion records for the given challenge
  Completion.getCompletionsByChallenge(challenge_id, (err, results) => {

    // If no completion records are found, return 404 Not Found
    if (results.length === 0) {
      return res.status(404).json({ error: "No completions found" });
    }

    // Return list of users who completed the challenge
    res.status(200).json(results);
  });
};


//////////////////////////////////////////////////////
// GET USER PROGRESS (JWT)
//////////////////////////////////////////////////////

exports.getMyProgress = (req, res) => {

  const userId = res.locals.userId;

  // Combine multiple database queries into ONE response
  Completion.getTotalCompletionsByUser(userId, (err, totalResult) => {
    if (err) return res.status(500).json(err);

    Completion.getTodayCompletionsByUser(userId, (err, todayResult) => {
      if (err) return res.status(500).json(err);

      Completion.getWeeklyCompletionsByUser(userId, (err, weeklyResult) => {
        if (err) return res.status(500).json(err);

        Completion.getRecentCompletions(userId, (err, recentResult) => {
          if (err) return res.status(500).json(err);

          Completion.getDailyCompletionsLast7Days(userId, (err, dailyResult) => {
            if (err) return res.status(500).json(err);

             // Send all dashboard data
            res.status(200).json({
              total_completed: totalResult[0].total,
              today_completed: todayResult[0].today,
              weekly_completed: weeklyResult[0].weekly,
              recent_activity: recentResult,
              daily_activity: dailyResult
            });

          });
        });
      });
    });
  });
};
