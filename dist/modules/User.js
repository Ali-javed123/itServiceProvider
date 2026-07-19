import mongoose, { Schema, Document } from "mongoose";
export const User = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    fullName: { type: String, required: true },
    image: {
        url: {
            type: String,
            required: true,
        },
        public_id: {
            type: String,
            required: true,
        },
    },
    gender: { type: String, enum: ["male", "female"], required: true },
});
export const UserModel = mongoose.model("Auth", User);
//# sourceMappingURL=User.js.map