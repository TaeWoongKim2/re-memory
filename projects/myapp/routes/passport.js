const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

var mysql = require('mysql');
var dbconfig = require('./config/database.js')
var conn = mysql.createConnection(dbconfig);

const crypto = require('crypto');

module.exports = () => {
  passport.serializeUser((user, done) => { // Strategy 성공 시 호출됨
    console.log('serialize');
    done(null, user); // 여기에 user가 deserializeUser의 첫 번째 매개변수로 이동
  });

  passport.deserializeUser((user, done) => { // 매개변수 user는 serializeUser의 done의 인자 user를 받은 것
    console.log('deserializeUser');
    done(null, user); // 여기에 user가 req.user가 됨
  });

  passport.use(new LocalStrategy({ // local 전략을 세움
    usernameField: 'uid',
    passwordField: 'pwd',
    session: true, // 세션에 저장 여부
    passReqToCallback: true,
  }, (req, uid, pwd, done) => {
    var sql = 'SELECT UID, NAME, PWD, SALT FROM USER WHERE UID = ?';
    var params = [uid];
    conn.query(sql, params, function(err, rows, fields){
      if(err) {
        console.log(err);
        return done(false, null);
      } else {
        crypto.pbkdf2(pwd, rows[0].SALT, 108236, 64, 'sha512', (err, key) => {
          //console.log(key.toString('base64'));

          if(key.toString('base64') === rows[0].PWD){
            //req.session.uid = rows[0].UID;
            //req.session.name = rows[0].NAME;
            return done(null, {
              'uid': rows[0].UID,
              'name': rows[0].NAME
            });
          }else {
            return done(false, null);
          }
        });
      }
    });
  }));
};