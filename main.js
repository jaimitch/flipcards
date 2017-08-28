const express = require('express');
const fs = require('file-system');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mustacheExpress = require('mustache-express');
const data = require('./data.json');
const session = require('express-session');
const users = require('./routes/user');
const flipcard = require('./routes/flipcard');

const application = express();

application.engine('mustache', mustacheExpress());
application.set('views', './views');
application.set('view engine', 'mustache');

application.use(session({
    secret: 'whoooaanelly',
    saveUninitialized: true,
    resave: false
}));
application.use(express.static(__dirname + '/public'));

application.use(bodyParser.urlencoded());

application.use(users);
application.use(flipcard);

application.listen(3000);

module.exports = application;