const express = require("express");
const apiRouter = require("./routes/api.router");

const {
  wrongPathErrorHandler,
  postgresErrorHandler,
  customErrorHandler,
  serverErrorHandler,
} = require("./errors/app.errors");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.use(wrongPathErrorHandler);

app.use(postgresErrorHandler);

app.use(customErrorHandler);
console.log("At the end before Server Error")
app.use(serverErrorHandler);

module.exports = app;
