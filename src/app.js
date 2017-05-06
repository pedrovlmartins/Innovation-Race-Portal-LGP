'use strict';

const path = require('path');
const hbs = require('hbs');
const hbsutils = require('hbs-utils')(hbs);

const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bb = require('express-busboy');
const session = require('express-session');
const validate = require('form-validate');
const express = require('express');

// Constants
const PORT = 8080;

global.__base = __dirname + '/';

// Paths
const routes = require(path.join(__base, 'routes', 'index'));

const about = require(path.join(__base, 'routes', 'about'));
const contact = require(path.join(__base, 'routes', 'contact'));
const innovationRules = require(path.join(__base, 'routes', 'innovationRules'));
const manageUsers = require(path.join(__base, 'routes', 'manageUsers'));
const manageIdeas = require(path.join(__base, 'routes', 'manageIdeas'));
const ideas = require(path.join(__base, 'routes', 'ideas'));
const users = require(path.join(__base, 'routes', 'users'));
const classification = require(path.join(__base, 'routes', 'classification'));
const ranking = require(path.join(__base, 'routes', 'ranking'));
const bmc = require(path.join(__base, 'routes', 'bmc'));
const errorPage = require(path.join(__base, 'routes', 'errorPage'));
const auth = {
  activate: require(path.join(__base, 'routes', 'auth', 'activate')),
  login: require(path.join(__base, 'routes', 'auth', 'login')),
  logout: require(path.join(__base, 'routes', 'auth', 'logout')),
  register: require(path.join(__base, 'routes', 'auth', 'register')),
};

// App
const app = express();

// View engine setup
const helpers = require(path.join(__base, 'lib', 'helpers'));
app.set('view engine', 'hbs');
app.set('views', path.join(__base, 'views'));
hbs.registerPartials(path.join(__base, 'views', 'partials'));
hbsutils.registerWatchedPartials(path.join(__base, 'views', 'partials'));
hbs.registerHelper('add-pagination', helpers.addPagination);
hbs.registerHelper('compare', helpers.compare);

// Favicon
app.use(favicon(path.join(__dirname, 'public', 'images', 'ico', 'favicon.ico')));

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
app.use('/about', about);
app.use('/auth/activate', auth.activate);
app.use('/auth/login', auth.login);
app.use('/auth/logout', auth.logout);
app.use('/auth/register', auth.register);
app.use('/bmc', bmc);
app.use('/contact', contact);
app.use('/classification', classification);
app.use('/ideas', ideas);
app.use('/innovationRules', innovationRules);
app.use('/manageUsers', manageUsers);
app.use('/manageIdeas', manageIdeas);
app.use('/ranking', ranking);
app.use('/users', users);

// Favicon
app.use(favicon(path.join(__base, 'public', 'images', 'ico', 'favicon.ico')));

// Static Dirs
app.use(express.static(path.join(__base, 'public')));
app.use(express.static(path.join(__base, 'images')));

if (!module.parent) {
  app.listen(PORT);
}

console.log('Running on http://localhost:' + PORT);

module.exports = app;
