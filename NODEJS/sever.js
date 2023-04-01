const express = require('express'); //import thu vien
var app = express(); //tạo hàm
const port = 8080;
var bodyParser = require('body-parser');

var accountRouter = require('./routers/accountRouter') //lấy router từ các hàm CRUD

const connectDatabase = require('./Services/connectMongodb')//goi ham connect database ket noi voi mongodb
connectDatabase();

app.set('view engine', 'ejs'); //thiết lập view engine là EJS.
app.set('views', './views'); //cấu hình sử dụng tài nguyên trong thư mục views
app.use(express.static(__dirname + '/public')); //lấy css từ public


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const AccountModal = require('./Models/accountModel');
const { request, response } = require('express');
const { json } = require('body-parser');

var accountRouter = require('./routers/accountRouter')

// app.get('/index', (req, res) => { //định nghĩa route trang chủ
//     res.render('index'); //trả về trang index
// })
// app.use('/api', accountRouter)
app.use('/api/account', accountRouter)

// ()=> : function()
//tb chay code
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
