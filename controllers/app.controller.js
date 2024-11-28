const endpointsJson = require("../endpoints.json");
const {
  fetchTopics,
  fetchArticle,
  fetchArticles,
  fetchArticleByIdComments,
  pushComment,
  patchVotes,
  removeComment,
  fetchUsers,
  checkArticleExists,
  fetchUserById,
  pushArticle,
  pushTopic,
} = require("../models/app.model");

exports.getApi = (req, res) => {
  res.status(200).send({ endpoints: endpointsJson });
};

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

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

exports.getArticleByIdComments = (req, res, next) => {
  const { article_id } = req.params;
  const { limit, p } = req.query;

  checkArticleExists(article_id)
    .then(() => {
      return fetchArticleByIdComments(article_id, limit, p);
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

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUserById = (req, res, next) => {
  const { username } = req.params;
  fetchUserById(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};

exports.incrementCommentVotes = (req, res, next) => {
  const comment_id = req.params;
  const { inc_votes } = req.body;
  patchVotes(comment_id, inc_votes)
    .then((comment) => {
      res.status(200).send({ comment });
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

exports.postTopic = (req, res, next) => {
  const { slug, description } = req.body;
  pushTopic(slug, description)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};
