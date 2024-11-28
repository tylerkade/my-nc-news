const {
  fetchArticle,
  fetchArticles,
  fetchArticleComments,
  pushComment,
  checkArticleExists,
  pushArticle,
  removeArticle,
} = require("../models/articles.model");

const { patchVotes } = require("../models/app.model");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticle(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic, limit, p } = req.query;
  fetchArticles(sort_by, order, topic, limit, p)
    .then(({ articles, totalCount }) => {
      res.status(200).send({ articles, totalCount });
    })
    .catch(next);
};

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order, limit, p } = req.query;

  checkArticleExists(article_id)
    .then(() => {
      return fetchArticleComments(article_id, sort_by, order, limit, p);
    })
    .then(({ comments, totalCount }) => {
      res.status(200).send({ comments, totalCount });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  pushComment(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.incrementArticleVotes = (req, res, next) => {
  const article_id = req.params;
  const { inc_votes } = req.body;
  patchVotes(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  const { author, title, body, topic, article_img_url } = req.body;
  pushArticle(author, title, body, topic, article_img_url)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next);
};

exports.deleteArticle = (req, res, next) => {
  const { article_id } = req.params;
  removeArticle(article_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
