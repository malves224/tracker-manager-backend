const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { User } = require('./controllers');

const port = process.env.PORT || 3001;
const app = express();

app.use([cors(), bodyParser.json()]);

app.get('/', (req, res) => res.send());

app.post('/Login', User.login);

app.listen(port, () => console.log(`app listening on port ${port}!`));

module.exports = app;