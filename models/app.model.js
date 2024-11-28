const db = require("../db/connection");

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
