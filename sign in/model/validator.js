"use strict";

function validator() {
  this.isValid = (data, type) => {
    var empty = '不能为空';
    var res = new Array();
    var errorMsg = {};
    if (type === 'regist')
      errorMsg = {
        username: data.username ? checkUsername(data.username) : empty,
        password: data.password ? checkPasswd(data.password, data.repeatPsd) : empty,
        repeatPsd: data.repeatPsd ? checkRepeatPsd(data.password, data.repeatPsd) : empty,
        schoolId: data.schoolId ? checkIdandPhone(data.schoolId, 8) : empty,
        phone: data.phone ? checkIdandPhone(data.phone, 11) : empty,
        email: data.email ? checkEmail(data.email) : empty
      };
    else if (type === 'signIn')
      errorMsg = {
        username: data.username ? checkUsername(data.username) : empty,
        password: data.password ? checkPasswd(data.password) : empty,
      };
    var flag = false;
    for (var opt in errorMsg)
      if (errorMsg[opt])
        flag = true;
    if (flag)
      res.push(errorMsg);
    return res;
  }
}

exports = module.exports = new validator();

function checkUsername(str) {
  var nameReg = /^[a-zA-Z]\w{5,17}$/;
  if (nameReg.test(str))
    return '';
  else if (str.length < 6)
    return "长度过短";
  else if (str.length > 18)
    return "长度过长";
  else if (/^[0-9_]/.test(str))
    return "必须以字母开头";
  else if (/\W/.test(str))
    return "只能包含字母，数字，下划线";
}

function checkPasswd(str) {
  var passwdReg = /^[\w\-]{6,12}$/;
  if (passwdReg.test(str))
    return '';
  else if (str.length < 6)
    return '长度过短';
  else if (str.length > 12)
    return '长度过长';
  else
    return '只能包含字母，数字，下划线，中划线';
}

function checkRepeatPsd(ori, rep) {
  return ori === rep ? '' : '密码不一致';
}

function checkIdandPhone(str, length) {
  var reg = length == 8 ? /^[1-9][0-9]{7}$/ : /^[1-9][0-9]{10}$/;
  if (reg.test(str))
    return '';
  else if (str.length != length)
    return "长度必须为" + length + "位";
  else if (/\D/.test(str))
    return "学号必须为数字";
  else if (/^0/.test(str))
    return "不能以0开头";
}

function checkEmail(str) {
  var emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  if (emailReg.test(str))
    return '';
  else
    return "非法邮箱地址";
}