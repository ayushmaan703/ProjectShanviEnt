import { Router } from "express";

import {
  getAllCustomers
} from "../controllers/customer.controller.js";

import verifyToken from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/getCustomerListUnauth",  getAllCustomers);

// Authenticated Routes

router.get("/getCustomerList", verifyToken, getAllCustomers);

export default router;
