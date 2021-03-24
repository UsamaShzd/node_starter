const express = require("express");
const _ = require("lodash");

const User = require("../../models/User");
const AuthSession = require("../../models/AuthSession");

const requestValidator = require("../../middlewares/requestValidator");
const { signupSchema, loginSchema } = require("../../validators/auth");
const jwt = require("../../services/jwt");

const userTransformer = require("../../transformers/user");

const router = express.Router();

router.post("/signup", requestValidator(signupSchema), async (req, res) => {
  const body = _.pick(req.body, ["firstname", "lastname", "email", "password"]);

  //check if user exists
  const previousUser = await User.findOne({ email: body.email });
  if (previousUser)
    return res.status(409).send({
      error: {
        message: "User already exists!",
      },
    });

  const user = new User({ ...body, createdAt: new Date() });
  user.password = await user.hashPassword(body.password);
  await user.save();
  createUserSessionAndSendResponse(res, user);
});

router.post("/signin", requestValidator(loginSchema), async (req, res) => {
  const { email, password } = _.pick(req.body, ["email", "password"]);

  //check if user exists
  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).send({
      error: {
        message: "Invalid email or password!",
      },
    });

  //check password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect)
    return res.status(404).send({
      error: {
        message: "Invalid email or password!",
      },
    });

  createUserSessionAndSendResponse(res, user);
});

const createUserSessionAndSendResponse = async (res, user) => {
  const session = await new AuthSession({
    user: user._id,
    createdAt: new Date(),
  }).save();

  const token = jwt.encrypt({ _id: session._id });
  res.header("token", token).header("Access-Control-Expose-Headers", "token");
  res.send({ token, user: userTransformer(user) });
};

module.exports = router;
