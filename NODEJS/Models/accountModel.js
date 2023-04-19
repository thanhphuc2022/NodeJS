// const express = require('express');
// const app = express();
// const port = 8080;

const { default: mongoose, Schema } = require('mongoose');

const connectDatabase = require('../Services/connectMongodb')//goi ham connect database ket noi voi mongodb
connectDatabase();

const accountSchema = new mongoose.Schema({
    username: String,
    password: String,
    refreshtoken: String,
    toDo: [
        {
            id: String,
            job: String
        }
    ]
}, {
    collection: 'Account'
});
const AccountModel = mongoose.model('Account', accountSchema); //(account)

module.exports = AccountModel
/////////////////////create///////////////////////
// AccountModal.create({
//     username: 'linhnv',
//     password: 'admin12345',
//     age: 19
// })
//     .then(function (data) {
//         console.log('data', data);
//     })
//     .catch(function (error) {
//         console.log('loi', error);
//     })

//////////////////////////find////////////////////
// AccountModal.find({})
//     .then(function (data) {
//         console.log('data', data);
//     })
//     .catch(function (error) {
//         console.log('loi', error);
//     })

/////////////////////////update///////////////
// AccountModal.updateOne({
//     username: 'linhnv'
// }, {
//     password: 'teo1231111111111'
// })
//     .then(function (data) {
//         console.log('data', data);
//     })
//     .catch(function (error) {
//         console.log('loi', error);
//     })

////////////////////////delete/////////////////
// AccountModal.deleteOne({
//     username: 'linhnv'
// })
//     .then(function (data) {
//         console.log('data', data);
//     })
//     .catch(function (error) {
//         console.log('loi', error);
//     })


// app.listen(port, function () {
//     console.log(`sever chay tren cong ${port}`);
// })