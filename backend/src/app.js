import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// const whitelist = process.env.CORS_ORIGIN || [
//   "http://localhost:5174",
//   "http://localhost:5173",
// ];

// const corsOptions = {
//   origin: function (origin, callback) {
//     // allow requests with no origin (like Postman) or in the whitelist
//     if (!origin || whitelist.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
//   exposedHeaders: ["x-rtb-fingerprint-id"],
// };

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    exposedHeaders: ["x-rtb-fingerprint-id"],
  }),
);
app.use(
  express.json({
    limit: "16kb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  }),
);

app.use(cookieParser());

// DEFAULT ROUTE
app.use("/", express.static(path.join(__dirname, "static")));


import userRoutes from "./routes/user.routes.js";
app.use("/api/v1/user", userRoutes);

import adminRoutes from "./routes/admin.routes.js";
app.use("/api/v1/admin", adminRoutes);

import customerRoutes from "./routes/customer.routes.js";
app.use("/api/v1/customer", customerRoutes);

export default app;
