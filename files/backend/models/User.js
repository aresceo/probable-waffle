const bcrypt = require('bcrypt');
const crypto = require('crypto');
const italianCities = require('../italian_cities.json'); // Array di nomi città italiane

exports.hashPassword = async (password) => await bcrypt.hash(password, 10);
exports.verifyPassword = async (password, hash) => await bcrypt.compare(password, hash);
exports.hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');
exports.validateItalianCity = (city) => italianCities.includes(city);