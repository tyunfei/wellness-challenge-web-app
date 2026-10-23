const Pet = require("../models/petModels");
const Wallet = require("../models/userWalletModels");
const PetSpecies = require("../models/petSpeciesModels");

// rarity cost mapping
const rarityCost = {
  "Common": 50,
  "Uncommon": 70,
  "Rare": 100,
  "Ultra Rare": 170,
  "Legendary": 300
};

//////////////////////////////////////////////////////
// POST /pets (Adopt a pet)
//////////////////////////////////////////////////////
exports.adoptPet = (req, res) => {

  // Get logged-in user from JWT
  const userId = res.locals.userId;

  // Get pet info from frontend request
  const { species_id, pet_name } = req.body;

  // Basic validation
  if (!species_id || !pet_name) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // 1. Get species info
  PetSpecies.getById(species_id, (err, results) => {

    if (err) return res.status(500).json(err);

    // Species does not exist
    if (!results || results.length === 0) {
      return res.status(404).json({ message: "Pet species not found" });
    }

    // Get rarity and determine cost
    const rarity = results[0].rarity;
    const cost = rarityCost[rarity];

    // 2. Get user wallet
    Wallet.getWalletByUserId(userId, (err, wallet) => {
      if (err) return res.status(500).json(err);

      // Not enough coins
      if (wallet[0].coins < cost) {
        return res.status(403).json({
          message: "Not enough coins to adopt this pet"
        });
      }

      // 3. Deduct coins
      Wallet.deductCoins(userId, cost, () => {

        // 4. Unequip existing pets
        // Only ONE active pet allowed at a time
        Pet.unequipAllPets(userId, () => {

          // 5. Create new pet
          Pet.createPet(userId, species_id, pet_name, (err, result) => {
            if (err) return res.status(500).json(err);

            // 6. Equip new pet
            Pet.equipPet(result.insertId, () => {
              res.status(201).json({
                message: "Pet adopted and equipped successfully",
                pet_name,
                rarity,
                coins_spent: cost
              });
            });
          });
        });
      });
    });
  });
};

//////////////////////////////////////////////////////
// PUT /pets/:pet_id/equip
//////////////////////////////////////////////////////
exports.equipPet = (req, res) => {

  const userId = res.locals.userId;
  const { pet_id } = req.params;

  // 1. Unequip all pets
  Pet.unequipAllPets(userId, () => {

    // 2. Equip selected pet
    Pet.equipPet(pet_id, (err, result) => {

      // Pet ID not found
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Pet not found" });
      }

      res.status(200).json({
        message: "Pet equipped successfully",
        pet_id
      });
    });
  });
};

//////////////////////////////////////////////////////
// GET /pets/user
//////////////////////////////////////////////////////
exports.getUserPets = (req, res) => {
  const userId = res.locals.userId;

  Pet.getPetsByUser(userId, (err, pets) => {
    if (err) return res.status(500).json(err);

    // Return all user's pets
    res.status(200).json(pets);
  });
};

//////////////////////////////////////////////////////
// GET /pets/species
//////////////////////////////////////////////////////
exports.getPetSpecies = (req, res) => {
  PetSpecies.getAllSpecies((err, results) => {
    if (err) return res.status(500).json(err);

    // Add cost based on rarity
    // Attach coin cost to each species (frontend display)
    const speciesWithCost = results.map(pet => ({
      ...pet,
      cost: rarityCost[pet.rarity]
    }));

    res.status(200).json(speciesWithCost);
  });
};

