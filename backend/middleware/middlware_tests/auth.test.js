
process.env.NODE_ENV = "test";

const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../../expressError.js");
const {
    authenticateJWT,
    ensureLoggedIn,
    ensureWorker,
    ensureCorrectUserOrAdmin
} = require("../auth.js");

const { SECRET_KEY } = require("../../config.js");

const testJwt = jwt.sign({email: "test@email.com", isWorker: false, isAdmin: true}, SECRET_KEY);
const badTestJwt = jwt.sign({email: "test@email.com", isWorker: false, isAdmin: false}, "nope");

describe('authenticateJWT', function() {
    test('works', function() {
        expect.assertions(2);
        const req = { headers: { authorization: `Bearer ${testJwt}`} }
        const res = { locals: {} };
        const next = function(err) {
            expect(err).toBeFalsy();
        }
        authenticateJWT(req, res, next);
        expect(res.locals).toEqual({
            user: {
                iat: expect.any(Number),
                email: "test@email.com",
                isWorker: false,
                isAdmin: true
            }
        })
    })

    test('works: no header', function() {
        expect.assertions(2);
        const req = {};
        const res = { locals: {} };
        const next = function(err) {
            expect(err).toBeFalsy();
        }
        authenticateJWT(req, res, next);
        expect(res.locals).toEqual({});
    })

    test('works: bad token', function() {
        expect.assertions(2);
        const req = { headers: { authorization: `Bearer ${badTestJwt}`} };
        const res = { locals: {} };
        const next = function(err) {
            expect(err).toBeFalsy();
        }
        authenticateJWT(req, res, next);
        expect(res.locals).toEqual({});
    })
})

describe('ensureLoggedIn', function() {
    test('works', function() {
        expect.assertions(1);
        const req = {};
        const res = { locals: {user: 'test@email.com'} };
        const next = function(err) {
            expect(err).toBeFalsy();
        }
        ensureLoggedIn(req, res, next);
    })

    test('works: no user', function() {
        expect.assertions(1);
        const req = {};
        const res = { locals: {} };
        const next = function(err) {
            expect(err).toBeTruthy();
        }
        ensureLoggedIn(req, res, next);
    })
})

describe('ensureWorker', function() {
    test('works: user and worker', function() {
        expect.assertions(1);
        const req = {};
        const res = { locals: {user: {email: 'test1@email.com', isWorker: true}}};
        const next = function(err) {
            expect(err instanceof UnauthorizedError).toBeFalsy();
        }
        ensureWorker(req, res, next)
    })


    test('works: user and not worker', function() {
        expect.assertions(1);
        const req = {};
        const res = { locals: {user: {email: 'test1@email.com', isWorker: false}}};
        const next = function(err) {
            expect(err instanceof UnauthorizedError).toBeTruthy();
        }
        ensureWorker(req, res, next)
    })

    test('works: no user', function() {
        expect.assertions(1);
        const req = {};
        const res = { locals: {}};
        const next = function(err) {
            expect(err instanceof UnauthorizedError).toBeTruthy();
        }
        ensureWorker(req, res, next)
    })
})

describe('ensureCorrectUserOrAdmin', function() {

    test('works: email matches', function() {
        expect.assertions(1);
        const req = { params: {email: 'test@email.com'}};
        const res = { locals: {user: {email: 'test@email.com', isWorker: false, isAdmin: false}}};
        const next = function(err) {
            expect(err instanceof UnauthorizedError).toBeFalsy();
        }
        ensureCorrectUserOrAdmin(req, res, next);
    })

    test('works: admin is authorized', function() {
        expect.assertions(1);
        const req = { params: {email: 'test@email.com'}};
        const res = { locals: {user: {email: 'test1@email.com', isWorker: false, isAdmin: true}}};
        const next = function(err) {
            expect(err instanceof UnauthorizedError).toBeFalsy();
        }
        ensureCorrectUserOrAdmin(req, res, next);
    })

    test('works: unauthorized', function() {
        expect.assertions(1);
        const req = { params: {email: 'test@email.com'}};
        const res = { locals: {user: {email: 'test1@email.com', isWorker: false, isAdmin: false}}};
        const next = function(err) {
            expect(err instanceof UnauthorizedError).toBeTruthy();
        }
        ensureCorrectUserOrAdmin(req, res, next);
    })

    test('works: no user', function() {
        expect.assertions(1);
        const req = { params: {email: 'test@email.com'}};
        const res = { locals: {}};
        const next = function(err) {
            expect(err instanceof UnauthorizedError).toBeTruthy();
        }
        ensureCorrectUserOrAdmin(req, res, next);
    })
    

})