var mongoose = require('mongoose')

var hireSchema = new mongoose.Schema({
  huserid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  euserid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastactive: {
    type: Date,
    default: new Date()
  },
  status: String,
  message: String
})

var Hire = mongoose.model('Hire', hireSchema)

module.exports = Hire
