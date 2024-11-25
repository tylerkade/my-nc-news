exports.wrongPathErrorHandler = (req, res, next) => {
  res.status(404).send({ msg: "not found" });
};