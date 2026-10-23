//Import database connection pool
const db = require("../services/db");

// create new user (CA2, with password)
// Called when user signs up
// Stores hashed password 
exports.createUser = (username, passwordHash, callback) => {
  const sql = `
    INSERT INTO user (username, password_hash)
    VALUES (?, ?)
  `;

  // Insert new user into database
  db.query(sql, [username, passwordHash], callback);
};


// Retrieve all users
// Used by GET /users
exports.getAllUsers = (callback) => {
  // SQL query to retrieve basic user information
  db.query(
    "SELECT user_id, username, points FROM user",
    callback
  );
};

// Retrieve a specific user by ID
// Used by GET /users/:user_id
exports.getUserById = (userId, callback) => {
  // SQL query to fetch a user using primary key
  db.query(
    "SELECT user_id, username, points FROM user WHERE user_id = ?",
    [userId],
    callback
  );
};


// Update user details
// Used by PUT /users/:user_id
exports.updateUser = (userId, username, points, callback) => {
  // SQL query to update username and points for a user
  const sql =
    "UPDATE user SET username = ?, points = ? WHERE user_id = ?";

  // Execute update query
  db.query(sql, [username, points, userId], callback);
};


//add points
// Used when user completes challenge
exports.addPoints = (userId, points, callback) => {
   // SQL query to increment user points
  const sql = `
    UPDATE user
    SET points = points + ?
    WHERE user_id = ?
  `;

  // Execute query with points to be added
  db.query(sql, [points, userId], callback);
};


// Get user by username (used for login) (CA2)
// Used during authentication
// Needed to verify password hash
exports.getUserByUsername = (username, callback) => {
  const sql = `
    SELECT user_id, username, password_hash, points
    FROM user
    WHERE username = ?
  `;
  db.query(sql, [username], callback);
};


// LEADERBOARD — Get top users by points
// Used on dashboard leaderboard
// Sorted descending (highest points first)
exports.getTopUsers = (limit, callback) => {

  const sql = `
    SELECT user_id, username, points
    FROM User
    ORDER BY points DESC
    LIMIT ?
  `;

  db.query(sql, [limit], callback);
};
