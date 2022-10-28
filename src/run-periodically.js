/* eslint-disable no-await-in-loop, no-constant-condition */
const log = require("skog");
const logErrors = require("./log-errors");

function sleep(t) {
  return new Promise((resolve) => {
    setTimeout(resolve, t);
  });
}

// Every 4 hours
const ONE_MINUTE = 60 * 1000;
const INTERVAL = 4 * 60 * ONE_MINUTE;
// Save when was the last time the app look at errors
let latestRun;

async function sync() {
  try {
    const now = new Date();
    const oneDayBack = new Date();
    oneDayBack.setDate(now.getDate() - 1);

    const apps = [
      "lms-activity-rooms",
      "lms-course-rooms-batch",
      // Disable monitor of lms-sync-users until it has been tested, and we know that there won't be a lot of false alarms
      // "lms-sync-users",
    ];

    if (latestRun && latestRun > oneDayBack) {
      await logErrors(latestRun, apps);
    } else {
      await logErrors(oneDayBack, apps);
    }
    latestRun = now;
  } catch (err) {
    log.error({ err }, "Error when trying to check import errors");
    return false;
  }

  return true;
}

module.exports = async function start() {
  while (true) {
    const completedRun = await sync();

    if (completedRun) {
      log.info(`Next invocation: ${new Date(Date.now() + INTERVAL)}`);
      await sleep(INTERVAL);
    } else {
      // If the process was blocked we wait a short while and
      // try again. This could happen if Canvas is unresponsive.
      await sleep(5 * ONE_MINUTE);
    }
  }
};
