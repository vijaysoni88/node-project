var express = require('express');
const userModel = require('../models/userModel');
const indexModel = require('../models/indexModel');
var router = express.Router();
var sunm = ""


// middleware for user autnetication session
router.use((req,res,next)=>{
  if(req.session.sunm==undefined || req.session.srole!='user'){
    req.session.sunm = ''
    res.redirect('/login')
  }
  next()
})

/* GET users listing. */

router.get('/', function(req, res, next) {
  res.render('userhome', {"sunm": req.session.sunm, "srole":req.session.srole});
});

router.get('/changepass', function(req, res, next) {
  res.render('changepass', {'msg':'', "sunm": req.session.sunm, "srole":req.session.srole});
});

router.post('/changepass', function(req, res, next) {
  userModel.changepassword(req.body, "vijay.soni011official@gmail.com").then((result)=>{
    res.render('changepass', {'msg':result.msg, "sunm": req.session.sunm, "srole":req.session.srole});
  }).catch((err)=>{
    console.log(err)
  });  
});

router.get('/addlocation', function(req, res, next) {
  indexModel.fetchAll('category').then((result)=>{
    categories = result
    res.render('addlocation', {"sunm": req.session.sunm, "srole":req.session.srole, 'categories':categories});
  }).catch((err)=>{
    console.log(err)
  })
});

router.get('/fetchsubcat', function(req, res, next) {
  catnm = url.parse(req.url, true).query.catnm
  indexModel.fetchSubCategory(catnm).then((result)=>{
    console.log(result)
    console.log("asfasdasdfasdfasdasf a sdf as fasd fsd fasd sa f")
    res.send(result)
  }).catch((err)=>{
    console.log(err);
  })
});


module.exports = router;
