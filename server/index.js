// Polyfill for Node versions where SlowBuffer may be missing (fixes buffer-equal-constant-time crash)
const bufferModule = require("buffer");
if (!bufferModule.SlowBuffer) {
  bufferModule.SlowBuffer = bufferModule.Buffer;
}
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const { userRouter } = require("./routes/user.router");
const { lessonRouter } = require("./routes/lesson.router");

const app = express();
const port = process.env.PORT || 3004;

const corsOptions = {
  origin: [
    "https://lesson-flow.vercel.app",
    "http://127.0.0.1:5173",
    "http://localhost:5173",
    "http://localhost:5174",
  ],
  credentials: true,
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  exposedHeaders: ["Set-Cookie"],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/lesson", lessonRouter);

const main = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`app connected to mongoDb database`);
    return true;
  } catch (error) {
    console.log(`error while connecting to MongoDb url : ${error.message}`);
    return false;
  }
};

const startServer = async () => {
  const connected = await main();
  if (!connected) {
    console.error("Failed to connect to MongoDB. Server will not start.");
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`the app is running at http://localhost:${port}`);
  });
};

startServer();
