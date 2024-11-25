const express = require("express");

const { getApi, getTopics } = require("./controllers/app.controller");

const {
  wrongPathErrorHandler,
  customErrorHandler,
  serverErrorHandler,
} = require("./errors/app.errors");

const app = express();

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.use(wrongPathErrorHandler);

module.exports = app;
