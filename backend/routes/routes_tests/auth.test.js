"use strict";

process.env.NODE_ENV = "test"

const request = require("supertest");
const app = require("../../app.js");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
} = require("./common.js");
const { UnauthorizedError } = require("../../expressError.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);
/************************************** POST /auth/token */

describe("POST /auth/token", function () {
  test("works", async function () {
      expect.assertions(1)
    const resp = await request(app)
        .post("/auth/token")
        .send({
          email: "u4@email.com",
          password: "password",
        });
    expect(resp.body).toEqual({
      "token": expect.any(String),
    });
  });

  test("unauth with non-existent user", async function () {
    expect.assertions(1);
  
    const resp = await request(app)
        .post("/auth/token")
        .send({
        email: "no-such-user@email.com",
        password: "password1",
        });

    expect(resp.statusCode).toEqual(401);
    
  });

  test("unauth with wrong password", async function () {
    const resp = await request(app)
        .post("/auth/token")
        .send({
          email: "u4@email.com",
          password: "nope",
        });
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
        .post("/auth/token")
        .send({
          email: "u4@email.com",
        });
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
        .post("/auth/token")
        .send({
          email: 42,
          password: "above-is-a-number",
        });
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** POST /auth/register */

describe("POST /auth/register", function () {
  test("works for anon", async function () {
    const resp = await request(app)
        .post("/auth/register")
        .send({user:{
          email: "new@email.com",
          firstName: "first",
          lastName: "last",
          phone: '(444)444-4444',
          password: "Password1",
        }});
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      "token": expect.any(String),
    });
  });

  test("bad request with missing fields", async function () {
    const resp = await request(app)
        .post("/auth/register")
        .send({user:{
            email: "new@email.com",
            firstName: "first",
          }});
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
        .post("/auth/register")
        .send({user:{
            email: "not-an-email",
            firstName: "first",
            lastName: "last",
            phone: '4444444444',
            password: "Password1",
          }});
    expect(resp.statusCode).toEqual(400);
  });
});