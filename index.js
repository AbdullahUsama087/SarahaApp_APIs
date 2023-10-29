import express from "express";
import { config } from "dotenv";
import path from "path";
config({ path: path.resolve("./config/config.env") });
import DbConnection from "./DB/connection.js";
import * as allRouters from "./Src/Modules/index.routes.js";
import cronOne from "./Src/Utils/crons.js";
import { gracefulShutdown } from "node-schedule";
const app = express();
app.use(express.json());
DbConnection();
// console.log(allRouters);
app.use("/uploads", express.static("./uploads"));
app.use(`/user`, allRouters.userRouter);
app.use(`/msg`, allRouters.messageRouter);

app.all("*", (req, res, next) =>
  res.status(404).json({ message: "Error 404 Not Found URL" })
);

app.use((err, req, res, next) => {
  return res.status(err["cause"] || 500).json({ message: err.message });
});

cronOne()
gracefulShutdown()
app.listen(3000, () => console.log("Server Is Running ........"));
