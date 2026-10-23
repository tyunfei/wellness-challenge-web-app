// src/app.js
const express = require("express");

// Import routes
const userRoutes = require("./routes/userRoutes");
const challengeRoutes = require("./routes/challengeRoutes");
const petRoutes = require("./routes/petRoutes")
const walletRoutes = require("./routes/userWalletRoutes");
const authRoutes = require("./routes/authRoutes");


const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve frontend files
app.use(express.static("public"));

// Routes
app.use("/users", userRoutes);
app.use("/challenge", challengeRoutes);   // qn 5 
app.use("/challenges", challengeRoutes);
app.use("/pets",petRoutes)
app.use("/wallet", walletRoutes);
app.use("/auth", authRoutes); //CA2


// Root test route 
app.get("/", (req, res) => {
  res.send("Gamified Wellness Challenge API running");
});

module.exports = app;


