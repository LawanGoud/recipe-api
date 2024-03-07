const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const userRoutes = require("./routes/userRoutes");

const recipeRoutes = require("./routes/recipeRoutes");

const app = express();
const port = 3000;

const dbPath = path.join(__dirname, "recipes.db");

const initializeDBAndServer = async () => {
  try {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS recipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        ingredients TEXT NOT NULL,
        instructions TEXT NOT NULL
      );
    `);

    console.log("Database connected successfully");

    app.use((req, res, next) => {
      req.db = db;
      next();
    });

    app.use(express.json());
    app.use("/users", userRoutes);
    app.use("/recipes", recipeRoutes);

    app.listen(port, () => {
      console.log(`Server Running at port http://localhost:${port}`);
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();
