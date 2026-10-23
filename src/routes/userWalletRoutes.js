const express = require("express");
const router = express.Router();
const walletController = require("../controllers/userWalletControllers");
const jwtMiddleware = require("../middlewares/jwtMiddleware");

router.get("/:user_id", jwtMiddleware.verifyToken, (req, res, next) => {
  if (String(req.params.user_id) !== String(res.locals.userId)) {
    return res.status(403).json({ error: "You can only view your own wallet." });
  }
  next();
}, walletController.getWalletByUserId);

module.exports = router;
