const topicsRouter = require("express").Router();

const { getTopics, postTopic } = require("../controllers/app.controller");

topicsRouter.route("/").get(getTopics).post(postTopic);

module.exports = topicsRouter;
