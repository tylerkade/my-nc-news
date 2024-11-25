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

describe("GET /api/topics", () => {
  test("200: Responds with all of the topics in the database", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });

  test("404: Responds with a not found error message", () => {
    return request(app)
      .get("/api/not-a-route")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("not found");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with the article with the specficied article_id", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });

  test("404: Responds with an article not found error message", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("article not found");
      });
  });

  test("400: Responds with an bad request error message", () => {
    return request(app)
      .get("/api/articles/not-an-id")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("bad request");
      });
  });
});

describe("GET /api/articles/", () => {
  test("200: Responds with an array of articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
          expect(typeof article.comment_count).toBe("number");
          /*
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
          */
          expect(article).not.toMatchObject({
            body: expect.any(String),
          });
          if (article.article_id === 1) {
            expect(article.comment_count).toBe(11);
          }
        });
      });
  });

  test("200: Responds with an array of articles sorted by date (DESC)", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});
