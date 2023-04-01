//ham ket noi csdl
const mongoose = require('mongoose');
async function connectDatabase() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/demoNodejs')
        console.log('ket noi database thanh cong');
    } catch (error) {
        console.log('ket noi database that bai');
    }
}
module.exports = connectDatabase;