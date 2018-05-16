"use strict";

var db = require('../model/db');
var validator = require('../model/validator');
var parse = require('../model/parse');

var sign = {
  render: function render(req, res) {
    if (req.originalUrl != '/') {
      res.redirect('/');
    } else {
      var errorMsg = '';
      if (req.session.errorMsg)
        errorMsg = req.session.errorMsg;
      req.session.errorMsg = '';
      res.render('sign', {
        errorMsg: errorMsg,
        username: ''
      });
    }
  },

  signIn: function signIn(req, res) { 
    var data = parse.parseInfo(req.body);
    var invalid = validator.isValid(data, 'signIn');
    db.check(data).then(check => {
      if (invalid.length || check.length) { 
        var validMsg = invalid.length ? invalid[0] : {};
        var checkMsg = check.length ? check[0] : {};
        var errorMsg = parse.parseError(validMsg, checkMsg);
        res.render('sign', {
          username: data.username,
          errorMsg: errorMsg,
        });
      } else {
        delete data.repeatPsd;
        db.signIn(req.session, data).then(() => {
          res.redirect('/?username=' + data.username);
        });
      }
    }).catch(err => {
      console.error(err);
    });
  },

  signOut: function signOut(req, res) {
    db.signOut(req.session);
    res.redirect('/');
  }
};

exports = module.exports = sign;