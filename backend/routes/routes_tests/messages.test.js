"use strict";

process.env.NODE_ENV = "test"

const request = require("supertest");
const app = require("../../app.js");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testUserIds,
    testMessageIds
} = require("./common.js");
const { NotFoundError, ExpressError } = require("../../expressError.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// ******** Tests ********

describe('GET route for conversation between two users', () => {
    test('works', async () => {
        expect.assertions(2)

        const result = await request(app)
            .get(`/messages/conversation/${testUserIds[0]}/${testUserIds[1]}`)

            const expectedConversation = [{
                body: 'jb6',
                created_at: expect.stringMatching(/.+/) //ignore dynamic timestamp
            },
            {
                body: 'jb5',
                created_at: expect.stringMatching(/.+/)
            },
            {
                body: 'jb4',
                created_at: expect.stringMatching(/.+/)
            }]

        expect(result.body.conversation.length).toBe(3);
        expect(result.body.conversation).toEqual(expectedConversation)
        
    })
})

describe('POST create a new message', () => {
    test('works', async () => {
        expect.assertions(3)
        // query the existing conversation -> length should be 3
        const convoRes = await request(app)
            .get(`/messages/conversation/${testUserIds[0]}/${testUserIds[1]}`)
        expect(convoRes.body.conversation.length).toBe(3);

        const message = {message: {
            body: 'jb7',
            sent_by: testUserIds[0],
            sent_to: testUserIds[1]
        }}

        const result = await request(app)
            .post(`/messages/create`)
            .send(message)

        expect(result.body).toEqual({ Message: 'Message sent'})

        // query the conversation again -> length should be 4
        const convoRes2 = await request(app)
            .get(`/messages/conversation/${testUserIds[0]}/${testUserIds[1]}`)
        expect(convoRes2.body.conversation.length).toBe(4);
    })

    test('works: error if invalid schema', async () => {
        expect.assertions(1)

        // missing body property
        const message = {message: {
            sent_by: testUserIds[0],
            sent_to: testUserIds[1]
        }}  
        
        try {
        const result = await request(app)
            .post(`/messages/create`)
            .send(message)
        } catch(err) {
            expect(err instanceof ExpressError).toBeTruthy();
        }

    })
})