const express = require('express');
var app = express();
var bodyParser = require('body-parser');

const ejs = require('ejs');

const port = 8080;
// const { request, response } = require('express');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const AccountModel = require('./Models/accountModel');
const { request, response } = require('express');
const { json } = require('body-parser');

app.post('/register', (request, response, next) => {
    var username = request.body.username
    var password = request.body.password

    //bat su kien trung ten dang nhap
    AccountModel.findOne({
        username: username
    })
        .then(function (data) {
            if (data) {
                response.json('username da duoc su dung')
            } else {
                AccountModel.create({
                    username: username,
                    password: password
                })
            }

        })
        .then(function (data) {
            response.json('tao tai khoan thanh cong')
        })
        .catch(function (error) {
            response.status(555).json('tao tai khoan that bai')
        })

    console.log(username, password);
})

app.post('/login', (request, response, next) => {
    var username = request.body.username
    var password = request.body.password

    AccountModel.findOne({
        username: username,
        password: password
    })
        .then(function (data) {

            if (data) {
                response.json('Dang nhap thanh cong')
            } else {
                response.status(555).json('username hoac pass khong dung')
            }
        })
        .catch(function (err) {
            response.status(555).json('dang nhap that bai')
        })
})

/////
app.set('view engine', 'ejs'); //thiết lập view engine là EJS.
app.set('views', './views'); //cấu hình sử dụng tài nguyên trong thư mục views
// app.use(express.static(__dirname + '/public'));

////
var accountRouter = require('./routers/accountRouter')
var accountController = require('./Conttrollers/accountController')

app.use('/api/account', accountRouter)

app.use('/account', accountRouter)


app.get('/', (request, response, next) => {
    response.json('HOME')
})

app.listen(port, function () {
    console.log(`sever chay tren cong ${port}`);
})
