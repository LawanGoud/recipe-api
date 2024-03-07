class User {
  constructor(id, username, email, password) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
  }

  static fromDbRow(row) {
    return new User(row.id, row.username, row.email, row.password);
  }
}

module.exports = User;
