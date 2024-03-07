const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const initializeDB = async () => {
  const dbPath = path.join(__dirname, "recipes.db");

  return open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
};

module.exports = initializeDB;
