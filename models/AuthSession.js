const mongoose = require("mongoose");

const authSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  createdAt: {
    type: Date,
  },
  isExpired: {
    type: Boolean,
    default: false,
  },
  expiredAt: {
    type: Date,
  },
});

const AuthSession = mongoose.model("authsession", authSessionSchema);

module.exports = AuthSession;
