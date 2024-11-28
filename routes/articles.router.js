const articlesRouter = require("express").Router();

const {
  getArticleById,
  getArticles,
  getArticleByIdComments,
  postComment,
  incrementArticleVotes,
  postArticle,
} = require("../controllers/app.controller");
console.log("Inside Articles Router");

articlesRouter.route("/").get(getArticles).post(postArticle);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(incrementArticleVotes);

articlesRouter
  .route("/:article_id/comments")
  .get(getArticleByIdComments)
  .post(postComment);

module.exports = articlesRouter;
