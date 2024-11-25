const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticle = (id) => {
  return db
    .query(
      `
    SELECT * FROM articles
    WHERE article_id = $1;`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article not found" });
      }
      return rows[0];
    });
};

exports.fetchArticles = () => {
  return db
    .query(
      `
    SELECT a.article_id, a.title, a.topic, a.author, a.created_at, 
    a.votes, a.article_img_url, COUNT(c.comment_id)::INTEGER AS comment_count
    FROM articles a
    LEFT JOIN comments c ON a.article_id = c.article_id
    GROUP BY a.article_id
    ORDER BY a.created_at DESC;`
    )
    .then(({ rows }) => {
      return rows;
    });
};