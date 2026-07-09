import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Customer } from "../models/customer.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

const getAllCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.find();
  return res
    .status(200)
    .json(new ApiResponse(200, customers, "Customers retrieved successfully"));
});

const deleteCustomer = asyncHandler(async (req, res) => {
  const { customerId } = req.body;

  const customer = await Customer.findByIdAndDelete(customerId);
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Customer deleted successfully"));
});

const editCustomer = asyncHandler(async (req, res) => {
  const { name, contactPerson, contactNo, connectionDetails, customerId } =
    req.body;

  if (!customerId) {
    throw new ApiError(404, "Customer Id is required");
  }
  const imageLocalPath = req?.files?.image?.[0]?.path;
  if (imageLocalPath) {
    var image = await uploadToCloudinary(imageLocalPath);
    if (!image) {
      throw new ApiError(400, "Image is required");
    }
  }

  const customer = await Customer.findById(customerId);
  if (name) customer.name = name;
  if (contactPerson) customer.contactPerson = contactPerson;
  if (contactNo) customer.contactNo = contactNo;
  if (connectionDetails) customer.connectionDetails = connectionDetails;
  if (imageLocalPath) customer.image = image?.url;

  await customer.save();

  return res
    .status(200)
    .json(new ApiResponse(200, customer, "Customer Updated Successfully"));
});

const togglePaidStatus = asyncHandler(async (req, res) => {
  const { customerId } = req?.body?.params;

  if (!customerId) {
    throw new ApiError(404, "Customer Id is required");
  }
  const customer = await Customer.findById(customerId);

  customer.isPaid = true;

  await customer.save();

  return res
    .status(200)
    .json(new ApiResponse(200, customer, "Paid Status Updated Successfully"));
});

export { getAllCustomers, deleteCustomer, editCustomer, togglePaidStatus };
