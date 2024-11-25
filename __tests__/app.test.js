const endpointsJson = require("../endpoints.json");

/* Set up your test imports here */
const db = require(`${__dirname}/../db/connection`);
const request = require("supertest");
const app = require(`${__dirname}/../app`);
const seed = require(`${__dirname}/../db/seeds/seed`);
const data = require(`${__dirname}/../db/data/test-data/index`);

/* Set up your beforeEach & afterAll functions here */

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});
