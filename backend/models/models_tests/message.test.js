"use strict";

const db = require("../../db.js");
const { NotFoundError } = require("../../expressError.js");
const Message = require("../message.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testUserIds
} = require("./common.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

//********* Tests *********

describe('gets messages between two users', function() {
    test('works', async function() {
        // pass first test user and second test user id's to getConversation function
        const result = await Message.getConversation(testUserIds[0], testUserIds[1]);

        // should have 3 test messages between these two users
        expect(result.length).toBe(3)
        
        // first message should be latest message chronologically
        expect(result[0]).toEqual({
            body: 'm3body',
            to_char: '06/02/2023 10:00 AM'
        })
        expect(result[1]).toEqual({
            body: 'm2body',
            to_char: '06/01/2023 09:05 AM'
        })
        expect(result[2]).toEqual({
            body: 'm1body',
            to_char: '06/01/2023 09:00 AM'
        })
    })

    test('error if no messages between these users', async function() {
        try {
            const result = await Message.getConversation(testUserIds[2], testUserIds[3]);
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    })
})


describe('create new message', function() {
    test('works', async function() {
        const newMsgData = {
            body: 'mb4',
            sent_by: testUserIds[2],
            sent_to: testUserIds[1]
        }

        const result = await Message.create(newMsgData);

        // use expectedMessage to help omit current timestamp value from test
        const expectedMessage = {
            body: 'mb4',
            conversation_id: `u${testUserIds[1]}u${testUserIds[2]}`,
            sent_by: testUserIds[2],
            sent_to: testUserIds[1]
        }

        expect(result).toMatchObject(expectedMessage);
    })

    test('inserts into conversations table', async function() {
        const newMsgData = {
            body: 'mb4',
            sent_by: testUserIds[2],
            sent_to: testUserIds[1]
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
            sent_to: testUserIds[1]
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
    test('output should be format `u + <lesser value> + u + <greater value>', function() {
        expect(Message.generateConvoId(3, 4)).toEqual('u3u4');
        expect(Message.generateConvoId(8, 2)).toEqual('u2u8');
        expect(Message.generateConvoId(88, 102)).toEqual('u88u102');
    })
})