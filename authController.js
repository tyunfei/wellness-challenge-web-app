//////////////////////////////////////////////////////
// AUTH CONTROLLER
//////////////////////////////////////////////////////

const bcrypt = require("bcrypt");
const UserModel = require("../models/userModels");
const WalletModel = require("../models/userWalletModels");

//////////////////////////////////////////////////////
// REGISTER
//////////////////////////////////////////////////////
module.exports.register = (req, res) => {
  // Extract username and password from request body
  const { username, password } = req.body;

  // Validation: make sure fields are not empty
  if (!username || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  // Hash the user's password before storing in database
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    // If hashing fails
    if (err) {
      return res.status(500).json({ message: "Error hashing password" });
    }

    // Save new user with hashed password
    UserModel.createUser(username, hashedPassword, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "This username is already taken" });
      }

      // Get newly created user's ID
      const userId = results.insertId;

      // Create wallet for new user 
      WalletModel.createWallet(userId, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Wallet creation failed" });
        }

        // Registration success response
        return res.status(201).json({
          message: "User registered successfully"
        });
      });
    });
  });
};


//////////////////////////////////////////////////////
// LOGIN
//////////////////////////////////////////////////////
module.exports.login = (req, res, next) => {
  // Get login input
  const { username, password } = req.body;

  // Find user record by username
  UserModel.getUserByUsername(username, (err, results) => {
    // If error or no user found
    if (err || results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Extract user row
    const user = results[0];

    // Compare input password with hashed password in DB
    bcrypt.compare(password, user.password_hash, (err, isMatch) => {
      // If password mismatch OR error
      if (err || !isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Save user ID into res.locals (temporary storage)
      // JWT middleware will use this to generate token
      res.locals.userId = user.user_id;

      res.locals.message = "Login successful";

      // Move to next middleware (JWT token generator)
      next();
    });
  });
};

//////////////////////////////////////////////////////
// GET LOGGED-IN USER
//////////////////////////////////////////////////////
module.exports.getMe = (req, res) => {
  // User ID extracted from JWT token by middleware
  const userId = res.locals.userId;

  // Fetch user details
  UserModel.getUserById(userId, (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = results[0];

    // Fetch wallet details (coins)
    WalletModel.getWalletByUserId(userId, (err, walletResults) => {
      if (err || walletResults.length === 0) {
        return res.status(500).json({ message: "Wallet error" });
      }

      const wallet = walletResults[0];

      // Send combined user + wallet data to frontend
      return res.json({
        user_id: user.user_id,
        username: user.username,
        points: user.points,
        coins: wallet.coins
      });
    });
  });
};
