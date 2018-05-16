"use strict";

var crypto = require('crypto');
var mongodb = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/db';

function connect() {
  return new Promise((resolve, reject) => {
    mongodb.connect(url, (err, db) => {
      if (err) console.err('连接数据库失败');
      resolve(db);
    });
  }).then(db => {
    return new Promise((resolve, reject) => {
      db.collection('usr', (err, res) => {
        if (err) console.error(err);
        resolve(res);
      });
    });
  });
}

function db() {

/**
 * 
 * 添加用户
 * @param {session} session 
 * @param {JSON} info 用户数据
 * @returns Promise
 */
this.addUser = (session, info) => {
    delete info.repeatPsd;
    var hash = crypto.createHash('sha256');
    hash.update(info.password);
    info.password = hash.digest('hex');
    return connect().then((collection) => {
      return collection.insert(info);
    }).then((res) => {
      return Promise.resolve();
    }).catch((err) => {
      console.error(err);
    });
  }

/**
 * 
 * 检查信息是否重复
 * @param {JSON} data 
 * @returns Promise
 */
this.isUnique = data => {
    var msg = {};
    var error = false;
    var opt = [{
      'username': data.username
    }, {
      'schoolId': data.schoolId
    }, {
      'phone': data.phone
    }, {
      'email': data.email
    }];
    var p = connect().then(collection => {
      return collection.find({
        $or: opt
      }).toArray();
    }).then(res => {
      if (res.length) {
        for (var each of res) {
          for (var i in data)
            if (each[i] == data[i] && i != 'password' && i != 'repeatPsd') {
              msg[i] = '已被占用';
              error = true;
            }
        }
      }
      return Promise.resolve();
    });
    return p.then(() => {
      if (error)
        return [msg];
      else
        return [];
    });
  };

/**
 * 
 * 登录检验
 * @param {JSON} data 
 * @returns Promise
 */
this.check = data => {
    var msg = {};
    var hash = crypto.createHash('sha256');
    hash.update(data.password);
    data.password = hash.digest('hex');
    return connect().then(collection => {
      return collection.find({
        'username': data.username
      }).toArray();
    }).then((res) => {
      if (!res.length) {
        msg.username = '用户不存在';
        return Promise.resolve([msg]);
      } else {
        if (res[0].password == data.password) {
          return Promise.resolve([]);
        } else {
          msg.password = '错误的用户名或密码';
          return Promise.resolve([msg]);
        }
      }
    });
  }

/**
 * 
 * 登录
 * @param {session} session 
 * @param {JSON} data 
 * @returns 
 */
this.signIn = (session, data) => {
    return connect().then(collection => {
      return collection.find({
        'username': data.username
      }).toArray();
    }).then(res => {
      data.schoolId = res[0].schoolId;
      data.phone = res[0].phone;
      data.email = res[0].email;
      session.info = data;
      session.signed = true;
      return Promise.resolve();
    });
  };
  
/**
 * 
 * 注销
 * @param {session} session 
 */
this.signOut = session => {
    session.signed = false;
    session.info = {};
  }
};

exports = module.exports = new db();