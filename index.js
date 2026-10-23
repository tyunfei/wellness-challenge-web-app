const app = require("./src/app");

if (process.env.NODE_ENV === "production" &&
    (!process.env.JWT_SECRET_KEY || process.env.JWT_SECRET_KEY.length < 32 ||
     process.env.JWT_SECRET_KEY.startsWith("REPLACE_"))) {
  console.error("Production requires a fresh random JWT secret (32+ characters).");
  process.exit(1);
}

const port = Number(process.env.PORT || 3000);
const startServer = () => app.listen(port, "0.0.0.0", () => {
  console.log("Wellness Challenge listening on port " + port);
});

// Optional first-run bootstrap; refuses to change a partially populated DB.
if (process.env.DEMO_AUTO_INIT === "true") {
  require("./scripts/setupFreshDatabase")()
    .then(startServer)
    .catch(error => {
      console.error("Database initialization failed:", error.message);
      process.exit(1);
    });
} else {
  startServer();
}
