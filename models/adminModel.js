const mongoose = require('mongoose')
const url = "mongodb://localhost:27017/mean89"
mongoose.connect(url)
const db = mongoose.connection

function adminModel() {
  this.fetchUser = () => {
    return new Promise((resolve, reject) => {
      db.collection('register').find({ 'role': 'user' }).toArray((err, data) => {
        if (err)
          reject(err)
        else
          resolve(data)
      })
    })
  }
  this.changeStatus = (status, userid, action) => {
    return new Promise((resolve, reject) => {
      db.collection('register').find({ '_id': parseInt(userid) }).toArray((err, data) => {
        if (err)
          reject(err)
        else {
          console.log(action)
          if (action == 'update') {
            if (status == 0) {
              status = 1
            }
            else if (status == 1) {
              status = 0
            }
            db.collection('register').update({ '_id': parseInt(userid) }, { $set: { 'status': status } })
            resolve({ 'msg': 'operation perform successfully...' })
          }
          else if (action == 'delete') {
            db.collection('register').remove({ '_id': parseInt(userid) })
            resolve({ 'msg': 'operation perform successfully...' })
          }
        }
      })
    })
  }
  this.managecategory = (catnm, caticonnm) => {
    return new Promise((resolve, reject) => {
      db.collection('category').find().toArray((err, data) => {
        if (err)
          reject(err)
        else {
          var cDetails = {}
          if (data.length == 0)
            cDetails._id = 1
          else {
            max_id = data[0]._id
            for (row of data) {
              if (max_id < row._id)
                max_id = row._id
            }
            cDetails._id = max_id + 1
          }
          var cstatus = 0
          if (data.length != 0) {
            for (row of data) {
              if (row.catnm == catnm) {
                resolve({ 'msg': 'Category already exists please select new...' })
                cstatus = 1
              }
            }
          }

          if (cstatus == 0) {
            cDetails.catnm = catnm
            cDetails.caticonnm = caticonnm
            db.collection("category").insert(cDetails, (err) => {
              if (err)
                reject(err)
              else
                resolve({ 'msg': 'Cateory added successfully' })
            })
          }

        }
      })

    })
  }
  this.managesubcategory = (catnm, scatnm, scaticonnm) => {
    return new Promise((resolve, reject) => {
      db.collection('subcategory').find().toArray((err, data) => {
        if (err)
          reject(err)
        else {
          var scDetails = {}
          if (data.length == 0)
            scDetails._id = 1
          else {
            max_id = data[0]._id
            for (row of data) {
              if (max_id < row._id)
                max_id = row._id
            }
            scDetails._id = max_id + 1
          }

            scDetails.catnm = catnm
            scDetails.scatnm = scatnm
            scDetails.scaticonnm = scaticonnm
            db.collection("subcategory").insert(scDetails, (err) => {
              if (err)
                reject(err)
              else
                resolve({ 'msg': 'Sub Cateory added successfully' })
            })
        }
      })

    })
  }
}

module.exports = new adminModel();