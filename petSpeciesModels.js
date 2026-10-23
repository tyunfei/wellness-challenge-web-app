const db = require("../services/db");


// Get all pet species
exports.getAllSpecies = (callback) => {
  const sql = `
    SELECT species_id, species_name, rarity
    FROM PetSpecies
  `;
  db.query(sql, callback);
};

// Get species by ID (used during adoption)
exports.getById = (speciesId, callback) => {
  const sql = `
    SELECT * FROM PetSpecies WHERE species_id = ?
  `;
  db.query(sql, [speciesId], (err, results) => {
    callback(err, results);
  });
};
