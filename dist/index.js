import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import UserRoutes from './routes/User.routes.js';
dotenv.config();
const app = express();
app.use("/api/v1/auth", UserRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server is running on port 3000");
});
//# sourceMappingURL=index.js.map