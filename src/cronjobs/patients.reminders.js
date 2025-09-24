const cron = require("node-cron");

function startRemindersJob() {
  cron.schedule("0 10 * * *", async () => {
    console.log("Running daily patient notification job...");
  });
  // cron.schedule("*/10 * * * * *", async () => {
  //   console.log("Running daily patient notification job...");
  //   await sendDailyReminders();
  // });
}

module.exports = { startRemindersJob };
