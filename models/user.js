var mongoose = require('mongoose')
var bcrypt = require('bcrypt')

var userSchema = new mongoose.Schema({
  local: {
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      maxlength: [50, 'Email too long, maximum 50 characters'],
      unique: true
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password too short, minimum 6 characters'],
      maxlength: [50, 'Password too long, maximum 50 characters']
    },
    role: {
      type: String,
      required: [true, 'Please choose either Helper or Employer']
    },
    identification: {
      type: String,
      required: [true, 'Please provide an identification']
      // match: [/^([A-z]{2}[0-9]{7})$|^([S,T,F,G,s,t,f,g][0-9]{7}[A-J,Z,a-j,z])$/, 'Invalid identification, please try again.']
    },
    contact: {
      countrycode: {
        type: String,
        default: '+'
      },
      number: {
        type: Number,
        default: 0
      }
    },
    passwordreset: {
      timecreated: {
        type: Date
      },
      resetcode: {
        type: String
      }
    }
  },
  available: {
    type: Boolean,
    default: false
  },
  recruit: {
    type: Boolean,
    default: false
  },
  // prevent more than one confirmation
  hire: {
    type: Boolean,
    default: true
  },
  activate: {
    status: {
      type: Boolean
    },
    code: {
      type: String
    }
  }
})

// passport, before saving a new user
// generate salt 5 times
// bcrypt passport with generated salt
// bcrypt activate code with salt
userSchema.pre('save', function (next) {
  var user = this
  bcrypt.genSalt(5, function (err, salt) {
    if (err) return next(err)
    bcrypt.hash(user.local.password, salt, function (err, hash) {
      if (err) return next(err)
      user.local.password = hash
      bcrypt.genSalt(5, function (err, salt) {
        if (err) return next(err)
        bcrypt.hash(user.activate.code, salt, function (err, hash) {
          if (err) return next(err)
          user.activate.code = hash
          next()
        })
      })
    })
  })
})

// bcrypt input and see if matches with existing hash in db

// passport method for password authentication
userSchema.methods.authenticate = function (password, callback) {
  bcrypt.compare(password, this.local.password, function (err, isMatch) {
    callback(err, isMatch)
  })
}
// passport method for resetcode authentication
userSchema.methods.resetcodeauth = function (resetcode, callback) {
  bcrypt.compare(resetcode, this.local.passwordreset.resetcode, function (err, isMatch) {
    callback(err, isMatch)
  })
}
// passport method for activate authentication
userSchema.methods.activateauth = function (activatecode, callback) {
  bcrypt.compare(activatecode, this.activate.code, function (err, isMatch) {
    callback(err, isMatch)
  })
}

var User = mongoose.model('User', userSchema)

module.exports = User
