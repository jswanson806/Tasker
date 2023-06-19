"use strict";

const db = require("../../db.js");
const User = require("../../models/user.js");
const Job = require("../../models/job.js");
const { createToken } = require("../../helpers/tokens.js");

const testJobIds = [];
const testUserIds = [];

async function commonBeforeAll() {

  await db.query("DELETE FROM users");

  await db.query("DELETE FROM jobs");

  await db.query("DELETE FROM applications");

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


const u1Token = createToken({ email: "u5@email.com", isWorker: false, isAdmin: false });
const u2Token = createToken({ email: "u6@email.com", isWorker: true, isAdmin: false });
const adminToken = createToken({ email: "u4@email.com", isWorker: false, isAdmin: true });


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testJobIds,
  testUserIds,
  u1Token,
  u2Token,
  adminToken,
};