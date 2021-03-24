const http = require("http");
const express = require("express");
require("express-async-errors");

const { NODE_ENV } = process.env;

//global exception handler
require("./utils/globalExceptionHandler")();

//global promise rejection handler
require("./utils/globalPromiseRejectionHandler")();

//configuring environment variables

require("./utils/environmentVariables")(
  require("./enums/environment_variables")
);

//connect to DB
require("./utils/db")(process.env.MONGO_DB_CONNECTION_URL);

const app = express();

//applying cors middleware
app.use(require("cors")());

//applying helmet middleware for security
if (["production"].includes(NODE_ENV)) {
  app.use(require("helmet")());
}

//using json body middleware
app.use(express.json());

//using urlencoded body middleware
app.use(express.urlencoded({ extended: true }));

require("./utils/routesInitializer")(app);

//configuring globalRouteExceptionHandler
app.use(require("./middlewares/globalRouteExceptionHandler"));

const server = http.createServer(app);

const port = process.env.PORT || 8080;

server.listen(port, () => {
  console.log(
    `Server is listening on port ${port} in ${NODE_ENV} environment.`
  );
});

module.exports = server;
