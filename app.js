const express = require("express");

const {
  getApi,
  getTopics,
  getArticleById,
} = require("./controllers/app.controller");

const {
  wrongPathErrorHandler,
  postgresErrorHandler,
  customErrorHandler,
} = require("./errors/app.errors");

const app = express();

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.use(wrongPathErrorHandler);

app.use(postgresErrorHandler);

app.use(customErrorHandler);

module.exports = app;
