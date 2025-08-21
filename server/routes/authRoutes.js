import express from "express";
import {
  registerUser,
  login,
  logout,
  sendVerifyOtp,
  verifyEmail,
  isAuthenticated,
  sendResetOtp,
  resetPassword,
} from "../controllers/authController.js";

import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router();

//we will add different endpoints in authRouter
authRouter.post("/register", registerUser);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
//authRouter.post("/login", authController.login);

authRouter.post("/send-verify-otp", userAuth, sendVerifyOtp);
//1st add middleware to get userid--then add controller function
authRouter.post("/verify-email", userAuth, verifyEmail);

authRouter.get("/is-auth", userAuth, isAuthenticated);

authRouter.post("/send-reset-otp", sendResetOtp);

authRouter.post("/reset-password", resetPassword);

export default authRouter;
