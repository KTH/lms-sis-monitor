const logErrors = require("./log-errors");
const log = require("skog");

function sleep(t) {
  return new Promise((resolve) => {
    setTimeout(resolve, t);
  });
}

const ONE_MINUTE = 60 * 1000;

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

module.exports = async function (context, every4hours) {
  const completedRun = await sync();

  if (completedRun) {
    log.info(`Next invocation: ${every4hours.scheduleStatus.next}`);
  } else {
    await sleep(5 * ONE_MINUTE);
  }
};