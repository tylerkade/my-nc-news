const commentsRouter = require("express").Router();

const {
  deleteComment,
  incrementCommentVotes,
} = require("../controllers/app.controller");

commentsRouter
  .route("/:comment_id")
  .delete(deleteComment)
  .patch(incrementCommentVotes);

module.exports = commentsRouter;
