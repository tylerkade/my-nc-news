const express = require("express");
const apiRouter = require("./routes/api.router");
const cors = require("cors");

const {
  wrongPathErrorHandler,
  postgresErrorHandler,
  customErrorHandler,
  serverErrorHandler,
} = require("./errors/app.errors");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.use(wrongPathErrorHandler);

app.use(postgresErrorHandler);

app.use(customErrorHandler);

app.use(serverErrorHandler);

module.exports = app;
