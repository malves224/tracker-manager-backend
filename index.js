const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const validateToken = require('./auth/validateToken');
const { User, MenuItems } = require('./controllers');

const port = process.env.PORT || 3001;
const app = express();

app.use([cors(), bodyParser.json()]);

app.get('/', (req, res) => res.send());

app.post('/Login', User.login);

app.use(validateToken);

app.get('/MenuItems', MenuItems.getMenuItems);

app.get('/UserPages', MenuItems.getPagesAllowed);

app.listen(port, () => console.log(`app listening on port ${port}!`));

module.exports = app;