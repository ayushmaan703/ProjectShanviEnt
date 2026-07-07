import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { UsedToken } from "../models/usedToken.model.js";

const verifyAdmin = asyncHandler(async (req, _, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decodedToken) {
      throw new ApiError(401, "JWT Token is invalid or expired");
    }
    const usedToken = await UsedToken.findOne({
      token,
    });
    if (usedToken) {
      throw new ApiError(401, "Token has already been used");
    }
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken",
    );
    if (!user || user.role !== "admin") {
      throw new ApiError(401, "Unauthorized Access.");
    }
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid access token");
  }
});

export default verifyAdmin;
