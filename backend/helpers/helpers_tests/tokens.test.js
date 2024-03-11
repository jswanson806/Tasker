const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require('../../config.js');
const { createToken } = require('../tokens.js');

describe('createToken', function() {
    test('works: worker', function() {
        const token = createToken({isWorker: true, isAdmin: false})
        const payload = jwt.verify(token, SECRET_KEY);
        expect(payload).toEqual({
            iat: expect.any(Number),
            isWorker: true,
            isAdmin: false
        })
    })

    test('works: user', function() {
        const token = createToken({isWorker: false, isAdmin: true})
        const payload = jwt.verify(token, SECRET_KEY);
        expect(payload).toEqual({
            iat: expect.any(Number),
            isWorker: false,
            isAdmin: true
        })
    })

    test('works: default not worker', function() {
        const token = createToken({isAdmin: false})
        const payload = jwt.verify(token, SECRET_KEY);
        expect(payload).toEqual({
            iat: expect.any(Number),
            isWorker: false,
            isAdmin: false
        })
    })

    test('works: default not admin', function() {
        const token = createToken({isWorker: false})
        const payload = jwt.verify(token, SECRET_KEY);
        expect(payload).toEqual({
            iat: expect.any(Number),
            isWorker: false,
            isAdmin: false
        })
    })
})
