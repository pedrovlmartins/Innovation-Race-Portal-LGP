var mysql = require('mysql');

var pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '14edgar14',
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

  /*listAllUsers: function (token, callback, next) {
    pool.query('Select * from users', [token], function (error, results, fields) {
      if (error) {
        console.error(error);
        callback(error);
      } else {
        console.log(results);
        callback(null, results.affectedRows == 0 ? false : true);
      }
    });
  },*/

  listAllUsers: function (next) {
    pool.query('SELECT * FROM users', function (error, results) {
      if (typeof next === 'function')
        next(results);
    });
  },
};
