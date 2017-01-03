// local definition of what a user is
// i.e has an email and password
// we need to tell mongoose <- our ORM for mongoDB

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// ^ use Schema to tell mongoose what fields a user has

const bcrypt = require('bcrypt-nodejs');

// Define our model
// ----------------
const userSchema = new Schema({
  email: {type: String, unique: true, lowercase: true},
  password: String
});

// On save hook, encrypt password
// before saving a model instance, run this callback
// ------------------------------
userSchema.pre('save', function(next){
  // context is the instance
  const user = this;

  // generate a salt then run callback
  bcrypt.genSalt(10, function(err, salt){
    if(err) { return next(err); }

    // hash (encrypt) a pw using the salt, then run cb
    bcrypt.hash(user.password, salt, null, function(err, hash){
      if(err) { return next(err); }

      // overwrite plaintext pw with encrypted pw
      user.password = hash;
      next();
    });
  });
});

// give methods to each instance
userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if(err) { return callback(err); }

    callback(null, isMatch);
  })
};

// Create model class
// ------------------
const ModelClass = mongoose.model('user', userSchema);


// Export model
// ------------
module.exports = ModelClass;
