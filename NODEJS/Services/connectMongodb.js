//ham ket noi csdl
const mongoose = require('mongoose');

const URL = 'mongodb+srv://thanhphuc:thanhphuc1204@demonodejs.r29hvtz.mongodb.net/demoNodejs?retryWrites=true&w=majority'

const connectDB = async () => {
    try {
        await mongoose.connect(
            URL,
            { useNewUrlParser: true, useUnifiedTopology: true }
        )
        console.log('Connected to mongoDB')
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = connectDB;