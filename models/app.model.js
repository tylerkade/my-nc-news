const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticle = (id) => {
  let sqlQuery = ``;
  sqlQuery += `
    SELECT a.*, COUNT(c.comment_id)::INTEGER AS comment_count
    FROM articles a
    LEFT JOIN comments c ON a.article_id = c.article_id
    WHERE a.article_id = $1
    GROUP BY a.article_id;`;

  return db.query(sqlQuery, [id]).then(({ rows }) => {
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

exports.patchVotes = (id, inc_votes) => {
  const [source] = Object.keys(id);
  const newSource = source.slice(0, -3);
  const sqlQuery =
    `UPDATE ` +
    newSource +
    "s" +
    ` SET votes = votes + $1 WHERE ` +
    source +
    ` = $2 RETURNING *;`;
  const queryValues = [inc_votes, id[source]];
  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: `${newSource} not found` });
    }
    return rows[0];
  });
};

exports.removeComment = (comment_id) => {
  return db
    .query(
      `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *;
    `,
      [comment_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "comment not found" });
      }
    });
};

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
};

exports.checkArticleExists = (id) => {
  return db
    .query(
      `
    SELECT * FROM articles
    WHERE article_id = $1
    `,
      [id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "article not found" });
      }
    });
};

exports.fetchUserById = (username) => {
  return db
    .query(
      `
    SELECT * FROM users
    WHERE username = $1`,
      [username]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "username not found" });
      }
      return rows[0];
    });
};

exports.pushArticle = (author, title, body, topic, article_img_url) => {
  const hasImageUrl = article_img_url !== undefined;

  const sqlQuery = `
    INSERT INTO articles (author, title, body, topic${
      hasImageUrl ? ", article_img_url" : ""
    })
    VALUES ($1, $2, $3, $4${hasImageUrl ? ", $5" : ""})
    RETURNING *;`;
  const queryValues = hasImageUrl
    ? [author, title, body, topic, article_img_url]
    : [author, title, body, topic];

  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    const id = rows[0].article_id;
    const newSqlQuery = `
      SELECT a.*, COUNT(c.comment_id)::INTEGER AS comment_count
      FROM articles a
      LEFT JOIN comments c ON a.article_id = c.article_id
      WHERE a.article_id = $1
      GROUP BY a.article_id;`;
    return db.query(newSqlQuery, [id]).then(({ rows }) => {
      return rows[0];
    });
  });
};
