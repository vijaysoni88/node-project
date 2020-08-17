const mongoose = require('mongoose')
const e = require('express')
const url = "mongodb://localhost:27017/newbiz"
mongoose.connect(url)
const db = mongoose.connection

function userModel() {
  this.changepassword = (passwordDetails, email) => {
    return new Promise((resolve, reject) => {
      db.collection('register').find({ 'email': email, 'password': passwordDetails.opass }).toArray((err, data) => {
        if (err)
          reject(err)
        else {
          if (data.length == 0) {
            resolve({ "msg": "Old password does not match" })
          }
          else {
            if (passwordDetails.npass == passwordDetails.cpass) {
              db.collection('register').update({ 'email': email }, { $set: { 'password': passwordDetails.npass } })
              resolve({ "msg": "Password Changed Successfully..." })
            }
          }
        }
      })
    })
  }
}

module.exports = new userModel();