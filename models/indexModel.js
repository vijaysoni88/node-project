const mongoose = require('mongoose')
const url = "mongodb://localhost:27017/newbiz"
mongoose.connect(url)
const db = mongoose.connection

function indexModel() {
  this.register = (userData) => {
    return new Promise((resolve, reject) => {
      db.collection('register').find().toArray((err, users) => {
        if (err) {
          reject(err)
        } else {
          userStatus = 0
          if (users.length == 0) {
            userData._id = 1
          } else {
            max = users[0]._id
            for (let user of users) {
              if (max < user._id) {
                max = user._id
              }
            }
            userData._id = max + 1
            for (user of users) {
              if (user.email == userData.email) {
                resolve({ 'msg': "User already registered" })
                userStatus = 1
              }
            }
          }
          userData.role = 'user'
          userData.status = '0'
          userData.created_at = Date()
          if (userStatus == 0) {
            db.collection('register').insert(userData, (err) => {
              if (err) {
                reject(err)
              }
              else {
                resolve({ "msg": "data inserted Successfully...." })
              }
            })
          }
        }
      })
    })

  }
  this.login = (loginData) => {
    return new Promise((resolve, reject) => {
      db.collection('register').find({ 'email': loginData.email, 'password': loginData.password, 'status': 1 }).toArray((err, data) => {
        if (err)
          reject(err)
        else
          resolve(data)
      })
    })
  }
  this.fetchAll = (collection_name) => {
    return new Promise((resolve, reject) => {
      db.collection(collection_name).find().toArray((err, data) => {
        if (err)
          reject(err)
        else
          resolve(data)
      })
    })
  }
  this.verifyuser = (userEmail) => {
    return new Promise((resolve, reject) => {
      db.collection('register').find({'email':userEmail}).toArray((err, data)=>{
        if(err)
          reject(err)
        else{
          if(data.length==0)
            resolve({'msg': 'record not found'})
          else{
            db.collection('register').update({'email':userEmail}, {$set:{'status':1}})
            resolve(true)
          }
        }
      })
    });
  }

  this.fetchSubCategory = (catnm) =>{
    console.log(catnm)
    return new Promise((resolve, reject) => {
      db.collection('subcategory').find({'catnm':catnm}).toArray((err, data)=>{
        if(err)
          reject(err)
        else{
          if(data.length==0){
            resolve({'msg':'subcategory not found..'})
          }
          else{
            resolve(data)
          }
        }
      })
    })
  }
}

module.exports = new indexModel();