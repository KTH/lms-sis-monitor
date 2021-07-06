require("dotenv").config();
require("@kth/reqvars").check();
require("skog/bunyan").createLogger({
  app: "lms-sis-monitor",
  name: "lms-sis-monitor",
  level: "info",
});

const log = require("skog");
const server = require("./src/server");
const runPeriodically = require("./src/run-periodically");

process.on("uncaughtException", (err) => {
  log.fatal(err, "Uncaught Exception thrown");
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  throw reason;
});

runPeriodically();
server.listen(3000);
