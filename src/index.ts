import dotenv from "dotenv";
import express from "express";
import dns from "dns";
import cors from "cors";

import ConnectDB from "./config/db.js";
import { UserRoutes } from "./routes/auth.routes.js";
import ServiceRouter from "./routes/service.routes.js";

dotenv.config();

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

ConnectDB().catch(console.error);

app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

app.use("/api/v1/auth", UserRoutes);
app.use("/api/v1", ServiceRouter);

export default app;