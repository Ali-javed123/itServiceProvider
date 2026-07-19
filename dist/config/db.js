import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const ConnectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        console.log("MONGO_URI connected=>");
        if (!uri) {
            throw new Error("MONGO_URI is missing in .env");
        }
        await mongoose.connect(uri, {
            dbName: "microservice_chatapp",
        });
        console.log("DB connected");
    }
    catch (error) {
        console.error("DB not connected:", error);
        process.exit(1);
    }
};
export default ConnectDB;
//# sourceMappingURL=db.js.map