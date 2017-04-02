/**
 * Created by Afonso on 25/03/2017.
 */
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

function createUser(name, email, passwordHash, type, businessField, collaboratorNum, role, emailConfirmationToken,
                    callback, next) {
  pool.query('INSERT INTO users' +
  '(name, email, passwordHash, type, businessField, colaboratorNum, role, emailConfirmationToken)' +
  'VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [name, email, passwordHash, type, businessField, collaboratorNum, role, emailConfirmationToken],
    function (err, rows, fields) {
      callback(err);
    });
}

module.exports = {
  createUser: createUser,
};
