const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./app.db');

// Funzioni di utilità per utenti, messaggi, bot, token persistente...
// Tutte le funzioni sono async e usano promesse.

module.exports = {
  // USER
  checkUserExists: (username, email) => new Promise(...),
  getUserByUsernameOrEmail: (usernameOrEmail) => new Promise(...),
  createUser: (user) => new Promise(...),
  getUserById: (id) => new Promise(...),
  // TOKEN
  storePersistentToken: (userId, token) => new Promise(...),
  getUserByPersistentToken: (token) => new Promise(...),
  deletePersistentToken: (userId) => new Promise(...),
  // BOT
  getBotProfiles: (city, gender) => new Promise(...),
  getAllBotProfiles: () => new Promise(...),
  updateBotProfile: (bot) => new Promise(...),
  // PROFILI
  getUserProfiles: (city, seeking, excludeId) => new Promise(...),
  // MESSAGGI
  createMessage: (from, to, text) => new Promise(...),
  getMessagesForUser: (userId) => new Promise(...),
  // GETTONI
  decrementTokens: (userId, qty) => new Promise(...),
  incrementTokens: (userId, qty) => new Promise(...),
  // ...
};