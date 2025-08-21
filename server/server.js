import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
//import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const port = process.env.PORT || 4000;
connectDB();

const allowedOrigins = ["http://localhost:5173"];

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    // origin: 'http://localhost:3000',
    origin: allowedOrigins,
    credentials: true,
  })
);

//...........API ENDPOINTS...........
app.get("/", (req, res) => {
  res.send("Hello World!API IS WORKING");
});

app.use("/auth", authRouter);
app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
