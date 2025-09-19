import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const parseOrigins = (originString) => {
  if (!originString) return ["http://localhost:5173"];
  
  return originString.split(",")
    .map(origin => origin.trim())
    .filter(origin => {
      try {
        new URL(origin);
        return true;
      } catch (e) {
        console.warn(`Invalid CORS origin: ${origin}`);
        return false;
      }
    });
};

const allowedOrigins = parseOrigins(process.env.CORS_ORIGIN);

console.log("Allowed CORS origins:", allowedOrigins);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type", 
    "Authorization", 
    "X-Requested-With",
    "Accept",
    "Origin",
    "Access-Control-Request-Method",
    "Access-Control-Request-Headers"
  ],
  exposedHeaders: [
    "Content-Range",
    "X-Content-Range",
    "Access-Control-Allow-Credentials"
  ],
  maxAge: 600,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log(`Origin: ${req.headers.origin || 'No origin'}`);
  console.log(`Authorization: ${req.headers.authorization ? 'Present' : 'Not present'}`);
  next();
});

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import commentRouter from "./routes/comment.routes.js";
import healthcheckRouter from "./routes/healthcheck.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import videoRouter from "./routes/video.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import likeRouter from "./routes/like.routes.js";

app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/dashboard", dashboardRouter);

app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    console.error("CORS Error:", {
      origin: req.headers.origin,
      url: req.url,
      method: req.method
    });
    
    return res.status(403).json({
      error: "CORS policy violation",
      message: "The request was blocked by CORS policy"
    });
  }
  
  next(err);
});

export { app };