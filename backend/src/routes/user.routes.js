import { Router } from "express";

import {
  registerUser,
  userLogin,
  logoutUser,
  refreshToken,
  getUserDetails,
  getCurrUserInfo,
  forgotPassword,
  updateAccountDetails,
  createCustomer,
} from "../controllers/user.controller.js";

import verifyToken from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post("/registerUser", registerUser);
router.post("/userLogin", userLogin);
router.post("/refreshToken", refreshToken);
router.post("/forgotPassword", forgotPassword);
router.post("/getUInfo", getUserDetails);

// Authenticated Routes
router.post("/logout", verifyToken, logoutUser);
router.get("/getCurrUInfo", verifyToken, getCurrUserInfo);
router.post(
  "/createCustomer",
  verifyToken,
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  createCustomer,
);

export default router;
