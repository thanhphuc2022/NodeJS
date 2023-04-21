const jwt = require('jsonwebtoken')
var cookieParser = require('cookie-parser');
require("dotenv").config();

const createJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json("You're not authenticated");
    }
    jwt.verify(token, process.env.JWT_SECRET_ACCESS, (err, decodedToken) => {
        if (err) {
            return res.status(403).json("Token is not valid");
        }
        if (decodedToken.user !== req.params.username) {
            return res.status(403).send("You're not authenticated!");
        }
        req.username = decodedToken.user;
        next();
    });
};


function generateAccessToken(user) {
    return jwt.sign({ user }, process.env.JWT_SECRET_ACCESS, { expiresIn: '1m' });
}

function generateRefreshToken(user) {
    return jwt.sign({ user }, process.env.JWT_SECRET_REFRESH, { expiresIn: '365d' });
}

module.exports = {
    createJWT,
    generateAccessToken,
    generateRefreshToken
}