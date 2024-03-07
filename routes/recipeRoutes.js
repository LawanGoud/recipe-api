const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");

const initializeDB = require("../db");

// Use middleware to initialize the database connection
router.use(async (req, res, next) => {
  req.db = await initializeDB();
  next();
});

router.get("/", async (req, res) => {
  try {
    const rows = await req.db.all("SELECT * FROM recipes");
    const recipes = rows.map((row) => Recipe.fromDbRow(row));

    res.json({ recipes });
  } catch (error) {
    console.error("Error getting recipes:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  const recipeId = req.params.id;

  try {
    const row = await req.db.get("SELECT * FROM recipes WHERE id = ?", [
      recipeId,
    ]);

    if (!row) {
      res.status(404).json({ error: "Recipe not found" });
      return;
    }

    const recipe = Recipe.fromDbRow(row);
    res.json({ recipe });
  } catch (error) {
    console.error("Error getting recipe:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  const { title, ingredients, instructions } = req.body;

  try {
    const result = await req.db.run(
      "INSERT INTO recipes (title, ingredients, instructions) VALUES (?, ?, ?)",
      [title, ingredients, instructions]
    );

    res.json({
      id: result.lastID,
      title,
      ingredients,
      instructions,
    });
  } catch (error) {
    console.error("Error creating recipe:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  const recipeId = req.params.id;
  const { title, ingredients, instructions } = req.body;

  try {
    await req.db.run(
      "UPDATE recipes SET title = ?, ingredients = ?, instructions = ? WHERE id = ?",
      [title, ingredients, instructions, recipeId]
    );

    res.json({
      id: recipeId,
      title,
      ingredients,
      instructions,
    });
  } catch (error) {
    console.error("Error updating recipe:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  const recipeId = req.params.id;

  try {
    await req.db.run("DELETE FROM recipes WHERE id = ?", [recipeId]);
    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Error deleting recipe:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
