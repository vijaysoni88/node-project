const express = require('express');
const router = express.Router();
const indexModel = require('../models/indexModel');
const url = require('url')
const sendmail = require('./sendmail');
const sendSMS = require('./smsapi');
const generateOTP = require('./otpapi');
const adminModel = require('../models/adminModel');



/* GET home page. */
router.get('/', function(req, res, next) {
  indexModel.fetchAll('category').then((result)=>{
    res.render('index',{'clist':result});
  }).catch((err)=>{
    console.log(err)
  })
});

router.get('/login', function(req, res, next) {
  res.render('login', {"msg":""});
});
router.post('/login', function(req, res, next) {
  indexModel.login(req.body).then((result)=>{
    if(result.length==0){
      res.render('login', {"msg": "Invalid email and password"})
    }
    else{
      req.session.sunm = result[0].email
      req.session.srole = result[0].role
      if(result[0].role == 'user')
        res.redirect('/users')
      else
        res.redirect('/admin')
    }
  }) 
});

router.get('/register', function(req, res, next) {
  res.render('register', {"msg": ""});
});
router.post('/register', function(req, res, next) {
  indexModel.register(req.body).then((result)=>{
    var otp = generateOTP()
    // res.cookie('email', req.body.email, {expires: new Date(Date.now() + 900000)})
    res.cookie('otp', otp, {expires: new Date(Date.now() + 900000)})
    sendmail(req.body.email, req.body.password)
    sendSMS(parseInt(req.body.mobile), otp)
    res.redirect('verifymobile')
    // res.render("register", {'msg':result.msg})
  }).catch((err)=>{
    console.log('Errroy the msset')
  });
});

router.get('/verifyuser', function(req, res, next) {
  var userEmail = url.parse(req.url, true).query.email
  indexModel.verifyuser(userEmail).then((result)=>{
      req.session.sunm = result[0].email
      req.session.srole = result[0].role
      if(result[0].role == 'user')
        res.redirect('/users')
      else
        res.redirect('/admin')
  }).catch((err)=>{
    console.log(err)
  });
});

router.get('/verifymobile', function(req, res, next) {
  res.render('verifymobile');
});
router.post('/verifymobile', function(req, res, next) {
  session_otp = req.cookies.otp
  otp = req.body.otp
  userEmail = req.session.sunm
  console.log(session_otp)
  console.log(otp)
  if( session_otp != otp)
    res.render('verifymobile');
  else{
    console.log(userEmail)
    indexModel.verifyuser(userEmail).then((result)=>{
      res.redirect('/user', )
    }).catch((err)=>{
      console.log(err)
    });
  }
});

router.get('/showsubcategory', function(req, res, next) {
  catnm = url.parse(req.url, true).query.catnm
  indexModel.fetchSubCategory(catnm).then((result)=>{
    console.log(result.length)
    console.log('aa gya ghe y  ou jldf pojf f')
    if (result.length == 0 || result.length == undefined)
      res.render('showsubcategory',{'msg': 'subcategory not found..'});
    else
      res.render('showsubcategory',{'subcat':result, 'msg': ''});
  }).catch((err)=>{
    console.log(err);
  })
});

module.exports = router;



