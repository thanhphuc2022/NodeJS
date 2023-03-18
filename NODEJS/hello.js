const express = require('express'); //import thu vien
const app = express(); //tạo hàm
const port = 8080;

// app.get('/', (req, res) => {
//     res.send('lololo')
// })
// app.get('/about', (req, res) => {
//     res.send('about ne')
// })

app.set('view engine', 'ejs'); //thiết lập view engine là EJS.
app.set('views', './views'); //cấu hình sử dụng tài nguyên trong thư mục views
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => { //định nghĩa route trang chủ
    res.render('index'); //trả về trang index
})

// ()=> : function()
//tb chay code
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})