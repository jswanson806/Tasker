const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require('../config.js');

function createToken(user){
    console.assert(user.isWorker !== false,
        "createToken passed user without isWork property");
    console.assert(user.isAdmin !== false,
        "createToken passed user without isAdmin property");

        let payload = {
            id: user.id,
            email: user.email,
            isWorker: user.isWorker || false,
            isAdmin: user.isAdmin || false
        };

        return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };