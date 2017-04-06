/**
 * Created by Afonso on 25/03/2017.
 */
var mysql = require('mysql');

var pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'root',
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
  getIdea: function (id, next) {
    pool.query(
      'SELECT users.name AS creator,ideas.name, ideas.description,' +
      'ideas.solutionTechnicalCompetence, ideas.uncertaintyToSolve, ideas.techHumanResources,' +
      'ideas.resultsToProduce ' +
      'FROM ideas ' +
      'JOIN users ' +
      'ON users.id = ideas.idCreator ' +
      'WHERE ideas.id = ?;', [id], function (err, result) {
        if (typeof next === 'function')
          next(result);
      });
  },

  getTeamMembers: function (id, next) {
    pool.query(
      'SELECT users.name ' +
      'FROM users ' +
      'JOIN ideamember ON ideamember.idMember = users.id ' +
      'JOIN ideas ON ideamember.idIdea = ideas.id ' +
      'WHERE ideas.id = ?;', [id], function (err, result) {
        if (typeof next === 'function')
          next(result);
      });
  },
};
