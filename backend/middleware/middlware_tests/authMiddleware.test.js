
process.env.NODE_ENV = "test";

const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../../expressError.js");
const {
    authenticateJWT,
    ensureLoggedIn,
    ensureIsWorker,
    ensureCorrectUserOrAdmin
} = require("../auth.js");

const { SECRET_KEY } = require("../../config.js");

const testJwt = jwt.sign({email: "test@email.com", isWorker: false, isAdmin: true}, SECRET_KEY);
const badTestJwt = jwt.sign({email: "test@email.com", isWorker: false, isAdmin: false}, "nope");

describe('authenticateJWT', function() {
    test('works', function() {
        expect.assertions(2);
        const req = { headers: { authorization: `Bearer ${testJwt}`} }
        const res = {};
        const next = function(err) {
            expect(err).toBeFalsy();
        }
        authenticateJWT(req, res, next);
        expect(req.user).toEqual(
            {
                iat: expect.any(Number),
                email: "test@email.com",
                isWorker: false,
                isAdmin: true
            }
        );
    });

    test('works: no header', function() {
        expect.assertions(1);
        const req = {};
        const res = {};
        const next = function(err) {
            expect(err).toBeFalsy();
        }
        authenticateJWT(req, res, next);

    });

    test('works: bad token', function() {
        expect.assertions(1);
        const req = { headers: { authorization: `Bearer ${badTestJwt}`} };
        const res = {};
        const next = function(err) {
            expect(err).toBeFalsy();
        }
        authenticateJWT(req, res, next);

    });
});

describe('ensureLoggedIn', function() {
    test('works', function() {
        expect.assertions(1);
        const req = { user: 'test@email.com' };
        const res = {};
        const next = function(err) {
            expect(err).toBeFalsy();
        }
        ensureLoggedIn(req, res, next);
    });

    test('works: no user', function() {
        expect.assertions(1);
        const req = {};
        const res = {};
        const next = function(err) {
            expect(err).toBeTruthy();
        }
        ensureLoggedIn(req, res, next);
    });
});

describe('ensureWorker', function() {
    test('works: user and worker', function() {
        expect.assertions(1);
        const req = {user: {email: 'test1@email.com', isWorker: true}};
        const res = {};
        const next = function(err) {
            expect(err instanceof UnauthorizedError).toBeFalsy();
        }
        ensureIsWorker(req, res, next)
    });


    test('works: user and not worker', function() {
        expect.assertions(1);
        const req = {user: {email: 'test1@email.com', isWorker: false}};
        const res = {};
        const next = function(err) {
            expect(err instanceof UnauthorizedError).toBeTruthy();
        }
        ensureIsWorker(req, res, next)
    });

    test('works: no user', function() {
        expect.assertions(1);
        const req = {};
        const res = {};
        const next = function(err) {
            expect(err instanceof UnauthorizedError).toBeTruthy();
        }
        ensureIsWorker(req, res, next)
    });
});

describe('ensureCorrectUserOrAdmin', function() {

    test('works: id matches', function() {
        expect.assertions(1);
        const req = { params: {id: 1}, user: {id: 1, email: 'u5@email.com', isWorker: false, isAdmin: false}};
        const res = {};
        const next = function(err) {
            expect(err instanceof UnauthorizedError).toBeFalsy();
        }
        ensureCorrectUserOrAdmin(req, res, next);
    });

    test('works: admin is authorized', function() {
        expect.assertions(1);
        const req = { params: {id: 1}, user: {id: 3, email: 'u7@email.com', isWorker: false, isAdmin: true}};
        const res = {};
        const next = function(err) {
            expect(err instanceof UnauthorizedError).toBeFalsy();
        }
        ensureCorrectUserOrAdmin(req, res, next);
    });

    test('works: unauthorized', function() {
        expect.assertions(1);
        const req = { params: {id: 1}, user: {id: 3, email: 'test1@email.com', isWorker: false, isAdmin: false}};
        const res = {};
        const next = function(err) {
            expect(err instanceof UnauthorizedError).toBeTruthy();
        }
        ensureCorrectUserOrAdmin(req, res, next);
    });

    test('works: no user', function() {
        expect.assertions(1);
        const req = { params: {id: 1}};
        const res = {};
        const next = function(err) {
            expect(err instanceof UnauthorizedError).toBeTruthy();
        }
        ensureCorrectUserOrAdmin(req, res, next);
    });

});