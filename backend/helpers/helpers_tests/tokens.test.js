const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require('../../config.js');
const { createToken } = require('../tokens.js');

describe('createToken', function() {
    test('works: worker', function() {
        const token = createToken({email: 'test@email.com', isWorker: true})
        const payload = jwt.verify(token, SECRET_KEY);
        expect(payload).toEqual({
            iat: expect.any(Number),
            email: 'test@email.com',
            isWorker: true
        })
    })

    test('works: user', function() {
        const token = createToken({email: 'test@email.com', isWorker: false})
        const payload = jwt.verify(token, SECRET_KEY);
        expect(payload).toEqual({
            iat: expect.any(Number),
            email: 'test@email.com',
            isWorker: false
        })
    })

    test('works: default not worker', function() {
        const token = createToken({email: 'test@email.com'})
        const payload = jwt.verify(token, SECRET_KEY);
        expect(payload).toEqual({
            iat: expect.any(Number),
            email: 'test@email.com',
            isWorker: false
        })
    })
})
