"use strict";

process.env.NODE_ENV = "test";

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../../expressError.js");
const User = require("../user.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testJobIds,
  testUserIds
} = require("./common.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

const newUserData = {
    email: 'u4@email.com',
    password: 'password',
    firstName: 'fn4',
    lastName: 'ln4',
    isWorker: false,
    isAdmin: false,
    phone: '9999999999'
}

const duplicateUserData = {
    email: 'u1@email.com',
    password: 'password',
    firstName: 'fn5',
    lastName: 'ln5',
    isWorker: false,
    isAdmin: false,
    phone: '8888888888'
}

// ************ authenticate ************

describe('authenticate user', function() {
    test('works', async function(){
        const user = await User.authenticate("u1@email.com", "password1");
        expect(user).toEqual({
            firstName: 'fn1',
            lastName: 'ln1',
            phone: '1231231234',
            email: 'u1@email.com',
            isWorker: false,
            isAdmin: false
        });
    });

    test('unauth if user not found', async function() {
        try{
            await User.authenticate("invalid", "password")
        } catch (err) {
            expect(err instanceof UnauthorizedError).toBeTruthy();
        }
    })

    test('unauth if password is invalid', async function() {
        try{
            await User.authenticate("u1@email.com", "wrong");
        } catch(err) {
            expect(err instanceof UnauthorizedError).toBeTruthy();
        }
    })

});

describe('register new user', function() {
    

    test('works', async function() {
        const newUser = await User.register(newUserData);

        expect(newUser).toMatchObject({
            firstName: 'fn4',
            lastName: 'ln4',
            phone: '9999999999',
            email: 'u4@email.com',
            isWorker: false,
            isAdmin: false
        })
    })

    test('error if duplicate email exists in db', async function() {
        try{
            const newUser = await User.register(duplicateUserData);
        } catch(err){
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    })

})

describe('find all users', function(){
    test('works', async function() {
        const result = await User.findAll();
        expect(result.length).toEqual(3);
    })
})

describe('retrieves a single user, with applications and avg review star rating', function() {
    test('works', async function() {
        const result = await User.get(testUserIds[0]);
        expect(result).toEqual({
            id: testUserIds[0],
            firstName: 'fn1',
            lastName: 'ln1',
            phone: '1231231234',
            email: 'u1@email.com',
            isWorker: false,
            isAdmin: false,
            applications: [testJobIds[0]],
            avgRating: 3
        })
    })

    test('error if user not found', async function() {
        try {
            await User.get(testUserIds[0]);
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    })
})

describe('updates a user', function() {
    const data = {
        first_name: 'updatedFn1',
        last_name: 'updatedLn1',
        phone: '1111111111',
        password: 'updatedpassword'
    }

    test('works', async function() {
        const result = await User.update(testUserIds[0], data)
        expect(result).toEqual({
            email: "u1@email.com",
            firstName: 'updatedFn1',
            lastName: 'updatedLn1',
            phone: '1111111111',
            isWorker: false,
            isAdmin: false
        })
        // old password does not work after update
        try {
            await User.authenticate('u1@email.com', 'password');
        } catch(err) {
            expect(err instanceof UnauthorizedError).toBeTruthy();
        }
        // new password works
        try {
            await User.authenticate('u1@email.com', 'updatedpassword');
        } catch(err) {
            expect(err instanceof UnauthorizedError).toBeFalsy();
        }
    })

    test('error if user is not found', async function() {
        try{
            await User.update(testUserIds[4], data)
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    })
})

describe('removes a user', function() {
    test('works', async function() {
        // query an existing user
        const result = await User.get(testUserIds[0]);
        expect(result).toEqual({
            id: testUserIds[0],
            firstName: 'fn1',
            lastName: 'ln1',
            phone: '1231231234',
            email: 'u1@email.com',
            isWorker: false,
            isAdmin: false,
            applications: [testJobIds[0]],
            avgRating: 3
        })

        // remove the same user that was just queried
        await User.remove(testUserIds[0]);

        // query the same user again
        try {
            await User.get(testUserIds[0]);
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    })

    test('error if no valid user found', async function() {
        try {
            await User.remove(testUserIds[4]);
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    })
})

describe('applies to a job', function () {
    test('works', async function() {
        // query an existing user
        const result = await User.get(testUserIds[0]);
        // length of applications array should be 1
        expect(result.applications.length).toBe(1)
        // first test job's id should be in applications array
        expect(result.applications[0]).toBe(testJobIds[0])

        // add a new application for test job 2
        await User.applyToJob(testUserIds[0], testJobIds[1]);

        // query an existing user
        const result3 = await User.get(testUserIds[0]);
        // length of applications array should be 2
        expect(result3.applications.length).toBe(2)
        // first test job's id should be in applications array
        expect(result3.applications[1]).toBe(testJobIds[1])
    })

    test('error if not a valid user', async function() {
        try {
            await User.applyToJob(99999999, testJobIds[1]);
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    })

    test('error if not a valid job', async function() {
        try {
            await User.applyToJob(testUserIds[0], 99999999);
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    })
})