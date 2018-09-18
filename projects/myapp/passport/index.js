const local = require('./localStrategy');
const { User } = require('../models');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.UID);
  });

  passport.deserializeUser((id, done) => {
    User.find({ where: { UID: id } })
      .then(user => done(null, user))
      .catch(err => done(err));
  });

  local(passport);
}