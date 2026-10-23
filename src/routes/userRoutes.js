const express = require("express");
const router = express.Router();
const jwtMiddleware = require("../middlewares/jwtMiddleware");

const controller = require("../controllers/userControllers");

// Public route (register)
router.post("/", controller.createUser);

// Protected routes
router.get("/", jwtMiddleware.verifyToken, controller.getUsers);

router.get("/leaderboard/top", jwtMiddleware.verifyToken, controller.getLeaderboard);

router.get("/:user_id", jwtMiddleware.verifyToken, controller.getUserById);

router.put("/:user_id", jwtMiddleware.verifyToken, controller.updateUser);

module.exports = router;
