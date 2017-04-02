var mysql = require('mysql');

var pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  database: 'irp',
});

// Exemplo

/*
 function getUsers(next) {
 pool.query('SELECT * FROM Utilizador', function (err, rows, fields) {
 if (typeof next === 'function')
 next(rows);
 });
 }
 */

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
    ' WHERE emailConfirmationToken = ? RETURNING id', [token], function (error, results, fields) {
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
