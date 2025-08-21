import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import {
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
} from "../config/emailTemplates.js";
import { transporter } from "../config/nodemailer.js";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    // return res.status(400).send({message:"Please provide all fields"});
    return res.json({ success: false, message: "Please provide all fields" });
  }
  try {
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    //create user for the database
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save(); //user will be saved in user model

    //generate JWT token(for authentication using user id)....token sent using cookies

    //after token generation, we will send this token to users in the response..
    //
    //in response(we will add cookie)..using the cookie,we will send this token
    const token = jwt.sign(
      { id: user._id.toString() },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production(if env is production,returns true; else returns false)

      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", //if env is production, cookie will be sent in cross-site requests(production env); else it will be sent in same-site requests(development environment)

      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    });
    //sending welcome email using nodemailer
    const mailOptions = {
      from: `"USER AUTHENTICATION" <${process.env.SENDER_EMAIL}>`, // Sender's email address
      to: email,
      subject: "Welcome to Our Authentication Portal",
      text: `Hello ${name},\n\nThank you for registering with us! Your account has been created with email id:${email}\n\nBest regards,\nThe Team`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.error("Error sending email:", error);
      }
      console.log("Email sent successfully:", info.response);
    });
    // Wrap in an async IIFE so we can use await.
    /* try {
      (async () => {
        const info = await transporter.sendMail({
          from: `"AIMA " <${process.env.SENDER_EMAIL}>`,
          to: email,
          subject: "Welcome to Our Authentication Portal",
          text: `Hello ${name},\n\nThank you for registering with us! Your account has been created with email id:${email}\n\nBest regards,\nThe Team`,
        });

        console.log("Message sent:", info.messageId);
      })();
    } catch (Emailerror) {
      console.error("Email sending failed:", Emailerror);
    }*/
    //send response

    return res.json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};

export const login = async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: "Please provide all fields" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ success: false, message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user._id.toString() },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "User logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};

//send verification OTP to User's Email
export const sendVerifyOtp = async (req, res) => {
  try {
    console.log("Sending verification OTP...");
    console.log(req.user);
    const { id } = req.user;
    const user = await userModel.findById(id);
    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account already verified" });
    }

    const OTP = String(Math.floor(100000 + Math.random() * 900000)); //converts 6 digit number(random) into String
    user.verifyOtp = OTP;
    user.verifyOtpExpires = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    //send OTP email
    const mailOptions = {
      from: `"USER AUTHENTICATION" <${process.env.SENDER_EMAIL}>`,
      to: user.email,
      subject: "Account Verification OTP",
      // text: `Your verification code is ${OTP}.Verify your account using this OTP. It is valid for 24 hours.`,
      html: EMAIL_VERIFY_TEMPLATE.replace("{{email}}", user.email).replace(
        "{{otp}}",
        OTP
      ),
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.error("Error sending email:", error);
      }
      console.log("Email sent successfully:", info.response);
    });

    return res.json({
      success: true,
      message: "Verification OTP sent to email",
    });
  } catch (error) {
    res.json({ success: false, message: `Server error: ${error.message}` });
  }
};

//Verify email using OTP
export const verifyEmail = async (req, res) => {
  const { OTP } = req.body;
  const { id } = req.user;
  console.log("Verifying email with OTP:", OTP, "for user ID:", id);
  if (!id) {
    return res.json({ success: false, message: `User ID Missing ${id}` });
  }
  if (!OTP) {
    return res.json({ success: false, message: `OTP Missing ${OTP}---${id}` });
  }

  //if(!OTP||!id){
  // return res.json({ success: false, message: `OTP Missing ${OTP}---${id}` });
  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account already verified" });
    }
    if (user.verifyOtp !== OTP || user.verifyOtp === "") {
      return res.json({ success: false, message: "Invalid OTP" });
    }
    if (user.verifyOtpExpires < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }
    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpires = 0;

    await user.save();

    return res.json({
      success: true,
      message: "Email verified successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: true,
      },
    });
  } catch (error) {
    return res.json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};

//checks if user is already Authenticated or Not()

export const isAuthenticated = async (req, res) => {
  try {
    return res.json({
      success: true,
      message: "User is authenticated",
      user: req.user,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};

//  SEND PASSWORD RESET OTP
/*export const sendResetOtp = async (req, res) => {
  console.log("hello...............", req);
  const { email } = req.body;
  if (!email) {
    return res.json({
      success: false,
      message: "No Email provided ..Email is required",
    });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const OTP = String(Math.floor(100000 + Math.random() * 900000)); //converts 6 digit number(random) into String
    user.resetOtp = OTP;
    user.resetOtpExpires = Date.now() + 15 * 60 * 60 * 1000;

    await user.save();

    //send OTP email
    const mailOptions = {
      from: `"USER AUTHENTICATION" <${process.env.SENDER_EMAIL}>`,
      to: user.email,
      subject: "Password Reset OTP",
      //  text: `Your OTP for resetting your password is ${OTP}. Use this OTP to proceed with resetting your password. OTP valid for 15 minutes.`,

      html: PASSWORD_RESET_TEMPLATE.replace("{{email}}", user.email).replace(
        "{{OTP}}",
        OTP
      ),
    };
try{
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");

    return res.json({
      success: true,
      message: " OTP RESET... OTP sent to your email",
    });
  }
  
  
  
  
  
  
  catch (error) {
    return res.json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
} catch (error) {
  return res.json({
    success: false,
    message: `Server error: ${error.message}`,
  });
} }*/

//  SEND PASSWORD RESET OTP
export const sendResetOtp = async (req, res) => {
  // Get email from the request body (CORRECTED)
  const { email } = req.body;
  console.log("email", email);
  console.log(req, "req");
  if (!email) {
    return res.json({
      success: false,
      message: "No Email provided. Email is required",
    });
  }

  try {
    // 1. Find the user
    const user = await userModel.findOne({ email });
    if (!user) {
      // It's often better to return a generic "If exists, sent" message for security
      return res.json({
        success: true, // Note: Often success is returned even if user not found to prevent email enumeration attacks.
        message:
          "If an account with that email exists, a reset OTP has been sent.",
      });
    }

    // 2. Generate OTP and save it to the user
    const OTP = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = OTP;
    user.resetOtpExpires = Date.now() + 15 * 60 * 1000; // Fixed: 15 minutes, not 15 hours

    await user.save();

    // 3. Send the email
    const mailOptions = {
      from: `"USER AUTHENTICATION" <${process.env.SENDER_EMAIL}>`,
      to: user.email,
      subject: "Password Reset OTP",
      html: PASSWORD_RESET_TEMPLATE.replace("{{email}}", user.email).replace(
        "{{otp}}",
        OTP
      ),
    };

    // This await is now in the main try block
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");

    // 4. Send success response
    return res.json({
      success: true,
      message: "OTP sent to your email.",
    });
  } catch (error) {
    // This single catch block will handle any error in the try block
    // (database find/save, email sending, etc.)
    console.error("Error in sendResetOtp:", error);
    return res.json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};

// RESET USER PASSWORD && VERIFY OTP
export const resetPassword = async (req, res) => {
  const { email, OTP, newPassword } = req.body;

  if (!email || !OTP || !newPassword) {
    return res.json({
      success: false,
      message: `All fields (Email ${email}, OTP${OTP}, New Password ${newPassword}) are required  `,
    });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.resetOtp === "" || user.resetOtp !== OTP) {
      return res.json({ success: false, message: "Invalid OTP" });
    }
    //if OTP matches with otp stored in database//check expiry date of OTP

    if (user.resetOtpExpires < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }
    //If OTP is not expired...then Update Users Password(encrypt it and store in database)

    if (user.resetOtp === OTP && user.resetOtpExpires > Date.now()) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;

      user.resetOtp = "";
      user.resetOtpExpires = 0;

      await user.save();
      return res.json({
        success: true,
        message: "Password has been Reset Successfully",
      });
    }
  } catch (error) {
    return res.json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};
