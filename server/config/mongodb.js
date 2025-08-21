import mongoose from "mongoose";

// const connectDB = async () => {
//   mongoose.connection.on("connected", () => {
//     console.log("MongoDB connected successfully");
//   });
//   console.log("MONGODB_URI:", process.env.MONGODB_URI);
//   await mongoose.connect(`${process.env.MONGODB_URI}/mern-auth`);
// };

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/mern-auth`);
    console.log("MongoDB connected successfully 1........");

    // mongoose.connection.on("connected", () => {
    //   console.log("MongoDB connected successfully 2");
    // });
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Crash app if DB fails
  }
};
export default connectDB;
