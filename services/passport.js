const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStategy = require('passport-local');


// set up options for jwt Strategy
// tell it where to look to find the token
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// create jwt strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
  // See if the user id in the payload exists in the db
  // if so call done with the user
  // otherwise call done without user
  User.findById(payload.sub, function(err, user) {
    if(err){ return done(err, false); }

    if(user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});


// create local strategy
// defaults to look for username and pw
// we need to tell it to look for email
const localOptions = {
  usernameField: 'email'
}

const localLogin = new LocalStategy(localOptions, function(email, password, done){
  // verify email and pw
  // call done with user if true, else call done with false
  User.findOne({email: email}, function(err, user) {
    if(err) { return done(err); }
    if(!user) { return done(null, false); }

    // compare passwords: is 'password' == user.password
    // 'password' is plaintext, user.password is salted + hashed
    user.comparePassword(password, function(err, isMatch) {
      if(err) { return done(err); }
      if(!isMatch) { return done(null, false); }

      return done(null, user);
    });
  });
});

// tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
