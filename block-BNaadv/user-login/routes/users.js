var express = require('express');
var router = express.Router();
var User = require('../model/User')

/* GET users listing. */
router.get('/', function (req, res, next) {
  console.log(req.session)
  res.render('user');
});

// registration
router.get('/registration', function (req, res, next) {
  res.render('registration');
});


router.post('/registration', function (req, res, next) {
  User.create(req.body, (err, user) => {

    if (err) return next(err)
    res.redirect('/')
  })
});

// login
router.get('/login', function (req, res, next) {
  res.render('login');
});


router.post('/login', function (req, res, next) {
  var { email, password } = req.body
  if (!email || !password) {
    return res.redirect('/users/login')
  }


  User.findOne({ email }, (err, user) => {
    if (err) return next(err)
    // no user
    if (!user) {
      return res.redirect('/users/login')
    }
    // compare password
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err)
      // console.log(result)
      if (!result) {
        return res.redirect('/users/login')
      }
      else {

        // persist logged in user information
        req.session.userId = user.id
        res.redirect('/users')
      }
    })
  })
});



module.exports = router;
