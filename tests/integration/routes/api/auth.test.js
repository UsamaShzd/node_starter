const request = require("supertest");

const User = require("../../../../models/User");
const AuthSession = require("../../../../models/AuthSession");

const jwt = require("../../../../services/jwt");

let server;
describe("/api/auth", () => {
  beforeEach(() => {
    server = require("../../../../index");
  });
  afterEach(async () => {
    server.close();
    await User.deleteMany({});
    await AuthSession.deleteMany({});
  });

  describe("POST /signup", () => {
    const route = "/api/auth/signup";

    it("should signup a new user if all required fields are passed.", async () => {
      const body = {
        firstname: "firstname",
        lastname: "lastname",
        email: "test@gmail.com",
        password: "123456",
      };
      await request(server).post(route).send(body);
      const user = await User.findOne({ email: body.email });

      expect(user).not.toBeNull();
    });

    it("should return response with 200 status code, user and token.", async () => {
      const body = {
        firstname: "firstname",
        lastname: "lastname",
        email: "test@gmail.com",
        password: "123456",
      };
      const result = await request(server).post(route).send(body);
      delete body.password;

      expect(result.status).toBe(200);
      expect(result.body.user).toMatchObject(body);
      expect(result.body.token).not.toBeNull();
    });

    it("should create a new session of the user when signup.", async () => {
      const body = {
        firstname: "firstname",
        lastname: "lastname",
        email: "test@gmail.com",
        password: "123456",
      };
      const result = await request(server).post(route).send(body);

      const decoded = jwt.decrypt(result.body.token);
      const authSession = await AuthSession.findOne({ _id: decoded._id });

      expect(authSession.user.toHexString()).toEqual(result.body.user._id);
    });

    it("should return 409 response with error body if user already exists with the same email.", async () => {
      const body = {
        firstname: "firstname",
        lastname: "lastname",
        email: "test@gmail.com",
        password: "123456",
      };

      await new User(body).save();

      const result = await request(server).post(route).send(body);

      expect(result.status).toBe(409);
      expect(result.body.error).not.toBeNull();
      expect(result.body.error.message).not.toBeNull();
    });

    it("should return 400 response with error if request body is not valid", async () => {
      const body = {};
      const result = await request(server).post(route).send(body);
      delete body.password;

      expect(result.status).toBe(400);
      expect(result.body.error).not.toBeNull();
    });
  });

  describe("POST /signin", () => {
    const route = "/api/auth/signin";

    it("should login the user if correct credentials are passed", async () => {
      const user = new User({
        firstname: "firstname",
        lastname: "lastname",
        email: "test@gmail.com",
        password: "password",
      });
      user.password = await user.hashPassword(user.password);
      await user.save();

      const result = await request(server)
        .post(route)
        .send({ email: user.email, password: "password" });

      expect(result.status).toBe(200);
      // expect(result.body.user._id).toMatchObject(user._id.toHexString());

      expect(result.body.token).not.toBeNull();
    });

    it("should return 404 response with error if user does not exist.", async () => {
      const body = {
        email: "test@gmail.com",
        password: "123456",
      };
      const result = await request(server).post(route).send(body);
      expect(result.status).toBe(404);
      expect(result.body.error).not.toBeNull();
      expect(result.body.error.message).not.toBeNull();
    });

    it("should return 404 response with error if invalid password is passed.", async () => {
      const user = new User({
        firstname: "firstname",
        lastname: "lastname",
        email: "test@gmail.com",
        password: "password",
      });
      user.password = await user.hashPassword("password");
      await user.save();

      const result = await request(server)
        .post(route)
        .send({ email: user.email, password: "some_wrong_password" });

      expect(result.status).toBe(404);
      expect(result.body.error).not.toBeNull();
      expect(result.body.error.message).not.toBeNull();
    });

    it("should return 400 response with error if request body is not valid", async () => {
      const body = {};
      const result = await request(server).post(route).send(body);
      delete body.password;

      expect(result.status).toBe(400);
      expect(result.body.error).not.toBeNull();
    });
  });
});
