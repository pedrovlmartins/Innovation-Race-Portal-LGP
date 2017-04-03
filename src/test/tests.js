/**
 * Created by Afonso on 25/03/2017.
 */

global.__base = __dirname + '/../';

const path = require('path');
var assert = require('assert');
var database = require(path.join(__base, 'database', 'database'));
var register = require(path.join(__base, 'routes', 'auth', 'register'));

describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, [1, 2, 3].indexOf(4));
    });
  });
});
