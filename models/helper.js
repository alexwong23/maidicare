var mongoose = require('mongoose')

var helperSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastactive: {
    type: Date,
    default: new Date()
  },
  transfer: {
    type: Boolean,
    default: false
  },
  searchstring: {
    type: String
  },
  profile: {
    photo: {
      version: {
        type: String,
        default: ''
      },
      format: {
        type: String,
        default: ''
      },
      exists: {
        type: Boolean,
        default: false
      }
    },
    firstname: {
      type: String,
      default: ''
    },
    middlename: {
      type: String,
      default: ''
    },
    familyname: {
      type: String,
      default: ''
    },
    dob: {
      type: Date,
      default: null
    },
    pob: {
      type: String,
      default: ''
    },
    nationality: {
      type: String,
      default: ''
    },
    residentialaddress: {
      type: String,
      default: ''
    },
    portrepatriated: {
      type: String,
      default: ''
    },
    religion: {
      type: String,
      default: ''
    },
    dietaryrestriction: {
      type: String,
      default: ''
    },
    foodhandlingrestriction: {
      type: String,
      default: ''
    },
    allergies: {
      type: String,
      default: ''
    },
    heightcm: {
      type: Number,
      default: 0
    },
    weightkg: {
      type: Number,
      default: 0
    },
    siblings: {
      type: Number,
      default: 0
    },
    maritalstatus: {
      type: String,
      default: ''
    },
    children: {
      type: Number,
      default: 0
    },
    ageofyoungest: {
      type: Number,
      default: 0
    }
  },
  education: {
    educationlevel: {
      type: String,
      default: ''
    },
    fieldofstudy: {
      type: String,
      default: ''
    },
    otherqualifications: {
      type: String,
      default: ''
    }
  },
  skills: {
    english: {
      type: Boolean,
      default: true
    },
    singapore: {
      type: Boolean,
      default: true
    },
    infantcare: {
      type: Boolean,
      default: true
    },
    childcare: {
      type: Boolean,
      default: true
    },
    elderlycare: {
      type: Boolean,
      default: true
    },
    disabledcare: {
      type: Boolean,
      default: true
    },
    housework: {
      type: Boolean,
      default: true
    },
    cooking: {
      type: Boolean,
      default: true
    },
    handledog: {
      type: Boolean,
      default: true
    },
    handlecat: {
      type: Boolean,
      default: true
    }
  },
  workingexperience: {
    first: {
      from: {
        type: Number,
        default: null
      },
      to: {
        type: Number,
        default: null
      },
      country: {
        type: String,
        default: ''
      },
      duties: {
        type: String,
        default: ''
      }
    },
    second: {
      from: {
        type: Number,
        default: null
      },
      to: {
        type: Number,
        default: null
      },
      country: {
        type: String,
        default: ''
      },
      duties: {
        type: String,
        default: ''
      }
    },
    third: {
      from: {
        type: Number,
        default: null
      },
      to: {
        type: Number,
        default: null
      },
      country: {
        type: String,
        default: ''
      },
      duties: {
        type: String,
        default: ''
      }
    }
  }
})

// helper method for concat searchstring
helperSchema.methods.searchString = function (helper, callback) {
  var searchString = ''
  var searchArray = []
  function pushBoolean (value, string) {
    if (value === 'true') {
      return searchArray.push(string + ' ')
    }
  }
  function pushString (string) {
    searchArray.push(string + ' ')
  }
  function countryCitizens (country) {
    var citizen = ''
    if (country === 'Philippines') { citizen = ' Filipino ' }
    if (country === 'India') { citizen = ' Indian ' }
    if (country === 'Indonesia') { citizen = ' Indonesian ' }
    if (country === 'Myanmar') { citizen = ' Burmese ' }
    if (country === 'Sri_Lanka') { citizen = ' Sri Lankan ' }
    return searchArray.push(country.replace(/_/, ' ') + citizen)
  }
  pushString(helper.profile.firstname)
  pushString(helper.profile.familyname)
  countryCitizens(helper.profile.nationality)
  pushString(helper.profile.religion)
  pushString(helper.profile.maritalstatus)
  pushString(helper.education.educationlevel)
  pushString(helper.education.fieldofstudy)
  pushString(helper.education.otherqualifications)
  pushBoolean(helper.transfer, 'transfer')
  pushBoolean(helper.skills.english, 'english')
  pushBoolean(helper.skills.singapore, 'singapore')
  pushBoolean(helper.skills.infantcare, 'infant infantcare')
  pushBoolean(helper.skills.childcare, 'child childcare')
  pushBoolean(helper.skills.elderlycare, 'elderly elderlycare')
  pushBoolean(helper.skills.disabledcare, 'disabled disabledcare')
  pushBoolean(helper.skills.housework, 'housework')
  pushBoolean(helper.skills.cooking, 'cooking')
  pushBoolean(helper.skills.handledog, 'dog')
  pushBoolean(helper.skills.handlecat, 'cat')
  for (var i = 0; i < searchArray.length; i++) {
    searchString += searchArray[i]
  }
  Helper.update({'_id': this._id}, {'searchstring': searchString}, function (err) {
    callback(err, searchString)
  })
}

var Helper = mongoose.model('Helper', helperSchema)

module.exports = Helper
