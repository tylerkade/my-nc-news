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

exports.fetchArticles = async (
  sort_by = "created_at",
  order = "DESC",
  topic
) => {
  const validSortBy = [
    "created_at",
    "article_id",
    "title",
    "topic",
    "author",
    "votes",
    "comment_count",
  ];

  if (!validSortBy.includes(sort_by.toLowerCase())) {
    return Promise.reject({ status: 404, msg: "column not found" });
  } else if (sort_by !== "comment_count") {
    sort_by = "a." + sort_by;
  }

  const validOrder = ["ASC", "DESC"];
  if (!validOrder.includes(order.toUpperCase())) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  let sqlQuery = `
    SELECT a.article_id, a.title, a.topic, a.author, a.created_at, 
    a.votes, COUNT(c.comment_id)::INTEGER AS comment_count
    FROM articles a
    LEFT JOIN comments c ON a.article_id = c.article_id `;
  const queryValues = [];

  if (topic) {
    const getValidTopics = () => {
      const query = `SELECT DISTINCT slug FROM topics;`;
      return db.query(query).then(({ rows }) => rows.map((row) => row.slug));
    };
    await getValidTopics().then((validTopics) => {
      if (!validTopics.includes(topic.toLowerCase())) {
        return Promise.reject({ status: 404, msg: "topic not found" });
      } else {
        queryValues.push(topic);
        sqlQuery += `WHERE topic = $${queryValues.length} `;
      }
    });
  }

  sqlQuery += `GROUP BY a.article_id `;

  if (sort_by) {
    sqlQuery += `ORDER BY ${sort_by} ${order} `;
  }

  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticleByIdComments = (id) => {
  return db
    .query(
      `
      SELECT * FROM comments
      WHERE article_id = $1
      ORDER BY created_at DESC;`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "article or comments not found",
        });
      }
      return rows;
    });
};

exports.pushComment = (article_id, username, body) => {
  return db
    .query(
      `
    INSERT INTO comments (author, body, article_id)
    VALUES ($1, $2, $3)
    RETURNING *`,
      [username, body, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.patchVotes = (article_id, inc_votes) => {
  return db
    .query(
      `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;
    `,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article not found" });
      }
      return rows[0];
    });
};

exports.removeComment = (comment_id) => {
  return db.query(
    `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *;
    `,
    [comment_id]
  );
};

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
};
