const express = require("express");
const router = express.Router();

const petController = require("../controllers/petControllers");
const jwtMiddleware = require("../middlewares/jwtMiddleware");

// Get all pet species (JWT required)
router.get(
  "/species",
  jwtMiddleware.verifyToken,
  petController.getPetSpecies
);

// Get pets owned by logged-in user
router.get(
  "/user",
  jwtMiddleware.verifyToken,
  petController.getUserPets
);

// Adopt a pet
router.post(
  "/",
  jwtMiddleware.verifyToken,
  petController.adoptPet
);

// Equip a pet
router.put(
  "/:pet_id/equip",
  jwtMiddleware.verifyToken,
  petController.equipPet
);

module.exports = router;
