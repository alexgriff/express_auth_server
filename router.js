const authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignin = passport.authenticate('local', {session: false});

// add route handlers to express
module.exports = function(app) {
 //             v requireAuth is middleware
  app.get('/', requireAuth, function(req, res) {
    res.send({hi: 'there'});
  });

  app.post('/sigin', requireSignin, authentication.signin)

  app.post('/signup', authentication.signup);

}
