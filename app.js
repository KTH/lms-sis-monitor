require("dotenv").config();
require("@kth/reqvars").check();
require("skog/bunyan").createLogger({
  app: "lms-sis-monitor",
  name: "lms-sis-monitor",
  level: "info",
});

const server = require("./src/server");
const runPeriodically = require("./src/run-periodically");
const log = require("skog");

process.on("uncaughtException", (err) => {
  log.fatal(err, "Uncaught Exception thrown");
  process.exit(1);
});

process.on("unhandledRejection", (reason, p) => {
  throw reason;
});

runPeriodically();
server.listen(3000);
