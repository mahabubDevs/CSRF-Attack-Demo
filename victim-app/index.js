const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'supersecret',
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: true }
}));

// Fake login route
app.get('/login', (req, res) => {
  req.session.username = 'korla';
  res.send('Logged in as korla. <a href="/transfer">Go to transfer</a>');
});

// Transfer page
app.get('/transfer', (req, res) => {
  if (!req.session.username) return res.status(403).send('Not logged in!');
  res.send(`
    <h2>Transfer Money</h2>
    <form method="POST" action="/transfer">
      <input name="to" placeholder="Recipient"><br>
      <input name="amount" placeholder="Amount"><br>
      <button type="submit">Send</button>
    </form>
  `);
});

// Handle transfer
app.post('/transfer', (req, res) => {
  if (!req.session.username) return res.status(403).send('Forbidden');
  console.log(`[💸] ${req.session.username} sent $${req.body.amount} to ${req.body.to}`);
  res.send('Transfer successful!');
});

app.listen(3000, () => console.log('Victim app running on http://localhost:3000'));
