import  asyncHandler  from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Customer } from "../models/customer.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateRefreshAndAccessTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessTokens();
    const refreshToken = user.generateRefreshTokens();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { refreshToken, accessToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while genrating tokens");
  }
};

const registerAdmin = asyncHandler(async (req, res) => {
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
    role: "admin",
  });

  const isUserCreated = await User.findById(user._id).select("-password");
  if (!isUserCreated) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, isUserCreated, "User registered successfully"));
});
 
const adminLogin = asyncHandler(async (req, res) => {
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

const logoutAdmin = asyncHandler(async (req, res) => {
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
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(500);

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, user) => {
      if (err) return res.sendStatus(500);
      const getUser = await User.findById(user._id);
      const accessToken = jwt.sign(
        {
          _id: getUser._id,
          userId: getUser.userId,
          role: getUser.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        },
      );
      res.json({ accessToken });
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

const getCurrAdminInfo = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._conditions._id).select(
    "-password -refreshToken",
  );
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched Successfully "));
});

const getAdminDetails = asyncHandler(async (req, res) => {
  const { id } = req?.body?.params;
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

const verifyCustomer = asyncHandler(async (req, res) => {
  const { customerId } = req.body;

  if (!customerId) {
    throw new ApiError(400, "Customer ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    throw new ApiError(400, "Invalid Customer ID");
  }

  const customer = await Customer.findByIdAndUpdate(
    customerId,
    { $set: { verified: true } },
    { new: true },
  );

  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, customer, "Customer verified successfully"));
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
  registerAdmin,
  adminLogin,
  logoutAdmin,
  refreshToken,
  getAdminDetails,
  getCurrAdminInfo,
  forgotPassword,
  updateAccountDetails,
  verifyCustomer,
};
