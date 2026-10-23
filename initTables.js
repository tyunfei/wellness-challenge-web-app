// ##############################################################
// REQUIRE MODULES
// ##############################################################
const pool = require("../services/db");

// ##############################################################
// DEFINE SQL STATEMENTS
// ##############################################################
const SQLSTATEMENT = `
DROP TABLE IF EXISTS UserCompletion;
DROP TABLE IF EXISTS ChallengeReward;
DROP TABLE IF EXISTS Pet;
DROP TABLE IF EXISTS PetSpecies;
DROP TABLE IF EXISTS UserWallet;
DROP TABLE IF EXISTS WellnessChallenge;
DROP TABLE IF EXISTS User;


CREATE TABLE User (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  points INT DEFAULT 0
);


CREATE TABLE WellnessChallenge (
  challenge_id INT AUTO_INCREMENT PRIMARY KEY,
  creator_id INT,
  description TEXT NOT NULL,
  points INT NOT NULL
);



CREATE TABLE UserCompletion (
  completion_id INT AUTO_INCREMENT PRIMARY KEY,
  challenge_id INT NOT NULL,
  user_id INT NOT NULL,
  details TEXT,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);




CREATE TABLE UserWallet (
  user_id INT PRIMARY KEY,
  coins INT DEFAULT 0
);



CREATE TABLE PetSpecies (
  species_id INT AUTO_INCREMENT PRIMARY KEY,
  species_name VARCHAR(100),
  rarity VARCHAR(50)
);


CREATE TABLE Pet (
  pet_id INT AUTO_INCREMENT PRIMARY KEY,
  owner_id INT NOT NULL,
  species_id INT NOT NULL,
  pet_name VARCHAR(100),
  level INT DEFAULT 1,
  xp INT DEFAULT 0,
  is_active BOOLEAN DEFAULT 0
);



CREATE TABLE ChallengeReward (
  reward_id INT AUTO_INCREMENT PRIMARY KEY,
  challenge_id INT NOT NULL,
  coins_reward INT DEFAULT 0,
  pet_xp_reward INT DEFAULT 0
);


INSERT INTO PetSpecies (species_name, rarity) VALUES
('Dog', 'Common'),
('Cat', 'Common'),
('Otter', 'Common'),

('Slug', 'Uncommon'),
('Hammerhead shark', 'Uncommon'),
('Dolphin', 'Uncommon'),

('Zebra', 'Rare'),
('Gorilla', 'Rare'),
('Shrimp', 'Rare'),

('Panda', 'Ultra Rare'),
('Partridge', 'Ultra Rare'),
('Toucan', 'Ultra Rare'),

('Unicorn', 'Legendary'),
('Dragon', 'Legendary'),
('Giraffe', 'Legendary');


INSERT INTO wellnesschallenge (creator_id, description, points)
VALUES
(NULL, 'Sleep like a boss - Get 7+ hours of sleep', 10),
(NULL, 'Stairs over elevator? Respect. - Take the stairs today', 20),
(NULL, 'Digital detox (mini edition) - No phone for 1 hour', 10),
(NULL, 'Touch grass IRL - Take a 15-minute walk outside', 10),
(NULL, 'IRL > DMs - Talk to a friend face-to-face', 20),
(NULL, 'Declutter your chaos - Clean your desk or room', 20),
(NULL, 'Help a homie - Assist someone without being asked', 20);



INSERT INTO ChallengeReward (challenge_id, coins_reward, pet_xp_reward) VALUES

(1, 20, 15),   -- Put pet to sleep
(2, 20, 15),   -- Shower pet
(3, 20, 15),   -- Bring pet to toilet
(4, 25, 20),   -- Walk your pet
(5, 25, 20),   -- Feed your pet
(6, 20, 25),   -- Outdoor play
(7, 20, 25);   -- Take pet to school to learn something new!
`;

// ##############################################################
// RUN SQL STATEMENTS
// ##############################################################
pool.query(SQLSTATEMENT, (error) => {
  if (error) {
    console.error("Error initializing tables:", error);
  } else {
    console.log("Tables and sample data created successfully");
  }
  process.exit();
})
