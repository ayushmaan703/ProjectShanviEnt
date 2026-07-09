import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Customer } from "../models/customer.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { UsedToken } from "../models/usedToken.model.js";

const generateRefreshAndAccessTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessTokens();
    const refreshToken = user.generateRefreshTokens();
    await user.save({ validateBeforeSave: false });
    return { refreshToken, accessToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while genrating tokens");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, mobileNo, password } = req.body;
  if (mobileNo == "") {
    throw new ApiError(400, "Mobile Number is required !!");
  }
  if (fullName == "") {
    throw new ApiError(400, "FullName is required !!");
  }
  if (password == "") {
    throw new ApiError(400, "Password is required !!");
  }

  const uniqueUser = await User.findOne({
    $or: [{ mobileNo }],
  });
  if (uniqueUser) {
    throw new ApiError(409, "User already exists ");
  }

  const user = await User.create({
    fullName,
    password,
    mobileNo,
    role: "user",
  });

  const isUserCreated = await User.findById(user._id).select("-password");
  if (!isUserCreated) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, isUserCreated, "User registered successfully"));
});

const userLogin = asyncHandler(async (req, res) => {
  const { mobileNo, password } = req.body;

  if (!mobileNo) {
    throw new ApiError(400, "Mobile Number is required");
  }
  const getUser = await User.findOne({
    $or: [{ mobileNo }],
  });
  if (!getUser) {
    throw new ApiError(404, "User not found");
  }
  const isPasswordCorrect = await getUser.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Password Incorrect");
  }
  const { refreshToken, accessToken } = await generateRefreshAndAccessTokens(
    getUser._id,
  );
  const userLoginStatus = await User.findById(getUser._id).select("-password");
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: userLoginStatus,
        accessToken,
        refreshToken,
      },
      "User logged in succesfully",
    ),
  );
});

const logoutUser = asyncHandler(async (req, res) => {
  const token = req.token;
  const user = req.user;

  try {
    await UsedToken.create({ token, userId: user?._id });
    // res.clearCookie("refreshToken", {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    // });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Logout successful"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Refresh token missing",
    });
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Invalid refresh token",
        });
      }

      const user = await User.findById(decoded._id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const accessToken = jwt.sign(
        {
          _id: user._id,
          mobileNo: user.mobileNo,
          fullName: user.fullName,
          role: user.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        },
      );


      return res.status(200).json({
        success: true,
        data: {
          accessToken,
        },
      });
    },
  );
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { password, newPassword } = req.body;
  const user = await User.findById(req.user._conditions._id);
  const checkingOldPassword = await user.isPasswordCorrect(password);
  if (!checkingOldPassword) {
    throw new ApiError(400, "Current password is incorrect");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password updated successfully"));
});

const getCurrUserInfo = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -refreshToken",
  );
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched Successfully "));
});

const getUserDetails = asyncHandler(async (req, res) => {
  const { id } = req?.body;
  if (!id) {
    throw new ApiError(400, "User ID is required");
  }
  try {
    const fetchedUser = await User.findById(id);
    if (!fetchedUser) {
      throw new ApiError(404, "User not found");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          fetchedUser,
          "User details retrieved successfully",
        ),
      );
  } catch (error) {
    throw new ApiError(500, "Some error occurred.");
  }
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, mobile } = req.body;
  if (!fullName) {
    throw new ApiError(400, "New fullname required");
  }
  if (!mobile) {
    throw new ApiError(400, "New mobile number required");
  }
  const userId = req.user._conditions._id;
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        fullName: fullName,
        mobile: mobile,
      },
    },
    {
      new: true,
    },
  ).select("-password");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const createCustomer = asyncHandler(async (req, res) => {
  const { name, contactPerson, contactNo, connectionDetails } = req.body;

  if (!name || name.trim() === "") {
    throw new ApiError(400, "Customer name is required");
  }

  if (!contactPerson || contactPerson.trim() === "") {
    throw new ApiError(400, "Contact person is required");
  }

  if (!contactNo || contactNo.trim() === "") {
    throw new ApiError(400, "Contact number is required");
  }

  if (!connectionDetails || connectionDetails.trim() === "") {
    throw new ApiError(400, "Connection details are required");
  }
  const imageLocalPath = req.files?.image[0]?.path;
  if (!imageLocalPath) {
    throw new ApiError(400, "Image not found ");
  }

  const image = await uploadToCloudinary(imageLocalPath);
  if (!image) {
    throw new ApiError(400, "Image is required");
  }

  const customer = await Customer.create({
    name,
    contactPerson,
    contactNo,
    connectionDetails,
    image: image.url,
    createdBy: req.user._id,
    verified: false,
  });
  if (!customer) {
    throw new ApiError(500, "Something went wrong while creating the customer");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, customer, "Customer created successfully"));
});

// const changeCoverImage = asyncHandler(async (req, res) => {
//     const CoverImageLocalPath = req.file?.path
//     if (!CoverImageLocalPath) {
//         throw new ApiError(400, "CoverImage not found ")
//     }
//     const CoverImage = await uploadToCloudinary(CoverImageLocalPath)
//     if (!CoverImage) {
//         throw new ApiError(400, "CoverImage is required")
//     }
//     const user = await User.findByIdAndUpdate(
//         req.user._conditions._id,
//         {
//             $set: {
//                 coverImage: CoverImage.url,
//             },
//         },
//         { new: true }
//     ).select("-password")

//     return res
//         .status(200)
//         .json(
//             new ApiResponse(200, user, "CoverImage image updated successfully")
//         )
// })

export {
  registerUser,
  userLogin,
  logoutUser,
  refreshToken,
  getUserDetails,
  getCurrUserInfo,
  forgotPassword,
  updateAccountDetails,
  createCustomer,
};
