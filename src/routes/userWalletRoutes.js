const express = require("express");
const router = express.Router();

const walletController = require("../controllers/userWalletControllers");
const jwtMiddleware = require("../middlewares/jwtMiddleware");

// GET wallet by user
router.get("/:user_id", jwtMiddleware.verifyToken, walletController.getWalletByUserId);

module.exports = router;
