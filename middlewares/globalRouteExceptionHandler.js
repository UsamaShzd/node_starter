/* eslint-disable no-unused-vars */
module.exports = function (err, req, res, next) {
  const responseObject = { message: "Something Went Wrong!" };

  if (["development", "test"].includes(process.env.NODE_ENV)) {
    responseObject.error = err.toString();
  }

  res.status(500).send(responseObject);
};
