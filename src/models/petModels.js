const db = require("../services/db");

// Check if user already owns this species
exports.hasPetSpecies = (userId, speciesId, callback) => {
  const sql = `
    SELECT * FROM Pet
    WHERE owner_id = ? AND species_id = ?
  `;
  db.query(sql, [userId, speciesId], callback);
};

// Create new pet (unlock)
// Called when user adopts a new pet
// Default is_active = 0 (not active yet)
exports.createPet = (userId, speciesId, petName, callback) => {
  const sql = `
    INSERT INTO Pet (owner_id, species_id, pet_name, is_active)
    VALUES (?, ?, ?, 0)
  `;
  db.query(sql, [userId, speciesId, petName], callback);
};


// Get all pets owned by a user (WITH species name for images)
// Used by dashboard + pets page
// JOIN used to get species name + rarity
exports.getPetsByUser = (userId, callback) => {
  const sql = `
    SELECT 
      p.pet_id,
      p.pet_name,
      p.xp,
      p.is_active,
      s.species_name,
      s.rarity
    FROM Pet p
    JOIN PetSpecies s
      ON p.species_id = s.species_id
    WHERE p.owner_id = ?
  `;

  db.query(sql, [userId], callback);
};



// Add XP to user's pet
// Called when user completes challenge
// Adds XP 
exports.addPetXP = (petId, xp, callback) => {
  const sql = `
    UPDATE Pet
    SET xp = xp + ?
    WHERE pet_id = ?
  `;
  db.query(sql, [xp, petId], callback);
};



// Unequip all pets for user
// Used before equipping another pet
// Ensures ONLY one active pet
exports.unequipAllPets = (userId, callback) => {
  const sql = `
    UPDATE Pet
    SET is_active = 0
    WHERE owner_id = ?
  `;
  db.query(sql, [userId], callback);
};


// Equip selected pet
// Sets chosen pet as active
exports.equipPet = (petId, callback) => {
  const sql = `
    UPDATE Pet
    SET is_active = 1
    WHERE pet_id = ?
  `;
  db.query(sql, [petId], callback);
};


// GET CURRENTLY EQUIPPED PET
// Used when awarding pet XP
// Only returns active pet
exports.getEquippedPet = (userId, callback) => {
  const sql = `
    SELECT 
      p.pet_id,
      p.pet_name,
      p.xp,
      s.species_name
    FROM Pet p
    JOIN PetSpecies s 
      ON p.species_id = s.species_id
    WHERE p.owner_id = ?
      AND p.is_active = 1
    LIMIT 1
  `;

  db.query(sql, [userId], callback);
};

