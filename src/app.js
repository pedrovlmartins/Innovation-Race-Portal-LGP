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

// Paths
const routes = require(path.join(__dirname, 'routes', 'index'));
const about = require(path.join(__dirname, 'routes', 'about'));
const contact = require(path.join(__dirname, 'routes', 'contact'));
const innovationRules = require(path.join(__dirname, 'routes', 'innovationRules'));
const manageUsers = require(path.join(__dirname, 'routes', 'manageUsers'));
const ideaPage = require(path.join(__dirname, 'routes', 'ideaPage'));

// Constants
const PORT = 8080;

// App
const app = express();

// View engine setup
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

// Routes
app.use('/', routes);
app.use('/about', about);
app.use('/contact', contact);
app.use('/innovationRules', innovationRules);
app.use('/manageUsers', manageUsers);
app.use('/ideaPage', ideaPage);

// Favicon
app.use(favicon(path.join(__dirname, 'public', 'images', 'ico', 'favicon.ico')));

// Request Handling
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(cookieParser());
app.use(session({ secret: 'sequoia' }));
bb.extend(app, {
  upload: true,
  allowedPath: /./,
});

// Static Dirs
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'images')));

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);

module.exports = app;
