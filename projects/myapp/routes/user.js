var mysql = require('mysql');
var dbconfig = require('./config/database.js')
var conn = mysql.createConnection(dbconfig);

const crypto = require('crypto');

exports.findOne = function (id) {
  var sql = 'SELECT UID, NAME, PWD, SALT FROM USER WHERE UID = ?';
  var params = [id];
  conn.query(sql, params, function (err, rows, fields) {
    if (err) {
      console.log(err);
      return false;
    } else {
      return true;
    }
  });
}

exports.comparePassword = function(password){
  crypto.pbkdf2(pwd, rows[0].SALT, 108236, 64, 'sha512', (err, key) => {
    console.log(key.toString('base64'));

    if(key.toString('base64') === rows[0].PWD){
      res.redirect('/');
    }else {
      res.redirect('/login');
    }
  });
}

