import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // role: {type:String,enum:['user','admin'],//default:'user'
  verifyOtp: { type: String, default: "" },
  //verifyOtpExpires: {type:Date,default:Date.now},
  verifyOtpExpires: { type: Number, default: 0 },

  isAccountVerified: { type: Boolean, default: false },
  resetOtp: { type: String, default: "" },
  resetOtpExpires: { type: Number, default: 0 },
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
