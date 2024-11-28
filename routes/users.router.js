const usersRouter = require("express").Router();

const { getUsers, getUserById } = require("../controllers/app.controller");

console.log("Inside Users Router");

usersRouter.get("/", getUsers);

usersRouter.get("/:username", getUserById);

module.exports = usersRouter;
