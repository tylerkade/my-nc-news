const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

exports.pushTopic = (slug, description) => {
  const sqlQuery = `INSERT INTO topics (slug, description)
    VALUES ($1, $2)
    RETURNING *;`;

  queryValues = [slug, description];

  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    return rows[0];
  });
};
