const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const validateToken = require('./auth/validateToken');
const {
  User, MenuItems, Pages, Profiles,
} = require('./controllers');

const port = process.env.PORT || 3001;
const app = express();
const ROTA_PROFILE_ID = '/Profile/:id';

app.use([cors(), bodyParser.json()]);

app.get('/', (req, res) => res.send());

app.post('/Login', User.login);

app.use(validateToken);

app.get('/MenuItems', MenuItems.getMenuItems);

app.get('/UserPages', Pages.getPagesAllowed);

app.get('/Pages', Pages.getAllPages);

app.delete(ROTA_PROFILE_ID, Profiles.deleteProfile);

app.get(ROTA_PROFILE_ID, Profiles.getById);

app.put(ROTA_PROFILE_ID, Profiles.edit);

app.post('/Profile', Profiles.create);

app.get('/Profile', Profiles.getAll);

app.post('/User', User.create);

app.listen(port, () => console.log(`app listening on port ${port}!`));

module.exports = app;
