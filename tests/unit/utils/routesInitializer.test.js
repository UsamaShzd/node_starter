const routesInitializer = require("../../../utils/routesInitializer");

describe("routesInitializer", () => {
  it("should register all routes", () => {
    const app = {
      use: jest.fn(),
    };
    routesInitializer(app);

    expect(app.use).toHaveBeenCalled();
  });
});
