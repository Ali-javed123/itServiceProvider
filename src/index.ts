import dotenv from "dotenv";
import express from "express";
import dns from "dns";
import cors from "cors";

import ConnectDB from "./config/db.js";
import { UserRoutes } from "./routes/auth.routes.js";
import ServiceRouter from "./routes/service.route.js";
import AboutRouter from "./routes/about.route.js";
dotenv.config();

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();

app.use(cors({
   origin:["http://localhost:3000", "https://it-service-provider.vercel.app/"],  // Next.js frontend

  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
// app.options("*", cors());
// app.options('*', cors());

ConnectDB().catch(console.error);



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", UserRoutes);
app.use("/api/v1", ServiceRouter);
app.use("/api/v1", AboutRouter);





app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);   
})
// export default app;