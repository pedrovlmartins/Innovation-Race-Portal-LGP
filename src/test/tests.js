/**
 * Created by Afonso on 25/03/2017.
 */

global.__base = __dirname + '/../';

const path = require('path');
var assert = require('assert');
var chai = require('chai');
var chaiHttp = require('chai-http');
var database = require(path.join(__base, 'database', 'database'));
var register = require(path.join(__base, 'routes', 'auth', 'register'));
var server = require('../app.js');
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
  describe('Registration', function () {
    it('should fail because the form is empty', function (done) {
      chai.request(server)
        .post('/auth/register')
        .end(function (err, res) {
          res.should.have.status(403);
          done();
        });
    });
  });
});
