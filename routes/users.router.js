const usersRouter = require("express").Router();

const { getUsers, getUserById } = require("../controllers/app.controller");

usersRouter.get("/", getUsers);

usersRouter.get("/:username", getUserById);

module.exports = usersRouter;
