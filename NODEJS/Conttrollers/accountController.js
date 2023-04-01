const { json } = require('body-parser');
const { ServerSession } = require('mongodb');
const { startSession } = require('../Models/accountModel');
const AccountModel = require('../Models/accountModel')//chứa khung schema account

function Register(request, response) {
    var username = request.body.username
    var password = request.body.password

    //bat su kien trung ten dang nhap
    AccountModel.findOne({
        username: username
    })
        .then(function (data) {
            if (data) {
                return response.json({ success: false, message: 'username da duoc su dung' });
            } else {
                AccountModel.create({
                    username: username,
                    password: password
                })
                response.json({ success: true, message: 'tao tai khoan thanh cong' })
            }

        })
        // .then(function (data) {
        //     response.json('tao tai khoan thanh cong')
        // })
        .catch(function (error) {
            response.status(555).json('tao tai khoan that bai')
        })
}

function login(request, response) {
    var username = request.body.username
    var password = request.body.password

    errLogin = 0;

    AccountModel.findOne({
        username: username,
        password: password
    })
        .then(function (data) {
            if (username == '' || password == '') {
                response.status(500).json({ success: false, message: 'vui long nhap day du thong tin' })
                errLogin++
            }
            if (!data) {
                response.status(500).json({ success: false, message: 'username hoac password khong dung' })
                errLogin++
            }
            if (errLogin == 0) {
                response.json({ success: true, message: 'Dang nhap thanh cong' })
                // response.json('Dang nhap thanh cong')
                // response.render('todo.ejs')
                // response.render('todo')
            }
        })
        .catch(function (err) {
            response.status(555).json('dang nhap that bai-Loi server')
        })
}


function getAccount(request, response) {
    AccountModel.find({})
        .then(function (data) {
            // response.render('account', { datas: data });
            response.json(data);
            // request.body()
        })
        .catch(function (err) {
            response.status(500).json('Loi sever')
        })
}

function getAccountID(request, response) {
    var id = request.params.id
    AccountModel.findById(id)
        .then(function (data) {
            response.json(data)
        })
        .catch(function (err) {
            response.status(500).json('Loi sever')
        })
}

function getAccountCreate(request, response) {
    response.render('account')
}

function postAccount(request, response) {
    const usernameRegex = /^[a-zA-Z0-9_.]{3,20}$/;
    const passwordRegex = /^.{8,}$/;
    var username = request.body.username
    var password = request.body.password
    errpost = 0;

    AccountModel.findOne({
        username: username
    })
        .then(function (data) {
            if (data) {
                // response.status(500).json('username da duoc su dung')
                response.send('username da duoc su dung')
                // response.locals.errAcc='username da duoc su dung'
                errpost++
            }
            else if (!usernameRegex.test(username)) {
                response.status(500).json('username khong hop le')
                errpost++
            }
            else if (!passwordRegex.test(password)) {
                response.status(500).json('password it nhat 8 ki tu')
                errpost++
            }
            else if (username == '' || password == '') {
                response.status(500).json('vui long dien day du thong tin')
                errpost++
            }
            else if (errpost == 0) {
                return AccountModel.create({
                    username: username,
                    password: password
                })
            }
        })
        .then(function (data) {
            response.json('Them acc thanh cong')
            // console.log(errpost)
        })
        .catch(function (err) {
            response.status(500).json('Loi server')
        })
}

function getAccountEdit(request, response) {
    // return response.send(`trang edit ${request.params.id} `)
    var id = request.params.id
    AccountModel.findByIdAndUpdate(id)
        .then(function (data) {
            // data = response.json(data)
            response.render('updateaccount.ejs', { datas: data })
        })
        .catch(function (err) {
            response.status(500).json('Loi sever')
        })
}

function putAccountID(request, response) {
    var id = request.params.id
    var newpassword = request.body.newpassword
    AccountModel.findByIdAndUpdate(id, {
        password: newpassword
    })
        // return response.redirect('/account/aa')
        .then(function (data) {
            response.json('Update thanh cong ')
        })
        .catch(function (err) {
            response.status(500).json('Loi server')
        })
}

function deleteAccountID(request, response) {
    var id = request.params.id
    AccountModel.deleteOne({
        _id: id
    })
        // return response.redirect('/account/aa')
        .then(function (data) {
            response.json('Xoa thanh cong ')
        })
        .catch(function (err) {
            response.status(500).json('Loi server')
        })
}

function createJob(request, response) {
    var id = request.params.id
    var job = request.body.job

    // AccountModel.findById({
    //     id: id
    // })
    //     .then(function (data) {
    //         if (!data) {
    //             response.json('Loi truy van')
    //         }
    //         else {
    //             return AccountModel.updateOne({
    //                 // toDo: job
    //                 $push: { toDo: job }
    //             })
    //         }
    //     })

    AccountModel.updateOne(
        { _id: id },
        { $push: { toDo: job } }
    )

        .then(function (data) {
            response.json('Them job thanh cong ')
        })
        .catch((err) => {
            response.status(500).json('that bai')
        })
}

function updateJob(request, response) {
    // var username = ServerSession.AccountModel.username
    var id = request.params.id
    var job = request.body.job

    AccountModel.findByIdAndUpdate(id, {
        toDo: job
    })
        .then(function (data) {
            response.json('update job thanh cong ')
        })
        // AccountModel.find({}).then((response) => {
        //     AccountModel.updateOne(
        //         { id: id },
        //         { $push: { toDo: job } },
        //         (err, result) => {
        //             if (err) throw err;
        //             // console.log(`Updated ${result.modifiedCount} document.`);
        //         }
        //     )
        // })
        .catch((err) => {
            response.status(500).json('that bai')
        })
}

module.exports = {
    Register: Register,
    login: login,
    getAccount: getAccount,
    getAccountID: getAccountID,
    getAccountCreate: getAccountCreate,
    postAccount: postAccount,
    getAccountEdit: getAccountEdit,
    putAccountID: putAccountID,
    deleteAccountID: deleteAccountID,
    updateJob: updateJob,
    createJob: createJob
}