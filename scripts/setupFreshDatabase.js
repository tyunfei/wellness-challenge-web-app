// Safe first-run demo initialization. Never drops existing tables.
const fs = require("node:fs");
const path = require("node:path");
const db = require("../src/services/db");
const required = ["User", "WellnessChallenge", "UserCompletion", "UserWallet", "PetSpecies", "Pet", "ChallengeReward"];

async function setupFreshDatabase() {
  const client = db.promise();
  const [existing] = await client.query(
    "SELECT TABLE_NAME FROM information_schema.tables WHERE TABLE_SCHEMA = DATABASE()"
  );
  const names = new Set(existing.map(row => row.TABLE_NAME.toLowerCase()));
  if (required.every(table => names.has(table.toLowerCase()))) {
    console.log("Demo schema exists; no changes made.");
    return;
  }
  if (existing.length) throw new Error("Database isn't empty. Refusing destructive or partial setup.");

  const source = fs.readFileSync(path.join(__dirname, "../src/configs/initTables.js"), "utf8");
  const tick = String.fromCharCode(96);
  const marker = "const SQLSTATEMENT = " + tick;
  const begin = source.indexOf(marker);
  const end = source.indexOf(tick + ";", begin + marker.length);
  if (begin < 0 || end < 0) throw new Error("Schema SQL not found.");

  const sql = source.slice(begin + marker.length, end)
    .replace(/^\s*DROP TABLE IF EXISTS [A-Za-z_]+;\s*$/gmi, "\n")
    .replace(/--[^\r\n]*/g, "");
  const statements = sql.split(";").map(x => x.trim()).filter(Boolean);
  if (statements.length !== 10 ||
      statements.filter(x => /^CREATE TABLE\s/i.test(x)).length !== 7 ||
      statements.filter(x => /^INSERT INTO\s/i.test(x)).length !== 3) {
    throw new Error("Unexpected schema input; no changes made.");
  }
  for (const statement of statements) await client.query(statement);
  console.log("Fresh demo tables and sample data created.");
}

module.exports = setupFreshDatabase;
if (require.main === module) {
  setupFreshDatabase()
    .then(() => db.promise().end())
    .catch(async error => {
      console.error("Demo bootstrap failed:", error.message);
      await db.promise().end().catch(() => {});
      process.exitCode = 1;
    });
}
