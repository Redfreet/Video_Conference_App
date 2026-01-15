import dotenv from "dotenv";

if (process.env.NODE_ENV != "production") {
  dotenv.config();
}

import express from "express";
import { createServer } from "node:http";

import { connectToSocket } from "./controllers/socketManager.js";
import userRoutes from "./routes/users.routes.js";

import mongoose from "mongoose";
import cors from "cors";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.set("port", process.env.PORT || 3000);

app.use("/api/users", userRoutes);

const start = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in .env file");
    }

    const connectionDb = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MONGO Connected DB Host: ${connectionDb.connection.host}`);

    server.listen(app.get("port"), () => {
      console.log(`App is listening on port ${app.get("port")}`);
    });
  } catch (error) {
    console.error("Failed to connect to DB :", error);
  }
};

start();
