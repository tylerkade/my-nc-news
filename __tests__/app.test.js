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

  test("404: Responds with a not found error message when an incorrect route is given", () => {
    return request(app)
      .get("/api/not-a-route")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("not found");
      });
  });
});

describe("/api/articles/:article_id", () => {
  describe("GET", () => {
    test("200: Responds with the article with the specficied article_id", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: 2,
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

    describe("?comment_count=[true/any-string]", () => {
      test("200: Responds with an article object with a comment_count property", () => {
        return request(app)
          .get("/api/articles/1?comment_count=true")
          .expect(200)
          .then(({ body }) => {
            const { article } = body;
            expect(article.article_id).toBe(1);
            expect(article.comment_count).toBe(11);
          });
      });

      test("200: Responds with an article object without a comment_count property when given any value that is not 'true'", () => {
        return request(app)
          .get("/api/articles/1?comment_count=any-value-including-false")
          .expect(200)
          .then(({ body }) => {
            const { article } = body;
            expect(article.article_id).toBe(1);
            expect(article).not.toHaveProperty("comment_count");
          });
      });
    });
  });

  describe("PATCH", () => {
    test("200: Responds with the updated article with added votes", () => {
      const newVotes = {
        inc_votes: 10,
      };

      return request(app)
        .patch("/api/articles/1")
        .send(newVotes)
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article.votes).toBe(110);
        });
    });

    test("200: Responds with the updated article with minus votes", () => {
      const newVotes = {
        inc_votes: -137,
      };

      return request(app)
        .patch("/api/articles/1")
        .send(newVotes)
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article.votes).toBe(-37);
        });
    });

    test("404: Responds with an article not found error when trying to update an article that doesn't exist", () => {
      const newVotes = {
        inc_votes: 10,
      };

      return request(app)
        .patch("/api/articles/9999")
        .send(newVotes)
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("article not found");
        });
    });

    test("400: Responds with a bad request error when trying to update an invalid article", () => {
      const newVotes = {
        inc_votes: 10,
      };

      return request(app)
        .patch("/api/articles/not-an-article")
        .send(newVotes)
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("bad request");
        });
    });

    test("400: Responds with a bad request error when trying to update an article with invalid data", () => {
      const newVotes = {
        inc_votes: "Not-a-number",
      };

      return request(app)
        .patch("/api/articles/1")
        .send(newVotes)
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("bad request");
        });
    });

    test("400: Responds with a bad request error when trying to update an article with incorrectly named data", () => {
      const newVotes = {
        not_votes: 10,
      };

      return request(app)
        .patch("/api/articles/1")
        .send(newVotes)
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("bad request");
        });
    });

    test("400: Responds with a bad request error when trying to update an article with no data", () => {
      const newVotes = {};

      return request(app)
        .patch("/api/articles/1")
        .send(newVotes)
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("bad request");
        });
    });
  });
});

describe("GET /api/articles", () => {
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
          expect(article).not.toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
          expect(typeof article.comment_count).toBe("number");
          expect(article).not.toHaveProperty("body");
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

  test("200: Responds with an array of articles sorted by created_at in desc order", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&order=DESC")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });

  test("200: Responds with an array of articles sorted by comment_count in asc order", () => {
    return request(app)
      .get("/api/articles?sort_by=comment_count&order=ASC")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("comment_count");
      });
  });

  test("404: Responds with a not found error when given a column that doesn't exist", () => {
    return request(app)
      .get("/api/articles?sort_by=not-a-sort_by-value&order=ASC")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("column not found");
      });
  });

  test("400: Responds with an bad request error when given an invalid order", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=not-an-order")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("bad request");
      });
  });

  test("200: Responds with all articles about the featured topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(1);
        articles.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
      });
  });

  test("200: Responds with an empty array when querying an existing topic that has no articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toEqual([]);
      });
  });

  test("404: Responds with a not found error when querying a topic that doesn't exist", () => {
    return request(app)
      .get("/api/articles?topic=none-existent-topic")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("topic not found");
        // Maybe have it send an empty array instead of an err?
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  describe("GET", () => {
    test("200: Responds with an array of comments from the specified article", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments).toHaveLength(11);
          comments.forEach((comment) => {
            expect(comment).toHaveProperty("comment_id");
            expect(comment).toHaveProperty("votes");
            expect(comment).toHaveProperty("created_at");
            expect(comment).toHaveProperty("author");
            expect(comment).toHaveProperty("body");
            expect(comment.article_id).toBe(1);
          });
        });
    });

    test("200: Responds with an array of comments from the specified article sorted by created_at (DESC)", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });

    test("404: Responds with an 'article not found' error message (article doesn't exist)", () => {
      return request(app)
        .get("/api/articles/9999/comments")
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("article not found");
        });
    });

    test("200: Responds with an empty array (article exists, no comments)", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments).toEqual([]);
        });
    });

    test("400: Responds with an bad request error message when invalid path is given", () => {
      return request(app)
        .get("/api/articles/not-an-id/comments")
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("bad request");
        });
    });
  });

  describe("POST", () => {
    test("201: Inserts a new comment to the db and sends the comment back to the client", () => {
      const newComment = {
        username: "butter_bridge",
        body: "New comment",
      };

      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          const { comment } = body;
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment.author).toBe("butter_bridge");
          expect(comment.body).toBe("New comment");
          expect(comment.article_id).toBe(1);
        });
    });

    test("400: Responds with an bad request error message when an non-existing username is provided", () => {
      const newComment = {
        username: "wrong_username",
        body: "New comment",
      };

      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("bad request");
        });
    });

    test("400: Responds with an bad request error message when an no username is provided", () => {
      const newComment = {
        body: "New comment",
      };

      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("bad request");
        });
    });

    test("400: Responds with an bad request error message when an no comment is provided", () => {
      const newComment = {
        username: "butter_bridge",
      };

      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("bad request");
        });
    });

    test("400: Responds with an bad request error message when the article doesn't exist", () => {
      const newComment = {
        username: "butter_bridge",
        body: "New comment",
      };

      return request(app)
        .post("/api/articles/9999/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("bad request");
        });
    });

    test("400: Responds with an bad request error message when the path is invalid", () => {
      const newComment = {
        username: "butter_bridge",
        body: "New comment",
      };

      return request(app)
        .post("/api/articles/now-a-path/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("bad request");
        });
    });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Responds with a 204 status code and no content when deleting a comment", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });

  test("404: Responds with a comment not found error when trying to delete a comment that doesn't exist", () => {
    return request(app).delete("/api/comments/999").expect(404);
  });

  test("400: Responds with a bad request error when trying to delete an invalid comment", () => {
    return request(app).delete("/api/comments/not-a-comment_id").expect(400);
  });
});

describe("GET /api/users", () => {
  test("200: Responds with an array of all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});
