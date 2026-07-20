import dotenv from "dotenv";
import express from "express";
import dns from "dns";

import ConnectDB from "./config/db.js";
import { UserRoutes } from "./routes/auth.routes.js";
import  ServiceRouter  from "./routes/service.routes.js";
import cors from 'cors'
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;


dns.setServers(["8.8.8.8", "8.8.4.4"]);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "*",
    
    credentials: true,
}));

app.use("/api/v1/auth", UserRoutes);
app.use("/api/v1", ServiceRouter);

// const startServer = async () => {
//     try {
//         await ConnectDB();

//         app.listen(PORT, () => {
//             console.log(`Server running on port ${PORT}`);
//         });
//     } catch (error) {
//         console.error(error);
//     }
// };

// startServer();


export default app;