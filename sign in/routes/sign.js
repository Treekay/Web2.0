"use strict";

var express = require('express');
var router = express.Router();

var sign = require('../controller/sign');

/* sign out */
router.get('/out', function (req, res) {
  sign.signOut(req, res);
});

/* GET sign page. */
router.get('*', function (req, res, next) {
  sign.render(req, res);
});


/* sign in */

router.post('/', function (req, res) {
  sign.signIn(req, res);
});

exports = module.exports = router;