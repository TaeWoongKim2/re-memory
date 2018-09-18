const local = require('./localStrategy');
const { User } = require('../models');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.uid);
  });

  passport.deserializeUser((uid, done) => {
    User.find({ where: { uid } })
      .then(user => done(null, user))
      .catch(err => done(err));
  });

  local(passport);
}