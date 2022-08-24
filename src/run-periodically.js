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
let running = false;

// Save when was the last time the app look at errors
let latestRun;

async function sync() {
  if (running) {
    return false;
  }

  running = true;

  try {
    const now = new Date();
    const oneDayBack = new Date();
    oneDayBack.setDate(now.getDate() - 1);

    const apps = ["lms-activity-rooms"];

    if (latestRun && latestRun > oneDayBack) {
      await logErrors(latestRun, apps);
    } else {
      await logErrors(oneDayBack, apps);
    }
    latestRun = now;
  } catch (err) {
    log.error({ err }, "Error when trying to check import errors");
  }

  running = false;
  return true;
}

module.exports = async function start() {
  while (true) {
    const didRun = await sync();

    if (!didRun) {
      // If the process was blocked we wait a minute
      // and try again.
      await sleep(ONE_MINUTE);
      continue;
    };

    log.info(`Next invocation: ${new Date(Date.now() + INTERVAL)}`);
    await sleep(INTERVAL);
  }
};
