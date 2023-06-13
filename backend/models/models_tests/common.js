"use strict";

const db = require("../../db.js");
const bcrypt = require("bcrypt");

const { BCRYPT_WORK_FACTOR } = require("../../config.js");

const testJobIds = [];
const testUserIds = [];
const testConvoIds = [];
const testMsgIds = [];
const testPayoutIds = [];

//********************* Setup *********************

async function commonBeforeAll() {
    // remove all users
    await db.query(`DELETE FROM users`);
    // remove all jobs
    await db.query(`DELETE FROM jobs`);
    // remove all conversations
    await db.query(`DELETE FROM conversations`);
    // remove all messages
    await db.query(`DELETE FROM messages`);
    // remove all applications
    await db.query(`DELETE FROM applications`);
    // remove all payouts
    await db.query(`DELETE FROM payouts`);

    // insert test users
    const userResults = await db.query(
        `INSERT INTO users(password, phone, first_name, last_name, email, is_worker)
        VALUES ($1, '1231231234', 'fn1', 'ln1', 'u1@email.com', false),
                ($2, '4324324321', 'fn2', 'ln2', 'u2@email.com', true),
                ($3, '2342342345', 'fn3', 'ln3', 'u3@email.com', false)
        RETURNING id`,
        [
            await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
            await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
            await bcrypt.hash("password3", BCRYPT_WORK_FACTOR)
        ]
    )

    // insert each test user id into the testUserIds array
    testUserIds.splice(0, 0, ...userResults.rows.map(r => r.id));

    // insert test jobs
    const jobResults = await db.query(
        `INSERT INTO jobs(title, 
                          body, 
                          status, 
                          address,
                          posted_by, 
                          assigned_to, 
                          start_time, 
                          end_time, 
                          payment_due, 
                          before_image_url, 
                          after_image_url)
        VALUES ('j1', 
                'jb1', 
                'completedj1', 
                '111 j street', 
                $1, 
                $2, 
                '2023-06-01 09:00:00', 
                '2023-06-01 10:00:00', 
                111.11, 
                'http://before1.img', 
                'http://after1.img'),

                ('j2',
                'jb2', 
                'completedj2', 
                '222 j street', 
                $3, 
                $4, 
                '2023-06-02 09:00:00', 
                '2023-06-02 10:00:00', 
                222.22, 
                'http://before2.img', 
                'http://after2.img'),
                
                ('j3',
                'jb3', 
                'startedj3', 
                '333 j street', 
                $5, 
                $6, 
                '2023-06-03 09:00:00', 
                NULL,  
                NULL, 
                'http://before3.img', 
                NULL)
        RETURNING id`,
                [testUserIds[0], testUserIds[1], testUserIds[2], testUserIds[1], testUserIds[0], testUserIds[1]]
    )

    // insert each job id into the testJobIds array
    testJobIds.splice(0, 0, ...jobResults.rows.map(r => r.id));


    // insert test applications
    await db.query(
        `INSERT INTO applications (applied_by, applied_to)
        VALUES ($1, $2),
                ($3, $4)`,
        [testUserIds[0], testJobIds[0], testUserIds[1], testJobIds[1]]
    )

    // insert into conversations
    const convoResults = await db.query(
        `INSERT INTO conversations(id, created_at)
        VALUES ($1, '2023-06-01 09:00:00'),
               ($2, '2023-06-03 10:00:00')
        RETURNING id`,
        [`u${testUserIds[0]}u${testUserIds[1]}`, `u${testUserIds[0]}u${testUserIds[2]}`]
    )

    // insert conversation ids into testConvoIds array
    testConvoIds.splice(0, 0, ...convoResults.rows.map(r => r.id));

    // insert test messages
    const msgResults = await db.query(
        `INSERT INTO messages(body, conversation_id, sent_by, sent_to, created_at)
        VALUES ('m1body', '${testConvoIds[0]}', $1, $2, '2023-06-01 09:00:00'),
                ('m2body', '${testConvoIds[0]}', $3, $4, '2023-06-01 09:05:00'),
                ('m3body', '${testConvoIds[0]}', $5, $6, '2023-06-02 10:00:00'),
                ('m4body', '${testConvoIds[1]}', $7, $8, '2023-06-03 10:00:00')
        RETURNING id`,
        [testUserIds[0], testUserIds[1], testUserIds[1], testUserIds[0], testUserIds[0], testUserIds[1], testUserIds[0], testUserIds[2]]
    )
    // insert message ids into testMsgIds array
    testMsgIds.splice(0, 0, ...msgResults.rows.map(r => r.id));
    
    // insert into reviews
    await db.query(
        `INSERT INTO reviews(title, body, stars, reviewed_by, reviewed_for)
        VALUES ('rt1', 'rb1', 1, $1, $2),
                ('rt2', 'rb2', 2, $3, $4),
                ('rt3', 'rb3', 3, $5, $6),
                ('rt4', 'rb4', 4, $7, $8)`,
                [testUserIds[0], testUserIds[1], testUserIds[2], testUserIds[1], testUserIds[1], testUserIds[0], testUserIds[1], testUserIds[2]]
    )

    // insert into payouts
    const payoutResults = await db.query(
        `INSERT INTO payouts (trans_to, trans_by, subtotal, tax, tip, total, created_at)
        VALUES ($1, $2, 1000.00, 38.00, 35.00, 1074.00, '2023-04-30 10:00:00'),
               ($3, $4, 900.00, 38.00, 35.00, 974.00, '2023-05-15 10:00:00'),
               ($5, $6, 800.00, 38.00, 35.00, 874.00, '2023-05-31 10:00:00')`,
        [testUserIds[0], testUserIds[1], testUserIds[0], testUserIds[1], testUserIds[0], testUserIds[1]]
    )

    // insert payout ids into testPayoutIds array
    testPayoutIds.splice(0, 0, ...payoutResults.rows.map(r => r.id));
}

// isolate changes made during tests to allow for rollback
async function commonBeforeEach() {
    await db.query("BEGIN");
}

//********************* Teardown *********************


async function commonAfterEach() {
    await db.query("ROLLBACK");
  }

  async function commonAfterAll() {
    await db.end();
  }

  module.exports = {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testJobIds,
    testUserIds,
    testConvoIds,
    testMsgIds,
    testPayoutIds
  }