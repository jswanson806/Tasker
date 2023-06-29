"use strict";

const db = require("../../db.js");
const User = require("../../models/user.js");
const Job = require("../../models/job.js");
const Message = require("../../models/message.js")
const Review = require("../../models/review.js");
const Payout = require("../../models/payout.js");

const { createToken } = require("../../helpers/tokens.js");

const testJobIds = [];
const testUserIds = [];
const testReviewIds = [];
const testMessageIds = [];
const testPayoutIds = [];

async function commonBeforeAll() {

  await db.query("DELETE FROM users");

  await db.query("DELETE FROM jobs");

  await db.query("DELETE FROM applications");

  await db.query("DELETE FROM conversations")

  await db.query("DELETE FROM reviews");

  await db.query("DELETE FROM messages");

  await db.query("DELETE FROM payouts");

  /** Test Users */
  
  testUserIds[0] = (await User.register(
      {
        email: 'u4@email.com',
        password: 'password',
        firstName: 'fn4',
        lastName: 'ln4',
        isWorker: false,
        isAdmin: true,
        phone: '444-444-4444'
      })).id;
  testUserIds[1] = (await User.register(
      {
        email: 'u5@email.com',
        password: 'password',
        firstName: 'fn5',
        lastName: 'ln5',
        isWorker: false,
        isAdmin: false,
        phone: '555-555-5555'
      })).id;
  testUserIds[2] = (await User.register(
      {
        email: 'u6@email.com',
        password: 'password',
        firstName: 'fn6',
        lastName: 'ln6',
        isWorker: false,
        isAdmin: false,
        phone: '666-666-6666'
      })).id;
  
/** Test Jobs */

  testJobIds[0] = (await Job.create(
    { 
        title: 'j4', 
        body: 'jb4',  
        address: '444 j street',
        posted_by: testUserIds[0], 
        before_image_url: 'http://before4.img', 
    })).id;

  testJobIds[1] = (await Job.create(
    { 
        title: 'j5', 
        body: 'jb5',  
        address: '555 j street',
        posted_by: testUserIds[0], 
        before_image_url: 'http://before5.img', 
    })).id;

  testJobIds[2] = (await Job.create(
    { 
        title: 'j6', 
        body: 'jb6',  
        address: '666 j street',
        posted_by: testUserIds[0], 
        before_image_url: 'http://before6.img', 
    })).id;


  await User.applyToJob(testUserIds[1], testJobIds[0]);

  /** Test Messages */

  testMessageIds[0] = (await Message.create(
    { 
        body: 'jb4',  
        sent_to: testUserIds[0],
        sent_by: testUserIds[1]
    })).id;
  testMessageIds[1] = (await Message.create(
    { 
        body: 'jb5',  
        sent_to: testUserIds[0],
        sent_by: testUserIds[1]
    })).id;
  testMessageIds[2] = (await Message.create(
    { 
        body: 'jb6',  
        sent_to: testUserIds[0],
        sent_by: testUserIds[1] 
    })).id;



/** Test Reviews */
testReviewIds[0] = (await Review.create(
  { 
    title: 'rt1', 
    body: 'rb1', 
    stars: 1,
    reviewed_by: testUserIds[0],
    reviewed_for: testUserIds[1] 
  })).id;
  
  testReviewIds[1] = (await Review.create(
  { 
    title: 'rt2', 
    body: 'rb2', 
    stars: 2,
    reviewed_by: testUserIds[0],
    reviewed_for: testUserIds[1] 
  })).id;
  
  testReviewIds[2] = (await Review.create(
    { 
      title: 'rt3', 
      body: 'rb3', 
      stars: 3,
      reviewed_by: testUserIds[0],
      reviewed_for: testUserIds[1] 
    })).id;



  /** Test Payouts */
  testPayoutIds[0] = (await Payout.create(
    {
      trans_to: testUserIds[0],
      trans_by: testUserIds[1],
      subtotal: 50.00,
      tax: 2.00,
      tip: 5.00,
      total: 57.00
  })).id;

  testPayoutIds[1] = (await Payout.create(
    {
      trans_to: testUserIds[0],
      trans_by: testUserIds[1],
      subtotal: 60.00,
      tax: 3.00,
      tip: 6.00,
      total: 69.00
  })).id;

  testPayoutIds[2] = (await Payout.create(
    {
      trans_to: testUserIds[0],
      trans_by: testUserIds[1],
      subtotal: 40.00,
      tax: 1.00,
      tip: 4.00,
      total: 45.00
  })).id;

}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


const u1Token = createToken({id: 1, email: "u7@email.com", isWorker: false, isAdmin: true });
const u2Token = createToken({id: 2, email: "u8@email.com", isWorker: true, isAdmin: false });
const u3Token = createToken({id: testUserIds[1], email: "u5@email.com", isWorker: false, isAdmin: false });
const adminToken = createToken({id: 3, email: "u4@email.com", isWorker: false, isAdmin: true });


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testJobIds,
  testUserIds,
  testMessageIds,
  testReviewIds,
  testPayoutIds,
  u1Token,
  u2Token,
  u3Token,
  adminToken,
};