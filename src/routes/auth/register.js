var express = require('express');
var router = express.Router();

router.post('/', function (req, res) {
  if (!req.body.name || typeof req.body.name != 'string') {
    res.status(400).send('400 Bad Request');
    return;
  }

  req.Validator.validate('name', {
    length: {
      min: 3,
      max: 200,
    },
  })
    .filter('name', {
      trim: true,
    })
    .validate('password', {
      length: {
        min: 7,
      },
    })
    .filter('password', {
      stripTags: false,
      escapeHTML: false,
    });

  /*
   * Call the "getErrors" method to start the validation
   */
  req.Validator.getErrors(function (errors) {
    /*
     * ... Your further rendering logic. e.g. res.render('view', { errors: errors });
     */

    // TODO
    res.status(400).send(errors);
  });
});

module.exports = router;
