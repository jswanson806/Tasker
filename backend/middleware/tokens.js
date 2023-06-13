const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require('../config.js');

function createToken(user){
    console.assert(user.isWorker !== false,
        "createToken passed user without isWork property");

        let payload = {
            email: user.email,
            isWorker: user.isWorker || false
        };

        return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };