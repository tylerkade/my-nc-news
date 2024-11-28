const topicsRouter = require("express").Router();

const { getTopics } = require("../controllers/app.controller");
console.log("Inside Topics Router");
topicsRouter.get("/", getTopics);

module.exports = topicsRouter;
