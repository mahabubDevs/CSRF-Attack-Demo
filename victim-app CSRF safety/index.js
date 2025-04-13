const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const csurf = require('csurf');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// Session setup
app.use(session({
  secret: 'supersecret',
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: true }
}));

// CSRF middleware (after session)
app.use(csurf());

// Error handler for CSRF errors
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).send('⛔ Invalid CSRF token!');
  }
  next();
});

// Fake login
app.get('/login', (req, res) => {
  req.session.username = 'korla';
  res.send('Logged in as korla. <a href="/transfer">Go to transfer</a>');
});

// Transfer form with CSRF token included
app.get('/transfer', (req, res) => {
  if (!req.session.username) return res.status(403).send('Not logged in!');
  const token = req.csrfToken();
  res.send(`
    <h2>Transfer Money</h2>
    <form method="POST" action="/transfer">
      <input type="hidden" name="_csrf" value="${token}">
      <input name="to" placeholder="Recipient"><br>
      <input name="amount" placeholder="Amount"><br>
      <button type="submit">Send</button>
    </form>
  `);
});

// Handle transfer
app.post('/transfer', (req, res) => {
  if (!req.session.username) return res.status(403).send('Forbidden');
  console.log(`[✅💸] ${req.session.username} sent $${req.body.amount} to ${req.body.to}`);
  res.send('✅ Transfer successful!');
});

app.listen(5000, () => console.log('🛡️ Victim app (protected) running at http://localhost:5000'));
