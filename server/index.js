import express from "express";
import cors from 'cors'
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./route/authRoute.js";
import userRouter from "./route/userRoute.js";

const app = express();
const port = process.env.PORT;

connectDB();
app.use(cors(
  {
    origin: 'http://localhost:5173',
    credentials: true
  }
))





app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("api is working");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(port, () => {
  console.log("api working on port " + port);
});
