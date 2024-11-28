const { removeComment } = require("../models/comments.model");
const { patchVotes } = require("../models/app.model");

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(() => {
      res.status(204).send();
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
