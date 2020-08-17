var express = require('express');
var url = require('url')
var router = express.Router();
const adminModel = require('../models/adminModel')
const indexModel = require('../models/indexModel')
var path = require('path')
var sunm = ""

// middleware for admin autnetication session
// router.use((req,res,next)=>{
//   if(req.session.sunm==undefined || req.session.srole!='admin'){
//     req.session.sunm = ''
//     res.redirect('/login')
//   }
//   next()
// })

/* GET home page. */
categories = ''
router.use('/managesubcategory', function(req, res, next) {
  indexModel.fetchAll('category').then((result)=>{
    categories = result
  })
  next();
});

/* GET users listing. */

router.get('/', function(req, res, next) {
  res.render('adminhome', {"sunm": req.session.sunm, "srole": req.session.srole});
});

router.get('/manageuser', function(req, res, next) {
  adminModel.fetchUser().then((result)=>{
    //console.log(result)
    res.render('manageuser', {'result': result, "sunm": req.session.sunm, "srole": req.session.srole});
  }).catch((err)=>{
    console.log(err)
  })
});

router.get('/manageuserstatus', function(req, res, next) {
  var url_data = url.parse(req.url, true).query
  var status = url_data.status
  var userid = url_data.userid
  var action = url_data.action
  console.log(url_data)
  adminModel.changeStatus(status, userid, action).then((data)=>{
    res.redirect('manageuser')
  }).catch((err)=>{
    console.log(err)
  })
  
});

router.get('/managecategory', function(req, res, next) {
  res.render('managecategory',{'msg':'', "sunm": req.session.sunm, "srole": req.session.srole});
});
router.post('/managecategory', function(req, res, next) {
  var catnm=req.body.catnm
  var caticon=req.files.caticon
  var caticonnm=Date.now()+'-'+caticon.name
  var caticonpath=path.join(__dirname,"../public/uploads/categoryicons",caticonnm)
  caticon.mv(caticonpath)
  adminModel.managecategory(catnm,caticonnm).then((result)=>{
    res.render('managecategory',{'msg':'category added successfully....', "sunm": req.session.sunm, "srole": req.session.srole});
  }).catch((err)=>{
    console.log(err)
  })
});

router.get('/managesubcategory', function(req, res, next) {
    res.render('managesubcategory',{'msg':'', "categories":categories,  "sunm": req.session.sunm, "srole": req.session.srole}); 
})
router.post('/managesubcategory', function(req, res, next) {
  var catnm = req.body.catnm
  var scatnm=req.body.scatnm
  var scaticon=req.files.scaticon
  var scaticonnm=Date.now()+'-'+scaticon.name
  var scaticonpath=path.join(__dirname,"../public/uploads/subcategoryicons",scaticonnm)
  scaticon.mv(scaticonpath)
  adminModel.managesubcategory(catnm,scatnm,scaticonnm).then((result)=>{
    res.render('managesubcategory',{'msg':'Subcategory added successfully...', "categories":categories,  "sunm": req.session.sunm, "srole": req.session.srole});
  }).catch((err)=>{
    if(err)
      console.log(err)
  });
});

// router.get('/fetchcategaries', function(req, res, next) {
//   console.log('into the page...')

// });

module.exports = router;
