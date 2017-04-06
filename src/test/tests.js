/**
 * Created by Afonso on 25/03/2017.
 */

global.__base = __dirname + '/../';

const path = require('path');
var assert = require('assert');
var chai = require('chai');
var chaiHttp = require('chai-http');
var config = require(path.join(__base, 'config'));
var mysql = require('mysql');
var register = require(path.join(__base, 'routes', 'auth', 'register'));
var server = require(path.join(__base, 'app'));
var should = chai.should();

chai.use(chaiHttp);

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1, 2, 3].indexOf(4));
    });
  });
});

describe('Authentication', function() {
  beforeEach(function(done) {
    // TODO add test entries
    var connection = mysql.createConnection(config.mysql[config.env]);
    connection.query('TRUNCATE users', function(error, results, fields) {
      done();
    });
  });

  describe('Registration', function() {
    it('should fail because the form is empty', function(done) {
      chai.request(server)
        .post('/auth/register')
        .end(function(err, res) {
          res.should.have.status(403);
          done();
        });
    });

    it('should succeed', function(done) {
      chai.request(server)
        .post('/auth/register')
        .send({
          email: 'ds34b32r98hdfg@gmail.com',
          password: '1234567',
          name: 'John Clinton',
          type: 0,
        })
        .end(function(err, res) {
          res.should.have.status(200);
          done();
        });
    });

    it('should fail because the email address is already registered', function(done) {
      chai.request(server)
        .post('/auth/register')
        .send({
          email: 'ds34b32r98hdfg@gmail.com',
          password: '1234567',
          name: 'John Clinton',
          type: 0,
        })
        .end(function (err, res) {
          chai.request(server)
            .post('/auth/register')
            .send({
              email: 'ds34b32r98hdfg@gmail.com',
              password: '1234567',
              name: 'John Clinton',
              type: 0,
            })
            .end(function (err, res) {
              res.should.not.have.status(200);
              done();
            });
        });
    });
  });

  afterEach(function(done) {
    var connection = mysql.createConnection(config.mysql[config.env]);
    connection.query('TRUNCATE users', function(error, results, fields) {
      done();
    });
  });
});
