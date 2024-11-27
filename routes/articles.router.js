const articlesRouter = require("express").Router();

const {
  getArticleById,
  getArticles,
  getArticleByIdComments,
  postComment,
  incrementArticleVotes,
  postArticle,
} = require("../controllers/app.controller");

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(incrementArticleVotes);

articlesRouter
  .route("/:article_id/comments")
  .get(getArticleByIdComments)
  .post(postComment);

articlesRouter.route("/").get(getArticles).post(postArticle);

module.exports = articlesRouter;
