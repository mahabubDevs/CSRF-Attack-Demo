const express = require('express');
const app = express();
app.use(express.static('.'));
app.listen(4000, () => console.log('Attacker site on http://localhost:4000'));
