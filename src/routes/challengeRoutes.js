const express = require("express");
const controller = require("../controllers/challengeControllers");
const completionController = require("../controllers/completionControllers");
const jwtMiddleware = require("../middlewares/jwtMiddleware");

const router = express.Router();

// ---------- CHALLENGES CRUD ----------

router.post("/", jwtMiddleware.verifyToken, controller.createChallenge);

router.get("/", jwtMiddleware.verifyToken, controller.getAllChallenges);

router.put("/:challenge_id", jwtMiddleware.verifyToken, controller.updateChallenge);

router.delete("/:challenge_id", jwtMiddleware.verifyToken, controller.deleteChallenge);

// ---------- COMPLETIONS ----------

router.post(
  "/:challenge_id",
  jwtMiddleware.verifyToken,
  completionController.completeChallenge
);

router.get(
  "/:challenge_id",
  jwtMiddleware.verifyToken,
  completionController.getCompletions
);

// ---------- USER PROGRESS ----------

router.get(
  "/progress/me",
  jwtMiddleware.verifyToken,
  completionController.getMyProgress
);

module.exports = router;
