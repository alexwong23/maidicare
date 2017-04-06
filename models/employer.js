var mongoose = require('mongoose')

var employerSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  profile: {
    fullname: {
      type: String,
      default: ''
    },
    housetype: {
      type: String,
      default: ''
    },
    blockhouseno: {
      type: String,
      default: ''
    },
    unitno: {
      type: String,
      default: ''
    },
    streetname: {
      type: String,
      default: ''
    },
    postalcode: {
      type: Number,
      default: null
    },
    maritalstatus: {
      type: String,
      default: ''
    }
  },
  household: {
    adult: {
      type: Number,
      default: 0
    },
    teenager: {
      type: Number,
      default: 0
    },
    children: {
      type: Number,
      default: 0
    },
    infant: {
      type: Number,
      default: 0
    },
    elderly: {
      type: Number,
      default: 0
    },
    disabled: {
      type: Number,
      default: 0
    }
  },
  jobscope: {
    infantcare: {
      type: Boolean,
      default: false
    },
    childcare: {
      type: Boolean,
      default: false
    },
    elderlycare: {
      type: Boolean,
      default: false
    },
    disabledcare: {
      type: Boolean,
      default: false
    },
    housework: {
      type: Boolean,
      default: false
    },
    cooking: {
      type: Boolean,
      default: false
    },
    handledog: {
      type: Boolean,
      default: false
    },
    handlecat: {
      type: Boolean,
      default: false
    },
    otherduties: {
      type: String,
      default: ''
    }
  }
})

var Employer = mongoose.model('Employer', employerSchema)

module.exports = Employer
