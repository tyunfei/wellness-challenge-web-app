// Import database connection pool
const db = require("../services/db");


// Create completion
//Used by POST /challenges/:challenge_id
exports.createCompletion = (challengeId, userId, details, callback) => {
  // SQL query to insert a new completion record
  const sql = `
    INSERT INTO UserCompletion (challenge_id, user_id, details)
    VALUES (?, ?, ?)
  `;

  // Execute parameterised query to prevent SQL injection
  db.query(sql, [challengeId, userId, details], callback);
};


// Get completions by challenge
// Used by GET /challenges/:challenge_id
exports.getCompletionsByChallenge = (challengeId, userId, callback) => {
  // Returns user_id and completion details
  const sql = `
    SELECT user_id, details
    FROM UserCompletion
    WHERE challenge_id = ? AND user_id = ?
  `;

  // Only return the authenticated user's completion notes.
  db.query(sql, [challengeId, userId], callback);
};


//////////////////////////////////////////////////////
// PROGRESS TRACKING QUERIES
//////////////////////////////////////////////////////

// Total completions by user
exports.getTotalCompletionsByUser = (userId, callback) => {

  // COUNT(*) counts number of rows matching user
  const sql = `
    SELECT COUNT(*) AS total
    FROM UserCompletion
    WHERE user_id = ?
  `;
  db.query(sql, [userId], callback);
};



// Today's completions
// Used for "Today's Progress" stat
exports.getTodayCompletionsByUser = (userId, callback) => {
  const sql = `
    SELECT COUNT(*) AS today
    FROM UserCompletion
    WHERE user_id = ?
    AND DATE(completed_at) = CURDATE()
  `;

  /*
    DATE(completed_at) extracts only the date
    CURDATE() returns today's date

    This ensures we only count completions from TODAY
  */

  db.query(sql, [userId], callback);
};



// Weekly completions (last 7 days)
// Used for "This Week" stat
exports.getWeeklyCompletionsByUser = (userId, callback) => {
  const sql = `
    SELECT COUNT(*) AS weekly
    FROM UserCompletion
    WHERE user_id = ?
    AND completed_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
  `;


   /*
    DATE_SUB subtracts 7 days from today's date

    This query counts:
    all completions from the past 7 days including today
  */

  db.query(sql, [userId], callback);
};


// Recent activity (last 5 completions)
// Used for dashboard "Completed Challenges" list
exports.getRecentCompletions = (userId, callback) => {
  const sql = `
    SELECT c.description, uc.completed_at
    FROM UserCompletion uc
    JOIN WellnessChallenge c
      ON uc.challenge_id = c.challenge_id
    WHERE uc.user_id = ?
    ORDER BY uc.completed_at DESC
    LIMIT 5
  `;

  /*
    JOIN is used so we can:
    - Get challenge description
    - Instead of only challenge_id

    ORDER BY DESC:
    newest completions first

    LIMIT 5:
    only show last 5 activities
  */

  
  db.query(sql, [userId], callback);
};


// Daily completion counts (last 7 days)
// Used for weekly activity chart
exports.getDailyCompletionsLast7Days = (userId, callback) => {

  const sql = `
    SELECT 
      DATE(completed_at) AS day,
      COUNT(*) AS count
    FROM UserCompletion
    WHERE user_id = ?
      AND completed_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
    GROUP BY day
    ORDER BY day ASC
  `;

   /*
    GROUP BY day:
    groups all completions by date

    COUNT(*) AS count:
    counts how many completions happened on each day

    ORDER BY ASC:
    oldest day → newest day (good for charts)

    INTERVAL 6 DAY:
    gives today + previous 6 days = 7-day range
  */

  db.query(sql, [userId], callback);
};
