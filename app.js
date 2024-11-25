const express = require("express");

const {
  getApi,
  getTopics,
  getArticleById,
  getArticles,
  getArticleByIdComments,
  postComment
} = require("./controllers/app.controller");

const {
  wrongPathErrorHandler,
  postgresErrorHandler,
  customErrorHandler,
  serverErrorHandler,
} = require("./errors/app.errors");

const app = express();

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getArticleByIdComments);

app.post("/api/articles/:article_id/comments", postComment);

app.use(wrongPathErrorHandler);

app.use(postgresErrorHandler);

app.use(customErrorHandler);

app.use(serverErrorHandler);

module.exports = app;
