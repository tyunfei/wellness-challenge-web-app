// Import User model to handle database operations
const User = require("../models/userModels");
const Wallet = require("../models/userWalletModels");


// 1. POST /users
exports.createUser = (req, res) => {
  // Extract username from request body
  const { username } = req.body;

   // Validate input: username must be provided
  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  // Insert new user into the database
  User.createUser(username, (err, result) => {
    if (err) {
      // Handle duplicate username
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ error: "Username already exists" });
      }
      // Handle other database errors
      return res.status(500).json(err);
    }
    
    const userId = result.insertId;


    // Create wallet for the new user
    Wallet.createWallet(userId, () => {
      res.status(201).json({
        user_id: userId,
        username,
        points: 0
      });
    });
  });
};


// 2. GET /users
exports.getUsers = (req, res) => {
  // Fetch all users from database
  User.getAllUsers((err, results) => {
     // Handle database error
    if (err) return res.status(500).json(err);

    //Return list of users
    res.status(200).json(results);
  });
};

// 3. GET /users/:user_id
exports.getUserById = (req, res) => {
  // Fetch user using user_id from URL parameter
  User.getUserById(req.params.user_id, (err, results) => {
    // If user does not exist, return 404 Not Found
    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    //Return user detials
    res.status(200).json(results[0]);
  });
};

// 4. PUT /users/:user_id
exports.updateUser = (req, res) => {
  // Extract updated values from request body
  const { username, points } = req.body;

   // Update user record in database
  User.updateUser(req.params.user_id, username, points, (err, result) => {

    if (err) {
      // Handle duplicate username update
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ error: "Username already exists" });
      }
      // Handle other database errors
      return res.status(500).json(err);
    }

     // If no rows were updated, user does not exist
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return updated user details
    res.status(200).json({
      user_id: req.params.user_id,
      username,
      points
    });
  });
};



// LEADERBOARD — GET TOP USERS BY POINTS
// Shows top users sorted by points
exports.getLeaderboard = (req, res) => {

  // Limit leaderboard to top 10 players
  const limit = 10; // top 10 players

  // Get top users from database
  User.getTopUsers(limit, (err, results) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to load leaderboard" });
    }

    // Add rank number
    const ranked = results.map((user, index) => ({
      rank: index + 1,
      user_id: user.user_id,
      username: user.username,
      points: user.points
    }));

    // Send leaderboard result
    res.status(200).json(ranked);
  });
};
