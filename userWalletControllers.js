const Wallet = require("../models/userWalletModels");

// GET /wallet/:user_id
exports.getWalletByUserId = (req, res) => {
  const { user_id } = req.params;

  Wallet.getWalletByUserId(user_id, (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (!results || results.length === 0) {
      return res.status(404).json({ error: "Wallet not found" });
    }

    res.status(200).json(results[0]);
  });
};
