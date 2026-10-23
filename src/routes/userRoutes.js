const express = require("express");
const router = express.Router();
const jwtMiddleware = require("../middlewares/jwtMiddleware");
const controller = require("../controllers/userControllers");

// The legacy endpoint created users without a password: disable it.
router.post("/", (req, res) => res.status(410).json({
  error: "Use /auth/register for account creation."
}));

router.get("/", jwtMiddleware.verifyToken, controller.getUsers);
router.get("/leaderboard/top", jwtMiddleware.verifyToken, controller.getLeaderboard);
router.get("/:user_id", jwtMiddleware.verifyToken, controller.getUserById);

// Prevent authenticated users changing arbitrary accounts or their points.
router.put("/:user_id", jwtMiddleware.verifyToken, (req, res) =>
  res.status(403).json({ error: "Direct account/points editing is disabled." })
);

module.exports = router;
