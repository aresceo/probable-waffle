const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const db = require('./database');
const paypal = require('./paypal');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { validateItalianCity } = require('./models/User');
const { hashToken, verifyPassword, hashPassword } = require('./models/User');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 4000;
const JWT_SECRET = 'supersegreto';

// Middlewares
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// --- Auth routes e sistema persistente
app.post('/api/register', async (req, res) => {
  const { username, email, password, city, gender, seeking, bio } = req.body;
  if (!username || !email || !password || !city || !gender || !seeking || !bio) return res.status(400).send('Campi mancanti');
  if (!validateItalianCity(city)) return res.status(400).send('Città non valida');
  if (bio.length < 5) return res.status(400).send('Bio troppo corta');
  const exists = await db.checkUserExists(username, email);
  if (exists) return res.status(409).send('Username o email già usati');
  const hashed = await hashPassword(password);
  const userId = await db.createUser({ username, email, password: hashed, city, gender, seeking, bio });
  res.status(201).json({ success: true, userId });
});

app.post('/api/login', async (req, res) => {
  const { usernameOrEmail, password, rememberMe } = req.body;
  const user = await db.getUserByUsernameOrEmail(usernameOrEmail);
  if (!user || !(await verifyPassword(password, user.password))) return res.status(401).send('Credenziali errate');
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true, secure: true });
  if (rememberMe) {
    const persistentToken = uuidv4();
    const hashedPersistent = hashToken(persistentToken);
    await db.storePersistentToken(user.id, hashedPersistent);
    res.cookie('rememberMe', persistentToken, { httpOnly: true, secure: true, maxAge: 30*24*3600*1000 });
  }
  res.json({ success: true });
});

// Middleware per autenticazione
function authMiddleware(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).send('Non autenticato');
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).send('Token non valido');
  }
}

// Cookie persistente
app.use(async (req, res, next) => {
  if (!req.cookies.token && req.cookies.rememberMe) {
    const hashedPersistent = hashToken(req.cookies.rememberMe);
    const user = await db.getUserByPersistentToken(hashedPersistent);
    if (user && user.persistent_token_expiry > Date.now()) {
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: true, secure: true });
      req.user = { id: user.id };
    }
  }
  next();
});

app.post('/api/logout', authMiddleware, async (req, res) => {
  await db.deletePersistentToken(req.user.id);
  res.clearCookie('token');
  res.clearCookie('rememberMe');
  res.json({ success: true });
});

// --- Home e profili bot
app.get('/api/home', authMiddleware, async (req, res) => {
  const user = await db.getUserById(req.user.id);
  let profiles = [];
  if (user.gender === 'maschio') {
    profiles = await db.getBotProfiles(user.city, user.seeking);
  }
  profiles = profiles.concat(await db.getUserProfiles(user.city, user.seeking, user.id));
  res.json({ profiles });
});

// --- Like/Messaggi
app.post('/api/message', authMiddleware, async (req, res) => {
  const { toUserId, message } = req.body;
  const sender = await db.getUserById(req.user.id);
  if (sender.tokens < 10) {
    return res.status(402).json({ redirect: '/acquista-gettoni' });
  }
  await db.createMessage(req.user.id, toUserId, message);
  await db.decrementTokens(req.user.id, 10);
  res.json({ success: true });
});

// --- Notifiche e messaggi bot
app.get('/api/messages', authMiddleware, async (req, res) => {
  // Messaggi ricevuti, incluse notifiche bot se maschio
  const messages = await db.getMessagesForUser(req.user.id);
  res.json({ messages });
});

// --- Gettoni & PayPal
app.post('/api/buy-tokens', authMiddleware, async (req, res) => {
  const { amount } = req.body; // 59.99, 149.99, 289.99
  const tokenMap = { "59.99": 200, "149.99": 500, "289.99": 1000 };
  const paypalLink = paypal.generateLink(amount);
  req.session.pendingTokens = tokenMap[amount];
  res.json({ paypalLink });
});

app.post('/api/paypal/webhook', async (req, res) => {
  // Verifica pagamento con api di paypal (vedi paypal.js)
  const { paymentId, payerId, amount, userId } = req.body;
  const isPaid = await paypal.verifyPayment(paymentId, payerId, amount);
  if (isPaid) {
    await db.incrementTokens(userId, amount);
    res.json({ success: true });
  } else {
    res.status(400).send('Pagamento non valido');
  }
});

// --- Personalizzazione bot
app.get('/api/bot-profiles', async (req, res) => {
  const bots = await db.getAllBotProfiles();
  res.json({ bots });
});

app.post('/api/bot-profiles', async (req, res) => {
  // Salva modifiche ai profili bot (solo admin)
  await db.updateBotProfile(req.body);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});