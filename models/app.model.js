const db = require("../db/connection");

exports.fetchTopics = (req, res) => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};
