import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync.js";
import { AuthService } from "./auth.services.js";
import sendResponse from "../../../shared/sendResponse.js";
import config from "../../../config/index.js";
import User from "../user/user.model.js";
import { jwtHelpers } from "../../../helper/jwtHelpers.js";


// const register = catchAsync(async (req, res) => {
//   const { ...registerData } = req.body;
//   const result = await AuthService.register(registerData);

//   return sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Registration successful!",
//     meta: null,
//     data: result,
//   });
// });

const register = catchAsync(async (req, res) => {
  const { ...registerData } = req.body;
  try {
    const result = await AuthService.register(registerData);
    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Registration successful!',
      meta: null,
      data: result,
    });
  } catch (error) {
    console.error('Error during registration:', error);
    return sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: 'Registration failed. Please try again later.',
      meta: null,
      data: null,
    });
  }
});


const login = catchAsync(async (req, res) => {
  const { ...loginData } = req.body;

  const result = await AuthService.login(loginData);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login successful!",
    meta: null,
    data: result,
  });
});

const adminLogin = catchAsync(async (req, res) => {
  const { ...loginData } = req.body;

  const result = await AuthService.adminLogin(loginData);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin login successful!",
    meta: null,
    data: result,
  });
});

const googleLogin = catchAsync(async (req, res) => {
  const authHeader = req.headers.authorization;
  const code = authHeader.split(" ")[1];
  const result = await AuthService.googleLogin(code);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login successful!",
    meta: null,
    data: result,
  });
});


const logout = catchAsync(async (req, res) => {
  // set refresh token into cookie
  const pastExpirationDate = new Date(Date.now() - 3600000);
  res.cookie(config.refresh_token_name, null, {
    expires: pastExpirationDate,
    sameSite: "none",
    secure: true,
    httpOnly: true,
  });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logout successful!",
    meta: null,
    data: null,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { token } = req.body;

  const result = await AuthService.refreshToken(token);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Refresh token successfully!",
    meta: null,
    data: result,
  });
});

const adminRefreshToken = catchAsync(async (req, res) => {
  const { token } = req.body;

  const result = await AuthService.adminRefreshToken(token);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Refresh token successfully!",
    meta: null,
    data: result,
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  const { ...forgotPasswordData } = req.body;

  await AuthService.forgotPassword(forgotPasswordData);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "An email has been sent!",
    meta: null,
    data: null,
  });
});

const adminForgotPassword = catchAsync(async (req, res) => {
  const { ...forgotPasswordData } = req.body;

  await AuthService.adminForgotPassword(forgotPasswordData);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "An email has been sent!",
    meta: null,
    data: null,
  });
});

const adminResetPassword = catchAsync(async (req, res) => {
  const { ...resetPasswordData } = req.body;

  const result = await AuthService.adminResetPassword(resetPasswordData);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successful!",
    meta: null,
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const { ...resetPasswordData } = req.body;

  const result = await AuthService.resetPassword(resetPasswordData);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successful!",
    meta: null,
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const payload = { ...req.body, ...req.user };
  await AuthService.changePassword(payload);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password change successful!",
    meta: null,
    data: null,
  });
});

const adminChangePassword = catchAsync(async (req, res) => {
  const payload = { ...req.body, ...req.user };
  await AuthService.adminChangePassword(payload);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password change successful!",
    meta: null,
    data: null,
  });
});

const verifyEmail = catchAsync(async (req, res) => {
  const { token } = req.query;
  try {
    const decodedToken = jwtHelpers.verifiedToken(token, config.jwt.email_verification_secret);
    const userId = decodedToken.userId;
    const user = await User.findOneAndUpdate(
      { userId: userId },
      { $set: { 'emailVerification.isVerified': true } },
      { new: true }
    );

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    res.status(httpStatus.OK).json({ message: 'Email verification successful', user });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(httpStatus.BAD_REQUEST).json({ message: 'Email verification failed. Please try again.' });
  }
});

export const AuthController = {
  register,
  login,
  logout,
  googleLogin,
  refreshToken,
  forgotPassword,
  adminForgotPassword,
  adminResetPassword,
  resetPassword,
  changePassword,
  adminLogin,
  adminRefreshToken,
  adminChangePassword,
  verifyEmail,
};
