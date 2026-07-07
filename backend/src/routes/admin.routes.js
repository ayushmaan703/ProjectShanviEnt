import { Router } from "express";

import {
  registerAdmin,
  adminLogin,
  logoutAdmin,
  refreshToken,
  getAdminDetails,
  getCurrAdminInfo,
  forgotPassword,
  updateAccountDetails,
  verifyCustomer,
} from "../controllers/admin.controller.js";

import verifyToken from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import verifyAdmin from "../middlewares/admin.middleware.js";


const router = Router();

router.post("/registerAdmin", registerAdmin);
router.post("/adminLogin", adminLogin);
router.post("/refreshToken", refreshToken);
router.post("/forgotPassword", forgotPassword);
router.post("/getAInfo", getAdminDetails);

// Authenticated Routes
router.post("/logout", verifyToken, logoutAdmin);
router.get("/getCurrAInfo", verifyToken, getCurrAdminInfo);
router.post("/verifyCustomer", verifyToken, verifyAdmin, verifyCustomer);

export default router;
