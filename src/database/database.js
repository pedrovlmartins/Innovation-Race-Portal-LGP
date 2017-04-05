const path = require('path');
var app = require(path.join(__base, 'app'));
var config = require(path.join(__base, 'config'));
var mysql = require('mysql');

var pool = mysql.createPool(config.mysql[config.env]);

module.exports = {
  createUser: function (name, email, passwordHash, type, businessField, collaboratorNum, role,
                        emailConfirmationToken, callback, next) {
    pool.query('INSERT INTO users' +
      ' (name, email, passwordHash, type, businessField, colaboratorNum' +
      ', role, emailConfirmationToken)' +
      ' VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, email, passwordHash, type, businessField, collaboratorNum, role, emailConfirmationToken],
      function (err, rows, fields) {
        callback(err);
      });
  },

  validateAccount: function (token, callback, next) {
    pool.query('UPDATE users SET emailConfirmationToken = NULL, accountStatus = 1' +
    ' WHERE emailConfirmationToken = ?', [token], function (error, results, fields) {
      if (error) {
        console.error(error);
        callback(error);
      } else {
        console.log(results);
        callback(null, results.affectedRows == 0 ? false : true);
      }
    });
  },
};
