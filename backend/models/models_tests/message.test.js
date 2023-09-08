"use strict";

const db = require("../../db.js");
const { NotFoundError } = require("../../expressError.js");
const Message = require("../message.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testUserIds,
  testJobIds
} = require("./common.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

//********* Tests *********

describe('gets messages between two users', function() {
    test('works', async function() {
        // pass first test user and second test user id's to getConversation function
        const result = await Message.getConversation(testUserIds[0], testUserIds[1], testJobIds[1]);

        // should have 3 test messages between these two users
        expect(result.length).toBe(3)
        
        // first message should be latest message chronologically
        expect(result[2]).toEqual({
            body: 'm3body',
            created_at: '06/02/2023 10:00 AM',
            id: expect.any(Number)
        })
        expect(result[1]).toEqual({
            body: 'm2body',
            created_at: '06/01/2023 09:05 AM',
            id: expect.any(Number)
        })
        expect(result[0]).toEqual({
            body: 'm1body',
            created_at: '06/01/2023 09:00 AM',
            id: expect.any(Number)
        })
    })
    test('no error if no messages found', async function() {
        try {
            await Message.getConversation(testUserIds[2], testUserIds[3]);
        } catch(err) {
            expect(err instanceof NotFoundError).toBeFalsy();
        }
    })
})

describe('gets all messages involving a single user', function() {
    test('works', async function() {
        // pass first test user and second test user id's to getConversation function
        const result = await Message.getAllMessagesInvolving(testUserIds[0]);

        // should have 4 test messages between these two users
        expect(result.length).toBe(4)
        
        // first message should be latest message chronologically
        expect(result[3]).toEqual({
            body: 'm4body',
            created_at: '06/03/2023 10:00 AM',
            conversationid: expect.any(String),
            id: expect.any(Number),
            sentby: expect.any(Number),
            sentto: expect.any(Number)
        })
        expect(result[2]).toEqual({
            body: 'm3body',
            created_at: '06/02/2023 10:00 AM',
            conversationid: expect.any(String),
            id: expect.any(Number),
            sentby: expect.any(Number),
            sentto: expect.any(Number)
        })
        expect(result[1]).toEqual({
            body: 'm2body',
            created_at: '06/01/2023 09:05 AM',
            conversationid: expect.any(String),
            id: expect.any(Number),
            sentby: expect.any(Number),
            sentto: expect.any(Number)
        })
        expect(result[0]).toEqual({
            body: 'm1body',
            created_at: '06/01/2023 09:00 AM',
            conversationid: expect.any(String),
            id: expect.any(Number),
            sentby: expect.any(Number),
            sentto: expect.any(Number)
        })
    })

    test('no error if no messages found', async function() {
        try {
            await Message.getAllMessagesInvolving(99999999);
        } catch(err) {
            expect(err instanceof NotFoundError).toBeFalsy();
        }
    })

})

describe('gets all recent messages from conversations involving a single user', function() {
    test('works', async function() {
        // pass first test user and second test user id's to getConversation function
        const result = await Message.getRecentConvoMessagesInvolving(testUserIds[0]);

        // should have 2 test messages between these two users
        expect(result.length).toBe(1)

        expect(result[0]).toEqual({
            id: expect.any(Number),
            body: 'm4body',
            convo_id: expect.any(String),
            created_at: "06/03/2023 10:00 AM",
            sent_by: testUserIds[0],
            sent_to: testUserIds[2]
        })

    })

    test('no error if no messages found', async function() {
        try {
            await Message.getRecentConvoMessagesInvolving(999999999999);
        } catch(err) {
            expect(err instanceof NotFoundError).toBeFalsy();
        }
    })
})



describe('create new message', function() {
    test('works', async function() {
        const newMsgData = {
            body: 'mb4',
            sent_by: testUserIds[2],
            sent_to: testUserIds[1],
            job_id: testJobIds[1]
        }

        const result = await Message.create(newMsgData);

        // use expectedMessage to help omit current timestamp value from test
        const expectedMessage = {
            body: 'mb4',
            conversation_id: `u${testUserIds[1]}u${testUserIds[2]}j${testJobIds[1]}`,
            sent_by: testUserIds[2],
            sent_to: testUserIds[1]
        }

        expect(result).toMatchObject(expectedMessage);
    })

    test('inserts into conversations table', async function() {
        const newMsgData = {
            body: 'mb4',
            sent_by: testUserIds[2],
            sent_to: testUserIds[1],
            job_id: testUserIds[1]
        }

        const convoResult = await db.query(`SELECT id FROM conversations`);
        // should have 2 test conversations
        expect(convoResult.rows.length).toBe(2);

        // add a new message
        await Message.create(newMsgData);

        const convoResult2 = await db.query(`SELECT id FROM conversations`);
        // should now have 3 conversations
        expect(convoResult2.rows.length).toBe(3);
    })

    test('does not insert duplicate ids into conversation table', async function() {
        const newMsgData = {
            body: 'mb4',
            sent_by: testUserIds[0],
            sent_to: testUserIds[1],
            job_id: testJobIds[1]
        }

        const convoResult = await db.query(`SELECT id FROM conversations`);
        // should have 2 test conversations
        expect(convoResult.rows.length).toBe(2);

        // add a new message with same user ids as existing conversation
        await Message.create(newMsgData);

        const convoResult2 = await db.query(`SELECT id FROM conversations`);
        // should still have only 2 conversations
        expect(convoResult2.rows.length).toBe(2);
    })

})


describe('generates unique conversation ids', function() {
    test('output should be format `u + <lesser value> + u + <greater value> + j + <job_id>', function() {
        expect(Message.generateConvoId(3, 4, 1)).toEqual('u3u4j1');
        expect(Message.generateConvoId(8, 2, 2)).toEqual('u2u8j2');
        expect(Message.generateConvoId(88, 102, 3)).toEqual('u88u102j3');
    })
})