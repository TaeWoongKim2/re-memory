var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var dbconfig = require('./config/database.js')
var conn = mysql.createConnection(dbconfig);

const crypto = require('crypto');

/* GET home page. */
router.get('/', function(req, res, next) {
  // url http://a.com?id=xxxx
  var uid = req.query.id;
  var boardList = [];

  if( req.query.id ) {
    var sql = "SELECT TITLE, BCONTENT, DATE FROM `BOARD` WHERE UID=?";
    conn.query(sql, uid, function(err, rows, fields){
      if(err){
        console.log(err);
      } else {
        for(var i=0; i < rows.length; i++){
          var board = {
		  			'title': rows[i].TITLE,
		  			'content': rows[i].BCONTENT,
		  			'date': rows[i].DATE
          }
          boardList.push(board);
        }
      }
      //console.log(boardList);
      res.render('index', { title: 'Memorize', boardList: boardList });
    });
  }
  else {
    res.render('index', { title: 'Memorize', boardList: boardList });
  }
});

/* GET sing-up page. */
router.get('/sign-up', function(req, res, next) {
  res.render('sign-up', { title: 'sign-up' });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'login' });
});

/* POST Sign-Up */
router.post('/sign-up', function(req, res, next){
  var body = req.body;
  var username = body.username;
  var id = body.id;
  var password = body.password;
  var salt;

  console.log(username);
  console.log(id);
  console.log(password);

  /*
  conn.query('SELECT * FROM USER', function(err, rows, fields){
    conn.end();
    if(!err){
      console.log(rows);
      console.log(fields);
    }else {
      console.log('query error : ' + err)
    }
  })
  */

  crypto.randomBytes(64, (err, buf) => {
    salt = buf.toString('base64');
    console.log('salt : ', salt);
    crypto.pbkdf2(password, buf.toString('base64'), 108236, 64, 'sha512', (err, key) => {
      conn.query('insert into USER(UID, PWD, NAME, DATE, SALT) values(?,?,?,SYSDATE(),?)', [id, key.toString('base64'), username, buf.toString('base64')] , function(err, rows){
        console.log('pwd : ', key.toString('base64'));
        if(err) { 
          throw err;
        }
        console.log("Data inserted!");
        res.redirect('/login');
      })
    });
  });
});

/* POST Sign-Up */
router.post('/login', function(req, res, next){
  var body = req.body;
  var uid = body.uid;
  var pwd = body.pwd;
  var salt;

  var sql = 'SELECT UID, NAME, PWD, SALT FROM USER WHERE UID = ?';
  var params = [uid];
  conn.query(sql, params, function(err, rows, fields){
    if(err) {
      console.log(err);
    } else {
      crypto.pbkdf2(pwd, rows[0].SALT, 108236, 64, 'sha512', (err, key) => {
        console.log(key.toString('base64'));

        if(key.toString('base64') === rows[0].PWD){
          res.redirect('/');
        }else {
          res.redirect('/login');
        }
      });
    }
  });
});

module.exports = router;
