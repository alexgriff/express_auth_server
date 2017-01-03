const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
};
  //                ^ jwt tokens have a sub property by convention
  //                short for subject <- who this token is about
  //                iat short for issued-at-time


exports.signup = function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if(!email || !password) {
    return res.status(422).send({error: "You must provide email and password"});
  }

  // see if a user with a given email exists
  User.findOne({email: email}, function(err, existingUser){
    if(err) { return next(err); }

    // if they do exist, return an error
    if(existingUser) {
      return res.status(422).send({error: "email is in use"});
    }

    // if its a new email, create and save user record
    const user = new User({
      email: email,
      password: password
    });

    user.save(function(err){
      if(err) { return next(err); }
      // respond to request indicating user was created
      res.json({token: tokenForUser(user)});
    });
  });
};



exports.signin = function(req, res, next) {
  // User has already had email and pw authed
  // just need to give them a token

  res.send({token: tokenForUser(req.user)});
};
