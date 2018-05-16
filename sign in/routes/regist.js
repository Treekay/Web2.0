"use strict";

var express = require('express');
var router = express.Router();

var regist = require('../controller/regist');

/* GET regist page. */
router.get('/', function (req, res) {
  regist.render(res);
});

/* post datas. */
router.post('/', function (req, res) {
  regist.signUp(req, res);
});

module.exports = router;