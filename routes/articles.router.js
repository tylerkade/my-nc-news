const articlesRouter = require("express").Router();

const {
  getArticleById,
  getArticles,
  getArticleComments,
  postComment,
  incrementArticleVotes,
  postArticle,
  deleteArticle,
} = require("../controllers/app.controller");

articlesRouter.route("/").get(getArticles).post(postArticle);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(incrementArticleVotes)
  .delete(deleteArticle);

articlesRouter
  .route("/:article_id/comments")
  .get(getArticleComments)
  .post(postComment);

module.exports = articlesRouter;
