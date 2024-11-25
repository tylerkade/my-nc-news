const endpointsJson = require("../endpoints.json");
const {} = require("../models/app.model");

exports.getApi = (req, res) => {
  res.status(200).send({ endpoints: endpointsJson });
};
