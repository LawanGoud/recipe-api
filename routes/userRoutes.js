const express = require("express");
const router = express.Router();
const User = require("../models/User");
const initializeDB = require("../db");

router.use(async (req, res, next) => {
  req.db = await initializeDB();
  next();
});

router.post("/", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const result = await req.db.run(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, password]
    );

    res.json({
      id: result.lastID,
      username,
      email,
    });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const rows = await req.db.all("SELECT * FROM users");
    const users = rows.map((row) => User.fromDbRow(row));

    res.json({ users });
  } catch (error) {
    console.error("Error getting users:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const row = await req.db.get("SELECT * FROM users WHERE id = ?", [userId]);

    if (!row) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const user = User.fromDbRow(row);
    res.json({ user });
  } catch (error) {
    console.error("Error getting user:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  const userId = req.params.id;
  const { username, email, password } = req.body;

  try {
    await req.db.run(
      "UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?",
      [username, email, password, userId]
    );

    res.json({
      id: userId,
      username,
      email,
    });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    await req.db.run("DELETE FROM users WHERE id = ?", [userId]);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
