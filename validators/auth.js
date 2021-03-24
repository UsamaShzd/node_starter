const yup = require("yup");

const email = yup.string().email().min(5).max(100).required();
const password = yup.string().min(5).max(25).required();

exports.loginSchema = yup.object().shape({
  email,
  password,
});

exports.signupSchema = yup.object().shape({
  firstname: yup.string().min(5).max(100).required(),
  lastname: yup.string().min(5).max(100).required(),
  email,
  password,
});
