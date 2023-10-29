import { Router } from "express";
import * as userCont from "./user.controller.js";
import asyncHandler from "../../Utils/error.handling.js";
import isAuth from "../../Middlewares/auth.js";
import validationCoreFunction from "../../Middlewares/validation.js";
import { signInSchema, signUpSchema } from "./user.validationSchemas.js";
import allowedExtensions from "../../Utils/allowedExtensions.js";
import multerFunction from "../../Services/multerLocal.js";
import multerCloudFunction from "../../Services/multerCloud.js";

const router = Router();

router.post("/", validationCoreFunction(signUpSchema), userCont.signUp);
router.get("/confirmEmail/:token", asyncHandler(userCont.confirmEmail));
router.post("/token", asyncHandler(userCont.verifyToken));
router.post(
  "/login",
  validationCoreFunction(signInSchema),
  asyncHandler(userCont.signIn)
);
router.patch("/:userId", asyncHandler(userCont.updateProfile));
router.get("/", isAuth(), asyncHandler(userCont.getProfile));

router.post(
  "/profile",
  isAuth(),
  multerFunction(allowedExtensions.Image, "user/profile").single("profile"),
  asyncHandler(userCont.profilePic)
);

router.post(
  "/cover",
  isAuth(),
  multerFunction(allowedExtensions.Image, "user/cover").array("cover"),
  asyncHandler(userCont.coverPics)
);
router.post(
  "/picCloud",
  isAuth(),
  multerCloudFunction(allowedExtensions.Image).single("profile"),
  asyncHandler(userCont.picCloud)
);
router.post(
  "/coverCloud",
  isAuth(),
  multerCloudFunction(allowedExtensions.Image).array("cover"),
  asyncHandler(userCont.coverCloud)
);

router.get("/", (req, res) => {
  res.json({ message: "Test User Router Ok" });
});
export default router;
