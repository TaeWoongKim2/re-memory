const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const { User } = require('../models');

module.exports = (passport) => {
    passport.use(new LocalStrategy({
        usernameField: 'uid',
        passwordField: 'pwd',
        session: true,
        passReqToCallback: true,
    }, async (req, uid, pwd, done) => {
        try {
            const exUser = await User.find({where: {UID: uid} });
            if (exUser) {
                const result = await bcrypt.compare(pwd, exUser.PWD);
                if (result) {
                    done(null, exUser);
                } else {
                    done(null, false, { message: '비밀번호가 일치하지 않습니다.'});
                }
            } else {
                done(null, false, {message: '가입되지 않은 회원입니다.'});
            }
        } catch (error) {
            console.log(error);
            done(error);
        }
    }));
};