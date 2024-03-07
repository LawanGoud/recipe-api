class Recipe {
  constructor(id, title, ingredients, instructions) {
    this.id = id;
    this.title = title;
    this.ingredients = ingredients;
    this.instructions = instructions;
  }

  static fromDbRow(row) {
    return new Recipe(row.id, row.title, row.ingredients, row.instructions);
  }
}

module.exports = { Recipe };
