var express = require('express');
var router = express.Router();
var User=require('../model/User')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('user');
});


router.get('/registration', function(req, res, next) {
  res.render('registration');
});


router.post('/registration', function(req, res, next) {
     User.create(req.body,(err,user)=>{
      if(err)return next(err)
      console.log(user)
      res.redirect('/users/login')
     })
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

module.exports = router;
