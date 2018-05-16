"use strict";

var db = require('../model/db');
var validator = require('../model/validator');
var parse = require('../model/parse');

var regist = {
  render: function render(res) {
    var option = {};
    option.data = parse.parseInfo({});
    option.errorMsg = parse.parseError({}, {})
    res.render('regist', option);
  },

  signUp: function signUp(req, res) {
    var data = parse.parseInfo(req.body);
    var invalid = validator.isValid(data, 'regist');
    db.isUnique(data).then(repeated => {
      if (invalid.length || repeated.length) {
        var validMsg = invalid.length ? invalid[0] : {};
        var repeatMsg = repeated.length ? repeated[0] : {};
        var errorMsg = parse.parseError(validMsg, repeatMsg);
        res.render('regist', {
          data: data,
          errorMsg: errorMsg,
        });
      } else {
        return db.addUser(req.session, data).then(() => {
          return db.signIn(req.session, data);
        }).then(() => {
          console.log('注册成功');
          res.redirect('/?username=' + data.username);
        }).catch(err => {
          console.error(err);
        });
      }
    }).catch(err => {
      console.error(err);
    });
  }

};

exports = module.exports = regist;