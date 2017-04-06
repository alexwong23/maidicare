var mongoose = require('mongoose')

var mailSchema = new mongoose.Schema({
  from: {type: String},
  to: [{
    email: {type: String}
  }],
  cc: [], // nvr used
  bcc: [],
  subject: {type: String},
  message: {type: String},
  substitutions: {},
  templateid: { type: String }
})

// schema method for sending SENDGRID emails (without BCC)
mailSchema.methods.sendEmail = function (mailobj, callback) {
  var mailregex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  if (mailregex.test(mailobj.to[0].email) && mailregex.test(mailobj.from)) {
    if (mailobj.subject !== '' && mailobj.message !== '') {
      var sg = require('sendgrid')(process.env.SENDGRID_API_KEY)
      var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: {
          personalizations: [{
            to: mailobj.to,
            subject: mailobj.subject,
            substitutions: mailobj.substitutions
          }],
          from: {email: mailobj.from},
          content: [{
            type: 'text/html',
            value: mailobj.message
          }],
          template_id: mailobj.templateid
        }
      })
      sg.API(request, function (err, response) {
        if (err) { }
        console.log(response.statusCode)
        console.log(response.body)
        console.log(response.headers)
        callback(err, response)
      })
    } else {
      var errEmpty = { message: 'Failed to send email. Subject and message cannot be empty.' }
      callback(errEmpty)
    }
  } else {
    var err = { message: 'Failed to send email. Invalid email provided.' }
    callback(err)
  }
}

// schema method for sending SENDGRID emails (with BCC)
mailSchema.methods.sendEmailBcc = function (mailobj, callback) {
  var mailregex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  if (mailregex.test(mailobj.to[0].email) && mailregex.test(mailobj.from)) {
    if (mailobj.subject !== '' && mailobj.message !== '') {
      var sg = require('sendgrid')(process.env.SENDGRID_API_KEY)
      var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: {
          personalizations: [{
            to: mailobj.to,
            bcc: mailobj.bcc,
            subject: mailobj.subject,
            substitutions: mailobj.substitutions
          }],
          from: {email: mailobj.from},
          content: [{
            type: 'text/html',
            value: mailobj.message
          }],
          template_id: mailobj.templateid
        }
      })
      sg.API(request, function (err, response) {
        if (err) { }
        console.log(response.statusCode)
        console.log(response.body)
        console.log(response.headers)
        callback(err, response)
      })
    } else {
      var errEmpty = { message: 'Failed to send email. Subject and message cannot be empty.' }
      callback(errEmpty)
    }
  } else {
    var err = { message: 'Failed to send email. Invalid email provided.' }
    callback(err)
  }
}

var Mail = mongoose.model('Mail', mailSchema)

module.exports = Mail
