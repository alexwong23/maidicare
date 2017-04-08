$(document).ready(function () {
  // Callback check for IE
  function isBrowserIE () {
    var ua = window.navigator.userAgent
    var msie = ua.indexOf('MSIE ')
    var trident = ua.indexOf('Trident/')
    var edge = ua.indexOf('Edge/')
    if (msie > 0 || trident > 0 || edge > 0) {
      return true
    }
  }

  // Callback for swals
  function swalError (string) {
    swal({
      title: 'Error',
      text: string,
      type: 'error',
      confirmButtonColor: 'rgb(221, 75, 57)'
    })
  }
  function swalSuccess (string) {
    swal({
      title: 'Success',
      text: string,
      type: 'success',
      confirmButtonColor: 'rgb(38, 166, 91)'
    })
  }

  // Callback validate email regex
  function validateEmail (email) {
    var re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    return re.test(email)
  }

  // Callback calculate age
  function calculateAge (dateString) {
    var today = new Date()
    var birthDate = new Date(dateString)
    var age = today.getFullYear() - birthDate.getFullYear()
    var m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  /**
  * @name Edit Helper & Employer Callbacks
  **/
  // callbacks to add input style
  function resetinput (element) {
    $(element).css({'border-color': '#ccc', 'color': '#555', 'border': '1px solid #ccc'})
  }
  function inputerror (element) {
    $(element).css({'color': '#a94442', 'border': '2px solid #a94442'})
  }
  function inputwarning (element) {
    $(element).css({'color': '#8a6d3b', 'border': '2px solid #F7CA18'})
  }
  // callback error to check if string exceeds max char
  function inputStringMax (type, elementname, max) {
    var element = type + '[name="' + elementname + '"]'
    var value = $(element).val()
    if (value.length > max) {
      inputwarning(element)
      return true
    } else {
      resetinput(element)
      return false
    }
  }
  // callback error to check if value is integer
  function inputNumber (canEmpty, type, elementname) {
    var element = type + '[name="' + elementname + '"]'
    var value = $(element).val()
    var returnValue
    if (canEmpty) {
      var regexIntOrEmpty = new RegExp(/^(\s*|\d+)$/)
      if (regexIntOrEmpty.test(value)) {
        resetinput(element)
        returnValue = false
      } else {
        inputwarning(element)
        returnValue = true
      }
    } else {
      var regexInt = new RegExp(/^\d+$/)
      if (regexInt.test(value)) {
        resetinput(element)
        returnValue = false
      } else {
        inputwarning(element)
        returnValue = true
      }
    }
    return returnValue
  }
  // callback errors to check if field filled
  function stringNotEmpty (type, elementname) {
    var element = type + '[name="' + elementname + '"]'
    var value = $(element).val()
    if (value.length > 0) {
      resetinput(element)
      return false
    } else {
      inputerror(element)
      return true
    }
  }
  function numberNotZero (type, elementname) {
    var element = type + '[name="' + elementname + '"]'
    var value = +$(element).val()
    if (value > 0) {
      resetinput(element)
      return false
    } else {
      inputerror(element)
      return true
    }
  }
  function dateNotEmpty () {
    function dateChecker (value, elementname) {
      if (value === '') {
        inputerror('select#dob-' + elementname)
      } else {
        resetinput('select#dob-' + elementname)
      }
    }
    var dobdate = $('select#dob-date').val()
    var dobmonth = $('select#dob-month').val()
    var dobyear = $('select#dob-year').val()
    if (dobdate !== '' && dobmonth !== '' && dobyear !== '') {
      resetinput('select#dob-date')
      resetinput('select#dob-month')
      resetinput('select#dob-year')
      return false
    } else {
      dateChecker(dobdate, 'date')
      dateChecker(dobmonth, 'month')
      dateChecker(dobyear, 'year')
      return true
    }
  }

  /**
  * @name Navbar
  *
  * logout swal
  * get current URL path and assign 'active' class
  * hover navbar
  **/
  $('.nav .dropdown-menu .logout').on('click', function () {
    swal({
      title: 'Sign Out',
      text: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(38, 166, 91)',
      cancelButtonColor: 'rgb(221, 75, 57)',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonClass: 'btn-success',
      cancelButtonClass: 'btn-danger',
      buttonsStyling: true
    }).then(function () {
      window.location = '/logout'
    })
  })

  var pathname = window.location.pathname.split('/', 2).join('/')
  $('.nav > li > a[href="' + pathname + '"]').parent().addClass('active')

  function hoverNavBar () {
    if ($(window).width() > 768) {
      $('.dropdown').on({
        mouseenter: function () {
          $(this).find('.dropdown-menu').stop(true, true).delay(150).fadeIn(500)
        },
        mouseleave: function () {
          $(this).find('.dropdown-menu').stop(true, true).delay(150).fadeOut(500)
        }
      })
    }
  }
  hoverNavBar()
  $(window).resize(function () {
    hoverNavBar()
  })

  // global for tooltip
  $('[data-toggle="tooltip"]').tooltip()

  // homepage page-scroll - requires jQuery Easing plugin
  $('a.page-scroll').bind('click', function (event) {
    var $anchor = $(this)
    $('html, body').stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top - 50)
    }, 1250, 'easeInOutExpo')
    event.preventDefault()
  })

  /**
  * @name Contact Us
  *
  * Autofill contact us email if user login
  *
  * AJAX Post Contact Us to support@maidicare.com
  * Includes Hidden input, prevent spam bots
  *
  **/
  if ($('.ajax-contactus').length) {
    var idrole = $('.ajax-contactus').data('idrole')
    if (idrole !== '') {
      $.ajax({
        url: '/loadcontactus/' + idrole,
        type: 'POST',
        cache: false,
        success: function (data) {
          if (data.status === 'success') {
            $('#contactname').val(data.name)
            $('#contactemail').val(data.email)
          }
        }
      })
    }
    $('.ajax-contactus').submit(function (e) {
      e.preventDefault()
      if (
        $('#contactname').val() === '' ||
        $('#contactemail').val() === '' ||
        $('#contactsubject').val() === '' ||
        $('#contactmessage').val() === '') {
        swalError('Please fill in the required * fields.')
      } else if (!validateEmail($('#contactemail').val())) {
        swalError('Please provide a valid email address.')
      } else {
        $.ajax({
          url: '/contactus',
          type: 'POST',
          data: JSON.stringify({
            name: $('#contactname').val(),
            email: $('#contactemail').val(),
            subject: $('#contactsubject').val(),
            message: $('#contactmessage').val(),
            dinnertime: $('#dinnertime').val()
          }),
          dataType: 'json',
          contentType: 'application/json',
          success: function (data) {
            swalSuccess('Thank you. We will get back to you within 2 business days.')
            // reset form
            $('#contactname').val('')
            $('#contactemail').val('')
            $('#contactsubject').val('')
            $('#contactmessage').val('')
          },
          error: function (err) {
            if (err) swalError('Please refresh the page and try again. You can also contact us at \'support@maidicare.com\'.')
          }
        })
      }
    })
  }

  /**
  * @name SIGN UP
  *
  * IE Browser alert
  *
  * load identification placeholder based on session storage
  *
  * CSS formatting
  *   glyphicons
  *   hidden p tags
  *
  * Custom Validation before submit
  *   regex
  *     email
  *     password
  *     identification
  *     NRIC calculator
  *
  * Session Storage
  *     email
  *     role
  *     identification
  *
  * Auto validation
  *     when not typing for 3 seconds
  *     focus out
  */
  if ($('.local-signup').length) {
    if (isBrowserIE()) {
      window.alert('For a better website experience, please use other browsers such as Chrome, Firefox or Safari.')
      $('.roleSelect input').css('display', 'block')
      $('.roleLogo:last-child, #roleEmployer').css({'position': 'relative', 'top': '-17px'})
    }

    // callbacks to add css and glyphicons
    function removerightaddon (params) {
      $(params).css('color', '#717f86')
      $(params).find('.right-addon').remove()
      $(params).removeClass('has-error has-success has-warning')
    }
    function formsuccess (param) {
      removerightaddon(param)
      $(param).css('color', '#3c763d')
      $(param).addClass('has-success')
      $(param).append('<i class="right-addon glyphicon glyphicon-ok"></i>')
    }
    function formerror (param) {
      removerightaddon(param)
      $(param).css('color', '#a94442')
      $(param).addClass('has-error')
      $(param).append('<i class="right-addon glyphicon glyphicon-remove"></i>')
    }
    function formwarning (param) {
      removerightaddon(param)
      $(param).css('color', '#8a6d3b')
      $(param).addClass('has-warning')
      $(param).append('<i class="right-addon glyphicon glyphicon-warning-sign"></i>')
    }

    // callbacks to add sign up form text
    function removeformtext (elementtext) {
      $(elementtext).css({'visibility': 'hidden', 'color': '#717f86'})
      $(elementtext).text('label')
    }
    function formtexterror (elementtext, displaytext) {
      removeformtext(elementtext)
      $(elementtext).css({'visibility': 'visible', 'color': '#a94442'})
      $(elementtext).text(displaytext)
    }
    function formtextwarning (elementtext, displaytext) {
      removeformtext(elementtext)
      $(elementtext).css({'visibility': 'visible', 'color': '#8a6d3b'})
      $(elementtext).text(displaytext)
    }

    // callbacks for signup validation
    function srolevalidation (value) {
      $('.roleSelect > p').css({'font-size': '15px', 'font-weight': '400', 'color': '#717f86'})
      if (value !== 'helper' && value !== 'employer') {
        $('.roleSelect > p').css({'font-size': '18px', 'font-weight': 'bolder', 'color': '#a94442'})
        return false
      }
    }
    function semailvalidation (element, elementtext, value) {
      if (value.length < 1) {
        removerightaddon(element)
        removeformtext(elementtext)
        return false
      } else if (validateEmail(value)) {
        $.ajax({
          url: '/users/emailtaken',
          type: 'POST',
          cache: false,
          data: JSON.stringify({email: value}),
          dataType: 'json',
          contentType: 'application/json',
          success: function (data) {
            if (data.status === 'success') {
              formsuccess(element)
              removeformtext(elementtext)
            } else {
              formerror(element)
              formtexterror(elementtext, 'Email has been taken.')
              return false
            }
          },
          error: function (err) {
            if (err) {
              swalError('Something went wrong! Please refresh the page and try again.')
            }
          }
        })
      } else {
        formerror(element)
        formtexterror(elementtext, 'Please provide a valid email')
        return false
      }
    }
    function spasswordvalidation (element, elementtext, value) {
      var mediumPasswordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9, !@#$%^&*]).{6,}$/)
      if (value.length < 1) {
        removerightaddon(element)
        removeformtext(elementtext)
        return false
      } else if (value.length < 6) {
        formerror(element)
        formtexterror(elementtext, 'Minimum 6 characters')
        return false
      } else if (mediumPasswordRegex.test(value) === false) {
        formwarning(element)
        formtextwarning(elementtext, 'Password not strong')
      } else {
        formsuccess(element)
        removeformtext(elementtext)
      }
    }
    function spasswordmatch (element, elementtext, password, confirm) {
      if (confirm.length < 1) {
        removerightaddon(element)
        removeformtext(elementtext)
        return false
      } else if (password !== confirm) {
        formerror(element)
        formtexterror(elementtext, 'Passwords do not match')
        return false
      }
    }
    function nricvalidator (value) {
      var nric = value.slice(1, 8)
      var nricarray = nric.split('').map(function (number) {
        return parseInt(number, 10)
      })
      var nricweightarray = [2, 7, 6, 5, 4, 3, 2]
      var sum = 0
      for (var i = 0; i < nricarray.length; i++) {
        sum += nricarray[i] * nricweightarray[i]
      }
      var firstletter = value.slice(0, 1).toUpperCase()
      if (firstletter === 'T' || firstletter === 'G') {
        sum += 4
      }
      var checkdigit = 11 - (sum % 11)
      var alphabetarray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'Z', 'J']
      if (firstletter === 'F' || firstletter === 'G') {
        alphabetarray = ['K', 'L', 'M', 'N', 'P', 'Q', 'R', 'T', 'U', 'W', 'X']
      }
      var lastletter = alphabetarray.slice(checkdigit - 1, checkdigit).toString()
      var valueletter = value.slice(8, 9).toUpperCase()
      if (lastletter === valueletter) {
        return true
      } else {
        return false
      }
    }
    function sidentityvalidation (role, value) {
      // var regexHelperPassport = new RegExp(/^([A-z]{2}[0-9]{7})$/)
      var regexEmployerNRIC = new RegExp(/^([S,T,s,t][0-9]{7}[A-J,Z,a-j,z])$|^([F,G,f,g][0-9]{7}[K-R,T-X,k-r,t-x])$/)
      var element = '.local-signup .identification'
      var elementtext = '.local-signup .form-group-text.tidentification'
      if (value.length < 1) {
        removerightaddon(element)
        removeformtext(elementtext)
        return false
      } else if (role === 'helper') {
        formsuccess(element)
        removeformtext(elementtext)
      } else if (role === 'employer' && regexEmployerNRIC.test(value) && nricvalidator(value)) {
        formsuccess(element)
        removeformtext(elementtext)
      } else if (role === 'helper' || role === 'employer') {
        formerror(element)
        formtexterror(elementtext, 'Invalid Identification')
        return false
      } else {
        formerror(element)
        formtexterror(elementtext, 'Please choose a role')
        return false
      }
    }

    var signuprole = window.sessionStorage.getItem('signuprole')
    var signupchangeplaceholder = $("input[name='user[local][identification]']")
    if (signuprole === 'helper') {
      signupchangeplaceholder.attr('placeholder', 'Passport Number')
    } else if (signuprole === 'employer') {
      signupchangeplaceholder.attr('placeholder', 'NRIC eg.S1234567D')
    }

    // session storage for sign up email, role and id
    $('.local-signup .form-group.email input#email').val(window.sessionStorage.getItem('signupemail'))
    $('.local-signup .form-group.identification input#identification').val(window.sessionStorage.getItem('signupidentification'))
    $('.local-signup .form-group input[value=' + signuprole + ']').attr('checked', 'checked')

    // event handlers for sign up form
    $('.local-signup').submit(function (e) {
      var sEmail = $("input[name='user[local][email]']").val()
      var sPassword = $("input[name='user[local][password]']").val()
      var sConfirm = $("input[name='user[local][confirm]']").val()
      var sRole = $("input[name='user[local][role]']:checked").val()
      var sIdentification = $("input[name='user[local][identification]']").val()

      srolevalidation(sRole)
      semailvalidation('.local-signup .email', '.local-signup .form-group-text.temail', sEmail)
      spasswordvalidation('.local-signup .password', '.local-signup .form-group-text.tpassword', sPassword)
      spasswordvalidation('.local-signup .confirm', '.local-signup .form-group-text.tconfirm', sConfirm)
      spasswordmatch('.local-signup .confirm', '.local-signup .form-group-text.tconfirm', sPassword, sConfirm)
      sidentityvalidation(sRole, sIdentification)

      if (
        srolevalidation(sRole) === false ||
        semailvalidation('.local-signup .email', '.local-signup .form-group-text.temail', sEmail) === false ||
        spasswordvalidation('.local-signup .password', '.local-signup .form-group-text.tpassword', sPassword) === false ||
        spasswordvalidation('.local-signup .confirm', '.local-signup .form-group-text.tconfirm', sConfirm) === false ||
        spasswordmatch('.local-signup .confirm', '.local-signup .form-group-text.tconfirm', sPassword, sConfirm) === false ||
        sidentityvalidation(sRole, sIdentification) === false) {
        e.preventDefault()
      }
      window.sessionStorage.setItem('signupemail', sEmail)
      window.sessionStorage.setItem('signuprole', sRole)
      window.sessionStorage.setItem('signupidentification', sIdentification)
    })

    // signup form auto check after not typing for 3seconds
    var sTypingTimer
    var sTypingInterval = 3000
    var $sInput = $('.local-signup .form-group')

    // on keyup, start the countdown
    $sInput.on('keyup', function () {
      clearTimeout(sTypingTimer)
      sTypingTimer = setTimeout(sStopTyping, sTypingInterval)
    })

    // on keydown, clear the countdown
    $sInput.on('keydown', function () {
      clearTimeout(sTypingTimer)
    })

    // run the callbacks when stop typing
    function sStopTyping () {
      var sEmail = $("input[name='user[local][email]']").val()
      var sPassword = $("input[name='user[local][password]']").val()
      var sConfirm = $("input[name='user[local][confirm]']").val()
      var sRole = $("input[name='user[local][role]']:checked").val()
      var sIdentification = $("input[name='user[local][identification]']").val()

      semailvalidation('.local-signup .email', '.local-signup .form-group-text.temail', sEmail)
      spasswordvalidation('.local-signup .password', '.local-signup .form-group-text.tpassword', sPassword)
      spasswordvalidation('.local-signup .confirm', '.local-signup .form-group-text.tconfirm', sConfirm)
      spasswordmatch('.local-signup .confirm', '.local-signup .form-group-text.tconfirm', sPassword, sConfirm)
      sidentityvalidation(sRole, sIdentification)
    }

    $('.local-signup .form-group.email').focusout(function () {
      var sEmail = $("input[name='user[local][email]']").val()
      semailvalidation('.local-signup .email', '.local-signup .form-group-text.temail', sEmail)
    })
    $('.local-signup .form-group.password').focusout(function () {
      var sPassword = $("input[name='user[local][password]']").val()
      spasswordvalidation('.local-signup .password', '.local-signup .form-group-text.tpassword', sPassword)
    })
    $('.local-signup .form-group.confirm').focusout(function () {
      var sPassword = $("input[name='user[local][password]']").val()
      var sConfirm = $("input[name='user[local][confirm]']").val()
      spasswordvalidation('.local-signup .confirm', '.local-signup .form-group-text.tconfirm', sConfirm)
      spasswordmatch('.local-signup .confirm', '.local-signup .form-group-text.tconfirm', sPassword, sConfirm)
    })
    $('.local-signup .form-group.identification').focusout(function () {
      var sRole = $("input[name='user[local][role]']:checked").val()
      var sIdentification = $("input[name='user[local][identification]']").val()
      sidentityvalidation(sRole, sIdentification)
    })
    $('.local-signup .form-group.role').on('click', function () {
      removerightaddon('.local-signup .identification')
      removeformtext('.local-signup .form-group-text.tidentification')
      var signupchangerole = $("input[name='user[local][role]']:checked").val()
      var signupchangeplaceholder = $("input[name='user[local][identification]']")
      if (signupchangerole === 'helper') {
        signupchangeplaceholder.attr('placeholder', 'Passport Number')
        signupchangeplaceholder.val('')
      } else if (signupchangerole === 'employer') {
        signupchangeplaceholder.attr('placeholder', 'NRIC, S1234567D')
        signupchangeplaceholder.val('')
      }
    })
  }

  /**
  * @name LOGIN
  *
  * IE Browser alert
  *
  * Focus on first input
  * Local Storage for email
  */
  if ($('.local-login').length) {
    if (isBrowserIE()) {
      window.alert('For a better website experience, please use other browsers such as Chrome, Firefox or Safari.')
    }
    // focus on first visible input textbox for login form
    // use local storage for login input
    $('.local-login .form-group input:text:visible:first').focus()
    $('.local-login .form-group input#email').val(window.localStorage.getItem('loginemail'))
    $('.local-login').submit(function (e) {
      var lEmail = $("input[name='user[local][email]']").val()
      window.localStorage.setItem('loginemail', lEmail)
    })
  }

  /**
  * @name Edit Employer
  *
  * Extract user data from front end html using data-employer
  *
  * Preload user data
  *     textbox
  *     ddl
  *     textarea
  *     checkbox
  *     unit no hidden if Landed
  *
  * Housetype
  *     Landed
  *       page load, housetype Landed, hide unit no
  *       change housetype value, if Landed, hide/show
  *     other textbox
  *       page load, housetype other, unhide textbox with value
  *       change housetype value, if other, hide/show
  *
  * Calculate total no in household
  *     page load
  *     any ddl change
  *
  * checkbox hidden input false
  *     value true, disable hidden false
  *
  * saveOrSubmit value affects backend
  *     value save, redirect back to edit page
  *     value submit, validate and try to submit form
  *
  * Fixed Save Button
  *     fixed position until reach static position
  *
  * form submit
  *     housetype Landed, unit value is N.A.
  *     housetype not Others, remove other textbox value
  */
  if ($('.editemployer').length) {
    if (isBrowserIE()) {
      window.alert('For a better website experience, please use other browsers such as Chrome, Firefox or Safari.')
      $('.editemployer .jobscope input').css('display', 'inline-block')
    }
    // load form data
    var employerdata = $('.editemployer').data('employer')[0]
    var editemployer = '.editemployer .form-group '
    function employerloadddlNtextarea () {
      $(editemployer + '#housetype').val(employerdata.profile.housetype.split(',')[0])
      $(editemployer + '#maritalstatus').val(employerdata.profile.maritalstatus)
      $(editemployer + '#adult').val(employerdata.household.adult)
      $(editemployer + '#teenager').val(employerdata.household.teenager)
      $(editemployer + '#children').val(employerdata.household.children)
      $(editemployer + '#infant').val(employerdata.household.infant)
      $(editemployer + '#elderly').val(employerdata.household.elderly)
      $(editemployer + '#disabled').val(employerdata.household.disabled)
      $(editemployer + '#otherduties').val(employerdata.jobscope.otherduties)
    }
    function employerloadcheckbox () {
      if (employerdata.jobscope.infantcare === true) {
        $(editemployer + '#infantcare').prop('checked', true)
        $(editemployer + '#infantcarehidden')[0].disabled = true
      }
      if (employerdata.jobscope.childcare === true) {
        $(editemployer + '#childcare').prop('checked', true)
        $(editemployer + '#childcarehidden')[0].disabled = true
      }
      if (employerdata.jobscope.elderlycare === true) {
        $(editemployer + '#elderlycare').prop('checked', true)
        $(editemployer + '#elderlycarehidden')[0].disabled = true
      }
      if (employerdata.jobscope.disabledcare === true) {
        $(editemployer + '#disabledcare').prop('checked', true)
        $(editemployer + '#disabledcarehidden')[0].disabled = true
      }
      if (employerdata.jobscope.housework === true) {
        $(editemployer + '#housework').prop('checked', true)
        $(editemployer + '#houseworkhidden')[0].disabled = true
      }
      if (employerdata.jobscope.cooking === true) {
        $(editemployer + '#cooking').prop('checked', true)
        $(editemployer + '#cookinghidden')[0].disabled = true
      }
      if (employerdata.jobscope.handledog === true) {
        $(editemployer + '#handledog').prop('checked', true)
        $(editemployer + '#handledoghidden')[0].disabled = true
      }
      if (employerdata.jobscope.handlecat === true) {
        $(editemployer + '#handlecat').prop('checked', true)
        $(editemployer + '#handlecathidden')[0].disabled = true
      }
    }
    employerloadddlNtextarea()
    employerloadcheckbox()

    // if user housetype is Landed, hide unit no
    // if user housetype is other, show other textbox with value
    if (employerdata.profile.housetype.split(',')[0] === 'Landed') {
      $('.editemployer .form-group-unitno').addClass('hidden')
    }
    if (employerdata.profile.housetype.split(',')[0] === 'Others') {
      $(editemployer + '.housetypeother').removeClass('hidden')
      $(editemployer + '.housetypeother').val(employerdata.profile.housetype.split(',')[1])
    }

    // when housetype value change
    $(editemployer + '#housetype').change(function () {
      if ($(editemployer + '#housetype').val() === 'Landed') {
        $('.editemployer .form-group-unitno').addClass('hidden')
      } else {
        $('.editemployer .form-group-unitno').removeClass('hidden')
      }
      if ($(editemployer + '#housetype').val() !== 'Others') {
        $(editemployer + '.housetypeother').addClass('hidden')
      } else {
        $(editemployer + '.housetypeother').removeClass('hidden')
      }
    })

    // callback function to calculate total no in household
    function totalnoinhousehold () {
      var totalno =
      parseInt($(editemployer + '#adult').val(), 10) +
      parseInt($(editemployer + '#teenager').val(), 10) +
      parseInt($(editemployer + '#children').val(), 10) +
      parseInt($(editemployer + '#infant').val(), 10) +
      parseInt($(editemployer + '#elderly').val(), 10) +
      parseInt($(editemployer + '#disabled').val(), 10)
      $('.totalnoinhousehold').text(totalno)
    }

    // run function when page load and when any ddl change value
    totalnoinhousehold()
    $(editemployer + 'select').change(function () {
      totalnoinhousehold()
    })

    // if checkbox value true, disable hidden false
    $(editemployer + '.checkbox-inline').click(function () {
      function checkboxtrue (params) {
        if ($(editemployer + params)[0].checked === true) {
          $(editemployer + params).val('true')
          $(editemployer + params + 'hidden')[0].disabled = true
        } else {
          $(editemployer + params + 'hidden')[0].disabled = false
        }
      }
      checkboxtrue('#infantcare')
      checkboxtrue('#childcare')
      checkboxtrue('#elderlycare')
      checkboxtrue('#disabledcare')
      checkboxtrue('#housework')
      checkboxtrue('#cooking')
      checkboxtrue('#handledog')
      checkboxtrue('#handlecat')
    })

    // change hidden input to save/submit
    $('#editemployersave').on('click', function () {
      $('.editemployer #saveOrSubmit').val('save')
    })
    $('#editemployersubmit').on('click', function () {
      $('.editemployer #saveOrSubmit').val('submit')
    })

    // fixed save button
    if ($('.editemployer .editemployerformbuttons #editemployersave').length) {
      $('.editemployer #editemployersave').css({
        'position': 'fixed',
        'bottom': '50px'
      })
      $(window).scroll(function () {
        var max = $('.editemployer .editemployerformbuttons').offset().top
        var min = $('.editemployer #editemployersave').offset().top
        if (min > max) {
          $('.editemployer #editemployersave').css({
            'position': 'static'
          })
        }
      })
    }

    // callback to validate if values correct format
    function employerFormFormat () {
      if (
        inputNumber(false, 'input', 'employer[local][contact][number]') |
        inputNumber(true, 'input', 'employer[profile][postalcode]')
      ) {
        return true
      } else {
        return false
      }
    }
    // callback to validate string max character
    function employerFormMaxChar () {
      if (
        inputStringMax('input', 'employer[profile][fullname]', 50) |
        inputStringMax('input', 'employer[profile][blockhouseno]', 20) |
        inputStringMax('input', 'employer[profile][unitno]', 20) |
        inputStringMax('input', 'employer[profile][streetname]', 50) |
        inputStringMax('textarea', 'employer[jobscope][otherduties]', 300)
      ) {
        return true
      } else {
        return false
      }
    }
    // callback to validate if all required filled
    function employerFormRequired () {
      if (
        stringNotEmpty('input', 'employer[profile][fullname]') |
        stringNotEmpty('select', 'employer[profile][housetype]') |
        stringNotEmpty('input', 'employer[profile][blockhouseno]') |
        stringNotEmpty('input', 'employer[profile][unitno]') |
        stringNotEmpty('input', 'employer[profile][streetname]') |
        stringNotEmpty('select', 'employer[profile][maritalstatus]') |
        numberNotZero('input', 'employer[profile][postalcode]') |
        numberNotZero('input', 'employer[local][contact][number]')
      ) {
        return true
      } else {
        return false
      }
    }

    // when form submitted
    // if housetype is Landed, remove unit no value
    // if housetype is not Others, remove other textbox value
    $('.editemployer').submit(function (e) {
      if ($(editemployer + '#housetype').val() === 'Landed') {
        $(editemployer + '#unitno').val('N/A')
      }
      if ($(editemployer + '#housetype').val() !== 'Others') {
        $(editemployer + '.housetypeother').val('')
      }
      if (!$(editemployer + '#contactnumber').val()) {
        $(editemployer + '#contactnumber').val('0')
      }

      if (employerFormFormat()) {
        e.preventDefault()
        swalError('Wrong format provided! Please provide Numbers in the yellow boxes.')
      } else if (employerFormMaxChar()) {
        e.preventDefault()
        swalError('Exceeded Character Limit! Please resolve the errors in yellow.')
      } else {
        var saveOrSubmit = $('input[name="employer[saveOrSubmit]"]').val()
        if (saveOrSubmit === 'submit') {
          if (employerFormRequired()) {
            e.preventDefault()
            swalError('Fill in all required \'*\' fields! Please resolve the errors in red.')
          }
        }
      }
    })
  }

  /**
  * @name Edit Helper
  *
  * Extract user data from front end html using data-helper
  *
  * Preload user data
  *     textbox
  *     ddl
  *     textarea
  *     radiobutton
  *     date, populate years in ddl
  *     country, populate countries in ddl
  *     ageofyoungest show if have children
  *
  * Country Code Autofill
  *     when nationality value change
  *
  * Children
  *     more than 0
  *       page load, show ageofyoungest field
  *       change children value, more than 0, show
  *
  * saveOrSubmit value affects backend
  *     value save, redirect back to edit page
  *     value submit,, validate and try to submit form
  *
  * Fixed Save Button
  *     fixed position until reach static position
  *
  * form Submit
  *     submit dob only if date, month, year not empty
  *     contact number value null, number value 0
  *     children value less than 1, ageofyoungest value 0
  */
  if ($('.edithelper').length) {
    if (isBrowserIE()) {
      window.alert('For a better website experience, please use other browsers such as Chrome, Firefox or Safari.')
      $('.edithelper .skillsradio input').css('display', 'inline-block')
    }

    // load form data
    var helperdata = $('.edithelper').data('helper')[0]
    var edithelper = '.edithelper .form-group '
    function appendyear (element, yearrange) {
      var currentyearminus = new Date().getFullYear()
      for (var i = 0; i < yearrange; i++) {
        var year = currentyearminus - i
        $(edithelper + element).append('<option value="' + year + '">' + year + '</option>')
      }
    }
    function appendcountries (element) {
      var $countries = $(
        '<option value="">-- select one --</option><option value="Brunei">Brunei</option><option value="Hong_Kong">Hong Kong</option><option value="India">India</option><option value="Indonesia">Indonesia</option><option value="Middle_East">Middle East</option><option value="Myanmar">Myanmar</option><option value="Philippines">Philippines</option><option value="Singapore">Singapore</option><option value="Sri_Lanka">Sri Lanka</option><option value="Taiwan">Taiwan</option>')
      $(edithelper + element).append($countries)
    }
    appendyear('.workingexperienceyear', 50)
    appendcountries('#firstcountry')
    appendcountries('#secondcountry')
    appendcountries('#thirdcountry')
    function helperloadddlNtextarea () {
      $(edithelper + '#nationality').val(helperdata.profile.nationality)
      $(edithelper + '#portrepatriated').val(helperdata.profile.portrepatriated)
      $(edithelper + '#religion').val(helperdata.profile.religion)
      $(edithelper + '#dietaryrestriction').val(helperdata.profile.dietaryrestriction)
      $(edithelper + '#foodhandlingrestriction').val(helperdata.profile.foodhandlingrestriction)
      $(edithelper + '#siblings').val(helperdata.profile.siblings)
      $(edithelper + '#maritalstatus').val(helperdata.profile.maritalstatus)
      $(edithelper + '#children').val(helperdata.profile.children)
      $(edithelper + '#educationlevel').val(helperdata.education.educationlevel)
      $(edithelper + '#otherqualifications').val(helperdata.education.otherqualifications)
      $(edithelper + '#firstfrom').val(helperdata.workingexperience.first.from)
      $(edithelper + '#firstto').val(helperdata.workingexperience.first.to)
      $(edithelper + '#firstcountry').val(helperdata.workingexperience.first.country)
      $(edithelper + '#firstduties').val(helperdata.workingexperience.first.duties)
      $(edithelper + '#secondfrom').val(helperdata.workingexperience.second.from)
      $(edithelper + '#secondto').val(helperdata.workingexperience.second.to)
      $(edithelper + '#secondcountry').val(helperdata.workingexperience.second.country)
      $(edithelper + '#secondduties').val(helperdata.workingexperience.second.duties)
      $(edithelper + '#thirdfrom').val(helperdata.workingexperience.third.from)
      $(edithelper + '#thirdto').val(helperdata.workingexperience.third.to)
      $(edithelper + '#thirdcountry').val(helperdata.workingexperience.third.country)
      $(edithelper + '#thirdduties').val(helperdata.workingexperience.third.duties)
    }
    function helperloadradiobtn (uservalue, param) {
      if (uservalue === true) {
        $(edithelper + '#' + param + 'yes').prop('checked', true)
      } else {
        $(edithelper + '#' + param + 'no').prop('checked', true)
      }
    }
    function helperloaddob () {
      appendyear('#dob-year', 100)
      if (helperdata.profile.dob === null) {
        $(edithelper + '#dob-date').val('')
        $(edithelper + '#dob-month').val('')
        $(edithelper + '#dob-year').val('')
      } else {
        var ds = new Date(helperdata.profile.dob)
        $(edithelper + '#dob-date').val((ds.getDate() < 10 ? '0' : '') + ds.getDate())
        $(edithelper + '#dob-month').val((ds.getMonth() < 9 ? '0' : '') + (ds.getMonth() + 1))
        $(edithelper + '#dob-year').val(ds.getFullYear())
      }
    }
    helperloadddlNtextarea()
    helperloadradiobtn(helperdata.skills.english, 'english')
    helperloadradiobtn(helperdata.skills.singapore, 'singapore')
    helperloadradiobtn(helperdata.skills.infantcare, 'infantcare')
    helperloadradiobtn(helperdata.skills.childcare, 'childcare')
    helperloadradiobtn(helperdata.skills.elderlycare, 'elderlycare')
    helperloadradiobtn(helperdata.skills.disabledcare, 'disabledcare')
    helperloadradiobtn(helperdata.skills.housework, 'housework')
    helperloadradiobtn(helperdata.skills.cooking, 'cooking')
    helperloadradiobtn(helperdata.skills.handledog, 'handledog')
    helperloadradiobtn(helperdata.skills.handlecat, 'handlecat')
    helperloaddob()

    // Country Code Autofill
    $(edithelper + '#nationality').change(function () {
      var nationalityvalue = $(edithelper + '#nationality').val()
      var countrycodename = ['Philippines', 'India', 'Indonesia', 'Myanmar', 'Sri_Lanka']
      var countrycodenumber = ['+63', '+91', '+62', '+95', '+94']
      var arrayposition = countrycodename.indexOf(nationalityvalue)
      if (arrayposition >= 0) {
        $(edithelper + '#countrycode').val(countrycodenumber.slice(arrayposition, arrayposition + 1))
      }
    })

    // if profile children is 0, show ageofyoungest
    // else, hide ageofyoungest
    if (helperdata.profile.children > 0) {
      $('.edithelper .form-group-children').removeClass('hidden')
    }

    // when profile children value change
    $(edithelper + '#children').change(function () {
      if ($(edithelper + '#children').val() > 0) {
        $('.edithelper .form-group-children').removeClass('hidden')
      } else {
        $('.edithelper .form-group-children').addClass('hidden')
      }
    })

    // change hidden input to save/submit
    $('#edithelpersave').on('click', function () {
      $('.edithelper #saveOrSubmit').val('save')
    })
    $('#edithelpersubmit').on('click', function () {
      $('.edithelper #saveOrSubmit').val('submit')
    })

    // fixed save button
    if ($('.edithelper .edithelperformbuttons #edithelpersave').length) {
      $('.edithelper #edithelpersave').css({
        'position': 'fixed',
        'bottom': '30px',
        'right': '30px'
      })
      $(window).scroll(function () {
        var max = $('.edithelper .edithelperformbuttons').offset().top
        var min = $('.edithelper #edithelpersave').offset().top
        if (min > max) {
          $('.edithelper #edithelpersave').css({
            'position': 'static'
          })
        }
      })
    }

    // callback to validate if values correct format
    function helperFormFormat () {
      if (
        inputNumber(false, 'input', 'helper[local][contact][number]') |
        inputNumber(false, 'input', 'helper[profile][heightcm]') |
        inputNumber(false, 'input', 'helper[profile][weightkg]') |
        inputNumber(true, 'input', 'helper[profile][ageofyoungest]')
      ) {
        return true
      } else {
        return false
      }
    }
    // callback to validate string max character
    function helperFormMaxChar () {
      if (
        inputStringMax('input', 'helper[profile][firstname]', 20) |
        inputStringMax('input', 'helper[profile][middlename]', 20) |
        inputStringMax('input', 'helper[profile][familyname]', 20) |
        inputStringMax('input', 'helper[profile][pob]', 100) |
        inputStringMax('input', 'helper[profile][residentialaddress]', 100) |
        inputStringMax('input', 'helper[profile][allergies]', 50) |
        inputStringMax('input', 'helper[education][fieldofstudy]', 50) |
        inputStringMax('textarea', 'helper[education][otherqualifications]', 300) |
        inputStringMax('textarea', 'helper[workingexperience][first][duties]', 300) |
        inputStringMax('textarea', 'helper[workingexperience][second][duties]', 300) |
        inputStringMax('textarea', 'helper[workingexperience][third][duties]', 300)
      ) {
        return true
      } else {
        return false
      }
    }
    // callback to validate if all required filled
    function helperFormRequired () {
      if (
        dateNotEmpty() |
        stringNotEmpty('input', 'helper[profile][firstname]') |
        stringNotEmpty('input', 'helper[profile][familyname]') |
        stringNotEmpty('input', 'helper[profile][pob]') |
        stringNotEmpty('select', 'helper[profile][nationality]') |
        stringNotEmpty('input', 'helper[local][contact][countrycode]') |
        stringNotEmpty('input', 'helper[profile][residentialaddress]') |
        stringNotEmpty('select', 'helper[profile][portrepatriated]') |
        stringNotEmpty('select', 'helper[profile][religion]') |
        stringNotEmpty('select', 'helper[profile][dietaryrestriction]') |
        stringNotEmpty('select', 'helper[profile][foodhandlingrestriction]') |
        stringNotEmpty('select', 'helper[profile][maritalstatus]') |
        stringNotEmpty('select', 'helper[education][educationlevel]') |
        stringNotEmpty('input', 'helper[education][fieldofstudy]') |
        numberNotZero('input', 'helper[local][contact][number]') |
        numberNotZero('input', 'helper[profile][heightcm]') |
        numberNotZero('input', 'helper[profile][weightkg]')
      ) {
        return true
      } else {
        return false
      }
    }

    // submit form
    $('.edithelper').submit(function (e) {
      // set values
      var dobdate = $(edithelper + '#dob-date').val()
      var dobmonth = $(edithelper + '#dob-month').val()
      var dobyear = $(edithelper + '#dob-year').val()
      if (dobdate !== '' && dobmonth !== '' && dobyear !== '') {
        $(edithelper + '#dob').val(new Date(dobyear + '-' + dobmonth + '-' + dobdate + 'T01:00:00+01:00'))
      }
      if (!$(edithelper + '#contactnumber').val()) {
        $(edithelper + '#contactnumber').val('0')
      }
      if ($(edithelper + '#children').val() < 1) {
        $(edithelper + '#ageofyoungest').val('0')
      }

      if (helperFormFormat()) {
        e.preventDefault()
        swalError('Wrong format provided! Please provide Numbers in the yellow boxes.')
      } else if (helperFormMaxChar()) {
        e.preventDefault()
        swalError('Exceeded Character Limit! Please resolve the errors in yellow.')
      } else {
        var saveOrSubmit = $('input[name="helper[saveOrSubmit]"]').val()
        if (saveOrSubmit === 'submit') {
          if (helperFormRequired()) {
            e.preventDefault()
            swalError('Fill in all required \'*\' fields! Please resolve the errors in red.')
          }
        }
      }
    })
  }

  /**
  * @name Profile
  *
  * SWAL if click change indentification
  */
  if ($('.profile-changeidentification').length) {
    $('.profile-changeidentification').on('click', function (e) {
      e.preventDefault()
      swal(
        'Warning',
        'To change identification, send a copy of your Identification to \'support@maidicare.com\'.',
        'warning'
      )
    })
  }

  /**
  * @name Browse Page
  *
  * search params
  *     extract from current window url
  *     convert url string into array, then object
  *
  * assign 'active' class to current page no
  *
  * load filter
  *     query, search bar, query text
  *     checkboxes & radiobuttons
  *     ddls
  *
  * hover css for panels
  *
  * filter AJAX Post
  *     using get form values
  *     get helper info and totalResults
  *     empty and append helperContainer
  *     add hover css again
  *     empty and append page numbers
  *     extract page no from url & assign active class
  *
  * click change Page
  *     use button text
  *         change hidden input page number
  *         replace page number url
  *     run filter AJAX Post function
  *
  * when Change filter values
  *     reset page no hidden input & url to '1'
  *     run filter AJAX Post function
  *
  * clear query form submit
  *
  * clear filter form submit
  *     checkboxes & radiobuttons
  *     ddls
  *
  * change hidden input page to '1' if use query text
  *
  * toggle filter (mobile view)
  */
  if ($('.browsepage').length) {
    var urlparams = decodeURIComponent(window.location.search.substring(1))
    var arrayparams = urlparams.replace(/=/g, '~*').replace(/\+/g, ' ').split('&')
    var objparams = {}
    arrayparams.forEach(function (value) {
      objparams[value.split('~*')[0]] = value.split('~*')[1]
    })
    if (objparams.query) {
      $('.browsepage input[name="query"]').val(objparams.query)
      $('.browse-content .querytext p span.glyphicon').css('visibility', 'visible')
      if (objparams.query.length > 30) {
        $('.browsepage .browse-content span.qtext').text('\'' + objparams.query.substring(0, 30) + '...\'')
      } else {
        $('.browsepage .browse-content span.qtext').text('\'' + objparams.query + '\'')
      }
    }

    // assign 'active' class to current page no
    $('.browsepage .browse-pagenumber a.pagenumber' + objparams.page).addClass('active')

    function loadfiltercheckbox (param, name) {
      if (param) {
        $('.browsepage input[name="' + name + '"][value="' + param + '"]').attr('checked', 'checked')
      }
    }
    loadfiltercheckbox(objparams.infantcare, 'infantcare')
    loadfiltercheckbox(objparams.childcare, 'childcare')
    loadfiltercheckbox(objparams.elderlycare, 'elderlycare')
    loadfiltercheckbox(objparams.disabledcare, 'disabledcare')
    loadfiltercheckbox(objparams.transfer, 'transfer')
    loadfiltercheckbox(objparams.singapore, 'singapore')
    if (objparams.nationality) {
      $('.browsepage select[name="nationality"]').val(objparams.nationality)
    }
    if (objparams.religion) {
      $('.browsepage select[name="religion"]').val(objparams.religion)
    }
    if (objparams.maritalstatus) {
      $('.browsepage select[name="maritalstatus"]').val(objparams.maritalstatus)
    }

    // hover css for specific panel body
    function hoverPanelBody () {
      $('.browsepage .helperContainer .panel').on({
        mouseenter: function () {
          $(this).children().css({'background-color': '#68C3A3', 'color': 'black', 'transition': 'all 0.3s ease', '-webkit-transform': 'scale(1.05)', '-ms-transform': 'scale(1.05)', 'transform': 'scale(1.05)'})
        },
        mouseleave: function () {
          $(this).children().css({'background-color': '#f5f5f5', 'color': '#717f86', 'transition': 'all 0.3s ease', '-webkit-transform': 'scale(1.0)', '-ms-transform': 'scale(1.0)', 'transform': 'scale(1.0)'})
        },
        click: function () {
          window.location = $(this).children('.viewbutton').attr('href')
        }
      })
    }
    hoverPanelBody()

    // retrieve & append helper data
    function filterAJAXPost () {
      var arrayPostData = $('.browsepage').serialize().replace(/=/g, ',').split('&')
      var objPostData = {}
      arrayPostData.forEach(function (value) {
        objPostData[value.split(',')[0]] = value.split(',')[1]
      })
      $.ajax({
        url: '/browse/filter',
        type: 'POST',
        data: objPostData,
        dataType: 'json',
        cache: false,
        success: function (data) {
          $('.helperContainer').empty()
          $('.browsepage .querytext span.found').text(data.totalResults + ' Found')
          data.helperInfo.forEach(function (helper) {
            function panelImage () {
              var imgsrc = '/images/noimg.jpg'
              if (helper.profile.photo.version) {
                imgsrc =
                'https://res.cloudinary.com/dbjdqrw9o/image/upload/w_300,h_300,c_thumb,g_face/dpr_1.0/v' + helper.profile.photo.version + '/' + helper._id + '.' + helper.profile.photo.format
              }
              return imgsrc
            }
            function panelSmartIcons () {
              var smarticonsstring = ''
              if (helper.transfer) {
                smarticonsstring = smarticonsstring + '<img class="transfericon" src="/images/logo/transfer.png" alt="transfer icon" data-toggle="tooltip" data-placement="right" title="Transfer">'
              }
              if (helper.skills.singapore) {
                smarticonsstring = smarticonsstring + '<img class="singaporeicon" src="/images/logo/singapore_icon.png" alt="singapore icon" data-toggle="tooltip" data-placement="right" title="Worked in Singapore before">'
              }
              return smarticonsstring
            }
            function panelElementString (imgSrc, smarticons) {
              return '<div class="col-sm-4 col-xs-12"><div class="panel panel-default"><a class="viewbutton" href="/browse/view/' + helper._id + '"></a><div class="panel-body"><div class="browse-helperpic"><img src=' + imgSrc + ' alt="profile image"></div><div class="smarticons">' + smarticons + '</div></div><div class="panel-footer"><h4>' + helper.profile.firstname + '<span>, ' + calculateAge(helper.profile.dob) + '<span></h4><p>' + helper.profile.maritalstatus + ' | ' + helper.profile.nationality.replace(/_/g, ' ') + '</p><img class="flagicon" src="/images/logo/' + helper.profile.nationality.toLowerCase() + '_flag.png" alt="flag icon"></div></div></div>'
            }
            $('.helperContainer').append(panelElementString(panelImage(), panelSmartIcons()))
          })
          hoverPanelBody()
          $('.browse-pagenumber').empty()
          if (data.totalResults > 1) {
            for (var i = 0; i < (Math.ceil(data.totalResults / 12)); i++) {
              $('.browse-pagenumber').append('<a class="pagenumber' + (i + 1) + '">' + (i + 1) + '</a>')
            }
            var indexPageNo = window.location.search.indexOf('page=')
            var currPageNo = window.location.search.substring(indexPageNo + 5, indexPageNo + 6)
            $('.browsepage .browse-pagenumber a.pagenumber' + currPageNo).addClass('active')
            changePageNo()
          }
        },
        error: function (err) {
          if (err) {
            swalError('Something went wrong! Please refresh the page and try again.')
          }
        }
      })
    }

    // when click change number
    function changePageNo () {
      $('.browse-pagenumber a').on('click', function () {
        var pageno = $(this).text()
        $('.browse-menu input[name="page"]').val(pageno)
        window.history.replaceState(null, null, window.location.href.replace(/(page=)[0-9]{1,}/, 'page=' + pageno))
        filterAJAXPost()
        $('html, body').animate({
          scrollTop: ($('.browsepage .browse-header').offset().top - 75)
        }, 1000, 'easeInOutExpo')
      })
    }
    changePageNo()
    // previous html code for future reference
    // <% var currenturl = "javascript:window.location.href=window.location.search.replace(/(page=)[0-9]{1,}/,'page=(i+1)')"%>

    $('.browsepage input[name="infantcare"], .browsepage input[name="childcare"], .browsepage input[name="elderlycare"], .browsepage input[name="disabledcare"], .browsepage input[name="transfer"], .browsepage input[name="singapore"], .browsepage select[name="nationality"], .browsepage select[name="religion"], .browsepage select[name="maritalstatus"]').on('change', function () {
      // reset page no and assign 'active' class
      $('.browse-menu input[name="page"]').val(1)
      window.history.replaceState(null, null, window.location.href.replace(/(page=)[0-9]{1,}/, 'page=' + 1))
      filterAJAXPost()
    })
    $('.browsepage .clearquerytext').on('click', function () {
      $('.browsepage input[name="query"]').val('')
      $('.browsepage').submit()
    })
    $('.browsepage .clearfilter').on('click', function () {
      function clearfilters (name, type) {
        if (type === 'checkbox') {
          $('.browsepage input[name="' + name + '"]:checked').attr('checked', false)
        } else if (type === 'radio') {
          $('.browsepage input[name="' + name + '"]').val('All')
        } else if (type === 'ddl') {
          $('.browsepage select[name="' + name + '"]').val('All')
        }
      }
      clearfilters('infantcare', 'checkbox')
      clearfilters('childcare', 'checkbox')
      clearfilters('elderlycare', 'checkbox')
      clearfilters('disabledcare', 'checkbox')
      clearfilters('transfer', 'radio')
      clearfilters('singapore', 'radio')
      clearfilters('nationality', 'ddl')
      clearfilters('religion', 'ddl')
      clearfilters('maritalstatus', 'ddl')
      $('.browsepage').submit()
    })

    // change pageno to '1' if use query text
    $('#browseform').submit(function () {
      var querytext = $('.browsepage input[name="query"]').val()
      if (querytext !== '') {
        $('.browse-menu input[name="page"]').val(1)
      }
    })

    // toggle filter
    $('.browsepage button.togglefilter').on('click', function () {
      $('.browsepage .browse-sidebar').slideToggle('fast', function () {
        if ($('.browsepage .browse-sidebar').is(':visible')) {
          $('.browsepage button.togglefilter').css({'background-color': 'black', 'color': 'orange'})
          $('html, body').animate({
            scrollTop: ($('.browsepage').offset().top - 50)
          }, 1000, 'easeInOutExpo')
        } else {
          $('.browsepage button.togglefilter').css({'background-color': 'orange', 'color': 'white'})
        }
      })
    })
  }

  /**
  * @name View Page
  *
  * Extract hire data from front end html using data-hirearray
  *
  * hire array
  *     extract helperids
  *     if helperid exists in helperids array
  *     css hire button grey + selected
  *
  * hover css for panels
  *
  * AJAX Post Pending Shortlist
  *     using the selected helper's userid and helperid
  */
  if ($('.browseview').length) {
    var hireArray = $('.browseview').data('hirearray')
    var helperids = []
    hireArray.forEach(function (hireData, index) {
      helperids.push(hireData.huserid)
    })
    // if is employer, helper is undefined
    if ($('.browseview .hirehelper').val()) {
      var shelperuserid = $('.browseview .hirehelper').val().split('&')[0]
      var shelperid = $('.browseview .hirehelper').val().split('&')[1]
      if (helperids.indexOf(shelperuserid) >= 0) {
        $('.browseview .hirehelper').removeClass('btn-primary').addClass('btn-secondary').text('Selected')
      }
    }

    // hover css for specific panel body
    function hoverPanelRelated () {
      $('.browseview .relatedContainer .panel').on({
        mouseenter: function () {
          $(this).children().css({'background-color': '#68C3A3', 'color': 'black', 'transition': 'all 0.3s ease', '-webkit-transform': 'scale(1.05)', '-ms-transform': 'scale(1.05)', 'transform': 'scale(1.05)'})
        },
        mouseleave: function () {
          $(this).children().css({'background-color': '#f5f5f5', 'color': '#717f86', 'transition': 'all 0.3s ease', '-webkit-transform': 'scale(1.0)', '-ms-transform': 'scale(1.0)', 'transform': 'scale(1.0)'})
        },
        click: function () {
          window.location = $(this).children('.viewbutton').attr('href')
        }
      })
    }
    hoverPanelRelated()

    $('.browseview .hirehelper').on('click', function () {
      $.ajax({
        url: '/browse/hire',
        type: 'POST',
        data: JSON.stringify({
          helperuserid: shelperuserid,
          helperid: shelperid
        }),
        dataType: 'json',
        contentType: 'application/json',
        cache: false,
        success: function (data) {
          if (data.status === 'success') {
            swalSuccess(data.message)
          } else if (data.status === 'error') {
            swalError(data.message)
          } else if (data.status === 'redirect') {
            window.location = data.message
          }
        },
        error: function (err) {
          if (err) swalError('Please refresh the page and try again. You can also contact us at \'support@maidicare.com\'.')
        }
      })
    })
  }

  /**
  * @name Profile Hire
  *
  * Extract user id for AJAX url
  *
  * AJAX Filter Hire
  *     Post JSON (filter value)
  *     respond with hireInfo Array and user role
  *     success, refresh page
  *
  * AJAX Post Hire
  *     Status: Accept, reject, confirm
  *     Post JSON (hireid and status)
  *     error, SWAL alert
  *     success, refresh page
  */
  if ($('.profile-hire').length) {
    var userid = $('.profile-hire').data('userid')
    $('.profile-hire-filter select[name="filter"]').on('change', function () {
      var filterValue = $('.profile-hire-filter select[name="filter"]').val()
      $.ajax({
        url: '/users/' + userid + '/shortlists/filter',
        type: 'POST',
        data: JSON.stringify({'filter': filterValue}),
        dataType: 'json',
        contentType: 'application/json',
        cache: false,
        success: function (response) {
          var filterValuesArray = ['All', 'confirmed', 'accepted', 'pending', 'rejected']
          var filterBgColor = ['#95A5A6', '#1E824C', '#3A539B', '#E87E04', '#96281B']
          var colorPos = filterValuesArray.indexOf(filterValue)
          $('.profile-hire-filter').css('background-color', filterBgColor.slice(colorPos, colorPos + 1))
          $('.hireContainer').empty()
          function dateFromObjectId (objectId) {
            return new Date(parseInt(objectId.substring(0, 8), 16) * 1000)
          }
          var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          if (response.hireInfo.length > 0) {
            response.hireInfo.forEach(function (data) {
              var isodate = dateFromObjectId(data._id.toString())
              var minutes = isodate.getMinutes() < 10 ? '0' + isodate.getMinutes() : isodate.getMinutes()
              var ddmmyyyyhhmm = isodate.getDate().toString() + ' ' + monthNames[isodate.getMonth()] + ' ' + isodate.getFullYear().toString() + ', ' + isodate.getHours() + ':' + minutes
              function profilePicture (data) {
                var imgUrl = ''
                if (data.user.profile.photo.version) {
                  imgUrl =
                  'https://res.cloudinary.com/dbjdqrw9o/image/upload/w_300,h_300,c_thumb,g_face/v' + data.user.profile.photo.version + '/' + data.user._id + '.' + data.user.profile.photo.format
                } else {
                  imgUrl = '/images/noimg.jpg'
                }
                return '<a href="/browse/view/"' + data.user._id + '><img src=' + imgUrl + ' alt="profile image"></a>'
              }
              function leftHireContainer (data) {
                var leftString = ''
                if (response.role === 'employer') {
                  leftString =
                  '<div class="profile-hire-userpic">' + profilePicture(data) + '</div>'
                } else if (response.role === 'helper') {
                  leftString = '<div class="profile-hire-userpic"><a href="/users/employer/"' + data.user.userid + '><img src="/images/employer.png" alt="profile image"></a></div>'
                }
                return '<div class="col-md-3 col-sm-3">' + leftString + '</div>'
              }
              function middleHireContainer (data) {
                var middleString = ''
                if (response.role === 'helper') {
                  var housetype = ''
                  if (data.user.profile.housetype.split(',')[0] === 'Others') {
                    housetype = data.user.profile.housetype.replace(/,/, ', ')
                  } else {
                    housetype = data.user.profile.housetype.split(',')[0].replace(/_/g, ' ')
                  }
                  middleString = '<a href="/users/employer/' + data.user.userid + '">' + data.user.profile.fullname + '</a><p>' + housetype + ' | ' + data.user.profile.maritalstatus + '</p>'
                } else {
                  var transfer = ''
                  if (data.user.transfer) {
                    transfer = '<p>' + data.user.profile.nationality + ' | ' + data.user.profile.maritalstatus + ' | Transfer</p>'
                  } else {
                    transfer = '<p>' + data.user.profile.nationality + ' | ' + data.user.profile.maritalstatus + '</p>'
                  }
                  middleString = '<a href="/browse/view/' + data.user._id + '">' + data.user.profile.firstname + '</a>' + transfer
                }
                return '<div class="col-md-6 col-sm-6">' + middleString + '<div class="well">' + data.message + '</div></div>'
              }
              function rightHireContainer (data) {
                var rightString = ''
                if (response.role === 'helper' && data.status === 'pending') {
                  rightString = '<button class="btn btn-success userresponse" value="' + data._id + ',Accept">Accept</button><button class="btn btn-danger userresponse" value="' + data._id + ',Reject">Reject</button>'
                }
                if (response.role === 'helper' && data.status === 'accepted') {
                  rightString = '<button class="btn btn-danger userresponse" value="' + data._id + ',Reject">Reject</button>'
                }
                if (response.role === 'employer' && data.status === 'pending') {
                  rightString = '<button class="btn btn-danger userresponse" value="' + data._id + ',Reject">Reject</button>'
                } else if (response.role === 'employer' && data.status === 'accepted') {
                  rightString = '<button class="btn btn-success userresponse" value="' + data._id + ',Confirm">Confirm</button><button class="btn btn-danger userresponse" value="' + data._id + ',Reject">Reject</button>'
                }
                return '<div class="col-md-3 col-sm-3"><div class="profile-hire-response"><input type="hidden" class="helperinput" name="helperinput" value="">' + rightString + '</div></div>'
              }
              function hireContainerString (data) {
                return '<div class="col-md-12 col-sm-12 profile-hire-content"><h4>' + ddmmyyyyhhmm + '</h4><h4 class="right" id=' + data.status + '>' + data.status + '</h4><hr>' + leftHireContainer(data, response.role) + middleHireContainer(data) + rightHireContainer(data) + '</div>'
              }
              $('.hireContainer').append(hireContainerString(data))
              hireAJAX()
            })
          }
        },
        error: function (err) {
          if (err) {
            swalError('Something went wrong! Please refresh the page and try again.')
          }
        }
      })
    })
    function hireAJAX () {
      $('.profile-hire .userresponse').on('click', function () {
        $('.profile-hire .helperinput').val($(this).val())
        var value = $('.profile-hire .helperinput').val().split(',')[1]
        swal({
          title: 'Are you sure you want to ' + value.toLowerCase() + '?',
          text: "You won't be able to revert this!",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: 'rgb(38, 166, 91)',
          cancelButtonColor: '#d33',
          confirmButtonText: value,
          cancelButtonText: 'No',
          confirmButtonClass: 'btn-success',
          cancelButtonClass: 'btn-danger',
          buttonsStyling: true
        }).then(function () {
          $.ajax({
            url: '/users/' + userid + '/shortlists',
            type: 'POST',
            data: JSON.stringify({
              'hireid': $('.profile-hire .helperinput').val().split(',')[0],
              'status': value
            }),
            dataType: 'json',
            contentType: 'application/json',
            cache: false,
            success: function (data) {
              if (data.status === 'error') {
                swalError(data.message)
              } else {
                window.location.reload()
              }
            },
            error: function (err) {
              if (err) swalError('Please refresh the page and try again. You can also contact us at \'support@maidicare.com\'.')
            }
          })
        }, function (dismiss) {
          if (dismiss === 'cancel') {
            swal(
              'Cancelled',
              'No changes were made.',
              'error'
            )
          }
        })
      })
    }
    hireAJAX()
  }

  /**
  * @name Password Index Page
  *
  * post to change user passwordreset fields
  *     non-user, AJAX Post email for reset
  *         if email exists in db
  *             change passwordreset fields & hash new resetcode
  *             send password/validate/:idcode via sendgrid mail
  *             response success for swal2
  *
  */
  if ($('.ajax-forgotpassword').length) {
    $('.ajax-forgotpassword').submit(function (e) {
      e.preventDefault()
      var useremail = $('.ajax-forgotpassword input[name="email"]').val()
      if (validateEmail(useremail)) {
        $.ajax({
          url: '/password/forgot',
          type: 'POST',
          data: JSON.stringify({
            email: useremail
          }),
          dataType: 'json',
          contentType: 'application/json',
          success: function (data) {
            if (data.status === 'success') {
              swalSuccess(data.message)
            } else {
              swalError(data.message)
              // reset form
              $('.ajax-forgotpassword input[name="email"]').val('')
            }
          },
          error: function (err) {
            if (err) swalError('Please refresh the page and try again. You can also contact us at \'support@maidicare.com\'.')
          }
        })
      } else {
        swalError('Please provide a valid email.')
      }
    })
  }

  /**
  * @name Password Reset Page
  *
  * AJAX Post New Passwords
  * using window.location.pathname to extract :id
  * check if password length > 6 and match
  *     true, AJAX Post JSON (userid and passwords)
  *         backend
  *         check password again
  *             true, hash password and update password and resetcode
  *             response with swal2 object and url
  *                 redirected to /password/resetsuccess
  *
  **/
  if ($('.ajax-resetpassword').length) {
    $('.ajax-resetpassword').submit(function (e) {
      e.preventDefault()
      var idcode = window.location.pathname.split('/password/validate/')[1]
      var userid = idcode.split('&')[0]
      var password = $('.ajax-resetpassword input[name="password"]').val()
      var confirm = $('.ajax-resetpassword input[name="confirm"]').val()
      if (password.length >= 6 && confirm.length >= 6) {
        if (password === confirm) {
          $.ajax({
            url: '/password/reset',
            type: 'POST',
            data: JSON.stringify({
              userid: userid,
              password: password,
              confirm: confirm
            }),
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
              if (data.status === 'success') {
                window.location = data.url
              } else {
                swalError(data.message)
              }
            },
            error: function (err) {
              if (err) swalError('Please refresh the page and try again. You can also contact us at \'support@maidicare.com\'.')
            }
          })
        } else {
          swalError('The passwords do not match.')
        }
      } else {
        swalError('Password must be at least 6 characters.')
      }
    })
  }

  /**
  * @name Profile Activate
  *
  * AJAX Get Activate Code
  *     send code via url, req.params
  *     error, SWAL alert
  *     success, load edit user page
  */
  if ($('.profile-activate-reset').length > 0) {
    $('.profile-activate-reset').on('click', function () {
      var userid = $('.profile-activate-reset').data('id')
      $.ajax({
        url: '/users/' + userid + '/activate/reset',
        type: 'POST',
        cache: false,
        success: function (data) {
          if (data.status === 'success') swalSuccess(data.message)
        },
        error: function (err) {
          if (err) swalError('Please refresh the page and try again. You can also contact us at \'support@maidicare.com\'.')
        }
      })
    })
  }

  /**
  * @name Login Admin Account
  *
  * AJAX Post New Code to admin email
  */
  if ($('.postadmincode').length > 0) {
    $('.postadmincode').on('click', function () {
      $.ajax({
        url: '/admin/newcode',
        type: 'POST',
        error: function (err) {
          if (err) swalError('Please refresh the page and try again. You can also contact us at \'support@maidicare.com\'.')
        }
      })
    })
  }

  /**
  * @name Admin Account
  *
  * replace standard navbar with admin navbar
  *
  * admin menu css when hover boxes
  *
  * admin menu search for shortlist
  *       if there is input, take input and redirect to url
  *
  * admin populate User Account Page
  *
  * admin Delete User Account
  *       AJAX Post, id & role
  *
  * admin using View Hire Page
  *       filter Hire by Status
  *           fill filter value using url path
  *           onChange filter, fire redirect with new status
  *       changing status of specific hire
  *           AJAX Post using hire id and new status
  *
  * admin using Inactive Helper Page
  *       AJAX Post
  *            email all helpers
  *            email selected helper, using helperid
  *
  * admin using Inactive Hire Page
  *       AJAX Post email selected shortlist
  *            email both employer and helper using their ids
  */
  if ($('.admin-remove-navbar').length > 0) {
    $('.navbar-brand').text('Admin').attr('href', '/admin')
    $('.nav.navbar-nav.navbar-right').empty()
    $('.nav.navbar-nav.navbar-right').append('<li><a target="_blank" href="/admin/email">Send an Email</a></li><li><a class="btn btn-danger"href="/logout">Logout</a></li>')

    // hover css for specific square box
    function hoverSquareBox () {
      $('.admin-home-container .squarebox').on({
        mouseenter: function () {
          $(this).css({'background-color': '#446CB3', 'color': '#fff', 'transition': 'all 0.3s ease', '-webkit-transform': 'scale(1.02)', '-ms-transform': 'scale(1.02)', 'transform': 'scale(1.02)', 'z-index': 1})
        },
        mouseleave: function () {
          $(this).css({'background-color': '#6BB9F0', 'color': 'black', 'transition': 'all 0.3s ease', '-webkit-transform': 'scale(1.0)', '-ms-transform': 'scale(1.0)', 'transform': 'scale(1.0)', 'z-index': 0})
        }
      })
    }
    hoverSquareBox()

    // admin menu search for shortlist
    if ($('.admin-shortlist-search').length > 0) {
      $('.admin-shortlist-search').on('click', function () {
        var hireid = $('input#hireid').val()
        if (hireid !== '') {
          window.location = '/admin/shortlists/' + hireid
        }
      })
    }

    // admin populate User Account Page
    if ($('.adminUserAccount').length > 0) {
      var userInfo = $('.adminUserAccount').data('admin')[0].userid
      function pageloadBoolean (uservalue, param) {
        if (uservalue === true) {
          $('.adminUserAccount input#' + param + 'yes').prop('checked', true)
        } else {
          $('.adminUserAccount input#' + param + 'no').prop('checked', true)
        }
      }
      pageloadBoolean(userInfo.available, 'available')
      pageloadBoolean(userInfo.recruit, 'recruit')
      pageloadBoolean(userInfo.hire, 'hire')
      pageloadBoolean(userInfo.activate.status, 'activatestatus')
    }

    // admin Delete User Account
    if ($('.admin-delete-user').length > 0) {
      $('.admin-delete-user').on('click', function () {
        var idroleemail = $('.admin-delete-user').val()
        var userid = idroleemail.split('&')[0]
        var userrole = idroleemail.split('&')[1]
        var useremail = idroleemail.split('&')[2]
        swal({
          title: 'Type email to Delete',
          text: useremail,
          input: 'email',
          showCancelButton: true,
          confirmButtonColor: 'rgb(221, 75, 57)',
          confirmButtonText: 'Delete',
          showLoaderOnConfirm: true,
          preConfirm: function (email) {
            return new Promise(function (resolve, reject) {
              setTimeout(function () {
                if (email === useremail) {
                  resolve()
                } else {
                  reject('Input does not match Email.')
                }
              }, 1000)
            })
          }
        }).then(function (email) {
          $.ajax({
            url: '/admin/users/delete',
            type: 'POST',
            cache: false,
            data: JSON.stringify({id: userid, role: userrole}),
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
              if (data.status === 'success') {
                swalSuccess('Account Deleted! Redirecting to Admin Menu...')
                setTimeout(function () {
                  window.location = '/admin'
                }, 2500)
              } else {
                swalError(data.message)
              }
            },
            error: function (err) {
              if (err) swalError('Please refresh the page and try again.')
            }
          })
        })
      })
    }

    // admin using View Hire Page's filter
    if ($('.admin-hire-filter').length > 0) {
      var status = window.location.pathname.split('/admin/shortlists/all/')[1]
      $('.admin-hire-filter select[name="filter"]').val(status)
      $('.admin-hire-filter select[name="filter"]').on('change', function () {
        var filterValue = $('.admin-hire-filter select[name="filter"]').val()
        window.location = '/admin/shortlists/all/' + filterValue
      })
    }

    // admin changing status of specific hire
    if ($('.admin-change-hire-status').length > 0) {
      $('.admin-change-hire-status select#status').on('change', function () {
        var hireid = $(this).data('hireid')
        var hirestatus = $(this).val()
        $.ajax({
          url: '/admin/shortlists/' + hireid,
          type: 'POST',
          cache: false,
          data: JSON.stringify({status: hirestatus}),
          dataType: 'json',
          contentType: 'application/json',
          success: function (data) {
            window.location.reload()
          },
          error: function (err) {
            if (err) swalError('Please refresh the page and try again. You can also contact us at \'support@maidicare.com\'.')
          }
        })
      })
    }

    // admin using Inactive Helper Page
    if ($('.admin-email-all-inactive-helper').length > 0) {
      $('.admin-email-all-inactive-helper').on('click', function () {
        $.ajax({
          url: '/admin/inactive/helpers',
          type: 'POST',
          cache: false,
          success: function (data) {
            if (data.status === 'success') {
              swalSuccess(data.message)
            } else {
              swalError(data.message)
            }
          },
          error: function (err) {
            if (err) swalError('Please refresh the page and try again. You can also contact us at \'support@maidicare.com\'.')
          }
        })
      })
      $('.admin-email-inactive-helper').on('click', function () {
        var helperid = $(this).val()
        $.ajax({
          url: '/admin/inactive/helpers/' + helperid,
          type: 'POST',
          cache: false,
          success: function (data) {
            if (data.status === 'success') {
              swalSuccess(data.message)
            } else {
              swalError(data.message)
            }
          },
          error: function (err) {
            if (err) swalError('Please refresh the page and try again. You can also contact us at \'support@maidicare.com\'.')
          }
        })
      })
    }

    // admin using Inactive Hire page
    if ($('.admin-email-inactive-hire').length > 0) {
      $('.admin-email-inactive-hire').on('click', function () {
        var userids = $(this).val()
        $.ajax({
          url: '/admin/inactive/shortlists',
          type: 'POST',
          cache: false,
          data: JSON.stringify({userids: userids}),
          dataType: 'json',
          contentType: 'application/json',
          success: function (data) {
            if (data.status === 'success') {
              swalSuccess(data.message)
            }
          },
          error: function (err) {
            if (err) swalError('Please refresh the page and try again. You can also contact us at \'support@maidicare.com\'.')
          }
        })
      })
    }
  }

  $('#demo').on('click', function () {
    $.ajax({
      url: '/api/users/data',
      type: 'GET',
      dataType: 'json'
    }).done(function (userarray) {
      userarray.forEach(function (userdata) {
        $.ajax({
          type: 'POST',
          url: '/api/users/demo',
          data: userdata
        })
      })
    })
  })
  $('#remove').on('click', function () {
    $.ajax({
      type: 'delete',
      url: '/api/users/remove'
    })
  })
})
