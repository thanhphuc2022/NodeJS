require("dotenv").config();
const { json } = require('body-parser');
const { ServerSession } = require('mongodb');
const { startSession } = require('../Models/accountModel');
const AccountModel = require('../Models/accountModel');//chứa khung schema account
const jwt = require('jsonwebtoken');
const { request, response } = require('express');
const { generateAccessToken, generateRefreshToken } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const CryptoJS = require('crypto-js');
let refreshTokens = [];

function getRegister(request, response) {
    response.render('register.ejs')
}

async function Register(request, response) {
    try {
        var username = request.body.username
        var password = request.body.password
        var repassword = request.body.repassword

        const usernameRegex = /^[a-zA-Z0-9_.]{3,20}$/;
        const passwordRegex = /^.{8,}$/;
        errRgt = 0
        //bat su kien trung ten dang nhap
        AccountModel.findOne({
            username: username
        })
            .then(async function (data) {
                if (username == '' || password == '' || repassword == '') {
                    return response.json({ success: false, message: 'vui long dien day du thong tin' });
                    errRgt++
                }
                if (data) {
                    return response.json({ success: false, message: 'username da duoc su dung' });
                    errRgt++
                }
                if (password != repassword) {
                    return response.json({ success: false, message: 'Mat khau khong trung khop' });
                    errRgt++
                }
                if (!usernameRegex.test(username)) {
                    return response.json({ success: false, message: 'username khong hop le' });
                    errRgt++
                }
                if (!passwordRegex.test(password)) {
                    return response.json({ success: false, message: 'mat khau it nhat 8 ki tu ' });
                    errRgt++
                }
                if (errRgt == 0) {
                    //mã hóa mật khẩu
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(password, salt);
                    //lưu user đã được mã hóa mk
                    AccountModel.create({
                        username: username,
                        password: hashedPassword
                    })
                    response.json({ success: true, message: 'tao tai khoan thanh cong' })
                }

            })
            .catch(function (error) {
                response.status(555).json('tao tai khoan that bai')
            })
    }
    catch (error) {
        response.status(555).json('Loi server')
    }
}

function getlogin(request, response) {
    response.render('login');
}

var user;//biến user toàn cục-lưu thông tin người dùng đăng nhập

async function login(request, response, next) {
    var username = request.body.username
    var password = request.body.password

    errLogin = 0;

    const use = await AccountModel.findOne({
        username: username,
    })
        .then(async function (use) {
            if (username == '' || password == '') {
                response.status(500).json({ success: false, message: 'vui long nhap day du thong tin' })
                errLogin++
            }
            if (!use) {
                response.status(500).json({ success: false, message: 'username hoac password khong dung' })
                errLogin++
            }
            const isMatch = await bcrypt.compare(password, use.password);
            if (!isMatch) {
                response.status(500).json({ success: false, message: 'username hoac password khong dung' })
                errLogin++
            }
            if (errLogin == 0) {

                // const accessToken = jwt.sign({ username }, process.env.JWT_SECRET_ACCESS, { expiresIn: "30s" });
                // const refreshToken = jwt.sign({ username }, process.env.JWT_SECRET_REFRESH, { expiresIn: "365d" });

                const accessToken = generateAccessToken(username);
                const refreshToken = generateRefreshToken(username);

                AccountModel.collection.findOneAndUpdate(
                    { username: username },
                    { $set: { refreshtoken: refreshToken } }
                )

                response.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict",
                })
                // response.json({ success: true, message: 'Dang nhap thanh cong' })
                // response.render('todo.ejs', { datas: use })////////////////////////////////o day
                response.json({ accessToken, refreshToken, toDo: use.toDo });
                // response.json({ toDo: data.toDo }); //trả về toDolish
                // response.json(data)

                user = username //lưu username đã đăng nhập vào biến user
            }

        })
        .catch(function (err) {
            console.log(err)
            // response.status(555).json('dang nhap that bai-Loi server')
        })
}

function getAccount(request, response) {
    AccountModel.find({})
        .then(function (data) {
            response.render('account', { datas: data });
            // response.json(data);
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
    var username = user //gán biến user chứa username đã đăng nhập vào username
    // var username = request.params.username
    const query = {
        username: username,
        'toDo.id': request.body.id,
    };
    AccountModel.collection.findOne(query, (err, result) => { //bắt lỗi trùng id job
        if (err) {
            console.log(err);
        } else if (result) {
            response.status(500).json('trung id job')
        } else {
            // Thực hiện thêm item nếu không có lỗi trùng name
            var item = { id: request.body.id, job: request.body.job }
            AccountModel.collection.updateOne(
                { username: username },
                { $push: { toDo: item } }
            )
                .then(function (data) {
                    response.json('Them job thanh cong ')
                })
                .catch((err) => {
                    response.status(500).json('that bai')
                })
        }
    });
}

async function getupdateJob(request, response) {
    var username = user
    // var username = request.params.username
    const userData = await AccountModel.collection.findOne({ username: username });
    const idToFind = request.params.username;
    // const userdata = AccountModel.findOne({ username: username })
    const toDolist = userData.toDo
    const foundItem = toDolist.find(item => item.id === idToFind);

    if (foundItem) {
        response.render('updatetodo.ejs', { foundItem })
    } else {
        response.status(500).json('Loi sever')
    }
}

function postupdateJob(request, response) {
    // var username = user
    const username = request.params.username
    const id = request.params.id
    var newjob = request.body.newjob

    AccountModel.collection.updateOne(
        { username: username, "toDo.id": id },
        { $set: { "toDo.$.job": newjob } }
    )
        .then(function (data) {
            response.json('update job thanh cong ')
        })
        .catch((err) => {
            response.status(500).json('that bai')
        })
}

function deleteJob(request, response) {
    const username = request.params.username
    const id = request.params.id

    AccountModel.collection.updateOne(
        { username: username },
        // { "toDo.id": id },
        { $pull: { "toDo": { "id": id } } }
    )
        .then(function (data) {
            response.json('Xoa thanh cong')
        })
        .catch(function (err) {
            response.status(500).json('Loi server')
        })
}

function toDojob(request, response, next) {
    username = request.params.username
    AccountModel.findOne(
        { username: username },
    )
        .then(function (data) {
            response.json({ toDo: data.toDo });
            // console.log(result.toDo);
        })
        .catch(function (err) {
            return response.json(err)
            // response.status(555).json('dang nhap that bai-Loi server')
        })
}

async function requestRefreshToken(request, response) {
    try {
        const authHeader = request.headers.authorization;
        const refreshToken = authHeader && authHeader.split(" ")[1];

        // const refreshToken = request.headers.authorization;
        const existingToken = await AccountModel.findOne({ refreshtoken: refreshToken });
        if (!refreshToken) {
            return response.status(401).json("You're not authenticated");
        }
        if (!existingToken) {
            return response.status(403).json("Refresh token is not valid");
        }

        const decodedToken = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);
        const new_accessToken = generateAccessToken(decodedToken.user);
        const new_refreshToken = generateRefreshToken(decodedToken.user);

        //lưu refreshtoken vào database
        await AccountModel.findOneAndUpdate(user, { refreshtoken: new_refreshToken })

        //luu refreshToken vao cookie
        response.cookie("refreshToken", new_refreshToken, {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "strict",
        })

        response.json(new_accessToken)
    } catch (error) {
        console.log(error)
        // throw new Error('Unable to request refresh token');
    }
}

module.exports = {
    getRegister: getRegister,
    Register: Register,
    getlogin: getlogin,
    login: login,
    getAccount: getAccount,
    getAccountID: getAccountID,
    getAccountCreate: getAccountCreate,
    postAccount: postAccount,
    getAccountEdit: getAccountEdit,
    putAccountID: putAccountID,
    deleteAccountID: deleteAccountID,
    getupdateJob: getupdateJob,
    postupdateJob: postupdateJob,
    createJob: createJob,
    deleteJob: deleteJob,
    toDojob: toDojob,
    requestRefreshToken: requestRefreshToken
}