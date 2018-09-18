var express = require('express');
var router = express.Router();
var passport = require('passport');

var mysql = require('mysql');
var dbconfig = require('../config/database.js')
var conn = mysql.createConnection(dbconfig);

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User } = require('../models');

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
router.post('/sign-up', isNotLoggedIn, async (req, res, next) => {
  const { name, uid, pwd } = req.body;
  try {
    const exUser = await User.find({where: {uid} });
    if (exUser) {
      req.flash('joinError', '이미 가입된 아이디입니다.');
      return res.redirect('/sign-up');
    }
    const hash = await bcrypt.hash(pwd, 12);
    await User.create({
      uid,
      pwd: hash,
      name,
    });
    return res.redirect('/');
  } catch (error) {
    console.log(error);
    return next(error);
  }
  /*
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
  */
});

/* POST Login */
router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.log(authError);
      return next(authError);
    }
    if (!user) {
      req.flash('loginError', info.message);
      return res.redirect('/');
    }
    return req.login(user, (loginError) => {
      if(loginError) {
        console.log(loginError);
        return next(loginError);
      }
      return res.redirect('/');
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});  

module.exports = router;
