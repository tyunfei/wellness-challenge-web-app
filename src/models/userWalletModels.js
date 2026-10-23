const db = require("../services/db");

// Create wallet for new user
exports.createWallet = (userId, callback) => {
  const sql = `
    INSERT INTO UserWallet (user_id, coins)
    VALUES (?, 0)
  `;
  db.query(sql, [userId], callback);
};

// Add coins to wallet
exports.addCoins = (userId, coins, callback) => {
  const sql = `
    UPDATE UserWallet
    SET coins = coins + ?
    WHERE user_id = ? AND coins >= ?
  `;
  db.query(sql, [coins, userId, coins], callback);
};

exports.addPoints = (userId, points, callback) => {
  const sql = `
    UPDATE User
    SET points = points + ?
    WHERE user_id = ?
  `;
  db.query(sql, [points, userId], callback);
};


// Deduct coins from wallet
exports.deductCoins = (userId, coins, callback) => {
  const sql = `
    UPDATE UserWallet
    SET coins = coins - ?
    WHERE user_id = ?
  `;
  db.query(sql, [coins, userId], callback);
};

// Get wallet by user
exports.getWalletByUserId = (userId, callback) => {
  const sql = `
    SELECT user_id, coins
    FROM UserWallet
    WHERE user_id = ?
  `;
  db.query(sql, [userId], callback);
};

