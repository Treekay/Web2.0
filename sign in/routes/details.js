"use strict";

var express = require('express');
var router = express.Router();

var details = require('../controller/details');

/* GET detail page. */
router.get('/', function (req, res, next) {
  if (req.query.username || req.session.signed)
    details(req, res);
  else
    next();
});

module.exports = router;