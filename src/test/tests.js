/**
 * Created by Afonso on 25/03/2017.
 */

global.__base = __dirname + '/../';

const path = require('path');
var assert = require('assert');
var chai = require('chai');
var chaiHttp = require('chai-http');
var config = require(path.join(__base, 'config'));
const irp = require(path.join(__base, 'lib', 'irp'));
var mysql = require('mysql');
var register = require(path.join(__base, 'routes', 'auth', 'register'));
var server = require(path.join(__base, 'app'));
var should = chai.should();

chai.use(chaiHttp);

describe('Array', function () {
  describe('#indexOf()', function () {
      it('should return -1 when the value is not present', function () {
          assert.equal(-1, [1, 2, 3].indexOf(4));
        });
    });
});

describe('Authentication', function () {
  beforeEach(function (done) {
    // TODO add test entries
    var connection = mysql.createConnection(config.mysql[config.env]);
    connection.query('TRUNCATE users', function (error, results, fields) {
      done();
    });
  });

  describe('Registration', function () {
    it('should fail because the form is empty', function (done) {
      chai.request(server)
        .post('/auth/register')
        .end(function (err, res) {
          // TODO expect error
          done();
        });
    });

    it('should succeed', function (done) {
      chai.request(server)
        .post('/auth/register')
        .send({
          email: 'ds34b32r98hdfg@gmail.com',
          password: '1234567',
          name: 'John Clinton',
          type: 0,
        })
        .end(function (err, res) {
          // TODO expect no error
          done();
        });
    });

    it('should fail because the email address is already registered', function (done) {
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
              // TODO expect error
              done();
            });
        });
    });

    // Logout
    // TODO Unit tests when the used is logged in. Someone needs to do log in unit tests for that.
    it('should fail because there is no user logged in', function (done) {
      chai.request(server)
        .get('/auth/logout')
        .end(function (err, res) {
          assert.equal(res.statusCode, 401);
          done();
        });
    });
  });

  afterEach(function (done) {
    console.log("NODE_ENV = " + config.env);
    console.log(config.mysql[config.env]);
    var connection = mysql.createConnection(config.mysql[config.env]);
    connection.query('TRUNCATE users', function (error, results, fields) {
      done();
    });
  });
});

describe('Idea Page', function () {
    // TODO add tests for the contents of an idea page.
    // Can only be done when the create idea US is done.

    it('should return 401 because the user is not logged in', function () {
      chai.request(server)
      .get('/ideas/1')
      .end(function(err, res) {
        assert.equal(res.statusCode, 401);
        done();
      });
    });

    it('should return 404 because the page doesn\'t exist', function () {
      chai.request(server)
      .get('/ideas/-1')
      .end(function (err, res) {
        assert.equal(res.statusCode, 404);
        done();
      });
    });
  });

describe('Action results', function () {
  var req;
  beforeEach(function () {
    req = {
      session: {
        errorMessages: [],
        successMessages: [],
      },
    };
  });

  it('should add error and success messages keeping the order in each group', function () {
    irp.addError(req, 'Error 1');
    irp.addError(req, 'Error 2');
    assert.equal('Error 1', irp.getActionResults(req).errorMessages[0]);
    assert.equal('Error 2', irp.getActionResults(req).errorMessages[1]);
    assert.equal(0, irp.getActionResults(req).successMessages.length);
    irp.addSuccess(req, 'Success 1');
    assert.equal(2, irp.getActionResults(req).errorMessages.length);
    assert.equal('Success 1', irp.getActionResults(req).successMessages[0]);
  });

  it('should clean messages', function () {
    irp.addError(req, 'Error 1');
    irp.addError(req, 'Success 1');
    irp.cleanActionResults(req);
    assert.equal(0, irp.getActionResults(req).errorMessages.length);
    assert.equal(0, irp.getActionResults(req).successMessages.length);
  });

  it('should accept new sessions', function () {
    req = {
      session: {

      },
    };

    assert.equal(0, irp.getActionResults(req).errorMessages.length);
    assert.equal(0, irp.getActionResults(req).successMessages.length);
    irp.addError(req, 'Error 1');
    assert.equal(1, irp.getActionResults(req).errorMessages.length);
  });
});
