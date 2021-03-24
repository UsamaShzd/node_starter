const _ = require("lodash");
module.exports = (user) => {
  return _.pick(user, ["_id", "firstname", "lastname", "image", "email"]);
};
