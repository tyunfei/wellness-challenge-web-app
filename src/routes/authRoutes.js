const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const jwtMiddleware = require("../middlewares/jwtMiddleware");

// REGISTER
router.post("/register", authController.register);

// LOGIN
router.post(
  "/login",
  authController.login,
  jwtMiddleware.generateToken,
  jwtMiddleware.sendToken
);

// GET LOGGED-IN USER
router.get(
  "/me",
  jwtMiddleware.verifyToken,
  authController.getMe
);

module.exports = router;
