'use strict';

// Modules
const express = require('express');

// Constants
const PORT = 8080;
const app = express();

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);

module.exports = app;
