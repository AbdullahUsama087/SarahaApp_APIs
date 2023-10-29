import { Router } from "express";

const router = Router();

import * as msgCont from "./message.controller.js";
import asyncHandler from "../../Utils/error.handling.js";
import isAuth from "../../Middlewares/auth.js";

router.post("/", asyncHandler(msgCont.sendMsg));
router.get("/",isAuth(), asyncHandler(msgCont.getUserMsgs));
router.delete("/:msgId",isAuth(), asyncHandler(msgCont.deleteMsg));

router.get("/", (req, res) => {
  res.json({ message: "Test Message Router Ok" });
});
export default router;
