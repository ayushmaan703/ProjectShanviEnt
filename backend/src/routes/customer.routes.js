import { Router } from "express";

import { deleteCustomer, getAllCustomers } from "../controllers/customer.controller.js";

import verifyToken from "../middlewares/auth.middleware.js";
import verifyAdmin from "../middlewares/admin.middleware.js";

const router = Router();

router.get("/getCustomerListUnauth", getAllCustomers);

// Authenticated Routes

router.get("/getCustomerList", verifyToken, getAllCustomers);
router.delete("/deleteCustomer", verifyToken, verifyAdmin, deleteCustomer);

export default router;
