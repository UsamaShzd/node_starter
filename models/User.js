const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const roles = require("../enums/roles");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
  },

  lastname: {
    type: String,
  },

  email: {
    type: String,
    index: true,
  },

  image: {
    type: String,
  },

  password: {
    type: String,
    default: "",
  },

  emailVerified: {
    type: Boolean,
    default: false,
  },

  emailVerificationCode: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: new Date(),
  },

  passwordResetCode: {
    type: String,
  },

  role: {
    type: String,
    default: roles.USER,
    enum: Object.entries(roles).map((role) => role[1]),
  },
});

userSchema.methods.hashPassword = async function (password) {
  //generating password hash
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const genereteRandomCode = () => Math.floor(100000 + Math.random() * 900000);

userSchema.methods.generateEmailVerificationCode = function () {
  this.emailVerificationCode = genereteRandomCode();
  return this.emailVerificationCode;
};

userSchema.methods.generatePasswordResetCode = function () {
  this.passwordResetCode = genereteRandomCode();
  return this.passwordResetCode;
};

const User = mongoose.model("user", userSchema);

module.exports = User;
