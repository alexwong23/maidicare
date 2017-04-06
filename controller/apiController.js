
var User = require('../models/user')
var Helper = require('../models/helper')
var Employer = require('../models/employer')
var Hire = require('../models/hire')

// export functions to api routes
module.exports = {
  getAJAXUsersData: function (req, res) {
    var userAPI = [{
      // Employers
      data: [{
        user: {
          local: {
            email: 'emp1@test.com',
            password: 'asdasd',
            confirm: 'asdasd',
            role: 'employer',
            identification: 'S9436989D',
            contact: {
              countrycode: '+65',
              number: '98880090'
            }
          },
          available: false,
          recruit: true,
          hire: true,
          activate: {
            status: true,
            code: ''
          }
        }
      }, {
        profile: {
          fullname: 'employer 1 test',
          housetype: 'Landed,',
          blockhouseno: '13',
          unitno: '14',
          streetname: 'My address is this',
          postalcode: 678901,
          maritalstatus: 'Married'
        },
        household: {
          adult: 2,
          teenager: 1,
          children: 0,
          infant: 1,
          elderly: 1,
          disabled: 0
        },
        jobscope: {
          infantcare: true,
          childcare: false,
          elderlycare: true,
          disabledcare: false,
          housework: true,
          cooking: true,
          handledog: false,
          handlecat: true,
          otherduties: 'Buying Groceries'
        }
      }]
    }, {
      data: [{
        user: {
          local: {
            email: 'emp2@test.com',
            password: 'asdasd',
            confirm: 'asdasd',
            role: 'employer',
            identification: 'S9436988F',
            contact: {
              countrycode: '+65',
              number: '96600875'
            }
          },
          available: false,
          recruit: true,
          hire: true,
          activate: {
            status: true,
            code: ''
          }
        }
      }, {
        profile: {
          fullname: 'employer 2 test',
          housetype: 'HDB_4-room_or_smaller,',
          blockhouseno: '12',
          unitno: '20',
          streetname: 'My address',
          postalcode: 678902,
          maritalstatus: 'Divorced'
        },
        household: {
          adult: 1,
          teenager: 1,
          children: 1,
          infant: 0,
          elderly: 0,
          disabled: 1
        },
        jobscope: {
          infantcare: false,
          childcare: true,
          elderlycare: false,
          disabledcare: true,
          housework: true,
          cooking: true,
          handledog: false,
          handlecat: false,
          otherduties: 'Taking the kids to my husbands home on the weekends.'
        }
      }]
    }, {
      // Filipino
      data: [{
        user: {
          local: {
            email: 'fili1@test.com',
            password: 'asdasd',
            confirm: 'asdasd',
            role: 'helper',
            identification: 'EU1234567',
            contact: {
              countrycode: '+64',
              number: '909121212'
            }
          },
          available: true,
          recruit: false,
          hire: true,
          activate: {
            status: true,
            code: 'alexcode'
          }
        }
      }, {
        transfer: true,
        lastactive: new Date(new Date().setDate(new Date().getDate() - 10)),
        profile: {
          firstname: 'FiliOne',
          middlename: 'test',
          familyname: 'Wong',
          dob: '1994-09-23 00:00:00.000Z',
          pob: 'Singaporean',
          nationality: 'Philippines',
          residentialaddress: 'Somewhere in the philippines',
          portrepatriated: 'Clark_International_Airport',
          religion: 'Christian',
          dietaryrestriction: 'No_Beef',
          foodhandlingrestriction: 'No_Beef',
          allergies: '',
          heightcm: 180,
          weightkg: 69,
          siblings: 3,
          maritalstatus: 'Married',
          children: 2,
          ageofyoungest: 7
        },
        education: {
          educationlevel: 'Primary',
          fieldofstudy: 'Nursing',
          otherqualifications: 'Taking care of elderly and cleaning toilets'
        },
        skills: {
          english: true,
          singapore: true,
          infantcare: true,
          childcare: true,
          elderlycare: true,
          disabledcare: true,
          housework: true,
          cooking: true,
          handledog: false,
          handlecat: true
        },
        workingexperience: {
          first: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          second: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          third: {
            from: null,
            to: null,
            country: '',
            duties: ''
          }
        }
      }]
    }, {
      data: [{
        user: {
          local: {
            email: 'fili2@test.com',
            password: 'asdasd',
            confirm: 'asdasd',
            role: 'helper',
            identification: 'GU1234587',
            contact: {
              countrycode: '+64',
              number: '909162701212'
            }
          },
          available: true,
          recruit: false,
          hire: true,
          activate: {
            status: true,
            code: 'testcode'
          }
        }
      }, {
        transfer: false,
        lastactive: new Date(new Date().setDate(new Date().getDate() - 10)),
        profile: {
          firstname: 'FiliTwo',
          middlename: 'test',
          familyname: 'Wong',
          dob: '1993-01-12 00:00:00.000Z',
          pob: 'Singaporean',
          nationality: 'Philippines',
          residentialaddress: 'Somewhere in the philippines',
          portrepatriated: 'Mactan-Cebu_International_Airport',
          religion: 'Taoist',
          dietaryrestriction: 'No_Pork',
          foodhandlingrestriction: 'No_Pork',
          allergies: '',
          heightcm: 188,
          weightkg: 75,
          siblings: 3,
          maritalstatus: 'Divorced',
          children: 2,
          ageofyoungest: 4
        },
        education: {
          educationlevel: 'Secondary',
          fieldofstudy: 'Medicine',
          otherqualifications: 'Cutting open people bellies'
        },
        skills: {
          english: true,
          singapore: true,
          infantcare: false,
          childcare: false,
          elderlycare: true,
          disabledcare: true,
          housework: true,
          cooking: true,
          handledog: true,
          handlecat: false
        },
        workingexperience: {
          first: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          second: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          third: {
            from: null,
            to: null,
            country: '',
            duties: ''
          }
        }
      }]
    }, {
      data: [{
        user: {
          local: {
            email: 'fili3@test.com',
            password: 'asdasd',
            confirm: 'asdasd',
            role: 'helper',
            identification: 'GU1234587',
            contact: {
              countrycode: '+64',
              number: '909162701212'
            }
          },
          available: true,
          recruit: false,
          hire: true,
          activate: {
            status: true,
            code: 'testcode'
          }
        }
      }, {
        transfer: false,
        lastactive: new Date(new Date().setDate(new Date().getDate() - 10)),
        profile: {
          firstname: 'FiliThree',
          middlename: 'test',
          familyname: 'Wong',
          dob: '1993-01-12 00:00:00.000Z',
          pob: 'Singaporean',
          nationality: 'Philippines',
          residentialaddress: 'Somewhere in the philippines',
          portrepatriated: 'Mactan-Cebu_International_Airport',
          religion: 'Christian',
          dietaryrestriction: 'No_Pork',
          foodhandlingrestriction: 'No_Pork',
          allergies: '',
          heightcm: 188,
          weightkg: 75,
          siblings: 3,
          maritalstatus: 'Single',
          children: 0,
          ageofyoungest: 0
        },
        education: {
          educationlevel: 'Secondary',
          fieldofstudy: 'Medicine',
          otherqualifications: 'Cutting open people bellies'
        },
        skills: {
          english: true,
          singapore: true,
          infantcare: false,
          childcare: false,
          elderlycare: true,
          disabledcare: true,
          housework: true,
          cooking: true,
          handledog: true,
          handlecat: false
        },
        workingexperience: {
          first: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          second: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          third: {
            from: null,
            to: null,
            country: '',
            duties: ''
          }
        }
      }]
    }, {
      data: [{
        user: {
          local: {
            email: 'fili4@test.com',
            password: 'asdasd',
            confirm: 'asdasd',
            role: 'helper',
            identification: 'SG126597',
            contact: {
              countrycode: '+64',
              number: '998867431212'
            }
          },
          available: true,
          recruit: false,
          hire: true,
          activate: {
            status: true,
            code: 'seancode'
          }
        }
      }, {
        transfer: true,
        lastactive: new Date(new Date().setDate(new Date().getDate() - 10)),
        profile: {
          firstname: 'FiliFour',
          middlename: 'test',
          familyname: 'Wong',
          dob: '1989-12-26 00:00:00.000Z',
          pob: 'America',
          nationality: 'Philippines',
          residentialaddress: 'Im never coming back to Singapore. I love it here',
          portrepatriated: 'Ninoy_Aquino_International_Airport',
          religion: 'Catholic',
          dietaryrestriction: 'None',
          foodhandlingrestriction: 'None',
          allergies: '',
          heightcm: 193,
          weightkg: 99,
          siblings: 3,
          maritalstatus: 'Single',
          children: 0,
          ageofyoungest: 0
        },
        education: {
          educationlevel: 'Undergraduate',
          fieldofstudy: 'Marketing and Communication',
          otherqualifications: 'Learning how to do marketing at a company.'
        },
        skills: {
          english: true,
          singapore: true,
          infantcare: true,
          childcare: true,
          elderlycare: false,
          disabledcare: false,
          housework: true,
          cooking: true,
          handledog: true,
          handlecat: false
        },
        workingexperience: {
          first: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          second: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          third: {
            from: null,
            to: null,
            country: '',
            duties: ''
          }
        }
      }]
    }, {
      // Myanmar
      data: [{
        user: {
          local: {
            email: 'myanmar1@test.com',
            password: 'asdasd',
            confirm: 'asdasd',
            role: 'helper',
            identification: 'EU1234567',
            contact: {
              countrycode: '+64',
              number: '909121212'
            }
          },
          available: true,
          recruit: false,
          hire: true,
          activate: {
            status: true,
            code: 'alexcode'
          }
        }
      }, {
        transfer: true,
        lastactive: new Date(new Date().setDate(new Date().getDate() - 10)),
        profile: {
          firstname: 'MyanmarOne',
          middlename: 'test',
          familyname: 'Wong',
          dob: '1994-09-23 00:00:00.000Z',
          pob: 'Singaporean',
          nationality: 'Myanmar',
          residentialaddress: 'Somewhere in the philippines',
          portrepatriated: 'Clark_International_Airport',
          religion: 'Christian',
          dietaryrestriction: 'No_Beef',
          foodhandlingrestriction: 'No_Beef',
          allergies: '',
          heightcm: 180,
          weightkg: 69,
          siblings: 3,
          maritalstatus: 'Married',
          children: 2,
          ageofyoungest: 7
        },
        education: {
          educationlevel: 'Primary',
          fieldofstudy: 'Nursing',
          otherqualifications: 'Taking care of elderly and cleaning toilets'
        },
        skills: {
          english: true,
          singapore: true,
          infantcare: true,
          childcare: true,
          elderlycare: true,
          disabledcare: true,
          housework: true,
          cooking: true,
          handledog: false,
          handlecat: true
        },
        workingexperience: {
          first: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          second: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          third: {
            from: null,
            to: null,
            country: '',
            duties: ''
          }
        }
      }]
    }, {
      data: [{
        user: {
          local: {
            email: 'myanmar2@test.com',
            password: 'asdasd',
            confirm: 'asdasd',
            role: 'helper',
            identification: 'GU1234587',
            contact: {
              countrycode: '+64',
              number: '909162701212'
            }
          },
          available: true,
          recruit: false,
          hire: true,
          activate: {
            status: true,
            code: 'testcode'
          }
        }
      }, {
        transfer: false,
        lastactive: new Date(new Date().setDate(new Date().getDate() - 10)),
        profile: {
          firstname: 'MyanmarTwo',
          middlename: 'test',
          familyname: 'Wong',
          dob: '1993-01-12 00:00:00.000Z',
          pob: 'Singaporean',
          nationality: 'Myanmar',
          residentialaddress: 'Somewhere in the philippines',
          portrepatriated: 'Mactan-Cebu_International_Airport',
          religion: 'Taoist',
          dietaryrestriction: 'No_Pork',
          foodhandlingrestriction: 'No_Pork',
          allergies: '',
          heightcm: 188,
          weightkg: 75,
          siblings: 3,
          maritalstatus: 'Divorced',
          children: 2,
          ageofyoungest: 4
        },
        education: {
          educationlevel: 'Secondary',
          fieldofstudy: 'Medicine',
          otherqualifications: 'Cutting open people bellies'
        },
        skills: {
          english: true,
          singapore: true,
          infantcare: false,
          childcare: false,
          elderlycare: true,
          disabledcare: true,
          housework: true,
          cooking: true,
          handledog: true,
          handlecat: false
        },
        workingexperience: {
          first: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          second: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          third: {
            from: null,
            to: null,
            country: '',
            duties: ''
          }
        }
      }]
    }, {
      data: [{
        user: {
          local: {
            email: 'myanmar3@test.com',
            password: 'asdasd',
            confirm: 'asdasd',
            role: 'helper',
            identification: 'GU1234587',
            contact: {
              countrycode: '+64',
              number: '909162701212'
            }
          },
          available: true,
          recruit: false,
          hire: true,
          activate: {
            status: true,
            code: 'testcode'
          }
        }
      }, {
        transfer: false,
        lastactive: new Date(new Date().setDate(new Date().getDate() - 10)),
        profile: {
          firstname: 'MyanmarThree',
          middlename: 'test',
          familyname: 'Wong',
          dob: '1993-01-12 00:00:00.000Z',
          pob: 'Singaporean',
          nationality: 'Myanmar',
          residentialaddress: 'Somewhere in the philippines',
          portrepatriated: 'Mactan-Cebu_International_Airport',
          religion: 'Christian',
          dietaryrestriction: 'No_Pork',
          foodhandlingrestriction: 'No_Pork',
          allergies: '',
          heightcm: 188,
          weightkg: 75,
          siblings: 3,
          maritalstatus: 'Single',
          children: 0,
          ageofyoungest: 0
        },
        education: {
          educationlevel: 'Secondary',
          fieldofstudy: 'Medicine',
          otherqualifications: 'Cutting open people bellies'
        },
        skills: {
          english: true,
          singapore: true,
          infantcare: false,
          childcare: false,
          elderlycare: true,
          disabledcare: true,
          housework: true,
          cooking: true,
          handledog: true,
          handlecat: false
        },
        workingexperience: {
          first: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          second: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          third: {
            from: null,
            to: null,
            country: '',
            duties: ''
          }
        }
      }]
    }, {
      data: [{
        user: {
          local: {
            email: 'myanmar4@test.com',
            password: 'asdasd',
            confirm: 'asdasd',
            role: 'helper',
            identification: 'SG126597',
            contact: {
              countrycode: '+64',
              number: '998867431212'
            }
          },
          available: true,
          recruit: false,
          hire: true,
          activate: {
            status: true,
            code: 'seancode'
          }
        }
      }, {
        transfer: true,
        lastactive: new Date(new Date().setDate(new Date().getDate() - 10)),
        profile: {
          firstname: 'MyanmarFour',
          middlename: 'test',
          familyname: 'Wong',
          dob: '1989-12-26 00:00:00.000Z',
          pob: 'America',
          nationality: 'Myanmar',
          residentialaddress: 'Im never coming back to Singapore. I love it here',
          portrepatriated: 'Ninoy_Aquino_International_Airport',
          religion: 'Catholic',
          dietaryrestriction: 'None',
          foodhandlingrestriction: 'None',
          allergies: '',
          heightcm: 193,
          weightkg: 99,
          siblings: 3,
          maritalstatus: 'Single',
          children: 0,
          ageofyoungest: 0
        },
        education: {
          educationlevel: 'Undergraduate',
          fieldofstudy: 'Marketing and Communication',
          otherqualifications: 'Learning how to do marketing at a company.'
        },
        skills: {
          english: true,
          singapore: true,
          infantcare: true,
          childcare: true,
          elderlycare: false,
          disabledcare: false,
          housework: true,
          cooking: true,
          handledog: true,
          handlecat: false
        },
        workingexperience: {
          first: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          second: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          third: {
            from: null,
            to: null,
            country: '',
            duties: ''
          }
        }
      }]
    }, {
      // Indonesia
      data: [{
        user: {
          local: {
            email: 'indo1@test.com',
            password: 'asdasd',
            confirm: 'asdasd',
            role: 'helper',
            identification: 'EU1234567',
            contact: {
              countrycode: '+64',
              number: '909121212'
            }
          },
          available: true,
          recruit: false,
          hire: true,
          activate: {
            status: true,
            code: 'alexcode'
          }
        }
      }, {
        transfer: false,
        lastactive: new Date(new Date().setDate(new Date().getDate() - 10)),
        profile: {
          firstname: 'IndoOne',
          middlename: 'test',
          familyname: 'Wong',
          dob: '1994-09-23 00:00:00.000Z',
          pob: 'Singaporean',
          nationality: 'Indonesia',
          residentialaddress: 'Somewhere in indo',
          portrepatriated: 'Clark_International_Airport',
          religion: 'Islam',
          dietaryrestriction: 'No_Beef',
          foodhandlingrestriction: 'No_Beef',
          allergies: '',
          heightcm: 180,
          weightkg: 69,
          siblings: 3,
          maritalstatus: 'Divorced',
          children: 3,
          ageofyoungest: 2
        },
        education: {
          educationlevel: 'Primary',
          fieldofstudy: 'Nursing',
          otherqualifications: 'Taking care of elderly and cleaning toilets'
        },
        skills: {
          english: true,
          singapore: true,
          infantcare: true,
          childcare: true,
          elderlycare: true,
          disabledcare: true,
          housework: true,
          cooking: true,
          handledog: true,
          handlecat: false
        },
        workingexperience: {
          first: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          second: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          third: {
            from: null,
            to: null,
            country: '',
            duties: ''
          }
        }
      }]
    }, {
      data: [{
        user: {
          local: {
            email: 'indo2@test.com',
            password: 'asdasd',
            confirm: 'asdasd',
            role: 'helper',
            identification: 'GU1234587',
            contact: {
              countrycode: '+64',
              number: '909162701212'
            }
          },
          available: true,
          recruit: false,
          hire: true,
          activate: {
            status: true,
            code: 'gordoncode'
          }
        }
      }, {
        transfer: false,
        lastactive: new Date(new Date().setDate(new Date().getDate() - 10)),
        profile: {
          firstname: 'IndoTwo',
          middlename: 'test',
          familyname: 'Wong',
          dob: '1993-01-12 00:00:00.000Z',
          pob: 'Singaporean',
          nationality: 'Indonesia',
          residentialaddress: 'Somewhere in the indo',
          portrepatriated: 'Mactan-Cebu_International_Airport',
          religion: 'Christian',
          dietaryrestriction: 'No_Pork',
          foodhandlingrestriction: 'No_Pork',
          allergies: '',
          heightcm: 188,
          weightkg: 75,
          siblings: 3,
          maritalstatus: 'Single',
          children: 0,
          ageofyoungest: 0
        },
        education: {
          educationlevel: 'Secondary',
          fieldofstudy: 'Nurse',
          otherqualifications: 'Injections'
        },
        skills: {
          english: true,
          singapore: true,
          infantcare: false,
          childcare: false,
          elderlycare: true,
          disabledcare: true,
          housework: true,
          cooking: true,
          handledog: true,
          handlecat: false
        },
        workingexperience: {
          first: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          second: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          third: {
            from: null,
            to: null,
            country: '',
            duties: ''
          }
        }
      }]
    }, {
      data: [{
        user: {
          local: {
            email: 'indo3@test.com',
            password: 'asdasd',
            confirm: 'asdasd',
            role: 'helper',
            identification: 'IN1234567',
            contact: {
              countrycode: '+64',
              number: '909121212'
            }
          },
          available: true,
          recruit: false,
          hire: true,
          activate: {
            status: true,
            code: 'testcode'
          }
        }
      }, {
        transfer: true,
        lastactive: new Date(new Date().setDate(new Date().getDate() - 10)),
        profile: {
          firstname: 'IndoThree',
          middlename: 'test',
          familyname: 'Wong',
          dob: '1994-09-23 00:00:00.000Z',
          pob: 'Singaporean',
          nationality: 'Indonesia',
          residentialaddress: 'Somewhere in indo',
          portrepatriated: 'Clark_International_Airport',
          religion: 'Islam',
          dietaryrestriction: 'No_Beef',
          foodhandlingrestriction: 'No_Beef',
          allergies: '',
          heightcm: 180,
          weightkg: 69,
          siblings: 3,
          maritalstatus: 'Married',
          children: 4,
          ageofyoungest: 1
        },
        education: {
          educationlevel: 'Secondary',
          fieldofstudy: 'Business',
          otherqualifications: 'Taking care of elderly and cleaning toilets'
        },
        skills: {
          english: true,
          singapore: true,
          infantcare: true,
          childcare: true,
          elderlycare: true,
          disabledcare: false,
          housework: true,
          cooking: true,
          handledog: true,
          handlecat: false
        },
        workingexperience: {
          first: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          second: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          third: {
            from: null,
            to: null,
            country: '',
            duties: ''
          }
        }
      }]
    }, {
      data: [{
        user: {
          local: {
            email: 'indo4@test.com',
            password: 'asdasd',
            confirm: 'asdasd',
            role: 'helper',
            identification: 'SG126597',
            contact: {
              countrycode: '+64',
              number: '998867431212'
            }
          },
          available: true,
          recruit: false,
          hire: true,
          activate: {
            status: true,
            code: 'seancode'
          }
        }
      }, {
        transfer: false,
        lastactive: new Date(new Date().setDate(new Date().getDate() - 10)),
        profile: {
          firstname: 'IndoFour',
          middlename: 'test',
          familyname: 'Wong',
          dob: '1989-12-26 00:00:00.000Z',
          pob: 'America',
          nationality: 'Indonesia',
          residentialaddress: 'Im never coming back to Singapore. I love it here',
          portrepatriated: 'Ninoy_Aquino_International_Airport',
          religion: 'Catholic',
          dietaryrestriction: 'None',
          foodhandlingrestriction: 'None',
          allergies: '',
          heightcm: 193,
          weightkg: 99,
          siblings: 3,
          maritalstatus: 'Single',
          children: 0,
          ageofyoungest: 0
        },
        education: {
          educationlevel: 'Undergraduate',
          fieldofstudy: 'Marketing and Communication',
          otherqualifications: 'Learning how to do marketing at a company.'
        },
        skills: {
          english: true,
          singapore: true,
          infantcare: true,
          childcare: true,
          elderlycare: false,
          disabledcare: false,
          housework: true,
          cooking: true,
          handledog: true,
          handlecat: false
        },
        workingexperience: {
          first: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          second: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          third: {
            from: null,
            to: null,
            country: '',
            duties: ''
          }
        }
      }]
    }, {
      // Filipino
      data: [{
        user: {
          local: {
            email: 'fili5@test.com',
            password: 'asdasd',
            confirm: 'asdasd',
            role: 'helper',
            identification: 'GU1234587',
            contact: {
              countrycode: '+64',
              number: '909162701212'
            }
          },
          available: true,
          recruit: false,
          hire: true,
          activate: {
            status: true,
            code: 'testcode'
          }
        }
      }, {
        transfer: false,
        lastactive: new Date(new Date().setDate(new Date().getDate() - 10)),
        profile: {
          firstname: 'FiliFive',
          middlename: 'test',
          familyname: 'Wong',
          dob: '1993-01-12 00:00:00.000Z',
          pob: 'Singaporean',
          nationality: 'Philippines',
          residentialaddress: 'Somewhere in the philippines',
          portrepatriated: 'Mactan-Cebu_International_Airport',
          religion: 'Christian',
          dietaryrestriction: 'No_Pork',
          foodhandlingrestriction: 'No_Pork',
          allergies: '',
          heightcm: 188,
          weightkg: 75,
          siblings: 3,
          maritalstatus: 'Single',
          children: 0,
          ageofyoungest: 0
        },
        education: {
          educationlevel: 'Secondary',
          fieldofstudy: 'Medicine',
          otherqualifications: 'Cutting open people bellies'
        },
        skills: {
          english: true,
          singapore: true,
          infantcare: false,
          childcare: false,
          elderlycare: true,
          disabledcare: true,
          housework: true,
          cooking: true,
          handledog: true,
          handlecat: false
        },
        workingexperience: {
          first: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          second: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          third: {
            from: null,
            to: null,
            country: '',
            duties: ''
          }
        }
      }]
    }, {
      data: [{
        user: {
          local: {
            email: 'fili6@test.com',
            password: 'asdasd',
            confirm: 'asdasd',
            role: 'helper',
            identification: 'SG126597',
            contact: {
              countrycode: '+64',
              number: '998867431212'
            }
          },
          available: true,
          recruit: false,
          hire: true,
          activate: {
            status: true,
            code: 'seancode'
          }
        }
      }, {
        transfer: true,
        lastactive: new Date(new Date().setDate(new Date().getDate() - 10)),
        profile: {
          firstname: 'FiliSix',
          middlename: 'test',
          familyname: 'Wong',
          dob: '1989-12-26 00:00:00.000Z',
          pob: 'America',
          nationality: 'Philippines',
          residentialaddress: 'Im never coming back to Singapore. I love it here',
          portrepatriated: 'Ninoy_Aquino_International_Airport',
          religion: 'Catholic',
          dietaryrestriction: 'None',
          foodhandlingrestriction: 'None',
          allergies: '',
          heightcm: 193,
          weightkg: 99,
          siblings: 3,
          maritalstatus: 'Single',
          children: 0,
          ageofyoungest: 0
        },
        education: {
          educationlevel: 'Undergraduate',
          fieldofstudy: 'Marketing and Communication',
          otherqualifications: 'Learning how to do marketing at a company.'
        },
        skills: {
          english: true,
          singapore: true,
          infantcare: true,
          childcare: true,
          elderlycare: false,
          disabledcare: false,
          housework: true,
          cooking: true,
          handledog: true,
          handlecat: false
        },
        workingexperience: {
          first: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          second: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          third: {
            from: null,
            to: null,
            country: '',
            duties: ''
          }
        }
      }]
    }, {
      data: [{
        user: {
          local: {
            email: 'fili7@test.com',
            password: 'asdasd',
            confirm: 'asdasd',
            role: 'helper',
            identification: 'SG126597',
            contact: {
              countrycode: '+64',
              number: '998867431212'
            }
          },
          available: true,
          recruit: false,
          hire: true,
          activate: {
            status: true,
            code: 'seancode'
          }
        }
      }, {
        transfer: true,
        lastactive: new Date(new Date().setDate(new Date().getDate() - 10)),
        profile: {
          firstname: 'FiliSeven',
          middlename: 'test',
          familyname: 'Wong',
          dob: '1989-12-26 00:00:00.000Z',
          pob: 'America',
          nationality: 'Philippines',
          residentialaddress: 'Im never coming back to Singapore. I love it here',
          portrepatriated: 'Ninoy_Aquino_International_Airport',
          religion: 'Catholic',
          dietaryrestriction: 'None',
          foodhandlingrestriction: 'None',
          allergies: '',
          heightcm: 193,
          weightkg: 99,
          siblings: 3,
          maritalstatus: 'Single',
          children: 0,
          ageofyoungest: 0
        },
        education: {
          educationlevel: 'Undergraduate',
          fieldofstudy: 'Marketing and Communication',
          otherqualifications: 'Learning how to do marketing at a company.'
        },
        skills: {
          english: true,
          singapore: true,
          infantcare: true,
          childcare: true,
          elderlycare: false,
          disabledcare: false,
          housework: true,
          cooking: true,
          handledog: true,
          handlecat: false
        },
        workingexperience: {
          first: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          second: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          third: {
            from: null,
            to: null,
            country: '',
            duties: ''
          }
        }
      }]
    }, {
      data: [{
        user: {
          local: {
            email: 'fili8@test.com',
            password: 'asdasd',
            confirm: 'asdasd',
            role: 'helper',
            identification: 'SG126597',
            contact: {
              countrycode: '+64',
              number: '998867431212'
            }
          },
          available: true,
          recruit: false,
          hire: true,
          activate: {
            status: true,
            code: 'seancode'
          }
        }
      }, {
        transfer: true,
        lastactive: new Date(new Date().setDate(new Date().getDate() - 10)),
        profile: {
          firstname: 'FiliEight',
          middlename: 'test',
          familyname: 'Wong',
          dob: '1989-12-26 00:00:00.000Z',
          pob: 'America',
          nationality: 'Philippines',
          residentialaddress: 'Im never coming back to Singapore. I love it here',
          portrepatriated: 'Ninoy_Aquino_International_Airport',
          religion: 'Catholic',
          dietaryrestriction: 'None',
          foodhandlingrestriction: 'None',
          allergies: '',
          heightcm: 193,
          weightkg: 99,
          siblings: 3,
          maritalstatus: 'Single',
          children: 0,
          ageofyoungest: 0
        },
        education: {
          educationlevel: 'Undergraduate',
          fieldofstudy: 'Marketing and Communication',
          otherqualifications: 'Learning how to do marketing at a company.'
        },
        skills: {
          english: true,
          singapore: true,
          infantcare: true,
          childcare: true,
          elderlycare: false,
          disabledcare: false,
          housework: true,
          cooking: true,
          handledog: true,
          handlecat: false
        },
        workingexperience: {
          first: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          second: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          third: {
            from: null,
            to: null,
            country: '',
            duties: ''
          }
        }
      }]
    }, {
      // Myanmar
      data: [{
        user: {
          local: {
            email: 'myanmar5@test.com',
            password: 'asdasd',
            confirm: 'asdasd',
            role: 'helper',
            identification: 'EU1234567',
            contact: {
              countrycode: '+64',
              number: '909121212'
            }
          },
          available: true,
          recruit: false,
          hire: true,
          activate: {
            status: true,
            code: 'alexcode'
          }
        }
      }, {
        transfer: true,
        lastactive: new Date(new Date().setDate(new Date().getDate() - 10)),
        profile: {
          firstname: 'MyanmarFive',
          middlename: 'test',
          familyname: 'Wong',
          dob: '1994-09-23 00:00:00.000Z',
          pob: 'Singaporean',
          nationality: 'Myanmar',
          residentialaddress: 'Somewhere in the philippines',
          portrepatriated: 'Clark_International_Airport',
          religion: 'Christian',
          dietaryrestriction: 'No_Beef',
          foodhandlingrestriction: 'No_Beef',
          allergies: '',
          heightcm: 180,
          weightkg: 69,
          siblings: 3,
          maritalstatus: 'Married',
          children: 2,
          ageofyoungest: 7
        },
        education: {
          educationlevel: 'Primary',
          fieldofstudy: 'Nursing',
          otherqualifications: 'Taking care of elderly and cleaning toilets'
        },
        skills: {
          english: true,
          singapore: true,
          infantcare: true,
          childcare: true,
          elderlycare: true,
          disabledcare: true,
          housework: true,
          cooking: true,
          handledog: false,
          handlecat: true
        },
        workingexperience: {
          first: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          second: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          third: {
            from: null,
            to: null,
            country: '',
            duties: ''
          }
        }
      }]
    }, {
      data: [{
        user: {
          local: {
            email: 'myanmar6@test.com',
            password: 'asdasd',
            confirm: 'asdasd',
            role: 'helper',
            identification: 'GU1234587',
            contact: {
              countrycode: '+64',
              number: '909162701212'
            }
          },
          available: true,
          recruit: false,
          hire: true,
          activate: {
            status: true,
            code: 'testcode'
          }
        }
      }, {
        transfer: false,
        lastactive: new Date(new Date().setDate(new Date().getDate() - 10)),
        profile: {
          firstname: 'MyanmarSix',
          middlename: 'test',
          familyname: 'Wong',
          dob: '1993-01-12 00:00:00.000Z',
          pob: 'Singaporean',
          nationality: 'Myanmar',
          residentialaddress: 'Somewhere in the philippines',
          portrepatriated: 'Mactan-Cebu_International_Airport',
          religion: 'Christian',
          dietaryrestriction: 'No_Pork',
          foodhandlingrestriction: 'No_Pork',
          allergies: '',
          heightcm: 188,
          weightkg: 75,
          siblings: 3,
          maritalstatus: 'Single',
          children: 0,
          ageofyoungest: 0
        },
        education: {
          educationlevel: 'Secondary',
          fieldofstudy: 'Medicine',
          otherqualifications: 'Cutting open people bellies'
        },
        skills: {
          english: true,
          singapore: true,
          infantcare: false,
          childcare: false,
          elderlycare: true,
          disabledcare: true,
          housework: true,
          cooking: true,
          handledog: true,
          handlecat: false
        },
        workingexperience: {
          first: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          second: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          third: {
            from: null,
            to: null,
            country: '',
            duties: ''
          }
        }
      }]
    }, {
      data: [{
        user: {
          local: {
            email: 'myanmar7@test.com',
            password: 'asdasd',
            confirm: 'asdasd',
            role: 'helper',
            identification: 'SG126597',
            contact: {
              countrycode: '+64',
              number: '998867431212'
            }
          },
          available: true,
          recruit: false,
          hire: true,
          activate: {
            status: true,
            code: 'seancode'
          }
        }
      }, {
        transfer: true,
        lastactive: new Date(new Date().setDate(new Date().getDate() - 10)),
        profile: {
          firstname: 'MyanmarSeven',
          middlename: 'test',
          familyname: 'Wong',
          dob: '1989-12-26 00:00:00.000Z',
          pob: 'America',
          nationality: 'Myanmar',
          residentialaddress: 'Im never coming back to Singapore. I love it here',
          portrepatriated: 'Ninoy_Aquino_International_Airport',
          religion: 'Catholic',
          dietaryrestriction: 'None',
          foodhandlingrestriction: 'None',
          allergies: '',
          heightcm: 193,
          weightkg: 99,
          siblings: 3,
          maritalstatus: 'Single',
          children: 0,
          ageofyoungest: 0
        },
        education: {
          educationlevel: 'Undergraduate',
          fieldofstudy: 'Marketing and Communication',
          otherqualifications: 'Learning how to do marketing at a company.'
        },
        skills: {
          english: true,
          singapore: true,
          infantcare: true,
          childcare: true,
          elderlycare: false,
          disabledcare: false,
          housework: true,
          cooking: true,
          handledog: true,
          handlecat: false
        },
        workingexperience: {
          first: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          second: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          third: {
            from: null,
            to: null,
            country: '',
            duties: ''
          }
        }
      }]
    }, {
      data: [{
        user: {
          local: {
            email: 'myanmar8@test.com',
            password: 'asdasd',
            confirm: 'asdasd',
            role: 'helper',
            identification: 'GU1234587',
            contact: {
              countrycode: '+64',
              number: '909162701212'
            }
          },
          available: true,
          recruit: false,
          hire: true,
          activate: {
            status: true,
            code: 'testcode'
          }
        }
      }, {
        transfer: false,
        lastactive: new Date(new Date().setDate(new Date().getDate() - 10)),
        profile: {
          firstname: 'MyanmarEight',
          middlename: 'test',
          familyname: 'Wong',
          dob: '1993-01-12 00:00:00.000Z',
          pob: 'Singaporean',
          nationality: 'Myanmar',
          residentialaddress: 'Somewhere in the philippines',
          portrepatriated: 'Mactan-Cebu_International_Airport',
          religion: 'Taoist',
          dietaryrestriction: 'No_Pork',
          foodhandlingrestriction: 'No_Pork',
          allergies: '',
          heightcm: 188,
          weightkg: 75,
          siblings: 3,
          maritalstatus: 'Divorced',
          children: 2,
          ageofyoungest: 4
        },
        education: {
          educationlevel: 'Secondary',
          fieldofstudy: 'Medicine',
          otherqualifications: 'Cutting open people bellies'
        },
        skills: {
          english: true,
          singapore: true,
          infantcare: false,
          childcare: false,
          elderlycare: true,
          disabledcare: true,
          housework: true,
          cooking: true,
          handledog: true,
          handlecat: false
        },
        workingexperience: {
          first: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          second: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          third: {
            from: null,
            to: null,
            country: '',
            duties: ''
          }
        }
      }]
    }, {
      // Indonesia
      data: [{
        user: {
          local: {
            email: 'indo5@test.com',
            password: 'asdasd',
            confirm: 'asdasd',
            role: 'helper',
            identification: 'EU1234567',
            contact: {
              countrycode: '+64',
              number: '909121212'
            }
          },
          available: true,
          recruit: false,
          hire: true,
          activate: {
            status: true,
            code: 'alexcode'
          }
        }
      }, {
        transfer: false,
        lastactive: new Date(new Date().setDate(new Date().getDate() - 10)),
        profile: {
          firstname: 'IndoFive',
          middlename: 'test',
          familyname: 'Wong',
          dob: '1994-09-23 00:00:00.000Z',
          pob: 'Singaporean',
          nationality: 'Indonesia',
          residentialaddress: 'Somewhere in indo',
          portrepatriated: 'Clark_International_Airport',
          religion: 'Islam',
          dietaryrestriction: 'No_Beef',
          foodhandlingrestriction: 'No_Beef',
          allergies: '',
          heightcm: 180,
          weightkg: 69,
          siblings: 3,
          maritalstatus: 'Divorced',
          children: 3,
          ageofyoungest: 2
        },
        education: {
          educationlevel: 'Primary',
          fieldofstudy: 'Nursing',
          otherqualifications: 'Taking care of elderly and cleaning toilets'
        },
        skills: {
          english: true,
          singapore: true,
          infantcare: true,
          childcare: true,
          elderlycare: true,
          disabledcare: true,
          housework: true,
          cooking: true,
          handledog: true,
          handlecat: false
        },
        workingexperience: {
          first: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          second: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          third: {
            from: null,
            to: null,
            country: '',
            duties: ''
          }
        }
      }]
    }, {
      data: [{
        user: {
          local: {
            email: 'indo6@test.com',
            password: 'asdasd',
            confirm: 'asdasd',
            role: 'helper',
            identification: 'GU1234587',
            contact: {
              countrycode: '+64',
              number: '909162701212'
            }
          },
          available: true,
          recruit: false,
          hire: true,
          activate: {
            status: true,
            code: 'gordoncode'
          }
        }
      }, {
        transfer: false,
        lastactive: new Date(new Date().setDate(new Date().getDate() - 10)),
        profile: {
          firstname: 'IndoSix',
          middlename: 'test',
          familyname: 'Wong',
          dob: '1993-01-12 00:00:00.000Z',
          pob: 'Singaporean',
          nationality: 'Indonesia',
          residentialaddress: 'Somewhere in the indo',
          portrepatriated: 'Mactan-Cebu_International_Airport',
          religion: 'Christian',
          dietaryrestriction: 'No_Pork',
          foodhandlingrestriction: 'No_Pork',
          allergies: '',
          heightcm: 188,
          weightkg: 75,
          siblings: 3,
          maritalstatus: 'Single',
          children: 0,
          ageofyoungest: 0
        },
        education: {
          educationlevel: 'Secondary',
          fieldofstudy: 'Nurse',
          otherqualifications: 'Injections'
        },
        skills: {
          english: true,
          singapore: true,
          infantcare: false,
          childcare: false,
          elderlycare: true,
          disabledcare: true,
          housework: true,
          cooking: true,
          handledog: true,
          handlecat: false
        },
        workingexperience: {
          first: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          second: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          third: {
            from: null,
            to: null,
            country: '',
            duties: ''
          }
        }
      }]
    }, {
      data: [{
        user: {
          local: {
            email: 'indo7@test.com',
            password: 'asdasd',
            confirm: 'asdasd',
            role: 'helper',
            identification: 'IN1234567',
            contact: {
              countrycode: '+64',
              number: '909121212'
            }
          },
          available: true,
          recruit: false,
          hire: true,
          activate: {
            status: true,
            code: 'testcode'
          }
        }
      }, {
        transfer: true,
        lastactive: new Date(new Date().setDate(new Date().getDate() - 10)),
        profile: {
          firstname: 'IndoSeven',
          middlename: 'test',
          familyname: 'Wong',
          dob: '1994-09-23 00:00:00.000Z',
          pob: 'Singaporean',
          nationality: 'Indonesia',
          residentialaddress: 'Somewhere in indo',
          portrepatriated: 'Clark_International_Airport',
          religion: 'Islam',
          dietaryrestriction: 'No_Beef',
          foodhandlingrestriction: 'No_Beef',
          allergies: '',
          heightcm: 180,
          weightkg: 69,
          siblings: 3,
          maritalstatus: 'Married',
          children: 4,
          ageofyoungest: 1
        },
        education: {
          educationlevel: 'Secondary',
          fieldofstudy: 'Business',
          otherqualifications: 'Taking care of elderly and cleaning toilets'
        },
        skills: {
          english: true,
          singapore: true,
          infantcare: true,
          childcare: true,
          elderlycare: true,
          disabledcare: false,
          housework: true,
          cooking: true,
          handledog: true,
          handlecat: false
        },
        workingexperience: {
          first: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          second: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          third: {
            from: null,
            to: null,
            country: '',
            duties: ''
          }
        }
      }]
    }, {
      data: [{
        user: {
          local: {
            email: 'indo8@test.com',
            password: 'asdasd',
            confirm: 'asdasd',
            role: 'helper',
            identification: 'SG126597',
            contact: {
              countrycode: '+64',
              number: '998867431212'
            }
          },
          available: true,
          recruit: false,
          hire: true,
          activate: {
            status: true,
            code: 'seancode'
          }
        }
      }, {
        transfer: false,
        lastactive: new Date(new Date().setDate(new Date().getDate() - 10)),
        profile: {
          firstname: 'IndoEight',
          middlename: 'test',
          familyname: 'Wong',
          dob: '1989-12-26 00:00:00.000Z',
          pob: 'America',
          nationality: 'Indonesia',
          residentialaddress: 'Im never coming back to Singapore. I love it here',
          portrepatriated: 'Ninoy_Aquino_International_Airport',
          religion: 'Catholic',
          dietaryrestriction: 'None',
          foodhandlingrestriction: 'None',
          allergies: '',
          heightcm: 193,
          weightkg: 99,
          siblings: 3,
          maritalstatus: 'Single',
          children: 0,
          ageofyoungest: 0
        },
        education: {
          educationlevel: 'Undergraduate',
          fieldofstudy: 'Marketing and Communication',
          otherqualifications: 'Learning how to do marketing at a company.'
        },
        skills: {
          english: true,
          singapore: true,
          infantcare: true,
          childcare: true,
          elderlycare: false,
          disabledcare: false,
          housework: true,
          cooking: true,
          handledog: true,
          handlecat: false
        },
        workingexperience: {
          first: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          second: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          third: {
            from: null,
            to: null,
            country: '',
            duties: ''
          }
        }
      }]
    }, {
      // Filipino
      data: [{
        user: {
          local: {
            email: 'fili9@test.com',
            password: 'asdasd',
            confirm: 'asdasd',
            role: 'helper',
            identification: 'EU1234567',
            contact: {
              countrycode: '+64',
              number: '909121212'
            }
          },
          available: true,
          recruit: false,
          hire: true,
          activate: {
            status: true,
            code: 'alexcode'
          }
        }
      }, {
        transfer: true,
        lastactive: new Date(new Date().setDate(new Date().getDate() - 10)),
        profile: {
          firstname: 'FiliNine',
          middlename: 'test',
          familyname: 'Wong',
          dob: '1994-09-23 00:00:00.000Z',
          pob: 'Singaporean',
          nationality: 'Philippines',
          residentialaddress: 'Somewhere in the philippines',
          portrepatriated: 'Clark_International_Airport',
          religion: 'Christian',
          dietaryrestriction: 'No_Beef',
          foodhandlingrestriction: 'No_Beef',
          allergies: '',
          heightcm: 180,
          weightkg: 69,
          siblings: 3,
          maritalstatus: 'Married',
          children: 2,
          ageofyoungest: 7
        },
        education: {
          educationlevel: 'Primary',
          fieldofstudy: 'Nursing',
          otherqualifications: 'Taking care of elderly and cleaning toilets'
        },
        skills: {
          english: true,
          singapore: true,
          infantcare: true,
          childcare: true,
          elderlycare: true,
          disabledcare: true,
          housework: true,
          cooking: true,
          handledog: false,
          handlecat: true
        },
        workingexperience: {
          first: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          second: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          third: {
            from: null,
            to: null,
            country: '',
            duties: ''
          }
        }
      }]
    }, {
      data: [{
        user: {
          local: {
            email: 'fili10@test.com',
            password: 'asdasd',
            confirm: 'asdasd',
            role: 'helper',
            identification: 'GU1234587',
            contact: {
              countrycode: '+64',
              number: '909162701212'
            }
          },
          available: true,
          recruit: false,
          hire: true,
          activate: {
            status: true,
            code: 'testcode'
          }
        }
      }, {
        transfer: false,
        lastactive: new Date(new Date().setDate(new Date().getDate() - 10)),
        profile: {
          firstname: 'FiliTen',
          middlename: 'test',
          familyname: 'Wong',
          dob: '1993-01-12 00:00:00.000Z',
          pob: 'Singaporean',
          nationality: 'Philippines',
          residentialaddress: 'Somewhere in the philippines',
          portrepatriated: 'Mactan-Cebu_International_Airport',
          religion: 'Taoist',
          dietaryrestriction: 'No_Pork',
          foodhandlingrestriction: 'No_Pork',
          allergies: '',
          heightcm: 188,
          weightkg: 75,
          siblings: 3,
          maritalstatus: 'Divorced',
          children: 2,
          ageofyoungest: 4
        },
        education: {
          educationlevel: 'Secondary',
          fieldofstudy: 'Medicine',
          otherqualifications: 'Cutting open people bellies'
        },
        skills: {
          english: true,
          singapore: true,
          infantcare: false,
          childcare: false,
          elderlycare: true,
          disabledcare: true,
          housework: true,
          cooking: true,
          handledog: true,
          handlecat: false
        },
        workingexperience: {
          first: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          second: {
            from: null,
            to: null,
            country: '',
            duties: ''
          },
          third: {
            from: null,
            to: null,
            country: '',
            duties: ''
          }
        }
      }]
    }]
    res.json(userAPI)
  },
  postAJAXUsersDemo: function (req, res) {
    var userData = new User({
      local: {
        email: req.body.data[0].user.local.email,
        password: req.body.data[0].user.local.password,
        confirm: req.body.data[0].user.local.confirm,
        role: req.body.data[0].user.local.role,
        identification: req.body.data[0].user.local.identification.toUpperCase(),
        contact: {
          countrycode: req.body.data[0].user.local.contact.countrycode,
          number: req.body.data[0].user.local.contact.number
        }
      },
      available: req.body.data[0].user.available,
      recruit: req.body.data[0].user.recruit,
      hire: req.body.data[0].user.hire,
      activate: {
        status: req.body.data[0].user.activate.status,
        code: req.body.data[0].user.activate.code
      }
    })
    userData.save(function (err, newUser) {
      if (err) { res.json({'updated': 'error'}) }
      if (newUser.local.role === 'helper') {
        var newHelper = new Helper({
          userid: newUser._id,
          transfer: req.body.data[1].transfer,
          lastactive: req.body.data[1].lastactive,
          profile: {
            firstname: req.body.data[1].profile.firstname,
            middlename: req.body.data[1].profile.middlename,
            familyname: req.body.data[1].profile.familyname,
            dob: req.body.data[1].profile.dob,
            pob: req.body.data[1].profile.pob,
            nationality: req.body.data[1].profile.nationality,
            residentialaddress: req.body.data[1].profile.residentialaddress,
            portrepatriated: req.body.data[1].profile.portrepatriated,
            religion: req.body.data[1].profile.religion,
            dietaryrestriction: req.body.data[1].profile.dietaryrestriction,
            foodhandlingrestriction: req.body.data[1].profile.foodhandlingrestriction,
            allergies: req.body.data[1].profile.allergies,
            heightcm: req.body.data[1].profile.heightcm,
            weightkg: req.body.data[1].profile.weightkg,
            siblings: req.body.data[1].profile.siblings,
            maritalstatus: req.body.data[1].profile.maritalstatus,
            children: req.body.data[1].profile.children,
            ageofyoungest: req.body.data[1].profile.ageofyoungest
          },
          education: {
            educationlevel: req.body.data[1].education.educationlevel,
            fieldofstudy: req.body.data[1].education.fieldofstudy,
            otherqualifications: req.body.data[1].education.otherqualifications
          },
          skills: {
            english: req.body.data[1].skills.english,
            singapore: req.body.data[1].skills.singapore,
            infantcare: req.body.data[1].skills.infantcare,
            childcare: req.body.data[1].skills.childcare,
            elderlycare: req.body.data[1].skills.elderlycare,
            disabledcare: req.body.data[1].skills.disabledcare,
            housework: req.body.data[1].skills.housework,
            cooking: req.body.data[1].skills.cooking,
            handledog: req.body.data[1].skills.handledog,
            handlecat: req.body.data[1].skills.handlecat
          },
          workingexperience: {
            first: {
              from: req.body.data[1].workingexperience.first.from,
              to: req.body.data[1].workingexperience.first.to,
              country: req.body.data[1].workingexperience.first.country,
              duties: req.body.data[1].workingexperience.first.duties
            },
            second: {
              from: req.body.data[1].workingexperience.second.from,
              to: req.body.data[1].workingexperience.second.to,
              country: req.body.data[1].workingexperience.second.country,
              duties: req.body.data[1].workingexperience.second.duties
            },
            third: {
              from: req.body.data[1].workingexperience.third.from,
              to: req.body.data[1].workingexperience.third.to,
              country: req.body.data[1].workingexperience.third.country,
              duties: req.body.data[1].workingexperience.third.duties
            }
          }
        })
        newHelper.save(function (err, newHelper) {
          if (err) { res.json({'updated': 'error'}) }
          newHelper.searchString(req.body.data[1], function (err, response) {
            if (err) { res.json({'updated': 'error'}) }
            res.json({'updated': 'success'})
          })
        })
      } else {
        var newEmployer = new Employer({
          userid: newUser._id,
          profile: {
            fullname: req.body.data[1].profile.fullname,
            housetype: req.body.data[1].profile.housetype,
            blockhouseno: req.body.data[1].profile.blockhouseno,
            unitno: req.body.data[1].profile.unitno,
            streetname: req.body.data[1].profile.streetname,
            postalcode: req.body.data[1].profile.postalcode,
            maritalstatus: req.body.data[1].profile.maritalstatus
          },
          household: {
            adult: req.body.data[1].household.adult,
            teenager: req.body.data[1].household.teenager,
            children: req.body.data[1].household.children,
            infant: req.body.data[1].household.infant,
            elderly: req.body.data[1].household.elderly,
            disabled: req.body.data[1].household.disabled
          },
          jobscope: {
            infantcare: req.body.data[1].jobscope.infantcare,
            childcare: req.body.data[1].jobscope.childcare,
            elderlycare: req.body.data[1].jobscope.elderlycare,
            disabledcare: req.body.data[1].jobscope.disabledcare,
            housework: req.body.data[1].jobscope.housework,
            cooking: req.body.data[1].jobscope.cooking,
            handledog: req.body.data[1].jobscope.handledog,
            handlecat: req.body.data[1].jobscope.handlecat,
            otherduties: req.body.data[1].jobscope.otherduties
          }
        })
        newEmployer.save(function (err, newEmployer) {
          if (err) { res.json({'updated': 'error'}) }
          res.json({'updated': 'success'})
        })
      }
    })
  },
  removeAJAXUsersData: function (req, res, next) {
    User.remove({'local.email': {$regex: 'test'}}, function (err) {
      if (err) { return next(err) }
      Helper.remove({'profile.middlename': {$regex: 'test'}}, function (err) {
        if (err) { return next(err) }
        Employer.remove({'profile.fullname': {$regex: 'test'}}, function (err) {
          if (err) { return next(err) }
          Hire.remove({}, function (err) {
            if (err) { return next(err) }
            res.json({'status': 'ok'})
          })
        })
      })
    })
  }
}
