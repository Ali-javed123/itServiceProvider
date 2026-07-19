import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
console.log("MONGO_URI=>", process.env.MONGO_URI);
const ConnectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        console.log("MONGO_URI connected=>", uri);
        if (!uri) {
            throw new Error("MONGO_URI is missing in .env");
        }
        await mongoose.connect(uri, {
            dbName: "it-service-provider",
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