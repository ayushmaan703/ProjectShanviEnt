import asyncHandler  from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Customer } from "../models/customer.model.js";


const getAllCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.find();
  return res
    .status(200)
    .json(new ApiResponse(200, customers, "Customers retrieved successfully"));
});


export { getAllCustomers };