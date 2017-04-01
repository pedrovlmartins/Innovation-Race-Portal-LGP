'use strict';

// Modules
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bb = require('express-busboy');
const session = require('express-session');
const validate = require('form-validate');

// Paths
const routes = require(path.join(__dirname, 'routes', 'index'));
const auth = {
  register: require(path.join(__dirname, 'routes', 'auth', 'register')),
};

// Constants
const PORT = 8080;

// App
const app = express();

// View engine setup
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

// Request Handling
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(cookieParser());
app.use(session({ secret: 'sequoia' }));
app.use(validate(app));
bb.extend(app, {
  upload: true,
  allowedPath: /./,
});

// Routes
app.use('/', routes);
app.use('/auth/register', auth.register);

// Favicon
app.use(favicon(path.join(__dirname, 'public', 'images', 'ico', 'favicon.ico')));

// Static Dirs
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'images')));

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);

module.exports = app;
