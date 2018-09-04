var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var dbconfig = require('./config/database.js')
var conn = mysql.createConnection(dbconfig);

const crypto = require('crypto');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET sing-up page. */
router.get('/sign-up', function(req, res, next) {
  res.render('sign-up', { title: 'sign-up' });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'login' });
});

/* POST sign-up. */
router.post('/sign-up', function(req, res, next) {
  var body = req.body;
  var username = body.username;
  var id = body.id;
  var password = body.password;
  var salt;

  crypto.randomBytes(64, (err, buf) => {
    salt = buf.toString('base64');
    crypto.pbkdf2(password, buf.toString('base64'), 108236, 64, 'sha512', (err, key) => {
      var query = conn.query("insert into USER(UID, PWD, NAME, DATE, SALT) values('" + id + "', '" + key.toString('base64') + "', '" + username + ", SYSDATE(), '"+ salt + "')", function(err, rows){
        if(err) { throw err;}
        console.log("Data inserted!");
        res.render('login', { title: 'login' });
      })
    });
  });
});


module.exports = router;
