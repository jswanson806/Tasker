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
    u3Token,
    testJobIds
} = require("./common.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// ******** Tests ********

describe('GET route for conversation between two users', () => {
    test('works', async () => {
        expect.assertions(2)

        const result = await request(app)
            .get(`/messages/conversation/${testUserIds[0]}/${testUserIds[1]}/${testJobIds[1]}`)
            .set('authorization', `Bearer ${u3Token}`)

            const expectedConversation = [{
                body: 'jb6',
                createdat: expect.stringMatching(/.+/) //ignore dynamic timestamp
            },
            {
                body: 'jb5',
                createdat: expect.stringMatching(/.+/)
            },
            {
                body: 'jb4',
                createdat: expect.stringMatching(/.+/)
            }]

        expect(result.body.conversation.length).toBe(3);
        expect(result.body.conversation).toEqual(expectedConversation)
        
    })

    test('error if not logged in', async () => {
        expect.assertions(1)

        const result = await request(app)
            .get(`/messages/conversation/${testUserIds[0]}/${testUserIds[1]}/${testJobIds[1]}`)
            
        expect(result.status).toBe(401);
        
    })
})

describe('GET route for messages involving a particular user', () => {
    test('works', async () => {
        expect.assertions(2)

        const result = await request(app)
            .get(`/messages/${testUserIds[0]}`)
            .set('authorization', `Bearer ${u3Token}`)

            const expectedMessages = [{
                id: expect.any(Number),
                body: 'jb4',
                createdat: expect.stringMatching(/.+/), //ignore dynamic timestamp
                conversationid: expect.any(String),
                sentby: testUserIds[1],
                sentto: testUserIds[0]
            },
            {
                id: expect.any(Number),
                body: 'jb5',
                createdat: expect.stringMatching(/.+/),
                conversationid: expect.any(String),
                sentby: testUserIds[1],
                sentto: testUserIds[0]
            },
            {
                id: expect.any(Number),
                body: 'jb6',
                createdat: expect.stringMatching(/.+/),
                conversationid: expect.any(String),
                sentby: testUserIds[1],
                sentto: testUserIds[0]
            }]

        expect(result.body.messages.length).toBe(3);
        expect(result.body.messages).toEqual(expectedMessages)
        
    })

    test('error if not logged in', async () => {
        expect.assertions(1)

        const result = await request(app)
            .get(`/messages/${testUserIds[0]}`)
            
        expect(result.status).toBe(401);
        
    })
})

describe('GET route for recent messages involving a particular user', () => {
    test('works', async () => {
        expect.assertions(2)

        const result = await request(app)
            .get(`/messages/conversations/${testUserIds[0]}`)
            .set('authorization', `Bearer ${u3Token}`)

            const expectedMessages = [
                {
                    id: expect.any(Number),
                    convo_id: expect.any(String),
                    body: 'jb6',
                    created_at: expect.stringMatching(/.+/),
                    sent_by: testUserIds[1],
                    sent_to: testUserIds[0]
                }
            ]

        expect(result.body.recentMessages.length).toBe(1);
        expect(result.body.recentMessages).toEqual(expectedMessages)
        
    })

    test('error if not logged in', async () => {
        expect.assertions(1)

        const result = await request(app)
            .get(`/messages/${testUserIds[0]}`)
            
        expect(result.status).toBe(401);
        
    })
})

describe('POST create a new message', () => {
    test('works', async () => {
        expect.assertions(3)
        // query the existing conversation -> length should be 3
        const convoRes = await request(app)
            .get(`/messages/conversation/${testUserIds[0]}/${testUserIds[1]}/${testJobIds[1]}`)
            .set('authorization', `Bearer ${u3Token}`)

        expect(convoRes.body.conversation.length).toBe(3);

        const message = {message: {
            body: 'jb7',
            sent_by: testUserIds[0],
            sent_to: testUserIds[1],
            job_id: testJobIds[1]
        }}

        const result = await request(app)
            .post(`/messages/create`)
            .set('authorization', `Bearer ${u3Token}`)
            .send(message)

        expect(result.body).toEqual({ Message: 'Message sent'})

        // query the conversation again -> length should be 4
        const convoRes2 = await request(app)
            .get(`/messages/conversation/${testUserIds[0]}/${testUserIds[1]}/${testJobIds[1]}`)
            .set('authorization', `Bearer ${u3Token}`)
        expect(convoRes2.body.conversation.length).toBe(4);
    })

    test('works: error if invalid schema', async () => {
        expect.assertions(1)

        // missing body property
        const message = {message: {
            sent_by: testUserIds[0],
            sent_to: testUserIds[1]
        }}  
        
        const result = await request(app)
            .post(`/messages/create`)
            .set('authorization', `Bearer ${u3Token}`)
            .send(message)

        expect(result.body).toEqual({
            error: {
              message: [ 'instance.message requires property "body"' ],
              status: 404
            }
          })

    })

    test('error if not logged in', async () => {
        expect.assertions(1)

        // missing body property
        const message = {message: {
            sent_by: testUserIds[0],
            sent_to: testUserIds[1],
            body: 'test',
            job_id: testUserIds[1]
        }}  
        
        const result = await request(app)
            .post(`/messages/create`)
            .send(message)

        expect(result.status).toBe(401);

    })
})