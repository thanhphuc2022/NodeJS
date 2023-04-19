const jwt = require('jsonwebtoken')
var cookieParser = require('cookie-parser');
require("dotenv").config();

const createJWT = (request, response, next) => {
    const token = request.headers.token;
    if (token) {
        const accessToken = token.split(" ")[1];
        jwt.verify(accessToken, process.env.JWT_SECRET_ACCESS, (err, data) => {
            if (err) {
                return response.status(403).json("Token js not valid");
            }
            request.data = data;
            next();
        })
    } else {
        return response.status(401).json("You're not authenticated");
    }
}

function generateAccessToken(user) {
    return jwt.sign({ user }, process.env.JWT_SECRET_ACCESS, { expiresIn: '30s' });
}

function generateRefreshToken(user) {
    return jwt.sign({ user }, process.env.JWT_SECRET_REFRESH, { expiresIn: '365d' });
}

module.exports = {
    createJWT,
    generateAccessToken,
    generateRefreshToken
}