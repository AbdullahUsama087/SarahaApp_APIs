import { scheduleJob } from "node-schedule";

const cronOne = () => {
  scheduleJob("/5 * * * * *", function () {
    console.log("CronJob runs every Second");
  });
};
export default cronOne;
