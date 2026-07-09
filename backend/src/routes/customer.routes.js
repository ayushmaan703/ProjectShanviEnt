import { Router } from "express";

import {
  deleteCustomer,
  editCustomer,
  getAllCustomers,
  togglePaidStatus,
} from "../controllers/customer.controller.js";

import verifyToken from "../middlewares/auth.middleware.js";
import verifyAdmin from "../middlewares/admin.middleware.js";

const router = Router();

router.get("/getCustomerListUnauth", getAllCustomers);

// Authenticated Routes

router.get("/getCustomerList", verifyToken, getAllCustomers);
router.delete("/deleteCustomer", verifyToken, verifyAdmin, deleteCustomer);
router.patch("/editCustomer", verifyToken, verifyAdmin, editCustomer);
router.patch("/togglePaidStatus", verifyToken, verifyAdmin, togglePaidStatus);

export default router;
