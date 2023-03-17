const express = require('express'); //import thu vien
const app = express();
const port = 8080;

// app.get('/', (req, res) => {
//     res.send('lololo')
// })
// app.get('/about', (req, res) => {
//     res.send('about ne')
// })

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('index');
})

// ()=> : function()
//tb chay code
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})